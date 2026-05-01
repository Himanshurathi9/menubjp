'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { env } from '@/lib/env'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      // Fetch session to get user role
      const res = await fetch('/api/auth/session')
      const session = await res.json()

      if (session?.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    height: 52,
    background: '#FFFFFF',
    border: '1.5px solid #E5E5EA',
    borderRadius: 12,
    padding: '0 16px',
    fontSize: 16,
    color: '#1A1A1A',
    width: '100%',
    outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
    boxSizing: 'border-box',
  }
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#1A1A1A'
    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(26,26,26,0.06)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#E5E5EA'
    e.currentTarget.style.boxShadow = 'none'
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: '#AEAEB2',
    letterSpacing: '0.08em',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <main style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — dark branding (hidden on mobile)
          ═══════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '50%',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A08 100%)',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230,57,70,0.15), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #E63946, #C1303C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>M</span>
            </div>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>MenuMate</span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.3,
              maxWidth: 320,
              marginTop: 60,
            }}
          >
            The smartest way to run your restaurant
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 16,
            }}
          >
            QR menus. WhatsApp orders. Loyal customers.
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '⚡', text: 'Orders in your WhatsApp in 3 seconds' },
              { icon: '📱', text: 'No app download needed' },
              { icon: '🎁', text: 'Loyalty stamps built in' },
            ].map((pill) => (
              <div
                key={pill.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 100,
                  padding: '10px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ fontSize: 16 }}>{pill.icon}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{pill.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <span
          style={{
            position: 'absolute',
            bottom: 32,
            left: 60,
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          Powered by MenuMate
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — login form
          ═══════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          background: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          minHeight: '100dvh',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="animate-page-enter animate-page-enter-1"
          style={{ width: '100%', maxWidth: 380, boxSizing: 'border-box' }}
        >
          {/* Mobile-only logo */}
          <div
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #E63946, #C1303C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>M</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>MenuMate</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#6E6E73',
              marginTop: 4,
            }}
          >
            Sign in to manage your restaurant
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div style={{ marginTop: 16 }}>
              <label htmlFor="password" style={labelStyle}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#AEAEB2',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#6E6E73'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#AEAEB2'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: 18, height: 18 }} />
                  ) : (
                    <Eye style={{ width: 18, height: 18 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FFF5F5',
                  border: '1px solid rgba(255,59,48,0.2)',
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <AlertCircle style={{ width: 16, height: 16, color: '#FF3B30', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#FF3B30' }}>{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: 52,
                marginTop: 24,
                background: loading ? '#2C2C2E' : '#1A1A1A',
                borderRadius: 100,
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 150ms ease',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#2C2C2E'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#1A1A1A'
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider + WhatsApp link */}
          <div style={{ marginTop: 24 }}>
            {/* "or" divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: '#E5E5EA',
                }}
              />
              <span style={{ fontSize: 13, color: '#AEAEB2' }}>or</span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: '#E5E5EA',
                }}
              />
            </div>

            {/* WhatsApp CTA */}
            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <span style={{ fontSize: 14, color: '#6E6E73' }}>New restaurant? </span>
              <Link
                href={`https://wa.me/${env.WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent('Hi, I want to know more about MenuMate')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: '#E63946',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Get started on WhatsApp →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
