export const uid = () => crypto.randomUUID()
export const today = () => new Date().toISOString().slice(0, 10)
export const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const dateText = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—'
export const digits = value => String(value || '').replace(/\D/g, '')
export const cpfText = value => digits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
export const phoneText = value => digits(value).slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2')
export function validCpf(value) {
  const cpf = digits(value)
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  const check = size => { let sum = 0; for (let i = 0; i < size; i++) sum += Number(cpf[i]) * (size + 1 - i); const n = (sum * 10) % 11; return (n === 10 ? 0 : n) === Number(cpf[size]) }
  return check(9) && check(10)
}
export const tripAvailable = trip => Math.max(0, Number(trip.capacity || 0) - Number(trip.sold || 0))
export const saleTotal = sale => Number(sale.total || 0)
export const paidTotal = sale => (sale.payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)
export const saleStatus = sale => sale.status === 'Cancelada' ? 'Cancelada' : paidTotal(sale) >= saleTotal(sale) - .009 ? 'Pago' : paidTotal(sale) > 0 ? 'Pagamento parcial' : 'Aguardando pagamento'
export const emptyState = {
  clients: [], trips: [], sales: [],
  settings: { company: 'Rota Viva Excursões', owner: 'Magno Jorge de Castro Nascimento', ownerCpf: '804.914.801-72', phone: '', email: '', address: '', reservationPrefix: 'RV', lastReservation: 0, commissionRate: 0 }
}
