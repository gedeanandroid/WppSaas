import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <SignupForm />
      </div>
    </div>
  )
}
