'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  organizationName: z.string().min(2),
});

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        router.push('/cabinet');
      })}
    >
      <input {...register('email')} placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input {...register('password')} type="password" placeholder="Пароль" className="w-full rounded border px-3 py-2" />
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Войти</button>
      {formState.errors.email && <p className="text-sm text-red-600">Невалидный email</p>}
    </form>
  );
}

export function RegisterForm(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        router.push('/cabinet/login');
      })}
    >
      <input {...register('fullName')} placeholder="ФИО" className="w-full rounded border px-3 py-2" />
      <input {...register('organizationName')} placeholder="Организация" className="w-full rounded border px-3 py-2" />
      <input {...register('email')} placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input {...register('password')} type="password" placeholder="Пароль" className="w-full rounded border px-3 py-2" />
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Зарегистрироваться</button>
    </form>
  );
}
