import { ApiError } from './api.js'
const roles = ['Administrador', 'Vendedor']
export function validateMember(input) {
  if (!input || typeof input.id !== 'string' || !input.id || typeof input.active !== 'boolean' || !roles.includes(input.role)) throw new ApiError(400, 'Informe usuário, perfil e situação válidos.')
  return { id: input.id, role: input.role, active: input.active }
}
export function validateNewUser(input) {
  const name = String(input?.name || '').trim(), email = String(input?.email || '').trim().toLowerCase(), password = input?.password
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8 || password.length > 128 || !roles.includes(input?.role)) throw new ApiError(400, 'Informe nome, e-mail, perfil e senha de 8 a 128 caracteres.')
  return { name, email, password, role: input.role }
}
export function createUserStore(sql) { return {
  async count() { const rows = await sql`select count(*)::int as count from public.app_members`; return rows[0].count },
  async role(id) { const rows = await sql`select role from public.app_members where user_id=${id}`; return rows[0]?.role || null },
  async list(actor) { return sql`select u.id::text id,u.name,u.email,m.role,(m.user_id is not null) active from neon_auth."user" u left join public.app_members m on m.user_id=u.id::text where exists(select 1 from public.app_members where user_id=${actor} and role='Administrador') order by lower(u.name)` },
  async emailExists(email) { const rows = await sql`select id from neon_auth."user" where lower(email)=${email} limit 1`; return rows.length > 0 },
  async idByEmail(email) { const rows = await sql`select id::text id from neon_auth."user" where lower(email)=${email} limit 1`; return rows[0]?.id || null },
  async authorizeFirst(id) { const rows = await sql`insert into public.app_members(user_id,role) select ${id},'Administrador' where not exists(select 1 from public.app_members) returning user_id`; if (!rows.length) throw new ApiError(409, 'O acesso inicial já foi criado.') },
  async update(actor,input) { const {id,role,active}=validateMember(input); if(id===actor) throw new ApiError(400,'Você não pode alterar o próprio acesso.'); const rows=active ? await sql`insert into public.app_members(user_id,role) select u.id::text,${role} from neon_auth."user" u where u.id::text=${id} and exists(select 1 from public.app_members where user_id=${actor} and role='Administrador') on conflict(user_id) do update set role=excluded.role returning user_id` : await sql`delete from public.app_members where user_id=${id} and exists(select 1 from public.app_members where user_id=${actor} and role='Administrador') returning user_id`; if(!rows.length) throw new ApiError(409,'Usuário indisponível ou acesso já alterado.') }
} }
export function createRegistrar(authUrl, fetcher=fetch) { return async ({name,email,password},origin) => { const response=await fetcher(`${authUrl.replace(/\/$/,'')}/sign-up/email`,{method:'POST',signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify({name,email,password})}).catch(()=>null); const result=await response?.json().catch(()=>null); if(!response?.ok || typeof result?.user?.id!=='string') throw new ApiError(502,result?.message||'O Neon Auth não confirmou o cadastro. Confira a URL e os domínios permitidos.'); return result.user.id } }
