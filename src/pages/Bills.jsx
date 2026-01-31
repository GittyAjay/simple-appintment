/**
 * Bills page — GST-compliant bills saved in Firestore; Create bill opens as form page, Print from list.
 */
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getInvoices, getInvoice } from '../lib/firestore'
import { Layout } from '../components/Layout'
import { InvoicePrintView } from '../components/InvoicePrintView'
import { Button, Card, ListItemSkeleton } from '../components/ui'
import { useT } from '../contexts/LocaleContext'

export function Bills({ user }) {
  const t = useT()
  const [searchParams, setSearchParams] = useSearchParams()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [printInvoice, setPrintInvoice] = useState(null)

  useEffect(() => {
    if (!user?.uid) return
    const load = async () => {
      try {
        const list = await getInvoices(user.uid)
        setInvoices(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.uid])

  useEffect(() => {
    const printId = searchParams.get('print')
    if (printId && user?.uid) {
      getInvoice(printId).then((inv) => {
        if (inv && inv.userId === user.uid) {
          setPrintInvoice(inv)
        }
      })
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, user?.uid, setSearchParams])

  return (
    <Layout user={user}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] font-heading">
          {t('bills.title')}
        </h1>
        <Link to="/bills/new">
          <Button variant="primary" size="lg">+ {t('bills.createBill')}</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <Card>
          <p className="text-[var(--color-text-muted)] text-center py-6">{t('bills.empty')}</p>
          <Link to="/bills/new" className="block mt-4">
            <Button variant="primary" className="w-full">+ {t('bills.createBill')}</Button>
          </Link>
        </Card>
      ) : (
        <ul className="space-y-2">
          {invoices.map((inv) => (
            <li key={inv.id}>
              <div className="flex flex-wrap items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text)]">{inv.invoiceNumber}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{inv.date} · {inv.buyerName}</p>
                </div>
                <p className="font-bold text-[var(--color-primary)]">₹{Number(inv.totalAmount).toFixed(2)}</p>
                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" size="sm" className="min-h-0" onClick={() => setPrintInvoice(inv)}>
                    {t('bills.print')}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {printInvoice && (
        <InvoicePrintView invoice={printInvoice} onClose={() => setPrintInvoice(null)} />
      )}
    </Layout>
  )
}
