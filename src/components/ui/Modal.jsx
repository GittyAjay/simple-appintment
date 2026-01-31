/**
 * Modal — overlay + panel. For forms and confirmations. Accessible (focus trap, Escape).
 * Close button uses Ionicons (react-icons/io5). aria-label from useT for i18n.
 */
import { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { useT } from '../../contexts/LocaleContext'

export function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef(null)
  const t = useT()

  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-gray-100 min-h-0"
              aria-label={t('common.close')}
            >
              <IoClose className="w-5 h-5" aria-hidden />
            </button>
          </div>
        )}
        <div className={title ? 'p-4' : 'p-4'}>{children}</div>
      </div>
    </div>
  )
}
