import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToR2, isR2Configured } from '@/lib/r2';
import { getSupabaseAdmin, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as 'mods' | 'images' | 'thumbnails' | 'screenshots' | 'general') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ─── Attempt 1: Upload to Cloudflare R2 ────────────────────────────────
    if (isR2Configured()) {
      try {
        const result = await uploadFileToR2({
          buffer,
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          folder: folder === 'screenshots' ? 'images' : folder,
        });

        return NextResponse.json({
          success: true,
          url: result.url,
          key: result.key,
          size: result.size,
          contentType: result.contentType,
          isR2Active: true,
          storage: 'r2',
          message: 'File uploaded to Cloudflare R2 CDN',
        });
      } catch (r2Err: any) {
        console.warn('R2 upload failed, falling back to Supabase Storage:', r2Err.message);
      }
    }

    // ─── Attempt 2: Fallback to Supabase Storage ────────────────────────────
    const supabase = getSupabaseAdmin() || getSupabase();
    if (supabase) {
      try {
        const timestamp = Date.now();
        const cleanName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.-]/g, '-')
          .replace(/-+/g, '-');
        const storagePath = `${folder}/${timestamp}-${cleanName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(storagePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicData } = supabase.storage
            .from('category-images')
            .getPublicUrl(storagePath);

          const publicUrl = publicData?.publicUrl;
          if (publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrl,
              key: storagePath,
              size: buffer.length,
              contentType: file.type,
              isR2Active: false,
              storage: 'supabase',
              message: 'File uploaded to Supabase Storage',
            });
          }
        } else {
          console.warn('Supabase Storage upload error:', uploadError?.message);
        }
      } catch (supabaseErr: any) {
        console.warn('Supabase Storage upload failed:', supabaseErr.message);
      }
    }

    // ─── Attempt 3: Return error — no storage available ────────────────────
    return NextResponse.json(
      {
        error: 'All storage providers failed. Please configure R2 or Supabase Storage.',
        success: false,
        isR2Active: false,
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('Storage Upload Error:', err);
    return NextResponse.json(
      {
        error: err.message || 'Failed to upload file.',
        details: err.toString(),
        success: false,
      },
      { status: 500 }
    );
  }
}
