import type { Metadata } from 'next';
import type { SiteMetadata } from '@/types';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, THEME_COLOR } from '@/constants';

export function buildMetadata(meta: Partial<SiteMetadata> = {}): Metadata {
  const baseUrl = SITE_URL || 'https://www.gta5-mods.com';
  const title = meta.title ? `${meta.title} - ${SITE_NAME}` : `${SITE_NAME} - ${SITE_DESCRIPTION}`;
  const description = meta.description ?? SITE_DESCRIPTION;
  const ogImage = meta.ogImage ?? `${baseUrl}/images/logo.png`;
  const canonicalUrl = meta.canonicalUrl ?? baseUrl;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: meta.alternateLocales?.reduce(
        (acc, { hreflang, href }) => ({ ...acc, [hreflang]: href }),
        {} as Record<string, string>
      ),
    },
    openGraph: {
      title: meta.title ?? SITE_NAME,
      description,
      url: meta.ogUrl ?? canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@5mods',
      title: meta.title ?? SITE_NAME,
      description,
      images: [ogImage],
    },
    other: {
      'msapplication-config': 'none',
      'msapplication-navbutton-color': THEME_COLOR,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': THEME_COLOR,
    },
  };
}
