import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToR2, isR2Configured } from '@/lib/r2';

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

    // Upload directly to Cloudflare R2 bucket
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
      isR2Active: isR2Configured(),
      message: 'File successfully uploaded directly to Cloudflare R2 CDN',
    });
  } catch (err: any) {
    console.error('Cloudflare R2 Upload Error:', err);
    return NextResponse.json(
      { 
        error: err.message || 'Failed to upload to Cloudflare R2. Please check your R2_SECRET_ACCESS_KEY in .env',
        details: err.toString()
      },
      { status: 500 }
    );
  }
}
