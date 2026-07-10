import { Link, useLocation } from "react-router-dom"
import { useAuth } from "#contexts/AuthContext"
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
  useSidebar,
} from "#components/ui/sidebar"
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react"

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-background p-4">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Botit</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <SidebarMenuItem key={link.to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={link.to}>
                        <Icon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center gap-2 py-1.5 px-1 text-sm">
              <div className="flex size-7 aspect-square items-center justify-center rounded-full bg-muted text-xs font-medium">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className={`flex-1 overflow-hidden flex-col ${state === "collapsed" ? "hidden" : "flex"}`}>
                <p className="truncate text-sm font-medium">{user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
