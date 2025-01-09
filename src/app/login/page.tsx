import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        <LoginButton />
      </div>
    </div>
  )
}