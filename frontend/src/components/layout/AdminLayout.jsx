import { Link, useLocation } from "react-router-dom"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "#components/ui/sidebar"
import { Separator } from "#components/ui/separator"
import { Button } from "#components/ui/button"
import { AppSidebar } from "#components/app-sidebar"
import { ArrowLeft } from "lucide-react"

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
]

export function AdminLayout({ children }) {
  const location = useLocation()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-full" />
          <Link to="/">
            <Button variant="ghost" size="icon" className="size-7">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-sm font-semibold">
            {links.find((l) => l.to === location.pathname)?.label || "Admin"}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
