
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azatzjtrhlfhmeufnvmk.supabase.co';
const supabaseAnonKey = 'sb_publishable_5UN2yJ3aSO2_rMU3QOMAWg_BPQXQpSI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log("Checking coaches...");
  const { data: coaches, error: cErr } = await supabase.from('coaches').select('*');
  if (cErr) console.error("Error fetching coaches:", cErr);
  else console.log("Coaches found:", coaches.length, coaches);

  console.log("\nChecking training_sessions...");
  const { data: sessions, error: sErr } = await supabase.from('training_sessions').select('*, coaches(*)');
  if (sErr) console.error("Error fetching sessions:", sErr);
  else {
      console.log("Sessions found:", sessions.length);
      sessions.forEach(s => {
          console.log(`- Day: ${s.day}, Time: ${s.start_time}-${s.end_time}, Coach: ${s.coaches ? s.coaches.name : 'NULL'}, CoachID: ${s.coach_id}`);
      });
  }
}

checkData();
