import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client — used only for Storage & Realtime.
 * Authentication is handled by the Elysia backend (Bearer token).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
