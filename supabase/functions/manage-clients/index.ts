import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { action, ...payload } = body;

    // setup_admin doesn't require auth (bootstrap)
    if (action === "setup_admin") {
      const { email, password: adminPassword } = payload;
      const { data: existing } = await supabase.from("clients").select("id").eq("is_admin", true).limit(1);
      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ error: "Admin already exists" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({ email, password: adminPassword, email_confirm: true });
      if (authError) return new Response(JSON.stringify({ error: authError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      await supabase.from("clients").insert({ user_id: authData.user.id, brand_name: "Admin", username: "admin", is_admin: true });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // All other actions require admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: adminCheck } = await supabase.from("clients").select("is_admin").eq("user_id", caller.id).single();
    if (!adminCheck?.is_admin) return new Response(JSON.stringify({ error: "Not an admin" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (action === "create_client") {
      const { username, password, brand_name, spreadsheet_id, meta_access_token, meta_ad_account_id, logo_url } = payload;
      const email = `${username}@playbook.local`;
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
      if (authError) return new Response(JSON.stringify({ error: authError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      const insertData: any = { user_id: authData.user.id, brand_name, username, is_admin: false };
      if (spreadsheet_id) insertData.spreadsheet_id = spreadsheet_id;
      if (logo_url) insertData.logo_url = logo_url;

      const { data: clientData, error: clientError } = await supabase.from("clients").insert(insertData).select().single();
      if (clientError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return new Response(JSON.stringify({ error: clientError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await supabase.from("client_secrets").insert({
        client_id: clientData.id,
        current_password: password ?? null,
        meta_access_token: meta_access_token || null,
        meta_ad_account_id: meta_ad_account_id || null,
      });

      return new Response(JSON.stringify({ client_id: clientData.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete_client") {
      const { client_id } = payload;
      const { data: clientData } = await supabase.from("clients").select("user_id").eq("id", client_id).single();
      if (clientData?.user_id) await supabase.auth.admin.deleteUser(clientData.user_id);
      await supabase.from("clients").delete().eq("id", client_id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "reset_password") {
      const { client_id, new_password } = payload;
      const { data: clientData } = await supabase.from("clients").select("user_id").eq("id", client_id).single();
      if (clientData?.user_id) {
        const { error } = await supabase.auth.admin.updateUserById(clientData.user_id, { password: new_password });
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_client") {
      const { client_id, brand_name, username, spreadsheet_id, logo_url, new_password, meta_access_token, meta_ad_account_id } = payload;
      const updates: any = { updated_at: new Date().toISOString() };
      if (brand_name !== undefined) updates.brand_name = brand_name;
      if (username !== undefined) updates.username = username;
      if (spreadsheet_id !== undefined) updates.spreadsheet_id = spreadsheet_id || null;
      if (logo_url !== undefined) updates.logo_url = logo_url || null;

      const { data: existing } = await supabase.from("clients").select("user_id, username").eq("id", client_id).single();

      const { error: updErr } = await supabase.from("clients").update(updates).eq("id", client_id);
      if (updErr) return new Response(JSON.stringify({ error: updErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      // Upsert secrets if any of those fields changed
      const secretsUpdate: any = {};
      if (meta_access_token !== undefined) secretsUpdate.meta_access_token = meta_access_token || null;
      if (meta_ad_account_id !== undefined) secretsUpdate.meta_ad_account_id = meta_ad_account_id || null;
      if (new_password) secretsUpdate.current_password = new_password;
      if (Object.keys(secretsUpdate).length > 0) {
        secretsUpdate.client_id = client_id;
        secretsUpdate.updated_at = new Date().toISOString();
        await supabase.from("client_secrets").upsert(secretsUpdate, { onConflict: "client_id" });
      }

      if (existing?.user_id) {
        const authUpdate: any = {};
        if (new_password) authUpdate.password = new_password;
        if (username && username !== existing.username) authUpdate.email = `${username}@playbook.local`;
        if (Object.keys(authUpdate).length > 0) {
          const { error: aErr } = await supabase.auth.admin.updateUserById(existing.user_id, authUpdate);
          if (aErr) return new Response(JSON.stringify({ error: aErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
