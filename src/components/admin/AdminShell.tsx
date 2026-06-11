import { ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Users, Briefcase, ListFilter, ExternalLink } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/auth";
import adchefsLogo from "@/assets/adchefs-logo.png.asset.json";
import { BrandStar } from "@/components/brand/BrandStar";

type NavItem = {
  title: string;
  to: string;
  icon: ReactNode;
  match?: (pathname: string, search: string) => boolean;
};

/** Primary nav order: Clients first, Shortlist last. */
const primaryItems: NavItem[] = [
  {
    title: "Clients",
    to: "/admin?section=clients",
    icon: <Users className="w-[15px] h-[15px]" strokeWidth={1.5} />,
    match: (p, s) =>
      (p === "/admin" && s.includes("section=clients")) ||
      p.startsWith("/admin/clients"),
  },
  {
    title: "Pipeline",
    to: "/admin?section=pipeline",
    icon: <ListFilter className="w-[15px] h-[15px]" strokeWidth={1.5} />,
    match: (p, s) => p === "/admin" && (!s || s.includes("section=pipeline")),
  },
  {
    title: "Job Postings",
    to: "/admin?section=jobs",
    icon: <Briefcase className="w-[15px] h-[15px]" strokeWidth={1.5} />,
    match: (p, s) => p === "/admin" && s.includes("section=jobs"),
  },
  {
    title: "Shortlist",
    to: "/admin?section=shortlist",
    icon: <BrandStar size={15} />,
    match: (p, s) => p === "/admin" && s.includes("section=shortlist"),
  },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[hsl(var(--sidebar-border))]"
    >
      {/* Brand header */}
      <SidebarHeader className="px-3 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <a
          href="/"
          className="flex items-center gap-2.5 px-1.5 group/brand"
          title="AdChefs"
        >
          <span className="relative flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#1A1A1A] ring-1 ring-white/5 overflow-hidden">
            <img src={adchefsLogo.url} alt="AdChefs" className="w-5 h-5 object-contain" />
            <span className="absolute -inset-px rounded-[6px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span
                className="text-[13px] tracking-[-0.01em] text-[#F5F4EE]"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
              >
                AdChefs
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6E6B63]">
                Studio
              </span>
            </span>
          )}
        </a>
      </SidebarHeader>

      <SidebarContent className="bg-transparent pt-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#5C594F]">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {primaryItems.map((item) => {
                const active = item.match
                  ? item.match(pathname, search)
                  : pathname + search === item.to;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={[
                        "relative h-9 rounded-[6px] mx-1 px-2.5",
                        "text-[#A8A59C] hover:text-[#F5F4EE] hover:bg-white/[0.04]",
                        "transition-colors duration-150",
                        "data-[active=true]:bg-[linear-gradient(90deg,rgba(158,216,245,0.14)_0%,rgba(158,216,245,0.04)_100%)]",
                        "data-[active=true]:text-[#F5F4EE]",
                        "data-[active=true]:shadow-[inset_0_0_0_1px_rgba(158,216,245,0.18)]",
                      ].join(" ")}
                    >
                      <NavLink to={item.to} className="flex items-center gap-2.5">
                        {/* Active rail */}
                        {active && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-[2px]"
                            style={{
                              background: "linear-gradient(180deg, #BDE7FA 0%, #6FB8E0 100%)",
                              boxShadow: "0 0 8px rgba(158,216,245,0.55)",
                            }}
                          />
                        )}
                        <span
                          className={[
                            "flex items-center justify-center w-5 h-5 transition-colors",
                            active ? "text-[#9ED8F5]" : "text-[#7E7B72] group-hover:text-[#F5F4EE]",
                          ].join(" ")}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-[13px] tracking-[-0.005em]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: active ? 600 : 500 }}>
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[hsl(var(--sidebar-border))] p-2">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Mock demo"
              className="h-9 rounded-[6px] px-2.5 text-[#7E7B72] hover:text-[#F5F4EE] hover:bg-white/[0.04]"
            >
              <a href="/mock" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
                <ExternalLink className="w-[15px] h-[15px]" strokeWidth={1.5} />
                {!collapsed && (
                  <span className="text-[12px] tracking-[-0.005em]">Mock demo</span>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => { logout(); navigate("/login"); }}
              className="h-9 rounded-[6px] px-2.5 text-[#7E7B72] hover:text-[#F5F4EE] hover:bg-white/[0.04]"
            >
              <LogOut className="w-[15px] h-[15px]" strokeWidth={1.5} />
              {!collapsed && <span className="text-[12px] tracking-[-0.005em]">Sign out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

type Props = {
  children: ReactNode;
  /** Optional page eyebrow shown in the top bar */
  eyebrow?: string;
  /** Optional right-aligned actions for the top bar */
  actions?: ReactNode;
};

export default function AdminShell({ children, eyebrow, actions }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full admin-bg">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-[#E5E3DC]/70 bg-[#FAF8F3]/60 backdrop-blur-xl px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-[#75726B] hover:text-[#1A1A1A] h-8 w-8 rounded-[6px] hover:bg-[#EEEDE8]" />
              <span className="h-4 w-px bg-[#D8D7D2]" />
              {eyebrow && (
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#75726B]">
                  {eyebrow}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}