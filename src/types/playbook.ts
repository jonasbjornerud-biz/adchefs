export interface Client {
  id: string;
  user_id: string | null;
  brand_name: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  client_id: string;
  title: string;
  stage_number: number;
  sort_order: number;
  created_at: string;
}

export interface Module {
  id: string;
  stage_id: string;
  client_id: string;
  title: string;
  icon: string | null;
  module_number: string;
  definition_of_done: string | null;
  content: any;
  sort_order: number;
  created_at: string;
}

export interface ModuleCompletion {
  id: string;
  module_id: string;
  client_id: string;
  completed: boolean;
  completed_at: string;
}

export interface StageWithModules extends Stage {
  modules: Module[];
}

export interface ClientWithStats extends Client {
  totalModules: number;
  completedModules: number;
  completionPercentage: number;
}
