import React from 'react';
import Link from 'next/link';
import type { ModTag } from '@/types';

interface ModDescriptionProps {
  description: string;
  tags?: ModTag[];
  firstUploadedAt?: string;
  lastUpdatedAt?: string;
}

export function ModDescription({
  description,
  tags = [],
  firstUploadedAt,
  lastUpdatedAt,
}: ModDescriptionProps) {
  return (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active">
          <a className="url-push" href="#description_tab" role="tab">
            <i className="fa fa-file-text-o" />
            &nbsp;Product Details & Description
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div role="tabpanel" className="tab-pane active" id="description_tab">
          <div className="panel panel-default" style={{ marginTop: 8 }}>
            <div className="panel-body">
              {/* Product Highlights & Features */}
              <div
                className="digital-inclusions-banner"
                style={{
                  background: '#f9fbf9',
                  border: '1px solid #d6edd9',
                  borderRadius: 4,
                  padding: '12px 16px',
                  marginBottom: 16,
                }}
              >
                <h4 style={{ color: '#dc2626', marginTop: 0, marginBottom: 8, fontSize: 14, fontWeight: 700 }}>
                  <i className="fa fa-check-circle" style={{ marginRight: 6 }} />
                  Digital Product Inclusions
                </h4>
                <ul className="digital-inclusions-list-desc" style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                  <li><strong>Format:</strong> High-Resolution 4K .YTD textures & .RPF installation files</li>
                  <li><strong>Compatibility:</strong> GTA V Single Player & FiveM Ready</li>
                  <li><strong>Instant Access:</strong> Automatic digital download link provided immediately upon checkout</li>
                  <li><strong>Updates:</strong> Free lifetime updates and patch support</li>
                </ul>
              </div>

              {/* Body Description */}
              <div className="file-description">
                <span
                  className="description-body"
                  dir="auto"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div id="tag-list" style={{ marginTop: 15 }}>
                  <div>
                    {tags.map((tag) => (
                      <Link key={tag.slug} href={`/all`} style={{ marginRight: 4, display: 'inline-block' }}>
                        <span className="label label-default">
                          <span className="fa fa-tag" style={{ marginRight: 4 }} />
                          {tag.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div style={{ marginTop: 15, fontSize: 12, color: '#777', borderTop: '1px solid #eee', paddingTop: 10 }}>
                {firstUploadedAt && (
                  <span style={{ marginRight: 15 }}>
                    <strong>Released:</strong> {firstUploadedAt.split('T')[0]}
                  </span>
                )}
                {lastUpdatedAt && (
                  <span>
                    <strong>Last Updated:</strong> {lastUpdatedAt.split('T')[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
