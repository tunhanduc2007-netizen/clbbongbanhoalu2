
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azatzjtrhlfhmeufnvmk.supabase.co';
const supabaseAnonKey = 'sb_publishable_5UN2yJ3aSO2_rMU3QOMAWg_BPQXQpSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
