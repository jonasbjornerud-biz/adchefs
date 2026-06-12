/**
 * Default portal template applied to every new client.
 * Lives in code (no schema change) so existing clients inherit the same
 * premium layout without a data migration. Each `*_enabled` flag also
 * answers as a safe fallback when the column is missing from the row.
 */
export type PortalTemplate = {
  client_portal_enabled: boolean;
  editor_performance_enabled: boolean;
  kpi_dashboard_enabled: boolean;
  ad_performance_enabled: boolean;
  show_demo_data: boolean;
  portal_theme: "adchefs-premium";
};

export const DEFAULT_PORTAL_TEMPLATE: PortalTemplate = {
  client_portal_enabled: true,
  editor_performance_enabled: true,
  kpi_dashboard_enabled: true,
  ad_performance_enabled: true,
  show_demo_data: false,
  portal_theme: "adchefs-premium",
};

/** Merge a (possibly partial) client row with the standard portal defaults. */
export function portalTemplateFor<T extends Record<string, unknown>>(
  client: T | null | undefined,
): PortalTemplate {
  return { ...DEFAULT_PORTAL_TEMPLATE, ...(client ?? {}) } as PortalTemplate;
}
