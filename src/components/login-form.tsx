"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido. Verifique a digitação."),
  password: z.string().min(1, "A senha é obrigatória."),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const { signIn, isLoading, error } = useAuthStore()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  })

  async function onSubmit(data: LoginFormValues) {
    const success = await signIn(data.email, data.password)
    if (success) {
      router.push("/chat")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 rounded-3xl border-none shadow-2xl shadow-primary/10">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 md:p-12 flex flex-col justify-center bg-card">
            <div className="flex flex-col gap-8 w-full max-w-sm mx-auto">
              <div className="flex flex-col gap-2 text-left">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-primary rounded-xl" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Login</h1>
                <p className="text-sm text-balance text-muted-foreground font-medium">
                  Acesse sua conta para continuar para o Workspace.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl font-medium border border-destructive/20 border-l-4 border-l-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground leading-none">E-mail corporativo</label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com.br"
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive font-semibold">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground leading-none">Senha</label>
                    <a href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                      Esqueci a senha
                    </a>
                  </div>
                  <Input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive font-semibold">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox 
                    id="rememberMe" 
                    checked={form.watch("rememberMe")} 
                    onCheckedChange={(val) => form.setValue("rememberMe", val === true)} 
                    disabled={isLoading}
                    className="rounded-md h-5 w-5"
                  />
                  <label htmlFor="rememberMe" className="text-sm font-semibold text-muted-foreground cursor-pointer select-none">
                    Lembrar-me por 30 dias
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Entrar no sistema"}
                </Button>
                
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Ainda não possui conta?{" "}
                  <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                    Criar conta
                  </Link>
                </p>
              </div>
            </div>
          </form>

          {/* Banner Criativo Lateral */}
          <div className="relative hidden w-full h-full md:block">
            <div className="absolute inset-0 bg-primary overflow-hidden">
               {/* Decorações do Banner */}
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
               
               <div className="relative z-10 flex flex-col h-full justify-center p-14">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl mb-8 flex items-center justify-center border border-white/30">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                    O controle total <br/>do seu suporte <br/>em um só lugar.
                  </h2>
                  <p className="text-lg text-primary-foreground/80 font-medium max-w-sm">
                    Revolucione a maneira como sua equipe se comunica com clientes usando nossa tecnologia omnichannel em tempo real.
                  </p>
                  
                  {/* Avatar Stack Mock */}
                  <div className="flex items-center gap-4 mt-12">
                     <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/30 backdrop-blur-sm"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/40 backdrop-blur-sm"></div>
                     </div>
                     <div className="text-sm font-bold text-white/90">
                        +2,000 atendentes <span className="block text-white/60 font-medium text-xs">ativos agora</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-muted-foreground font-semibold px-4 tracking-tight">
        Ao prosseguir, você concorda com nossos{" "}
        <a href="#" className="underline hover:text-foreground transition-colors">Termos de Serviço</a>{" e "}
        <a href="#" className="underline hover:text-foreground transition-colors">Privacidade</a>.
      </p>
    </div>
  )
}
