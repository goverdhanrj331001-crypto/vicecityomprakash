'use client';

import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="container" style={{ padding: '40px 15px', minHeight: '80vh', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#dc2626', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa fa-arrow-left" /> Back to Home
        </Link>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Refund Policy (रिफंड नीति)</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Last Updated: August 21, 2026</p>

        {/* Hindi Section */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>1. हिंदी संस्करण (Hindi Version)</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            डिजिटल उत्पादों (जैसे डाउनलोड करने योग्य मॉड्स, स्क्रिप्ट्स, और लिवरीज़) की प्रकृति के कारण, <strong>एक बार भुगतान पूरा होने और फ़ाइलें डाउनलोड हो जाने के बाद हम कोई रिफंड या रिप्लेसमेंट जारी नहीं करते हैं।</strong>
          </p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>विशेष अपवाद:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            हम केवल निम्नलिखित विशेष मामलों में रिफंड या सहायता प्रदान करेंगे:
          </p>
          <ul style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>यदि आपके खाते से पैसे कट गए हैं लेकिन आर्डर डिलीवर नहीं हुआ या डाउनलोड लिंक सक्रिय नहीं हुआ।</li>
            <li style={{ marginBottom: '8px' }}>यदि डिजिटल फ़ाइल पूरी तरह से क्षतिग्रस्त (corrupted) है और डाउनलोड नहीं हो पा रही है।</li>
          </ul>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7' }}>
            ऐसी स्थिति में, आप भुगतान के प्रमाण के साथ सपोर्ट टीम से संपर्क कर सकते हैं और हम 24-48 घंटों के भीतर आपकी समस्या का समाधान करेंगे।
          </p>
        </div>

        {/* English Section */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>2. English Version</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            Due to the non-tangible, irreversible nature of digital downloads (such as scripts, tools, cars, and customized liveries), <strong>all sales are final. Once a download link is accessed or files are retrieved, we do not issue monetary refunds or exchange credits.</strong>
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>Exceptions:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            We only review refund requests under very specific, verified conditions:
          </p>
          <ul style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Non-Delivery of Product:</strong> Your payment was successfully captured, but you did not receive a functional invoice or secure download links within your profile panel.</li>
            <li style={{ marginBottom: '8px' }}><strong>File Corruption:</strong> The ZIP archive is verified to be corrupted or missing crucial assets on our servers, preventing deployment.</li>
          </ul>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7' }}>
            Please contact our administrators with valid payment screenshots or gateway receipts for assistance, and we will resolve your case within 24 to 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
