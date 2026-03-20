import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fuewpxohwwwngikxzpgz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h8UPWhsombfBQpHb3rqQ4w_q5Betwwn";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
