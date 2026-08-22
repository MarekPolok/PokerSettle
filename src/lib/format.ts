export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} zł`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(iso),
  )
}
