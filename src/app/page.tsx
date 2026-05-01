'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import {
  UtensilsCrossed,
  QrCode,
  MessageCircle,
  Award,
  ArrowRight,
  Check,
  X,
  Star,
  ChevronDown,
  Menu as MenuIcon,
  X as XIcon,
  Zap,
  BarChart3,
  Smartphone,
  Image,
  ClipboardList,
} from 'lucide-react'

/* ── WhatsApp helper (uses env.ts — NO hardcoded numbers) ── */
import { env } from '@/lib/env'
const waLink = (msg: string) =>
  `https://wa.me/${env.WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent(msg)}`

/* ── Design tokens ── */
const T = {
  bg: '#0A0A0A',
  surface: '#111111',
  card: '#1A1A1A',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(230,57,70,0.3)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.35)',
  accent: '#E63946',
  accentGlow: 'rgba(230,57,70,0.15)',
  green: '#34C759',
  waGreen: '#25D366',
}

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useScrollDirection() {
  const [dir, setDir] = useState<'up' | 'down'>('up')
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    let prev = window.scrollY
    const onScroll = () => {
      const curr = window.scrollY
      setScrollY(curr)
      setDir(curr > prev ? 'down' : 'up')
      prev = curr
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return { dir, scrollY }
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED SECTION WRAPPER
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0,0,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION LABEL COMPONENT
   ═══════════════════════════════════════════════════════════ */
function SectionLabel({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: '12px',
        fontWeight: 700,
        color: T.accent,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      {text}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1 — NAVBAR
   ═══════════════════════════════════════════════════════════ */
function Navbar() {
  const { dir, scrollY } = useScrollDirection()
  const [mobileOpen, setMobileOpen] = useState(false)
  const hidden = dir === 'down' && scrollY > 200

  const links = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: hidden ? -80 : 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 clamp(16px, 4vw, 40px)',
          transition: 'top 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <UtensilsCrossed size={20} color={T.accent} strokeWidth={2.2} />
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: T.textPrimary,
                letterSpacing: '-0.03em',
              }}
            >
              MenuMate
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 14,
                  color: T.textSecondary,
                  textDecoration: 'none',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.textSecondary)}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
            <Link
              href="/login"
              style={{
                fontSize: 14,
                color: T.textPrimary,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Log In
            </Link>
            <button
              onClick={() => window.open(waLink('Hi, I want to know more about MenuMate'), '_blank')}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: T.textPrimary,
                background: T.accent,
                border: 'none',
                borderRadius: 100,
                padding: '8px 20px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(230,57,70,0.3)',
                transition: 'filter 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? (
              <XIcon size={24} color={T.textPrimary} />
            ) : (
              <MenuIcon size={24} color={T.textPrimary} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(10,10,10,0.98)',
            backdropFilter: 'blur(20px)',
            padding: '80px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: T.textPrimary,
                textDecoration: 'none',
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: 'center',
                padding: '14px 0',
                borderRadius: 100,
                color: T.textPrimary,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Log In
            </Link>
            <button
              onClick={() => {
                window.open(waLink('Hi, I want to know more about MenuMate'), '_blank')
                setMobileOpen(false)
              }}
              style={{
                textAlign: 'center',
                padding: '14px 0',
                borderRadius: 100,
                color: T.textPrimary,
                fontWeight: 600,
                background: T.accent,
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                boxShadow: '0 0 20px rgba(230,57,70,0.3)',
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — HERO
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const stagger = (i: number) =>
    loaded
      ? { opacity: 1, transform: 'translateY(0)', transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s` }
      : { opacity: 0, transform: 'translateY(20px)' }

  return (
    <section
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 50% 0%, ${T.accentGlow} 0%, transparent 60%), ${T.bg}`,
        padding: '100px 24px 60px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(230,57,70,0.1)',
            border: '1px solid rgba(230,57,70,0.3)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 24,
            ...stagger(0),
          }}
        >
          <span style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>
            ⚡ Now live in Surat — Join 50+ restaurants
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            color: T.textPrimary,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            ...stagger(1),
          }}
        >
          Your restaurant deserves
          <br />
          <span style={{ color: T.accent }}>a menu that sells.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            marginTop: 20,
            fontSize: 18,
            color: T.textSecondary,
            maxWidth: 500,
            margin: '20px auto 0',
            lineHeight: 1.6,
            ...stagger(2),
          }}
        >
          Customers scan a QR code, browse your menu, and order — you get it on WhatsApp
          instantly. No app. No printer. No missed orders.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginTop: 40,
            flexWrap: 'wrap',
            ...stagger(3),
          }}
        >
          <button
            onClick={() => window.open('/menu/brew-house-demo', '_blank')}
            style={{
              background: T.accent,
              color: T.textPrimary,
              padding: '16px 32px',
              borderRadius: 100,
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 40px rgba(230,57,70,0.35)',
              transition: 'filter 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            See Live Demo →
          </button>
          <button
            onClick={() =>
              window.open(waLink('Hi, I want to know more about MenuMate'), '_blank')
            }
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: T.textPrimary,
              padding: '16px 32px',
              borderRadius: 100,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={T.waGreen}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get Started on WhatsApp
          </button>
        </div>

        {/* Social proof */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            marginTop: 32,
            flexWrap: 'wrap',
            ...stagger(4),
          }}
        >
          {[
            '⭐⭐⭐⭐⭐  Loved by 50+ owners',
            '📱 No app download needed',
            '⚡ Setup in 24 hours',
          ].map((text, i) => (
            <span key={i} style={{ fontSize: 14, color: T.textMuted }}>
              {text}
            </span>
          ))}
        </div>

        {/* Phone mockup */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center',
            ...stagger(5),
          }}
        >
          <div
            className="phone-float"
            style={{
              width: 280,
              borderRadius: 40,
              overflow: 'hidden',
              background: '#1A1A18',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              padding: 8,
              position: 'relative',
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 24,
                background: '#1A1A18',
                borderRadius: '0 0 16px 16px',
                zIndex: 2,
              }}
            />
            {/* Screen */}
            <div
              style={{
                borderRadius: 32,
                overflow: 'hidden',
                background: '#0B0B0F',
                position: 'relative',
              }}
            >
              {/* Minimal Header Bar */}
              <div
                style={{
                  height: 36,
                  background: 'rgba(11,11,15,0.88)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  padding: '28px 14px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>
                  Brew House
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Search icon */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="7" />
                      <line x1="15" y1="15" x2="21" y2="21" />
                    </svg>
                  </div>
                  {/* Cart icon with badge */}
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: '#E63946',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ color: '#FFFFFF', fontSize: 7, fontWeight: 700 }}>2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  padding: '6px 8px',
                  overflow: 'hidden',
                }}
              >
                {['All', 'Starters', 'Mains'].map((c, i) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 8,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 100,
                      background: i === 0 ? '#1C1C1E' : 'rgba(255,255,255,0.04)',
                      color: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* 2-Column Card Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  padding: '8px 8px 48px',
                }}
              >
                {[
                  { name: 'Truffle Pasta', price: '₹320', emoji: '🍝', gradient: 'linear-gradient(145deg, #2D1B0E, #1A0F05)' },
                  { name: 'Caesar Salad', price: '₹180', emoji: '🥗', gradient: 'linear-gradient(145deg, #1B2D1E, #0F1A15)' },
                  { name: 'Margherita', price: '₹250', emoji: '🍕', gradient: 'linear-gradient(145deg, #2D1B2D, #1A0F1A)' },
                  { name: 'Tiramisu', price: '₹220', emoji: '🧁', gradient: 'linear-gradient(145deg, #2D2518, #1A1508)' },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={{
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                      background: '#111114',
                      position: 'relative',
                    }}
                  >
                    {/* Image area */}
                    <div
                      style={{
                        aspectRatio: '1/1',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{item.emoji}</span>
                      {/* Add button */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: -8,
                          right: -4,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#E63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(230,57,70,0.4)',
                          zIndex: 1,
                        }}
                      >
                        <span style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 700, marginTop: -1 }}>+</span>
                      </div>
                    </div>
                    {/* Text info */}
                    <div style={{ padding: '6px 6px 8px' }}>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          marginTop: 2,
                        }}
                      >
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Cart Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 10,
                  right: 10,
                  height: 28,
                  background: 'rgba(26,26,34,0.94)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 100,
                  boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  zIndex: 2,
                }}
              >
                <span style={{ color: '#FFFFFF', fontSize: 9, fontWeight: 600 }}>
                  2 items • ₹300
                </span>
                <span style={{ color: '#FFFFFF', fontSize: 8, fontWeight: 600 }}>
                  View Cart →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .phone-float {
          animation: phoneFloat 4s ease-in-out infinite;
        }
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — PROBLEM / SOLUTION
   ═══════════════════════════════════════════════════════════ */
function ProblemSolutionSection() {
  const problems = [
    'Printed menus cost ₹5,000 every time you update',
    'Customers shout orders across the restaurant',
    'Waiter writes wrong order — kitchen makes wrong dish',
    'No way to know which items are bestsellers',
    "Customers don't come back — no loyalty system",
    'Paying Zomato 25% commission on every order',
  ]
  const solutions = [
    'Update your menu in 30 seconds — free, forever',
    'Every order lands directly in your WhatsApp',
    'Customer types their own order — zero mistakes',
    'See exactly what sells every single day',
    'Digital stamp cards bring customers back',
    'Direct orders from your own QR — zero commission',
  ]

  return (
    <section style={{ background: '#0D0D0D', padding: '80px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: T.textPrimary,
                letterSpacing: '-0.03em',
              }}
            >
              Still doing this the old way?
            </h2>
            <p style={{ marginTop: 8, fontSize: 16, color: T.textSecondary }}>
              Every restaurant in Surat faces these problems
            </p>
          </div>
        </AnimatedSection>

        <div
          className="grid md:grid-cols-2"
          style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}
        >
          {/* Problems */}
          <AnimatedSection delay={100}>
            <div
              style={{
                background: 'rgba(255,59,48,0.05)',
                border: '1px solid rgba(255,59,48,0.15)',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.textPrimary,
                  marginBottom: 20,
                }}
              >
                ❌ Without MenuMate
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {problems.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <X size={18} color="#FF3B30" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Solutions */}
          <AnimatedSection delay={200}>
            <div
              style={{
                background: 'rgba(52,199,89,0.05)',
                border: '1px solid rgba(52,199,89,0.15)',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.textPrimary,
                  marginBottom: 20,
                }}
              >
                ✓ With MenuMate
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {solutions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Check size={18} color={T.green} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4 — HOW IT WORKS
   ═══════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: <ClipboardList size={40} color={T.accent} />,
      title: 'You fill a form',
      desc: 'Fill our simple inquiry form with your restaurant details. We call you within 2 hours.',
    },
    {
      num: '02',
      icon: <UtensilsCrossed size={40} color={T.accent} />,
      title: 'We build your menu',
      desc: 'Send us your menu photos and prices. We set everything up for you — beautifully.',
    },
    {
      num: '03',
      icon: <Zap size={40} color={T.accent} />,
      title: 'Go live in 24 hours',
      desc: 'Print your QR codes, place them on tables, and start receiving orders on WhatsApp.',
    },
  ]

  return (
    <section id="how-it-works" style={{ background: T.bg, padding: '80px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="HOW IT WORKS" />
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: T.textPrimary,
                marginTop: 12,
                letterSpacing: '-0.03em',
              }}
            >
              Up and running in 24 hours
            </h2>
          </div>
        </AnimatedSection>

        <div
          className="grid md:grid-cols-3"
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          }}
        >
          {steps.map((s, i) => (
            <AnimatedSection key={i} delay={i * 120}>
              <div
                style={{
                  background: T.surface,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  padding: 28,
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(230,57,70,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: 'rgba(230,57,70,0.2)',
                    display: 'block',
                    marginBottom: 12,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </span>
                {s.icon}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.textPrimary,
                    marginTop: 16,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.6,
                    marginTop: 8,
                  }}
                >
                  {s.desc}
                </p>

                {/* Arrow */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block"
                    style={{
                      position: 'absolute',
                      right: -24,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: T.accent,
                      fontSize: 24,
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5 — LIVE DEMO CTA
   ═══════════════════════════════════════════════════════════ */
function DemoSection() {
  const [qrUrl, setQrUrl] = useState<string | null>(null)

  useEffect(() => {
    const demoUrl = typeof window !== 'undefined' ? `${window.location.origin}/menu/brew-house-demo` : 'https://menumate.in/menu/brew-house-demo'
    QRCode.toDataURL(demoUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    }).then(setQrUrl)
  }, [])

  return (
    <section
      id="demo"
      style={{
        background: `radial-gradient(ellipse at center, rgba(230,57,70,0.08) 0%, transparent 70%), #0D0D0D`,
        padding: '80px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <AnimatedSection>
          <SectionLabel text="SEE IT IN ACTION" />
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontWeight: 800,
              color: T.textPrimary,
              marginTop: 12,
              letterSpacing: '-0.03em',
            }}
          >
            Scan this to see a live menu
          </h2>
          <p
            style={{
              fontSize: 16,
              color: T.textSecondary,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            This is exactly what your customers will see when they scan your restaurant&apos;s QR
            code
          </p>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              width: 200,
              height: 200,
              margin: '32px auto 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px rgba(255,255,255,0.05)',
            }}
          >
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Demo QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#F0F0F0',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={48} color="#CCC" />
              </div>
            )}
          </div>

          <div style={{ margin: '20px 0', color: T.textMuted, fontSize: 13 }}>— or —</div>

          <button
            onClick={() => window.open('/menu/brew-house-demo', '_blank')}
            style={{
              background: T.textPrimary,
              color: T.bg,
              padding: '14px 28px',
              borderRadius: 100,
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              transition: 'filter 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            View Demo Menu →
          </button>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6 — FEATURES
   ═══════════════════════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: <QrCode size={20} color={T.accent} />,
      title: 'QR Code Per Table',
      desc: 'Each table gets its own QR. Customer scans, table number is automatic. No confusion.',
      badge: null,
    },
    {
      icon: <MessageCircle size={20} color={T.accent} />,
      title: 'WhatsApp Orders',
      desc: 'Every order arrives in your WhatsApp in 3 seconds. With table number and full item list.',
      badge: null,
    },
    {
      icon: <Award size={20} color={T.accent} />,
      title: 'Loyalty Stamp Cards',
      desc: 'Digital stamp cards bring customers back. 9 orders = 1 free item. Automatic rewards.',
      badge: 'PRO',
    },
    {
      icon: <Image size={20} color={T.accent} />,
      title: 'Promotional Banners',
      desc: 'Run festival offers, happy hours, new launches. Schedule them in advance. Auto on/off.',
      badge: null,
    },
    {
      icon: <BarChart3 size={20} color={T.accent} />,
      title: 'Live Order Dashboard',
      desc: 'See every order live. New → Preparing → Served. Your kitchen stays organized.',
      badge: null,
    },
    {
      icon: <Smartphone size={20} color={T.accent} />,
      title: 'No App Needed',
      desc: "Customers open in their browser. No download. Works on any phone, any network.",
      badge: null,
    },
  ]

  return (
    <section id="features" style={{ background: T.bg, padding: '80px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="FEATURES" />
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: T.textPrimary,
                marginTop: 12,
                letterSpacing: '-0.03em',
              }}
            >
              Everything your restaurant needs
            </h2>
          </div>
        </AnimatedSection>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div
                style={{
                  background: T.surface,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: 24,
                  height: '100%',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)'
                  e.currentTarget.style.background = 'rgba(230,57,70,0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.background = T.surface
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: 'rgba(230,57,70,0.1)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {f.icon}
                  {f.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        background: T.accent,
                        color: '#FFFFFF',
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 100,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: T.textPrimary,
                    marginTop: 16,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.6,
                    marginTop: 8,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 7 — PRICING
   ═══════════════════════════════════════════════════════════ */
function PricingSection() {
  const plans = [
    {
      name: 'Basic',
      subtitle: 'For cafes getting started',
      setupPrice: '₹3,000',
      monthlyPrice: '₹999',
      perDay: '= just ₹33/day ☕',
      perDayColor: T.green,
      features: [
        'Up to 40 menu items',
        '8 categories',
        '10 tables with QR codes',
        'WhatsApp order notifications',
        '1 promotional banner',
        'Live order dashboard',
        'We set everything up for you',
      ],
      cta: 'Get Started on Basic',
      waMsg: 'Hi, I want MenuMate Basic Plan',
      popular: false,
    },
    {
      name: 'Pro',
      subtitle: 'For serious restaurants',
      setupPrice: '₹5,000',
      monthlyPrice: '₹1,499',
      perDay: '= just ₹50/day 🔥',
      perDayColor: T.accent,
      features: [
        'Everything in Basic',
        'Unlimited menu items',
        '30 tables with QR codes',
        '5 rotating banners',
        'Festival banner templates',
        'Digital loyalty stamp cards',
        'Customer database (phone numbers)',
        "Best Seller + Chef's Special badges",
        'Weekly WhatsApp report',
        'Priority support from founder',
      ],
      cta: 'Get Started on Pro →',
      waMsg: 'Hi, I want MenuMate Pro Plan',
      popular: true,
    },
  ]

  return (
    <section id="pricing" style={{ background: '#0D0D0D', padding: '80px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <SectionLabel text="PRICING" />
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: T.textPrimary,
                marginTop: 12,
                letterSpacing: '-0.03em',
              }}
            >
              Simple, honest pricing
            </h2>
            <p style={{ fontSize: 16, color: T.textSecondary, marginTop: 8 }}>
              One-time setup fee + monthly subscription. We build everything for you.
            </p>
          </div>
        </AnimatedSection>

        {/* Trial banner */}
        <AnimatedSection delay={100}>
          <div
            style={{
              background: 'rgba(52,199,89,0.08)',
              border: '1px solid rgba(52,199,89,0.2)',
              borderRadius: 12,
              padding: '14px 20px',
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            <span style={{ color: T.green, fontWeight: 600, fontSize: 14 }}>
              🎁 Special offer — First 7 days free. No payment needed to start.
            </span>
          </div>
        </AnimatedSection>

        <div
          className="grid md:grid-cols-2"
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            alignItems: 'start',
          }}
        >
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 120 + 200}>
              <div
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, #1A0A0A, #1A1010)'
                    : T.surface,
                  border: plan.popular
                    ? '1px solid rgba(230,57,70,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  padding: 32,
                  position: 'relative',
                  boxShadow: plan.popular ? '0 0 40px rgba(230,57,70,0.1)' : 'none',
                  transition: 'box-shadow 200ms ease',
                }}
                onMouseEnter={(e) => {
                  if (plan.popular)
                    e.currentTarget.style.boxShadow = '0 0 60px rgba(230,57,70,0.2)'
                }}
                onMouseLeave={(e) => {
                  if (plan.popular)
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(230,57,70,0.1)'
                }}
              >
                {/* Most popular badge */}
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: T.accent,
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 16px',
                      borderRadius: 100,
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 14, color: T.textSecondary, marginTop: 2 }}>
                  {plan.subtitle}
                </p>

                {/* Pricing */}
                <div style={{ marginTop: 20 }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: T.textPrimary,
                    }}
                  >
                    {plan.setupPrice}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.4)',
                      marginLeft: 4,
                    }}
                  >
                    /one-time setup
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.6)',
                    marginTop: 4,
                  }}
                >
                  then {plan.monthlyPrice}/month
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: plan.perDayColor,
                    marginTop: 4,
                  }}
                >
                  {plan.perDay}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                    margin: '24px 0',
                  }}
                />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Check size={16} color={T.green} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => window.open(waLink(plan.waMsg), '_blank')}
                  style={{
                    width: '100%',
                    marginTop: 24,
                    height: 52,
                    borderRadius: 100,
                    fontWeight: 600,
                    fontSize: 15,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'filter 150ms',
                    background: plan.popular ? T.accent : '#FFFFFF',
                    color: plan.popular ? '#FFFFFF' : '#0A0A0A',
                    boxShadow: plan.popular
                      ? '0 0 30px rgba(230,57,70,0.3)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Below cards */}
        <AnimatedSection delay={500}>
          <p
            style={{
              textAlign: 'center',
              marginTop: 32,
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            🤝 We set up your entire menu for you. Just send us your photos and prices.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 8 — TESTIMONIALS
   ═══════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      text: 'Aap ne jo promise kiya tha exactly waisi cheez mili. Customers ab khud order karte hain, galtiyan zero ho gayi.',
      name: 'Rajesh Patel',
      restaurant: 'Spice Garden, Surat',
      initials: 'RP',
    },
    {
      text: 'Pehle menu print karana ₹4,000 lagta tha. Ab sirf phone mein update karta hoon. MenuMate ne sach mein life easy kar di.',
      name: 'Priya Shah',
      restaurant: 'Cafe Bloom, Adajan',
      initials: 'PS',
    },
    {
      text: 'WhatsApp pe seedha order aata hai table number ke saath. Kitchen staff ko samajh aata hai, mistakes nahi hote. Highly recommended.',
      name: 'Amit Desai',
      restaurant: 'The Coffee Stop, Vesu',
      initials: 'AD',
    },
  ]

  return (
    <section style={{ background: T.bg, padding: '80px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="TESTIMONIALS" />
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: T.textPrimary,
                marginTop: 12,
                letterSpacing: '-0.03em',
              }}
            >
              Restaurant owners love it
            </h2>
          </div>
        </AnimatedSection>

        <div
          className="grid md:grid-cols-3"
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          }}
        >
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 120}>
              <div
                style={{
                  background: T.surface,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: 24,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: 14 }}>⭐⭐⭐⭐⭐</span>
                <p
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.75)',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    marginTop: 12,
                    flex: 1,
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${T.accent}, rgba(230,57,70,0.6))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>
                      {t.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.restaurant}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 9 — INQUIRY FORM
   ═══════════════════════════════════════════════════════════ */
function InquiryForm() {
  const [form, setForm] = useState({
    restaurantName: '',
    ownerName: '',
    phone: '',
    city: 'Surat',
    plan: 'basic',
  })
  const [submitting, setSubmitting] = useState(false)

  const cities = ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Other']

  const handleSubmit = useCallback(() => {
    if (!form.restaurantName || !form.ownerName || !form.phone) {
      return
    }
    setSubmitting(true)
    const message = `Hi MenuMate! 🍽️

Restaurant: ${form.restaurantName}
Name: ${form.ownerName}
City: ${form.city}
Plan: ${form.plan === 'basic' ? 'Basic (₹999/mo)' : 'Pro (₹1,499/mo)'}

I want to get started with MenuMate.`

    window.open(waLink(message), '_blank')
    setTimeout(() => setSubmitting(false), 2000)
  }, [form])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '14px 16px',
    color: T.textPrimary,
    fontSize: 16,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 150ms, background 150ms',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
    display: 'block',
  }

  const isFormValid = form.restaurantName && form.ownerName && form.phone

  return (
    <section id="get-started" style={{ background: '#0D0D0D', padding: '80px 40px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SectionLabel text="GET STARTED" />
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                fontWeight: 800,
                color: T.textPrimary,
                marginTop: 12,
                letterSpacing: '-0.03em',
              }}
            >
              Let&apos;s set up your restaurant
            </h2>
            <p style={{ fontSize: 16, color: T.textSecondary, marginTop: 8, lineHeight: 1.6 }}>
              Fill this form. We&apos;ll call you within 2 hours and set everything up in 24 hours.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            style={{
              background: T.surface,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Restaurant Name */}
            <div>
              <label style={labelStyle}>Restaurant Name *</label>
              <input
                type="text"
                placeholder="The Brew House"
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(230,57,70,0.5)'
                  e.target.style.background = 'rgba(230,57,70,0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            {/* Your Name */}
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input
                type="text"
                placeholder="Rajesh Patel"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(230,57,70,0.5)'
                  e.target.style.background = 'rgba(230,57,70,0.03)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label style={labelStyle}>WhatsApp Number *</label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 16,
                    fontWeight: 500,
                    pointerEvents: 'none',
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: 52 }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(230,57,70,0.5)'
                    e.target.style.background = 'rgba(230,57,70,0.03)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                We&apos;ll call you on this number only
              </p>
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>Your City *</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  paddingRight: 40,
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(230,57,70,0.5)'
                  e.target.style.background = 'rgba(230,57,70,0.03)'
                  e.target.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(230,57,70,0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                  e.target.style.backgroundRepeat = 'no-repeat'
                  e.target.style.backgroundPosition = 'right 16px center'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                  e.target.style.backgroundRepeat = 'no-repeat'
                  e.target.style.backgroundPosition = 'right 16px center'
                }}
              >
                {cities.map((c) => (
                  <option key={c} value={c} style={{ background: '#111', color: '#fff' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Selection */}
            <div>
              <label style={labelStyle}>Plan Interested In *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(['basic', 'pro'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, plan: p })}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: 'center',
                      background: form.plan === p ? T.accent : 'rgba(255,255,255,0.05)',
                      color: form.plan === p ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                      transition: 'all 150ms',
                    }}
                  >
                    {p === 'basic' ? 'BASIC' : 'PRO'} — {p === 'basic' ? '₹999/mo' : '₹1,499/mo'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              style={{
                width: '100%',
                height: 56,
                borderRadius: 100,
                background: isFormValid ? T.waGreen : 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isFormValid ? '0 0 30px rgba(37,211,102,0.25)' : 'none',
                transition: 'all 150ms',
                marginTop: 4,
                opacity: isFormValid ? 1 : 0.5,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send on WhatsApp →
            </button>

            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              By submitting you agree to be contacted on WhatsApp
            </p>
          </form>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 10 — FOOTER
   ═══════════════════════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UtensilsCrossed size={18} color={T.accent} strokeWidth={2.2} />
            <span style={{ fontWeight: 700, fontSize: 16, color: T.textPrimary }}>
              MenuMate
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>
              Digital menus for Indian restaurants
            </span>
          </div>

          {/* Location */}
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Surat, Gujarat 🇮🇳
          </span>

          {/* WhatsApp */}
          <button
            onClick={() => window.open(waLink('Hi MenuMate!'), '_blank')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: T.waGreen,
              fontWeight: 500,
              textDecoration: 'none',
              padding: 0,
            }}
          >
            Chat with us
          </button>
        </div>

        {/* Copyright */}
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          © {new Date().getFullYear()} MenuMate. Built in Surat.
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div style={{ background: T.bg, color: T.textPrimary }}>
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <InquiryForm />
      <FooterSection />
    </div>
  )
}
