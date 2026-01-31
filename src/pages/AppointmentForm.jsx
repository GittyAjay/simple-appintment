import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import { addAppointment, updateAppointment, getAppointment, getCustomers } from '../lib/firestore'
import { Layout } from '../components/Layout'
import { Button, Input, Select, Textarea, CardSkeleton } from '../components/ui'
import { useToast } from '../contexts/ToastContext'
import { useT } from '../contexts/LocaleContext'

const STATUS_OPTIONS = [
  { value: 'scheduled', labelKey: 'appointments.statusUpcoming' },
  { value: 'completed', labelKey: 'appointments.statusCompleted' },
  { value: 'cancelled', labelKey: 'appointments.statusCancelled' },
]

export function AppointmentForm({ user }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const prefillCustomerId = searchParams.get('customer')
  const navigate = useNavigate()
  const t = useT()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    status: 'scheduled',
  })
  const toast = useToast()

  useEffect(() => {
    if (!user?.uid) return
    const load = async () => {
      try {
        const list = await getCustomers(user.uid)
        setCustomers(list)
        if (!isEdit && prefillCustomerId) {
          const c = list.find((x) => x.id === prefillCustomerId)
          if (c) {
            setForm((prev) => ({
              ...prev,
              customerId: c.id,
              customerName: c.name,
              phone: c.phone || '',
            }))
          }
        }
        if (isEdit) {
          const apt = await getAppointment(id)
          if (!apt || apt.userId !== user.uid) {
            navigate('/appointments')
            return
          }
          setForm({
            customerId: apt.customerId || '',
            customerName: apt.customerName || '',
            phone: apt.phone || '',
            date: apt.date || '',
            time: apt.time || '',
            notes: apt.notes || '',
            status: apt.status || 'scheduled',
          })
        }
      } catch (err) {
        console.error(err)
        toast.error(t('appointmentForm.toastLoadFail'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.uid, id, isEdit, prefillCustomerId, navigate, toast, t])

  const handleCustomerSelect = (e) => {
    const val = e.target.value
    const c = customers.find((x) => x.id === val)
    setForm((prev) => ({
      ...prev,
      customerId: val,
      customerName: c?.name || '',
      phone: c?.phone || '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateAppointment(id, {
          customerId: form.customerId || null,
          customerName: form.customerName,
          phone: form.phone,
          date: form.date,
          time: form.time,
          notes: form.notes,
          status: form.status,
        })
        toast.success(t('appointmentForm.toastUpdated'))
      } else {
        await addAppointment(user.uid, {
          customerId: form.customerId || null,
          customerName: form.customerName,
          phone: form.phone,
          date: form.date,
          time: form.time,
          notes: form.notes,
          status: form.status,
        })
        toast.success(t('appointmentForm.toastSaved'))
      }
      navigate('/appointments')
    } catch (err) {
      toast.error(err.message || t('appointmentForm.toastFail'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout user={user}>
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Layout>
    )
  }

  const customerOptions = [
    { value: '', label: t('appointmentForm.customerSelectPlaceholder') },
    ...customers.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.phone})`,
    })),
  ]

  const statusOptionsForSelect = STATUS_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }))

  return (
    <Layout user={user}>
      <Link
        to="/appointments"
        className="inline-block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 no-underline"
      >
        ← {t('appointmentForm.back')}
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-6 font-heading">
        {isEdit ? t('appointmentForm.titleEdit') : t('appointmentForm.titleNew')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Select
          label={t('appointmentForm.customerOptional')}
          options={customerOptions}
          value={form.customerId}
          onChange={handleCustomerSelect}
        />
        <Input
          label={t('appointmentForm.customerName')}
          placeholder={t('appointmentForm.placeholderName')}
          value={form.customerName}
          onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
          required
        />
        <Input
          label={t('appointmentForm.phone')}
          type="tel"
          placeholder={t('appointmentForm.placeholderPhone')}
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          required
        />
        <Input
          label={t('appointmentForm.date')}
          type="date"
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          required
        />
        <Input
          label={t('appointmentForm.time')}
          type="time"
          value={form.time}
          onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
          required
        />
        <Textarea
          label={t('appointmentForm.notes')}
          placeholder={t('appointmentForm.placeholderNotes')}
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          rows={2}
        />
        {isEdit && (
          <Select
            label={t('appointmentForm.status')}
            options={statusOptionsForSelect}
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          />
        )}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/appointments')}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={saving}>
            {isEdit ? t('common.update') : t('common.save')}
          </Button>
        </div>
      </form>
    </Layout>
  )
}
