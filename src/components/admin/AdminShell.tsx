import { ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Users, Briefcase, ListFilter, ExternalLink } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

const items: NavItem[] = [
  {
    title: "Pipeline",
    to: "/admin?section=pipeline",
    icon: <ListFilter className="w-4 h-4" strokeWidth={1.5} />,
    match: (p, s) => p === "/admin" && (!s || s.includes("section=pipeline")),
  },
  {
    title: "Shortlist",
    to: "/admin?section=shortlist",
    icon: <BrandStar size={14} />,
    match: (p, s) => p === "/admin" && s.includes("section=shortlist"),
  },
  {
    title: "Job Postings",
    to: "/admin?section=jobs",
    icon: <Briefcase className="w-4 h-4" strokeWidth={1.5} />,
    match: (p, s) => p === "/admin" && s.includes("section=jobs"),
  },
  {
    title: "Clients",
    to: "/admin?section=clients",
    icon: <Users className="w-4 h-4" strokeWidth={1.5} />,
    match: (p, s) =>
      (p === "/admin" && s.includes("section=clients")) ||
      p.startsWith("/admin/clients"),
  },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E2E0D9]">
      <SidebarHeader className="px-3 py-4 border-b border-[#E2E0D9]">
        <a href="/" className="flex items-center gap-2 px-1.5">
          <img src={adchefsLogo.url} alt="AdChefs" className="h-7 w-auto" />
          {!collapsed && (
            <span className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#75726B]">
              backend
            </span>
          )}
        </a>
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.match
                  ? item.match(pathname, search)
                  : pathname + search === item.to;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-[#ECF7FD] data-[active=true]:text-[#1A4A6B] data-[active=true]:font-medium hover:bg-[#F2F1EC]"
                    >
                      <NavLink to={item.to} className="flex items-center gap-2.5">
                        <span className="relative flex items-center justify-center">
                          {active && (
                            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-[#3B86A8]" />
                          )}
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-[13px] tracking-tight">{item.title}</span>
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

      <SidebarFooter className="border-t border-[#E2E0D9] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mock demo" className="hover:bg-[#F2F1EC]">
              <a href="/mock" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                {!collapsed && <span className="text-[12px]">Mock demo</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="hover:bg-[#F2F1EC] text-[#75726B] hover:text-[#1A1A1A]"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              {!collapsed && <span className="text-[12px]">Sign out</span>}
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
          <header className="h-12 flex items-center justify-between border-b border-[#E2E0D9] bg-[#FAF8F3]/70 backdrop-blur-md px-3 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-[#75726B] hover:text-[#1A1A1A]" />
              {eyebrow && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">
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