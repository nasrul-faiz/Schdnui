"use client"

import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  SettingsIcon,
  InboxIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  CheckIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const workspaces = [
  { name: "Schdnui", plan: "Free" },
  { name: "My Project", plan: "Pro" },
]

const navItems = [
  { title: "Home", icon: HomeIcon, url: "/home" },
  { title: "Inbox", icon: InboxIcon, url: "/inbox" },
  { title: "Calendar", icon: CalendarIcon, url: "/calendar" },
  { title: "Team", icon: UsersIcon, url: "/team" },
]

const settingsItems = [
  { title: "Settings", icon: SettingsIcon, url: "/settings" },
]

interface AppLayoutProps {
  title: string
  children: React.ReactNode
}

export function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      S
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-sm">Schdnui</span>
                      <span className="text-xs text-muted-foreground">Free</span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width)"
                  align="start"
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Workspaces
                  </DropdownMenuLabel>
                  {workspaces.map((ws) => (
                    <DropdownMenuItem key={ws.name} className="gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold shrink-0">
                        {ws.name[0]}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm">{ws.name}</span>
                        <span className="text-xs text-muted-foreground">{ws.plan}</span>
                      </div>
                      {ws.name === "Schdnui" && <CheckIcon className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded border bg-background shrink-0">
                      <PlusIcon className="size-3" />
                    </div>
                    <span className="text-sm">Add workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild closeOnClick>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {settingsItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild closeOnClick>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <ThemeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <SidebarTrigger />
          <h1 className="font-semibold">{title}</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
