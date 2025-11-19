"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Package,
  CircuitBoard,
  Image,
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()

  const data = {
    user: {
      name: user?.name || 'Utilisateur inconnu',
    },
    teams: [
      {
        plan: "© Matis M'barek",
        name: "MICROSERVICES DEV-OPS",
        logo: CircuitBoard,
      }
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/backoffice",
        icon: LayoutDashboard,
      },
      {
        title: "Commandes",
        url: "/backoffice/orders",
        icon: Package,
      },
      {
        title: "GIFs",
        url: "/backoffice/gifs",
        icon: Image,
      },
    ]
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={data.user} 
          onLogout={logout}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}