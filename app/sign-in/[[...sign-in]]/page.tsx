import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your culinary journey
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl"
            }
          }}
        />
      </div>
    </div>
  );
}
