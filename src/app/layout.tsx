import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PageLoader } from '@/components/layout/PageLoader';
import { buildMetadata } from '@/lib/metadata';
import { GTM_ID } from '@/constants';

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        {/* Existing CSS (preserved verbatim) */}
        <link
          rel="stylesheet"
          href="/css/application-e5bbfec24aca7af623526506adc308291adf041a31ac899d0cf4f1461bc16d47.css"
        />
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.png" />
      </head>

      <body className="en">
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ login_status: 'Guest', user_id: undefined, gta5mods_id: undefined });
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* GTM noscript */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <PageLoader />

        <Navbar />

        {children}

        <Footer />
        <MobileBottomNav />

        {/* Existing JS bundles (preserved verbatim) */}
        <Script
          src="/js/i18n-b34ba0d3e2681623cbc3208073f6389a3f84f016c9e94dc133bc1f2cbdcdc356.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/js/translations-7d40e53b624c1374790643ca581e785bccb8752eeba38e1663d60775bbedb083.js"
          strategy="beforeInteractive"
        />
        <Script
          id="i18n-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              I18n.defaultLocale = 'en';
              I18n.locale = 'en';
              I18n.fallbacks = true;
              window.locale_path_prefix = '';
              var GTA5M = {User: {authenticated: false}};
            `,
          }}
        />
        <Script
          src="/js/application-3d46eee0cf5b4dd445659c3f01ee7e697e385082c720c57c6a7618c752e3f9a9.js"
          strategy="afterInteractive"
        />

        {/* Ad scripts */}
        <Script src="/js/gtm.js" strategy="afterInteractive" />
        <Script src="/js/quant.js" strategy="afterInteractive" />

        {/* Quantcast */}
        <Script
          id="quantcast-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _qevents = _qevents || [];
              (function(){
                var elem = document.createElement('script');
                elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
                elem.async = true;
                elem.type = "text/javascript";
                var scpt = document.getElementsByTagName('script')[0];
                scpt.parentNode.insertBefore(elem, scpt);
              })();
              _qevents.push({ qacct: "p-bcgV-fdjlWlQo" });
            `,
          }}
        />
      </body>
    </html>
  );
}
