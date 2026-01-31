import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAppointments, getCustomers } from '../lib/firestore'
import { Layout } from '../components/Layout'
import { CalendarStrip } from '../components/CalendarStrip'
import { Card, Button, CardSkeleton, ListItemSkeleton } from '../components/ui'
import { useT } from '../contexts/LocaleContext'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function Dashboard({ user }) {
  const t = useT()
  const [allAppointments, setAllAppointments] = useState([])
  const [customerCount, setCustomerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    if (!user?.uid) return
    const load = async () => {
      try {
        const [apts, customers] = await Promise.all([
          getAppointments(user.uid, 'all'),
          getCustomers(user.uid),
        ])
        setAllAppointments(apts)
        setCustomerCount(customers.length)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.uid])

  const countsByDate = useMemo(() => {
    const counts = {}
    allAppointments.forEach((a) => {
      const d = a.date || ''
      if (!d) return
      counts[d] = (counts[d] || 0) + 1
    })
    return counts
  }, [allAppointments])

  const selectedDateAppointments = useMemo(() => {
    return allAppointments
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }, [allAppointments, selectedDate])

  const isToday = selectedDate === todayStr()
  const statusLabel = (status) => {
    if (status === 'scheduled') return t('appointments.statusUpcoming')
    if (status === 'completed') return t('appointments.statusCompleted')
    if (status === 'cancelled') return t('appointments.statusCancelled')
    return status
  }

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return ''
    if (selectedDate === todayStr()) return t('dashboard.todayAppointments')
    const d = new Date(selectedDate + 'T12:00:00')
    return `${t('dashboard.appointmentsFor')} ${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`
  }, [selectedDate, t])

  return (
    <Layout user={user}>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-6 font-heading">
        {t('dashboard.title')}
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                {countsByDate[todayStr()] ?? 0}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {t('dashboard.todayAppointments')}
              </p>
            </Card>
            <Card>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                {customerCount}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {t('dashboard.totalCustomers')}
              </p>
            </Card>
          </>
        )}
      </div>

      <Link to="/appointments/new" className="block mb-6">
        <Button variant="primary" size="lg" className="w-full sm:w-auto">
          + {t('dashboard.addAppointment')}
        </Button>
      </Link>

      {/* Calendar strip for schedule */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-[var(--color-text)] mb-3 font-heading">
          {t('calendar.schedule')}
        </h2>
        <CalendarStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          countsByDate={countsByDate}
          weekOffset={weekOffset}
          onWeekChange={setWeekOffset}
        />
      </section>

      {/* Appointments for selected date */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-text)] mb-3">
          {selectedDateLabel}
        </h2>
        {loading ? (
          <div className="space-y-2">
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        ) : selectedDateAppointments.length === 0 ? (
          <Card>
            <p className="text-[var(--color-text-muted)] text-center py-4">
              {isToday ? t('dashboard.emptyTitle') : `${t('dashboard.appointmentsFor')} ${selectedDate} — no appointments.`}
            </p>
            <Link to="/appointments/new" className="block mt-2">
              <Button variant="secondary" className="w-full">
                {t('dashboard.emptyCta')}
              </Button>
            </Link>
          </Card>
        ) : (
          <ul className="space-y-2">
            {selectedDateAppointments.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/appointments/${a.id}`}
                  className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] transition-colors no-underline text-[var(--color-text)]"
                >
                  <span className="font-semibold text-[var(--color-primary)] min-w-[4rem]">
                    {a.time}
                  </span>
                  <span className="flex-1 font-medium">{a.customerName || t('common.noName')}</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      a.status === 'completed'
                        ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                        : a.status === 'cancelled'
                        ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
                        : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    }`}
                  >
                    {statusLabel(a.status)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  )
}
