import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function promote() {
  const email = process.env.ADMIN_EMAIL || process.argv[2]
  if (!email) {
    console.error('Usage: bun promote_admin.ts <email>  (or set ADMIN_EMAIL env var)')
    process.exit(1)
  }

  const { data: users, error: listErr } = await supabaseAdmin.auth.admin.listUsers()
  if (listErr) {
    console.error('Erro ao listar usuários:', listErr)
    process.exit(1)
  }
  const user = users.users.find((u: any) => u.email === email)
  if (!user) {
    console.error('Usuário não encontrado')
    process.exit(1)
  }
  console.log('User ID:', user.id)

  const { error: insertErr } = await supabaseAdmin
    .from('user_roles')
    .insert({ user_id: user.id, role: 'admin' })

  if (insertErr) {
    console.error('Erro ao inserir role:', insertErr)
    process.exit(1)
  }
  console.log('Promovido com sucesso!')
}

promote()
