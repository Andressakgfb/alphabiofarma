import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function list() {
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) {
    console.error('Erro:', error)
    return
  }
  console.log('Total usuários:', users.users.length)
  users.users.forEach((u: any) => console.log(u.email))
}
list()
