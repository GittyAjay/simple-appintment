import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers, addCustomer } from '../lib/firestore'
import { Layout } from '../components/Layout'
import { Card, Button, Modal, Input, ListItemSkeleton } from '../components/ui'
import { useToast } from '../contexts/ToastContext'
import { useT } from '../contexts/LocaleContext'

export function Customers({ user }) {
  const t = useT()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!user?.uid) return
    const load = async () => {
      try {
        const list = await getCustomers(user.uid)
        setCustomers(list)
      } catch (err) {
        console.error(err)
        toast.error(t('customers.toastLoadFail'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.uid, toast, t])

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.trim().toLowerCase()
    return customers.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q)
    )
  }, [customers, search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      toast.error(t('customers.toastNamePhoneRequired'))
      return
    }
    setSaving(true)
    try {
      await addCustomer(user.uid, { name: name.trim(), phone: phone.trim() })
      const list = await getCustomers(user.uid)
      setCustomers(list)
      setName('')
      setPhone('')
      setShowAddModal(false)
      toast.success(t('customers.toastAdded'))
    } catch (err) {
      toast.error(err.message || t('customers.toastAddFail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout user={user}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] font-heading">
          {t('customers.title')}
        </h1>
        <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)}>
          + {t('customers.addCustomer')}
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder={t('customers.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 text-base border border-[var(--color-border)] rounded-[var(--radius)] min-h-[44px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          aria-label="Search customers"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-[var(--color-text-muted)] text-center py-6">
            {search.trim() ? t('customers.emptySearch') : t('customers.emptyNoSearch')}
          </p>
          {!search.trim() && (
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={() => setShowAddModal(true)}
            >
              + {t('customers.addCustomer')}
            </Button>
          )}
        </Card>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <li key={c.id}>
              <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text)]">{c.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{c.phone}</p>
                </div>
                <Link to={`/appointments/new?customer=${c.id}`}>
                  <Button variant="success" size="sm" className="min-h-0">
                    {t('customers.bookAppointment')}
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setName('')
          setPhone('')
        }}
        title={t('customers.modalTitle')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('customers.labelName')}
            placeholder={t('customers.placeholderName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label={t('customers.labelPhone')}
            type="tel"
            placeholder={t('customers.placeholderPhone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {t('common.add')}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
