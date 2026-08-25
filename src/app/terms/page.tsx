'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="container" style={{ padding: '40px 15px', minHeight: '80vh', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#dc2626', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa fa-arrow-left" /> Back to Home
        </Link>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Terms of Use (उपयोग की शर्तें)</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Last Updated: August 21, 2026</p>

        {/* Hindi Section */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>1. हिंदी संस्करण (Hindi Version)</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों को पूरी तरह से स्वीकार करते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।
          </p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>डिजिटल उत्पाद और लाइसेंस:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            हमारी वेबसाइट पर उपलब्ध सभी गेमिंग मॉडिफिकेशन्स, 3D मॉडल्स और स्क्रिप्ट्स डिजिटल उत्पाद हैं। इन्हें खरीदने पर आपको केवल व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए एक सीमित लाइसेंस प्रदान किया जाता है। आप इन फ़ाइलों को पुनः वितरित, पुनर्विक्रय या अनधिकृत रूप से शेयर नहीं कर सकते।
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>उपयोगकर्ता उत्तरदायित्व:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            यह आपकी जिम्मेदारी है कि आप खरीदे गए मॉड्स को सही तरीके से अपने सिस्टम पर सेटअप करें। हम गेम फ़ाइलों या गेम में होने वाले किसी भी क्रैश या असंगति के लिए जिम्मेदार नहीं होंगे।
          </p>
        </div>

        {/* English Section */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>2. English Version</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this platform.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>Digital Products & Licensing:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            All mods, assets, scripts, and liveries hosted on our store are classified as digital software downloads. Upon purchase, you are granted a single-user, non-transferable personal license to run and test these modifications. Unauthorized redistribution, copying, modification for sale, or sharing of any proprietary files is strictly prohibited.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>Account & Installation Accountability:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            You are solely responsible for ensuring compatibility with your current game build and system parameters. We do not assume liability for localized software conflicts or account bans resulting from game modifications.
          </p>
        </div>
      </div>
    </div>
  );
}
