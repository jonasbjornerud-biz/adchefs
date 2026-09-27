import { createClient } from "@supabase/supabase-js";

// Second backend ("OS") that receives job applications. Public (anon) key — safe in client code.
const OS_URL = "https://tdmxcsgkqtzmazzyoqxy.supabase.co";
const OS_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbXhjc2drcXR6bWF6enlvcXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDExMDksImV4cCI6MjA5ODA3NzEwOX0.IC41z2yTmHvnE-HidOoxj3VQdHGoy7kxOJyml96ZQ6w";

export const osBackend = createClient(OS_URL, OS_PUBLIC_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: "os-backend-auth" },
});
