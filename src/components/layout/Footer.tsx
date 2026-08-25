'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FOOTER_SECTIONS } from '@/constants';
import type { FooterLink } from '@/types';

function FooterLinkItem({ link }: { link: FooterLink }) {
  const content = (
    <>
      {link.icon && <span className={`${link.icon}`} />}
      {link.isImage && link.imageSrc && (
        <Image src={link.imageSrc} height={15} width={20} alt="" />
      )}{' '}
      {link.label}
    </>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        className={link.icon ? 'social' : undefined}
        target="_blank"
        rel="noreferrer"
        title={link.label}
      >
        {content}
      </a>
    );
  }

  return <Link href={link.href}>{content}</Link>;
}

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <div id="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-4 col-md-4">
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>G5mode</span>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '16px', lineHeight: '1.5' }}>
              <i className="fa fa-map-marker" style={{ color: '#dc2626', marginRight: '6px' }} />
              Main Market Road, Ward No. 12,<br />
              Churu, Rajasthan - 331001, India
            </div>
          </div>

          <div className="col-sm-8 col-md-8 hidden-xs">
            {FOOTER_SECTIONS.map((section, idx) => (
              <div
                key={idx}
                className={
                  idx === 0
                    ? 'col-md-4 hidden-sm hidden-xs'
                    : 'col-sm-4 col-md-4' + (idx === 0 ? ' hidden-xs' : '')
                }
              >
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
