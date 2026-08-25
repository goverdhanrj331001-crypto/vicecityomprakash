'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLogin } from '@/components/admin/AdminLogin';

export default function ServeromprakashLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/vpsomprakash');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
