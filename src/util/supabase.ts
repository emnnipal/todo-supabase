import { clientEnv } from "@/constants/env";
import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  clientEnv.SUPABASE_URL,
  clientEnv.SUPABASE_ANON_KEY
);
