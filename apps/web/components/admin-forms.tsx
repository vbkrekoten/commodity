'use client';

import { useState } from 'react';

export function AdminMarketCreateForm(): JSX.Element {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  return (
    <form
      className="mb-4 flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/markets`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, title, description: `Описание ${title}`, tags: ['admin'] }),
        });
        window.location.reload();
      }}
    >
      <input className="rounded border px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
      <input className="rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Добавить</button>
    </form>
  );
}

export function AdminNewsCreateForm(): JSX.Element {
  const [title, setTitle] = useState('');
  return (
    <form
      className="mb-4 flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/news`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            title,
            summary: title,
            body: title,
            tags: ['admin'],
            publishedAt: new Date().toISOString(),
          }),
        });
        window.location.reload();
      }}
    >
      <input className="flex-1 rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Добавить</button>
    </form>
  );
}

export function AdminDocCreateForm(): JSX.Element {
  const [title, setTitle] = useState('');
  return (
    <form
      className="mb-4 flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/documents`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            title,
            category: 'rules',
            version: '1.0',
            effectiveDate: new Date().toISOString(),
            tags: ['admin'],
          }),
        });
        window.location.reload();
      }}
    >
      <input className="flex-1 rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название документа" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">Добавить</button>
    </form>
  );
}
