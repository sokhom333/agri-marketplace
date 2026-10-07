import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgljvdvguorcrkeynxdr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_TNZxznIgu-jNqy9v9Zvacg_fca-oO8n';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);