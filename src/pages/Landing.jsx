/**
 * SahajDesk — Modern SaaS landing page.
 * Linear / Notion / Vercel inspired. Premium, trustworthy, clean.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IoCheckmarkCircle,
  IoCalendarOutline,
  IoPeopleOutline,
  IoNotificationsOutline,
  IoGridOutline,
  IoArrowForward,
  IoCloseCircleOutline,
  IoDocumentTextOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5'
import { Modal, Button, Input } from '../components/ui'
import { useToast } from '../contexts/ToastContext'

const FONT_HEADING = 'var(--font-heading)'
const FONT_BODY = 'var(--font-body)'

function DemoModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      toast.success("We'll contact you within 24 hours. Thank you!")
      setName('')
      setPhone('')
      setEmail('')
      setSubmitting(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open={open} onClose={onClose} title="Book a Free Demo">
      <p className="text-[var(--landing-text-muted)] text-sm mb-4" style={{ fontFamily: FONT_BODY }}>
        Leave your number; we'll call you within 24 hours.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" placeholder="Dr. Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Phone" type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Input label="Email (optional)" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 disabled:opacity-70"
          style={{ fontFamily: FONT_BODY }}
        >
          {submitting ? 'Sending...' : 'Request Demo'}
        </button>
      </form>
    </Modal>
  )
}

export function Landing() {
  const [demoOpen, setDemoOpen] = useState(false)
  const openDemo = () => setDemoOpen(true)

  useEffect(() => {
    document.title = 'SahajDesk — Run your daily business without the chaos'
    return () => { document.title = 'SahajDesk' }
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[var(--landing-bg)] to-white text-[var(--landing-text)]"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--landing-border)]">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <span className="text-lg font-bold text-[var(--landing-primary)]" style={{ fontFamily: FONT_HEADING }}>
            SahajDesk
          </span>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--landing-text-muted)] hover:text-[var(--landing-primary)] no-underline py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors min-h-0"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={openDemo}
              className="py-2 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 min-h-0"
            >
              Book Demo
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--landing-text)] leading-[1.15] mb-6"
                style={{ fontFamily: FONT_HEADING }}
              >
                Run your daily business work —{' '}
                <span className="bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 bg-clip-text text-transparent">
                  without the chaos
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[var(--landing-text-muted)] mb-8 max-w-xl leading-relaxed">
                Appointments, customers, and reminders — simplified for doctors, coaching centers, and small businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={openDemo}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Book a Free Demo
                  <IoArrowForward className="w-5 h-5" aria-hidden />
                </button>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-[var(--landing-text)] border border-[var(--landing-border)] bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors min-h-0"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="relative order-first lg:order-last">
              <div className="rounded-2xl border border-[var(--landing-border)] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--landing-border)]">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="ml-2 text-xs font-medium text-[var(--landing-text-muted)]">Dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-gray-50 border border-[var(--landing-border)] p-4">
                    <p className="text-2xl font-bold text-[var(--landing-primary)]" style={{ fontFamily: FONT_HEADING }}>5</p>
                    <p className="text-xs text-[var(--landing-text-muted)]">Today&apos;s appointments</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-[var(--landing-border)] p-4">
                    <p className="text-2xl font-bold text-[var(--landing-primary)]" style={{ fontFamily: FONT_HEADING }}>42</p>
                    <p className="text-xs text-[var(--landing-text-muted)]">Total customers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['9:00 AM — Raj Kumar', '10:30 AM — Priya S.', '2:00 PM — Amit K.'].map((line, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-[var(--landing-border)] text-sm">
                      <span className="text-[var(--landing-text)]">{line}</span>
                      <span className="text-xs text-emerald-600 font-medium">Upcoming</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SOCIAL PROOF */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 border-y border-[var(--landing-border)] bg-white/50">
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-12 text-sm font-medium text-[var(--landing-text-muted)]">
            <span className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden />
              Built for Indian small businesses
            </span>
            <span className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden />
              No complex setup
            </span>
            <span className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden />
              Works on mobile
            </span>
          </div>
        </section>

        {/* 3. PROBLEM → SOLUTION (side by side) */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--landing-text)] mb-12 text-center"
            style={{ fontFamily: FONT_HEADING }}
          >
            Problems we solve
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { problem: 'Forgotten appointments, no-shows', icon: IoCloseCircleOutline, solution: 'One dashboard. Today, tomorrow, all dates. Status at a glance.' },
              { problem: 'Excel sheets, paper registers', icon: IoDocumentTextOutline, solution: 'Customer list in one place. Search, add, book in seconds.' },
              { problem: 'Manual reminders, missed calls', icon: IoChatbubbleOutline, solution: 'One-click WhatsApp reminder. Date and time sent instantly.' },
            ].map((item, i) => (
              <div key={i} className="md:flex flex-col">
                <div className="rounded-2xl border border-[var(--landing-border)] bg-gray-50/80 p-5 mb-4 transition-shadow hover:shadow-md duration-200">
                  <item.icon className="w-8 h-8 text-red-400 mb-3" aria-hidden />
                  <p className="font-semibold text-[var(--landing-text)] text-sm">{item.problem}</p>
                </div>
                <div className="rounded-2xl border border-[var(--landing-primary)]/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md duration-200">
                  <IoCheckmarkCircle className="w-8 h-8 text-emerald-500 mb-3" aria-hidden />
                  <p className="text-[var(--landing-text-muted)] text-sm leading-relaxed">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PRODUCT PREVIEW */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 bg-gradient-to-b from-white to-[var(--landing-bg)]">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--landing-text)] mb-12 text-center"
              style={{ fontFamily: FONT_HEADING }}
            >
              See SahajDesk in action
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[var(--landing-border)] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <IoGridOutline className="w-6 h-6 text-[var(--landing-primary)]" aria-hidden />
                  <span className="font-semibold text-[var(--landing-text)]">Dashboard</span>
                </div>
                <p className="text-sm text-[var(--landing-text-muted)] mb-4">Today&apos;s appointments and customer count at a glance.</p>
                <div className="rounded-xl bg-gray-50 border border-[var(--landing-border)] h-24 flex items-center justify-center text-xs text-[var(--landing-text-muted)]">
                  Preview
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--landing-border)] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <IoCalendarOutline className="w-6 h-6 text-[var(--landing-primary)]" aria-hidden />
                  <span className="font-semibold text-[var(--landing-text)]">Appointments</span>
                </div>
                <p className="text-sm text-[var(--landing-text-muted)] mb-4">List by date. Edit, complete, or send reminder.</p>
                <div className="rounded-xl bg-gray-50 border border-[var(--landing-border)] h-24 flex items-center justify-center text-xs text-[var(--landing-text-muted)]">
                  Preview
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--landing-border)] bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <IoNotificationsOutline className="w-6 h-6 text-[var(--landing-primary)]" aria-hidden />
                  <span className="font-semibold text-[var(--landing-text)]">WhatsApp reminder</span>
                </div>
                <p className="text-sm text-[var(--landing-text-muted)] mb-4">One click sends date and time to the customer.</p>
                <div className="rounded-xl bg-gray-50 border border-[var(--landing-border)] h-24 flex items-center justify-center text-xs text-[var(--landing-text-muted)]">
                  Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURES (minimal) */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--landing-text)] mb-12 text-center"
            style={{ fontFamily: FONT_HEADING }}
          >
            Everything you need
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: IoCalendarOutline, title: 'Appointments', desc: 'One place for all dates and status.' },
              { icon: IoPeopleOutline, title: 'Customers', desc: 'Search, add, and book in seconds.' },
              { icon: IoNotificationsOutline, title: 'Reminders', desc: 'WhatsApp reminder in one click.' },
              { icon: IoGridOutline, title: 'Dashboard', desc: 'Today and totals at a glance.' },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--landing-border)] bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <f.icon className="w-8 h-8 text-[var(--landing-primary)] mb-3" aria-hidden />
                <h3 className="font-semibold text-[var(--landing-text)] mb-1" style={{ fontFamily: FONT_HEADING }}>{f.title}</h3>
                <p className="text-sm text-[var(--landing-text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. HOW IT WORKS */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 bg-white border-y border-[var(--landing-border)]">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--landing-text)] mb-12 text-center"
              style={{ fontFamily: FONT_HEADING }}
            >
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: 1, title: 'Sign up', desc: 'Create your account with email. No credit card required.' },
                { step: 2, title: 'Add customers', desc: 'Add names and numbers. Reuse them when booking.' },
                { step: 3, title: 'Send reminders', desc: 'One click sends a WhatsApp reminder with date and time.' },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--landing-primary)] to-indigo-600 text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-[var(--landing-text)] mb-2" style={{ fontFamily: FONT_HEADING }}>{item.title}</h3>
                  <p className="text-sm text-[var(--landing-text-muted)]">{item.desc}</p>
                  {item.step < 3 && (
                    <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-[var(--landing-border)]" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. PRICING */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 bg-gradient-to-b from-[var(--landing-bg)] to-indigo-50/30">
          <div className="max-w-xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--landing-text)] mb-12 text-center"
              style={{ fontFamily: FONT_HEADING }}
            >
              Simple pricing
            </h2>
            <div className="rounded-2xl border-2 border-[var(--landing-primary)] bg-white p-8 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/15 transition-shadow duration-200">
              <p className="text-sm font-semibold text-[var(--landing-primary)] mb-2">7-day free trial</p>
              <p className="text-3xl font-bold text-[var(--landing-text)] mb-1" style={{ fontFamily: FONT_HEADING }}>
                ₹69 <span className="text-lg font-normal text-[var(--landing-text-muted)]">/ month</span>
              </p>
              <p className="text-sm text-[var(--landing-text-muted)] mb-6">No credit card required. Cancel anytime.</p>
              <Link
                to="/signup"
                className="block w-full py-3.5 px-6 rounded-xl font-semibold text-center text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 transition-all duration-200 no-underline"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--landing-text)] mb-4 leading-tight"
            style={{ fontFamily: FONT_HEADING }}
          >
            Spend less time managing. More time growing.
          </h2>
          <p className="text-[var(--landing-text-muted)] mb-8">No commitment. See the product, then decide.</p>
          <button
            type="button"
            onClick={openDemo}
            className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 transition-all duration-200"
          >
            Book a Free Demo
            <IoArrowForward className="w-5 h-5" aria-hidden />
          </button>
        </section>

        {/* 9. FOOTER */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-[var(--landing-border)] bg-white">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-bold text-[var(--landing-primary)]" style={{ fontFamily: FONT_HEADING }}>SahajDesk</span>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--landing-text-muted)]">
              <span>Contact: WhatsApp — (your number)</span>
              <Link to="/login" className="hover:text-[var(--landing-primary)] no-underline">Log in</Link>
              <a href="#" className="hover:text-[var(--landing-primary)] no-underline">Privacy</a>
              <a href="#" className="hover:text-[var(--landing-primary)] no-underline">Terms</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky CTA — mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur border-t border-[var(--landing-border)] safe-area-pb">
        <button
          type="button"
          onClick={openDemo}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--landing-primary)] to-indigo-600 hover:from-[var(--landing-primary-hover)] hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200"
        >
          Book a Free Demo
        </button>
      </div>
      <div className="lg:hidden h-20" aria-hidden />

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
