import Link from 'next/link';
import { LoginForm } from '@/components/auth-forms';

export default function CabinetLoginPage(): JSX.Element {
  return (
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Вход в кабинет</h1>
      <LoginForm />
      <p className="mt-3 text-sm">
        Нет аккаунта? <Link href="/cabinet/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
