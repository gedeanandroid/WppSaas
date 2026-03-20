import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@acmecorp.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'Admin Acme'
      }
    }
  })

  if (error && error.message.includes('already registered')) {
    console.log('User already exists')
  } else if (error) {
    console.error('Error creating user:', error.message)
  } else {
    console.log('User created:', data.user?.id)

    // Also link user to Acme Corp in profiles table
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        organization_id: '00000000-0000-0000-0000-000000000001',
        full_name: 'Admin Acme',
        role: 'admin'
      })
      console.log('Profile created in database')
    }
  }
}

createUser()
