import "../globals.css";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { AuthProvider } from "@/contexts/auth-context";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbItem className="hidden md:block">
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </header>
            <main>
              {children}
              <Toaster />
            </main>
          </SidebarInset>
        </SidebarProvider>
    </AuthProvider>
  );
}
