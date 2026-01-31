/**
 * Full-screen GST invoice view — Print or Close. Used by Bills list and BillsForm (Save & Print).
 */
import { Button } from './ui/Button'
import { useT } from '../contexts/LocaleContext'
import { INDIAN_STATES } from '../utils/indianStates'

export function InvoicePrintView({ invoice, onClose }) {
  const t = useT()
  if (!invoice) return null
  const isSameState = invoice.sellerState === invoice.placeOfSupply
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--color-bg)]">
      <div className="invoice-fullscreen-actions flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
        <h2 className="text-lg font-semibold text-[var(--color-text)] font-heading truncate">
          {t('bills.invoiceNo')} {invoice.invoiceNumber}
        </h2>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>{t('common.close')}</Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>{t('bills.print')}</Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white text-[var(--color-text)] p-6 sm:p-8 max-w-3xl mx-auto shadow-sm rounded-[var(--radius-lg)] print:shadow-none print:max-w-none">
          <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading">TAX INVOICE</h1>
              <p className="text-sm mt-2"><strong>{t('bills.invoiceNo')}:</strong> {invoice.invoiceNumber}</p>
              <p className="text-sm"><strong>{t('bills.date')}:</strong> {invoice.date}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">{t('bills.sellerDetails')}</p>
              <p className="font-medium">{invoice.sellerName}</p>
              {invoice.sellerAddress && <p className="text-sm">{invoice.sellerAddress}</p>}
              {invoice.sellerGstin && <p className="text-sm">GSTIN: {invoice.sellerGstin}</p>}
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">{t('bills.buyerDetails')}</p>
              <p className="font-medium">{invoice.buyerName}</p>
              {invoice.buyerAddress && <p className="text-sm">{invoice.buyerAddress}</p>}
              {invoice.buyerPhone && <p className="text-sm">Phone: {invoice.buyerPhone}</p>}
              {invoice.buyerGstin && <p className="text-sm">GSTIN: {invoice.buyerGstin}</p>}
            </div>
          </div>
          <p className="text-sm mb-2"><strong>{t('bills.placeOfSupply')}:</strong> {INDIAN_STATES.find((s) => s.code === invoice.placeOfSupply)?.name || invoice.placeOfSupply}</p>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">#</th>
                <th className="border border-gray-300 p-2 text-left">{t('bills.itemDescription')}</th>
                <th className="border border-gray-300 p-2 text-left">SAC</th>
                <th className="border border-gray-300 p-2 text-right">{t('bills.quantity')}</th>
                <th className="border border-gray-300 p-2 text-right">{t('bills.rate')}</th>
                <th className="border border-gray-300 p-2 text-right">{t('bills.taxableValue')}</th>
                <th className="border border-gray-300 p-2 text-right">GST%</th>
                {isSameState ? (
                  <>
                    <th className="border border-gray-300 p-2 text-right">{t('bills.cgst')}</th>
                    <th className="border border-gray-300 p-2 text-right">{t('bills.sgst')}</th>
                  </>
                ) : (
                  <th className="border border-gray-300 p-2 text-right">{t('bills.igst')}</th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">{invoice.description}</td>
                <td className="border border-gray-300 p-2">{invoice.sacCode}</td>
                <td className="border border-gray-300 p-2 text-right">{invoice.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">₹{Number(invoice.rate).toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-right">₹{Number(invoice.taxableValue).toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-right">{invoice.gstRate}%</td>
                {isSameState ? (
                  <>
                    <td className="border border-gray-300 p-2 text-right">₹{Number(invoice.cgst).toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₹{Number(invoice.sgst).toFixed(2)}</td>
                  </>
                ) : (
                  <td className="border border-gray-300 p-2 text-right">₹{Number(invoice.igst).toFixed(2)}</td>
                )}
              </tr>
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <p className="text-lg font-bold">{t('bills.total')}: ₹{Number(invoice.totalAmount).toFixed(2)}</p>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-6">This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  )
}
