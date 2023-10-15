export const clientEnv = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

// Server env variables are only available on the server
export const serverEnv = {
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || "",
};
