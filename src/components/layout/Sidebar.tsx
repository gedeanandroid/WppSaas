'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Smartphone } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Atendimentos', href: '/chat', icon: MessageSquare },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Instâncias', href: '/instances', icon: Smartphone },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden flex-col items-center py-4 bg-white border-r border-slate-200 w-16 md:flex h-full fixed left-0 top-0">
      {/* Logo */}
      <div className="flex-shrink-0 mb-8 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-indigo-600/20">
        M
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className={`flex h-12 w-full items-center justify-center rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  />
                }
              >
                <Icon className={`h-6 w-6 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                <span className="sr-only">{item.name}</span>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 text-white rounded-lg border-none text-xs">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* User Avatar */}
      <div className="flex-shrink-0 mt-auto flex flex-col items-center gap-4 w-full px-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <button className="flex h-12 w-full items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" />
            }
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 text-white rounded-lg border-none text-xs">
            <p>Sair</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link href="/profile">
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 ring-indigo-600 ring-offset-2 transition-all">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Operador" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">OP</AvatarFallback>
                </Avatar>
              </Link>
            }
          >
            <span className="sr-only">Meu Perfil</span>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 text-white rounded-lg border-none text-xs">
            <p>Meu Perfil</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}
