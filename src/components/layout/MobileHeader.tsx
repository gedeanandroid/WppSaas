'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Atendimentos', href: '/chat', icon: MessageSquare },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function MobileHeader() {
  const pathname = usePathname()

  return (
    <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 -ml-2" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 flex flex-col bg-white">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="font-semibold text-slate-900 tracking-tight">Multi-Atendimento</span>
            </div>
            <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-slate-800 tracking-tight">Multi-Atendimento</span>
      </div>
      <Avatar className="h-8 w-8 ring-2 ring-white">
        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Operador" />
        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium text-xs">OP</AvatarFallback>
      </Avatar>
    </header>
  )
}
