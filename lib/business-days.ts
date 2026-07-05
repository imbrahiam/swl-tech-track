export function businessDaysBetween(from: Date, to: Date): number {
  if (to <= from) return 0
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setHours(0, 0, 0, 0)
  let days = 0
  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1)
    const weekday = cursor.getDay()
    if (weekday !== 0 && weekday !== 6) days++
  }
  return days
}

export function isOrderOverdue(lastUpdated: Date, thresholdDays = 10) {
  return businessDaysBetween(lastUpdated, new Date()) > thresholdDays
}
