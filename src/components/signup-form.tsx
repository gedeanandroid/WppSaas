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
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// Máscara de Telefone (99) 9 9999-9999
const maskPhone = (value: string) => {
  if (!value) return ""
  return value
    .replace(/\\D/g, "")
    .replace(/^(\\d{2})/, "($1) ")
    .replace(/(\\d)(\\d{4})$/, "$1-$2")
    .replace(/(-\\d{4})\\d+?$/, "$1")
}

const signupSchema = z.object({
  fullName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail corporativo inválido."),
  whatsapp: z.string().refine((val) => val.replace(/\\D/g, "").length >= 10, {
    message: "Digite um número de WhatsApp válido.",
  }),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial (ex: !@#$)."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", whatsapp: "", password: "", confirmPassword: "" }
  })

  const supabase = createClient()

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.whatsapp.replace(/\\D/g,"") // Salva só numeros no metadata
          }
        }
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      router.push("/chat")
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao cadastrar usuário.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 rounded-3xl border-none shadow-2xl shadow-primary/10">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
          
          {/* Form Content */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 md:p-12 flex flex-col justify-center bg-card">
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
              <div className="flex flex-col gap-2 text-left">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-primary rounded-xl" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Criar uma conta</h1>
                <p className="text-sm text-balance text-muted-foreground font-medium">
                  Preencha seus dados para começar a usar a plataforma.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl font-medium border border-destructive/20 border-l-4 border-l-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                
                {/* Nome Completo */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-foreground leading-none">Nome completo</label>
                  <Input
                    {...form.register("fullName")}
                    id="fullName"
                    placeholder="João Silva"
                    disabled={isLoading}
                    className="h-11 rounded-lg bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-xs text-destructive font-semibold">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground leading-none">E-mail corporativo</label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com.br"
                    disabled={isLoading}
                    className="h-11 rounded-lg bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive font-semibold">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="text-sm font-semibold text-foreground leading-none">WhatsApp</label>
                  <Input
                    {...form.register("whatsapp")}
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 9 9999-9999"
                    maxLength={16}
                    disabled={isLoading}
                    className="h-11 rounded-lg bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                    onChange={(e) => {
                      const masked = maskPhone(e.target.value)
                      form.setValue("whatsapp", masked)
                    }}
                  />
                  {form.formState.errors.whatsapp && (
                    <p className="text-xs text-destructive font-semibold">{form.formState.errors.whatsapp.message}</p>
                  )}
                </div>

                {/* Senhas Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground leading-none">Senha</label>
                    <Input
                      {...form.register("password")}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="h-11 rounded-lg bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                    />
                    {form.formState.errors.password && (
                      <p className="text-xs text-destructive font-semibold leading-tight">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground leading-none">Repetir Senha</label>
                    <Input
                      {...form.register("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="h-11 rounded-lg bg-muted/40 border-muted-foreground/20 focus-visible:bg-transparent transition-colors px-4"
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive font-semibold leading-tight">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Criar minha conta"}
                </Button>
                
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Já possui uma conta?{" "}
                  <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                    Entrar no sistema
                  </Link>
                </p>
              </div>
            </div>
          </form>

          {/* Banner Criativo Lateral */}
          <div className="relative hidden w-full h-full bg-slate-950 md:block">
            <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950">
               {/* Pattern de Fundo */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               
               <div className="relative z-10 flex flex-col h-full justify-center p-14 border-l border-white/5 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 w-fit">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    SUPORTE REINVENTADO
                  </div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
                    Transforme <br/>conversas em <br/><span className="text-indigo-400 font-black italic">Resultados!</span>
                  </h2>
                  <p className="text-lg text-slate-400 font-medium max-w-sm">
                    Junte-se a dezenas de times de ponta e descubra a agilidade de um hub centralizado proativo.
                  </p>
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
