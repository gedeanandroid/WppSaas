import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'

export default function ProfilePage() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-slate-900 dark:text-white">Configurações do Usuário</h2>
        <p className="text-sm text-muted-foreground font-medium">
          Gerencie seus dados pessoais e credenciais de acesso.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 md:p-12 flex flex-col gap-16">
        <ProfileForm />
        <hr className="border-slate-200 dark:border-slate-800" />
        <PasswordForm />
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
          Multi-Atendimento v1.0.0
        </p>
      </div>
    </div>
  )
}
