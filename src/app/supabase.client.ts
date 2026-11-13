import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env as {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
};

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);