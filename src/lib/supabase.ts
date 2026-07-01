import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://kknvrufoelhdtouprcvm.supabase.co'
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbnZydWZvZWxoZHRvdXByY3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzUxOTQsImV4cCI6MjA5NzY1MTE5NH0.2izbOlPczt5TNEKKtKW9r524E8MBbg-rFhjtR7m3U4s'

export const supabase = createClient(url, anonKey)
