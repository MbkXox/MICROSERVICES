"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className=""
              >
                <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  style={{ borderRadius: '8px' }}
                />
                <div className="grid flex-1 text-left text-sm font-normal tracking-tight">
                  <span className="truncate">{activeTeam.name}</span>
                  <span className="truncate">{activeTeam.plan}</span>
                </div>
              </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
