export interface Client {
  id: string;
  user_id: string | null;
  brand_name: string;
  username: string;
  is_admin: boolean;
  spreadsheet_id: string | null;
  logo_url?: string | null;
  meta_access_token?: string | null;
  meta_ad_account_id?: string | null;
  current_password?: string | null;
  created_at: string;
  updated_at: string;
}
