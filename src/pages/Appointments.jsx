import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAppointments, deleteAppointment } from '../lib/firestore'
import { getWhatsAppReminderLink } from '../utils/whatsapp'
import { Layout } from '../components/Layout'
import { CalendarStrip } from '../components/CalendarStrip'
import { Button, Card, ConfirmModal, ListItemSkeleton } from '../components/ui'
import { useToast } from '../contexts/ToastContext'
import { useT } from '../contexts/LocaleContext'

const FILTER_KEYS = [
  { key: 'today', labelKey: 'appointments.filterToday' },
  { key: 'upcoming', labelKey: 'appointments.filterUpcoming' },
  { key: 'all', labelKey: 'appointments.filterAll' },
]

function formatDateLabel(dateStr, t) {
  if (!dateStr) return ''
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10)
  if (dateStr === today) return t('appointments.dateToday')
  if (dateStr === tomorrow) return t('appointments.dateTomorrow')
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getStatusBadge(status, t) {
  const map = {
    scheduled: { labelKey: 'appointments.statusUpcoming', class: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' },
    completed: { labelKey: 'appointments.statusCompleted', class: 'bg-[var(--color-success-light)] text-[var(--color-success)]' },
    cancelled: { labelKey: 'appointments.statusCancelled', class: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]' },
  }
  const entry = map[status] || { labelKey: status, class: 'bg-gray-100 text-[var(--color-text-muted)]' }
  return { label: t(entry.labelKey), class: entry.class }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function Appointments({ user }) {
  const t = useT()
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('upcoming')
  const [selectedDate, setSelectedDate] = useState(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!user?.uid) return
    const load = async () => {
      try {
        const list = await getAppointments(user.uid, filter)
        setAppointments(list)
      } catch (err) {
        console.error(err)
        toast.error(t('appointments.toastLoadFail'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.uid, filter, toast, t])

  useEffect(() => {
    setSelectedDate(null)
  }, [filter])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteAppointment(deleteId)
      setAppointments((prev) => prev.filter((a) => a.id !== deleteId))
      setDeleteId(null)
      toast.success(t('appointments.toastDeleted'))
    } catch (err) {
      toast.error(err.message || t('appointments.toastDeleteFail'))
    } finally {
      setDeleting(false)
    }
  }

  const handleWhatsApp = (a) => {
    const phone = a.phone || ''
    if (!phone) {
      toast.error(t('appointments.toastNoPhone'))
      return
    }
    const link = getWhatsAppReminderLink(phone, a.customerName, a.date, a.time)
    window.open(link, '_blank')
  }

  const countsByDate = useMemo(() => {
    const counts = {}
    appointments.forEach((a) => {
      const d = a.date || ''
      if (!d) return
      counts[d] = (counts[d] || 0) + 1
    })
    return counts
  }, [appointments])

  const displayList = useMemo(() => {
    if (selectedDate) return appointments.filter((a) => a.date === selectedDate)
    return appointments
  }, [appointments, selectedDate])

  const groupedByDate = useMemo(() => {
    const groups = {}
    displayList.forEach((a) => {
      const key = a.date || 'other'
      if (!groups[key]) groups[key] = []
      groups[key].push(a)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [displayList])

  return (
    <Layout user={user}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] font-heading">
          {t('appointments.title')}
        </h1>
        <Link to="/appointments/new">
          <Button variant="primary" size="lg">+ {t('appointments.addAppointment')}</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTER_KEYS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2.5 rounded-[var(--radius)] font-medium text-sm min-h-[44px] transition-colors ${
              filter === f.key
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="px-4 py-2.5 rounded-[var(--radius)] font-medium text-sm min-h-[44px] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {t('appointments.filterAll')}
          </button>
        )}
      </div>

      <section className="mb-6">
        <h2 className="text-base font-semibold text-[var(--color-text)] mb-3 font-heading sr-only">
          {t('calendar.schedule')}
        </h2>
        <CalendarStrip
          selectedDate={selectedDate ?? todayStr()}
          onSelectDate={(dateStr) => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
          countsByDate={countsByDate}
          weekOffset={weekOffset}
          onWeekChange={setWeekOffset}
        />
      </section>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <Card>
          <p className="text-[var(--color-text-muted)] text-center py-6">
            {selectedDate ? t('appointments.emptyForDate') : t('appointments.empty')}
          </p>
          <Link to="/appointments/new" className="block mt-4">
            <Button variant="primary" className="w-full sm:w-auto">+ {t('appointments.addAppointment')}</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map(([dateKey, list]) => (
            <div key={dateKey}>
              <h2 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">
                {formatDateLabel(dateKey, t)}
              </h2>
              <ul className="space-y-2">
                {list.map((a) => {
                  const badge = getStatusBadge(a.status, t)
                  return (
                    <li
                      key={a.id}
                      className="flex flex-wrap items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[var(--color-primary)]">
                            {a.time}
                          </span>
                          <span className="font-medium">{a.customerName || t('common.noName')}</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                        {a.notes && (
                          <p className="text-sm text-[var(--color-text-muted)] mt-1 truncate">
                            {a.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to={`/bills/new?appointmentId=${a.id}`}>
                          <Button variant="secondary" size="sm" className="min-h-0">
                            {t('appointments.generateBill')}
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleWhatsApp(a)}
                          className="min-h-0 bg-[#25D366] text-white border-0 hover:opacity-90"
                        >
                          {t('appointments.whatsapp')}
                        </Button>
                        <Link to={`/appointments/${a.id}`}>
                          <Button variant="secondary" size="sm" className="min-h-0">
                            {t('common.edit')}
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          className="min-h-0"
                          onClick={() => setDeleteId(a.id)}
                        >
                          {t('common.delete')}
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('appointments.deleteConfirmTitle')}
        message={t('appointments.deleteConfirmMessage')}
        confirmLabel={t('appointments.deleteConfirmYes')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        loading={deleting}
      />
    </Layout>
  )
}
