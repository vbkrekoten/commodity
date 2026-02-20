'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ticketSchema = z.object({
  subject: z.string().min(3),
  category: z.string().min(2),
  message: z.string().min(3),
});

const otcSchema = z.object({
  marketSlug: z.string().min(2),
  volume: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
  dealDate: z.string().min(5),
  comment: z.string().optional(),
});

const keySchema = z.object({
  name: z.string().min(3),
  scopes: z.string().min(1),
});

export function TicketCreateForm(): JSX.Element {
  const { register, handleSubmit } = useForm<z.infer<typeof ticketSchema>>({ resolver: zodResolver(ticketSchema) });

  return (
    <form
      className="mb-4 space-y-2"
      onSubmit={handleSubmit(async (values) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        window.location.reload();
      })}
    >
      <input {...register('subject')} placeholder="Тема" className="w-full rounded border px-3 py-2" />
      <input {...register('category')} placeholder="Категория" className="w-full rounded border px-3 py-2" />
      <textarea {...register('message')} placeholder="Сообщение" className="w-full rounded border px-3 py-2" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Создать тикет</button>
    </form>
  );
}

export function OtcCreateForm(): JSX.Element {
  const { register, handleSubmit } = useForm<z.infer<typeof otcSchema>>({ resolver: zodResolver(otcSchema) });

  return (
    <form
      className="mb-4 grid gap-2 md:grid-cols-5"
      onSubmit={handleSubmit(async (values) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otc-deals`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        window.location.reload();
      })}
    >
      <input {...register('marketSlug')} placeholder="Рынок" className="rounded border px-3 py-2" />
      <input {...register('volume')} type="number" placeholder="Объем" className="rounded border px-3 py-2" />
      <input {...register('price')} type="number" placeholder="Цена" className="rounded border px-3 py-2" />
      <input {...register('dealDate')} type="date" className="rounded border px-3 py-2" />
      <input {...register('comment')} placeholder="Комментарий" className="rounded border px-3 py-2" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white md:col-span-5" type="submit">Добавить сделку</button>
    </form>
  );
}

export function ApiKeyCreateForm(): JSX.Element {
  const { register, handleSubmit } = useForm<z.infer<typeof keySchema>>({ resolver: zodResolver(keySchema) });

  return (
    <form
      className="mb-4 flex gap-2"
      onSubmit={handleSubmit(async (values) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: values.name, scopes: values.scopes.split(',').map((x) => x.trim()) }),
        });
        window.location.reload();
      })}
    >
      <input {...register('name')} className="rounded border px-3 py-2" placeholder="Название ключа" />
      <input {...register('scopes')} className="flex-1 rounded border px-3 py-2" placeholder="scopes через запятую" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Создать</button>
    </form>
  );
}
