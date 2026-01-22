import { RegisterForm } from "@/components/features/auth";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center px-4 py-8 md:min-h-[calc(100vh-4rem)]">
      <RegisterForm />
    </div>
  );
}
