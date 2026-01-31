/**
 * Create bill form — full page (not modal). Saves to Firestore, then redirects to /bills.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getAppointment, createInvoice, getInvoice } from '../lib/firestore'
import { Layout } from '../components/Layout'
import { InvoicePrintView } from '../components/InvoicePrintView'
import { Button, Card, Input, Select } from '../components/ui'
import { useToast } from '../contexts/ToastContext'
import { useT } from '../contexts/LocaleContext'
import { INDIAN_STATES } from '../utils/indianStates'

const DEFAULT_SAC = '998313'
const DEFAULT_GST_RATE = 18

function computeGst(taxableValue, gstRatePercent, sellerStateCode, placeOfSupplyCode) {
  const gstAmount = (taxableValue * gstRatePercent) / 100
  const isSameState = sellerStateCode === placeOfSupplyCode
  if (isSameState) {
    const half = gstAmount / 2
    return { cgst: half, sgst: half, igst: 0 }
  }
  return { cgst: 0, sgst: 0, igst: gstAmount }
}

export function BillsForm({ user }) {
  const t = useT()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('appointmentId')
  const [saving, setSaving] = useState(false)
  const [savedInvoiceForPrint, setSavedInvoiceForPrint] = useState(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    sellerName: user?.name || user?.businessName || '',
    sellerAddress: '',
    sellerGstin: '',
    sellerState: '',
    buyerName: '',
    buyerAddress: '',
    buyerPhone: '',
    buyerGstin: '',
    placeOfSupply: '',
    description: 'Consultation / Professional service',
    sacCode: DEFAULT_SAC,
    quantity: 1,
    rate: '',
    gstRate: DEFAULT_GST_RATE,
  })

  useEffect(() => {
    if (appointmentId && user?.uid) {
      getAppointment(appointmentId).then((apt) => {
        if (apt && apt.userId === user.uid) {
          setForm((f) => ({
            ...f,
            buyerName: apt.customerName || f.buyerName,
            buyerPhone: apt.phone || f.buyerPhone,
          }))
        }
      })
    }
  }, [appointmentId, user?.uid])

  const qty = Number(form.quantity) || 0
  const rate = Number(form.rate) || 0
  const taxableValue = qty * rate
  const { cgst, sgst, igst } = computeGst(
    taxableValue,
    form.gstRate,
    form.sellerState,
    form.placeOfSupply
  )
  const totalAmount = taxableValue + cgst + sgst + igst

  const doSave = async (openPrint) => {
    if (!form.sellerName?.trim() || !form.buyerName?.trim() || !form.rate || !form.date || !form.placeOfSupply) {
      toast.error(t('bills.toastFail'))
      return
    }
    if (!user?.uid) {
      toast.error(t('bills.toastFail'))
      return
    }
    setSaving(true)
    try {
      const payload = {
        date: form.date,
        sellerName: form.sellerName.trim(),
        sellerAddress: (form.sellerAddress || '').trim() || null,
        sellerGstin: (form.sellerGstin || '').trim() || null,
        sellerState: form.sellerState || '',
        buyerName: form.buyerName.trim(),
        buyerAddress: (form.buyerAddress || '').trim() || null,
        buyerPhone: (form.buyerPhone || '').trim() || null,
        buyerGstin: (form.buyerGstin || '').trim() || null,
        placeOfSupply: form.placeOfSupply || '',
        description: (form.description || '').trim(),
        sacCode: (form.sacCode || '').trim(),
        quantity: Number(form.quantity) || 1,
        rate: Number(form.rate),
        gstRate: Number(form.gstRate) || 18,
        taxableValue: Math.round(taxableValue * 100) / 100,
        cgst: Math.round(cgst * 100) / 100,
        sgst: Math.round(sgst * 100) / 100,
        igst: Math.round(igst * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        appointmentId: appointmentId || null,
      }
      const id = await createInvoice(user.uid, payload)
      toast.success(t('bills.toastCreated'))
      if (openPrint) {
        const saved = await getInvoice(id)
        if (saved) setSavedInvoiceForPrint(saved)
      } else {
        navigate('/bills')
      }
    } catch (err) {
      console.error('[BillsForm] createInvoice failed:', err)
      const msg = err?.message || err?.code || t('bills.toastFail')
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doSave(false)
  }

  const handleSaveAndPrint = () => {
    doSave(true)
  }

  const stateOptions = [{ value: '', label: '— Select state —' }, ...INDIAN_STATES.map((s) => ({ value: s.code, label: s.name }))]

  return (
    <Layout user={user}>
      <div className="mb-6">
        <Link
          to="/bills"
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← {t('bills.backToBills')}
        </Link>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] font-heading mb-6">
        {t('bills.createBill')}
      </h1>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          <section>
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase mb-3">{t('bills.sellerDetails')}</h2>
            <div className="space-y-3">
              <Input label={t('bills.sellerName')} value={form.sellerName} onChange={(e) => setForm((f) => ({ ...f, sellerName: e.target.value }))} required />
              <Input label={t('bills.sellerAddress')} value={form.sellerAddress} onChange={(e) => setForm((f) => ({ ...f, sellerAddress: e.target.value }))} placeholder="Address for invoice" />
              <Input label={t('bills.sellerGstin')} value={form.sellerGstin} onChange={(e) => setForm((f) => ({ ...f, sellerGstin: e.target.value }))} placeholder="22AAAAA0000A1Z5" />
              <Select label={t('bills.sellerState')} options={stateOptions} value={form.sellerState} onChange={(e) => setForm((f) => ({ ...f, sellerState: e.target.value }))} required />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase mb-3">{t('bills.buyerDetails')}</h2>
            <div className="space-y-3">
              <Input label={t('bills.buyerName')} value={form.buyerName} onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))} required />
              <Input label={t('bills.buyerPhone')} type="tel" value={form.buyerPhone} onChange={(e) => setForm((f) => ({ ...f, buyerPhone: e.target.value }))} />
              <Input label={t('bills.buyerAddress')} value={form.buyerAddress} onChange={(e) => setForm((f) => ({ ...f, buyerAddress: e.target.value }))} placeholder="Address for invoice" />
              <Input label={t('bills.buyerGstin')} value={form.buyerGstin} onChange={(e) => setForm((f) => ({ ...f, buyerGstin: e.target.value }))} placeholder="Optional" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase mb-3">Invoice details</h2>
            <div className="space-y-3">
              <Select label={t('bills.placeOfSupply')} options={stateOptions} value={form.placeOfSupply} onChange={(e) => setForm((f) => ({ ...f, placeOfSupply: e.target.value }))} required />
              <Input label={t('bills.date')} type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase mb-3">Item / Service</h2>
            <div className="space-y-3">
              <Input label={t('bills.itemDescription')} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
              <Input label={t('bills.sacCode')} value={form.sacCode} onChange={(e) => setForm((f) => ({ ...f, sacCode: e.target.value }))} placeholder="e.g. 998313" />
              <div className="grid grid-cols-2 gap-3">
                <Input label={t('bills.quantity')} type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                <Input label={t('bills.rate')} type="number" min={0} step="0.01" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))} required />
              </div>
              <Input label={t('bills.gstRate')} type="number" min={0} max={28} value={form.gstRate} onChange={(e) => setForm((f) => ({ ...f, gstRate: e.target.value }))} />
            </div>
          </section>

          <div className="rounded-[var(--radius)] bg-gray-50 p-4 text-sm">
            <p><strong>{t('bills.taxableValue')}:</strong> ₹{taxableValue.toFixed(2)}</p>
            {(cgst > 0 || sgst > 0) && <p><strong>{t('bills.cgst')} / {t('bills.sgst')}:</strong> ₹{cgst.toFixed(2)} / ₹{sgst.toFixed(2)}</p>}
            {igst > 0 && <p><strong>{t('bills.igst')}:</strong> ₹{igst.toFixed(2)}</p>}
            <p><strong>{t('bills.total')}:</strong> ₹{totalAmount.toFixed(2)}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/bills">
              <Button type="button" variant="secondary">{t('common.cancel')}</Button>
            </Link>
            <Button type="submit" variant="primary" loading={saving} disabled={saving}>{t('bills.save')}</Button>
            <Button type="button" variant="primary" loading={saving} disabled={saving} onClick={handleSaveAndPrint} className="bg-[var(--color-success)] hover:opacity-90">
              {t('bills.saveAndPrint')}
            </Button>
          </div>
        </form>
      </Card>

      {savedInvoiceForPrint && (
        <InvoicePrintView
          invoice={savedInvoiceForPrint}
          onClose={() => {
            setSavedInvoiceForPrint(null)
            navigate('/bills')
          }}
        />
      )}
    </Layout>
  )
}
