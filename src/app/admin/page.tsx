'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If explicitly authenticated in session, stay authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.replace('/serveromprakash');
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 32, color: '#dc2626', marginBottom: 16 }} />
          <div>Checking Authentication...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to /vpsomprakash in useEffect
  }

  return <AdminLayout />;
}
