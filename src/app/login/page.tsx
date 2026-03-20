import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <LoginForm />
      </div>
    </div>
  )
}
