import Link from 'next/link';
import { RegisterForm } from '@/components/auth-forms';

export default function CabinetRegisterPage(): JSX.Element {
  return (
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Регистрация</h1>
      <RegisterForm />
      <p className="mt-3 text-sm">
        Уже есть аккаунт? <Link href="/cabinet/login">Войти</Link>
      </p>
    </div>
  );
}
