import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
        console.error("Supabase environment variables are missing. Please update .env.local with your project credentials.");
        // Return a dummy client or handle as needed, but prevent crash if possible
    }

    return createBrowserClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseKey || "placeholder"
    )
}
