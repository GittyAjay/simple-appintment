/**
 * Calendar strip — horizontal week view for schedule.
 * Shows day names, dates, optional appointment counts. Today and selected date highlighted.
 */
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { useT } from '../contexts/LocaleContext'

const DAYS_TO_SHOW = 7
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

function buildDays(centerDate, count = DAYS_TO_SHOW) {
  const start = new Date(centerDate)
  const dayOfWeek = start.getDay()
  const diff = start.getDate() - dayOfWeek
  start.setDate(diff)
  const days = []
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

export function CalendarStrip({
  selectedDate,
  onSelectDate,
  countsByDate = {},
  weekOffset = 0,
  onWeekChange,
  className = '',
}) {
  const t = useT()
  const todayStr = toDateStr(new Date())
  const center = new Date()
  center.setDate(center.getDate() + weekOffset * DAYS_TO_SHOW)
  const days = buildDays(center)

  const goPrev = () => onWeekChange?.(weekOffset - 1)
  const goNext = () => onWeekChange?.(weekOffset + 1)

  return (
    <div className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={goPrev}
          className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-gray-100 hover:text-[var(--color-text)] transition-colors min-h-0"
          aria-label={t('calendar.prevWeek')}
        >
          <IoChevronBack className="w-5 h-5" aria-hidden />
        </button>
        <span className="text-sm font-medium text-[var(--color-text-muted)]">
          {days[0].toLocaleDateString('en-IN', { month: 'short' })} {days[0].getDate()} – {days[days.length - 1].toLocaleDateString('en-IN', { month: 'short' })} {days[days.length - 1].getDate()}
        </span>
        <button
          type="button"
          onClick={goNext}
          className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-gray-100 hover:text-[var(--color-text)] transition-colors min-h-0"
          aria-label={t('calendar.nextWeek')}
        >
          <IoChevronForward className="w-5 h-5" aria-hidden />
        </button>
      </div>
      <div className="flex gap-1 sm:gap-2">
        {days.map((d) => {
          const dateStr = toDateStr(d)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const count = countsByDate[dateStr] ?? 0
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate?.(dateStr)}
              className={`flex-1 flex flex-col items-center justify-center min-w-0 py-2 px-1 sm:py-2.5 sm:px-2 rounded-[var(--radius)] border transition-colors ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : isToday
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-gray-50'
              }`}
              aria-pressed={isSelected}
              aria-label={`${d.toLocaleDateString('en-IN', { weekday: 'long' })}, ${dateStr}${count ? `, ${count} appointments` : ''}`}
            >
              <span className="text-[10px] sm:text-xs font-medium opacity-80">
                {WEEKDAY_SHORT[d.getDay()]}
              </span>
              <span className="text-base sm:text-lg font-bold mt-0.5">{d.getDate()}</span>
              {count > 0 && (
                <span
                  className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isSelected ? 'bg-white/25' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  }`}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
