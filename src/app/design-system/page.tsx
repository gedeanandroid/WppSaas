import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 font-sans overflow-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-16 pb-20">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Design System</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Página de referência interativa com todas as cores, tipografias e variações de componentes criados para o projeto Multi-Atendimento utilizando TailwindCSS v4 e Shadcn/UI.
          </p>
        </div>

        {/* Cores */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2 mb-6">Cores & Temas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Primary */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-primary border shadow-sm flex items-end p-3">
                  <span className="text-primary-foreground font-medium text-sm">Primary</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-primary</p>
              </div>

              {/* Background */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-background border shadow-sm flex items-end p-3">
                  <span className="text-foreground font-medium text-sm">Background</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-background</p>
              </div>

              {/* Muted */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-muted border shadow-sm flex items-end p-3">
                  <span className="text-muted-foreground font-medium text-sm">Muted</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-muted</p>
              </div>

              {/* Destructive */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-destructive border shadow-sm flex items-end p-3">
                  <span className="text-white font-medium text-sm">Destructive</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-destructive</p>
              </div>

              {/* Accent */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-accent border shadow-sm flex items-end p-3">
                  <span className="text-accent-foreground font-medium text-sm">Accent</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-accent</p>
              </div>

              {/* Card */}
              <div className="space-y-2">
                <div className="h-24 rounded-2xl bg-card border shadow-sm flex items-end p-3">
                  <span className="text-card-foreground font-medium text-sm">Card</span>
                </div>
                <p className="text-xs text-muted-foreground">bg-card</p>
              </div>

            </div>
          </div>
        </section>

        {/* Tipografia */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2 mb-6">Tipografia (Plus Jakarta Sans)</h2>
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">H1 / The quick brown fox jumps</h1>
                <p className="text-xs text-muted-foreground">text-4xl lg:text-5xl font-extrabold tracking-tight</p>
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-semibold tracking-tight transition-colors">H2 / The quick brown fox jumps</h2>
                <p className="text-xs text-muted-foreground">text-3xl font-semibold tracking-tight</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight">H3 / The quick brown fox jumps</h3>
                <p className="text-xs text-muted-foreground">text-2xl font-semibold tracking-tight</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-semibold tracking-tight">H4 / The quick brown fox jumps</h4>
                <p className="text-xs text-muted-foreground">text-xl font-semibold tracking-tight</p>
              </div>

              <div className="space-y-1">
                <p className="leading-7 [&:not(:first-child)]:mt-6">P / The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-xs text-muted-foreground">leading-7</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Small / The quick brown</p>
                <p className="text-xs text-muted-foreground">text-sm font-medium</p>
              </div>

            </div>
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2 mb-6">Componentes (Shadcn/UI)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Botões */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              {/* Forms / Inputs */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Form Inputs</h3>
                <div className="max-w-sm space-y-4 p-6 border rounded-2xl bg-card shadow-sm">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                     <Label htmlFor="picture">Arquivo</Label>
                     <Input id="picture" type="file" />
                  </div>
                  <Button className="w-full">Enviar</Button>
                </div>
              </div>

              {/* Cartões / Sombras */}
              <div className="space-y-4 md:col-span-2">
                 <h3 className="text-lg font-medium">Cards & Shadows</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Component</CardTitle>
                        <CardDescription>Simulando estrutura básica</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Perfeito para agrupar informações, status e miniaturas de chat.</p>
                      </CardContent>
                    </Card>

                    <div className="bg-indigo-500 text-white rounded-2xl p-6 shadow-xl shadow-indigo-500/20">
                      <h4 className="font-semibold text-lg mb-2">Painel Destacado</h4>
                      <p className="text-indigo-50 text-sm">Exemplo de container personalizado com as sombras do projeto e cantos extras arredondados (rounded-2xl).</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
