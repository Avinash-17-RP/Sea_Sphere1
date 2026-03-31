import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ijyveyflpvtumwekfgjb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Q_Tn2AuObzqDByzCYbVrkg_MeOdz7x-';
export const GOOGLE_CLIENT_ID = '266477823019-dn401lojsiur1g9ohcqgf55nu8b6js89.apps.googleusercontent.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if connected properly and log to console
supabase.from('projects').select('id').limit(1).then(({ error }) => {
    if (error) {
        console.error("❌ Supabase connection test failed:", error.message);
    } else {
        console.log("✅ Supabase is connected successfully!");
    }
});
