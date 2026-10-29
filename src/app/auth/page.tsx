import AuthForm from '@/components/auth/AuthForm';
import SetupNotice from '@/components/common/SetupNotice';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#D5DAE3] shadow-sm overflow-hidden">
        <SetupNotice />
        <AuthForm />
      </div>
    </main>
  );
}
