export { cn } from "cn"

const relativeTime = new Intl.RelativeTimeFormat("id-ID", {
  numeric: "auto",
})

const dateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function formatRelativeTime(value: string | Date) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const diffMs = date.getTime() - Date.now()
  const absMs = Math.abs(diffMs)

  if (absMs < 60_000) return "Baru saja"
  if (absMs < 3_600_000) {
    return relativeTime.format(Math.round(diffMs / 60_000), "minute")
  }
  if (absMs < 86_400_000) {
    return relativeTime.format(Math.round(diffMs / 3_600_000), "hour")
  }
  if (absMs < 7 * 86_400_000) {
    return relativeTime.format(Math.round(diffMs / 86_400_000), "day")
  }
  return dateTime.format(date)
}
