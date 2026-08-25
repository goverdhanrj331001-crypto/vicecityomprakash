import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a' }}>404</h1>
      <h2 style={{ fontSize: 20, color: '#475569', marginBottom: 20 }}>Page Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: 30 }}>
        The page or mod you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-success btn-lg">
        Return to Home
      </Link>
    </div>
  );
}
