export interface Client {
  id: string;
  user_id: string | null;
  brand_name: string;
  username: string;
  is_admin: boolean;
  spreadsheet_id: string | null;
  created_at: string;
  updated_at: string;
}
