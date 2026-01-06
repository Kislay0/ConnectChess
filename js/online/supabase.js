import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://egbyhcfybiaydllpejmq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_t_wRRcclDnAXLn8XacW-gw_W-pO6Y5P';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
