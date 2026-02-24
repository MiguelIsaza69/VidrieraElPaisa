import { createBrowserClient } from '@supabase/ssr'

let client: any = null;

export function createClient() {
    if (client) return client;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
        console.error("Supabase environment variables are missing. Please update .env.local with your project credentials.");
    }

    client = createBrowserClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseKey || "placeholder"
    )

    return client;
}
