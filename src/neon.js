import { createAuthClient } from '@neondatabase/neon-js/auth'
import { emptyState } from './data.js'
export const configured = Boolean(import.meta.env.VITE_NEON_AUTH_URL)
export const neon = configured ? { auth: createAuthClient(import.meta.env.VITE_NEON_AUTH_URL) } : null
let version = 0
async function api(path, options = {}) {
  const session = await neon?.auth.getSession()
  const token = session?.data?.session?.token
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || 'Não foi possível acessar o servidor.')
  return body
}
export async function readRemote() { const result = await api('/api/state'); version = result.version; return result.state }
export async function saveRemote(state) { const result = await api('/api/state', { method: 'PUT', body: JSON.stringify({ expected_version: version, next_state: state }) }); if (result.conflict) { version = result.version; throw new Error('Os dados foram alterados por outro usuário. Atualize a página.') } version = result.version; return result.state }
export async function me() { return api('/api/me') }
export async function listUsers() { return (await api('/api/users')).users }
export async function createUser(input) { return api('/api/users', { method: 'POST', body: JSON.stringify(input) }) }
export async function updateUser(input) { return api('/api/users', { method: 'PUT', body: JSON.stringify(input) }) }
export async function bootstrap() { return api('/api/bootstrap', { method: 'POST' }) }
export { emptyState }
