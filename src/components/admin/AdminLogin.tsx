'use client';

import React, { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }

    // Auto-complete @gmail.com if user types only username
    if (!trimmedEmail.includes('@')) {
      trimmedEmail = `${trimmedEmail}@gmail.com`;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      if (!supabase || !isSupabaseConfigured()) {
        setErrorMsg(
          'Database credentials are not configured in environment variables. Please check your cloud configuration.'
        );
        setLoading(false);
        return;
      }

      // Authenticate directly using secure Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      if (data.session && data.user) {
        const userId = data.user.id;
        const userEmail = data.user.email || trimmedEmail;

        // Fetch or initialize user profile securely via server API route
        let userRole = 'super_admin';
        try {
          const profileRes = await fetch('/api/admin/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              email: userEmail,
              name: userEmail.split('@')[0],
            }),
          });
          const profileData = await profileRes.json();
          if (profileData?.profile?.role) {
            userRole = profileData.profile.role;
          }
        } catch (profileErr) {
          console.warn('Profile fetch note:', profileErr);
        }

        // Successfully authenticated credentials
        if (rememberMe) {
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('admin_user_email', userEmail);
          localStorage.setItem('admin_user_role', userRole);
        }
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_user_email', userEmail);
        sessionStorage.setItem('admin_user_role', userRole);

        setLoading(false);
        onLoginSuccess();
        return;
      } else {
        setErrorMsg('Authentication failed: No active session received.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'Authentication error occurred while connecting to the server.');
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-wrapper"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
        }}
      >
        {/* LEFT PANEL: High Contrast Minimal Brand Frame */}
        <div
          className="hidden-xs col-sm-5 col-md-6"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRight: '1px solid #262626',
            position: 'relative',
          }}
        >
          {/* Subtle overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1
          }} />

          {/* No text displayed on top of the background image per user request */}
        </div>

        {/* RIGHT PANEL: Crisp White Form */}
        <div
          className="col-xs-12 col-sm-7 col-md-6"
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            color: '#0a0a0a',
            padding: '60px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ maxWidth: 420, width: '100%' }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                Secure Login
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0a0a0a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
                Sign In to Dashboard
              </h2>
              <p style={{ fontSize: 14, color: '#71717a', margin: 0 }}>
                Enter your administrative credentials to continue.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#0a0a0a',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <i className="fa fa-exclamation-triangle" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Username / Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Email Address or Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: 14,
                    border: '1px solid #d4d4d8',
                    borderRadius: 6,
                    outline: 'none',
                    color: '#0a0a0a',
                    backgroundColor: '#fafafa',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Password
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      fontSize: 14,
                      border: '1px solid #d4d4d8',
                      borderRadius: 6,
                      outline: 'none',
                      color: '#0a0a0a',
                      backgroundColor: '#fafafa',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: 10,
                      background: 'none',
                      border: 'none',
                      color: '#71717a',
                      fontSize: 14,
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#52525b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#000000' }}
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'opacity 0.15s ease',
                }}
              >
                {loading ? (
                  <>
                    <i className="fa fa-circle-o-notch fa-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-sign-in" />
                    <span>Sign In to Admin Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
