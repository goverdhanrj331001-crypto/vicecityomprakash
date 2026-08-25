'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '40px 15px', minHeight: '80vh', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#dc2626', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa fa-arrow-left" /> Back to Home
        </Link>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Privacy Policy (गोपनीयता नीति)</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Last Updated: August 21, 2026</p>

        {/* Hindi Section */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>1. हिंदी संस्करण (Hindi Version)</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            <strong>G5mode</strong> (&quot;हम&quot;, &quot;हमारा&quot;, या &quot;कंपनी&quot;) में, हमारे विज़िटर्स की गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह गोपनीयता नीति दस्तावेज़ यह रेखांकित करता है कि हमारे द्वारा कौन सी जानकारी एकत्र और रिकॉर्ड की जाती है तथा हम इसका उपयोग कैसे करते हैं।
          </p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>संग्रहीत की जाने वाली जानकारी:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            जब आप हमारे प्लेटफ़ॉर्म पर ऑर्डर देते हैं या भुगतान करते हैं, तो हम आपका नाम, ईमेल आईडी, मोबाइल नंबर और पेमेंट रेफरेंस आईडी जैसी बुनियादी जानकारी एकत्र करते हैं ताकि हम सुरक्षित रूप से डिजिटल डाउनलोड की आपूर्ति कर सकें। हम कोई भी कार्ड विवरण या बैंक पिन एकत्र या स्टोर नहीं करते हैं; सभी भुगतान अधिकृत पेमेंट गेटवे (जैसे Razorpay, PayPal, UPI) के माध्यम से सुरक्षित रूप से प्रोसेस किए जाते हैं।
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>सुरक्षा:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            हम आपके व्यक्तिगत डेटा की सुरक्षा सुनिश्चित करने के लिए उद्योग-मानक एन्क्रिप्शन और सुरक्षा उपायों का उपयोग करते हैं। आपकी व्यक्तिगत जानकारी कभी भी किसी तीसरे पक्ष को बेची या साझा नहीं की जाती है।
          </p>
        </div>

        {/* English Section */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>2. English Version</h2>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            At <strong>G5mode</strong>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by us and how we use it.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>Information We Collect:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            When you place an order or complete a transaction on our platform, we collect standard details such as your name, email address, mobile number, and payment transaction IDs to deliver the digital mods successfully. We do not store credit card or confidential banking credentials; payments are securely handled by certified, external payment processors.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '8px' }}>Data Protection & Security:</h3>
          <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
            We implement high-grade server encryption and secure hosting configurations to ensure your digital profile is fully shielded. Your details are strictly confidential and are never rented, sold, or shared with unauthorized third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
