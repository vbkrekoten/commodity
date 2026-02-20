'use client';

import { useState } from 'react';

export function PresignedUploadForm(): JSX.Element {
  const [status, setStatus] = useState<string>('');

  return (
    <form
      className="mt-4 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('file') as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
          return;
        }

        const presignRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/presign`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, mimeType: file.type || 'application/octet-stream' }),
        });
        const presignPayload = (await presignRes.json()) as { data: { objectKey: string; url: string } };
        const { objectKey, url } = presignPayload.data;

        await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });

        const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/confirm`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            objectKey,
            originalName: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
          }),
        });

        if (confirmRes.ok) {
          setStatus('Файл загружен и подтвержден');
        } else {
          setStatus('Ошибка загрузки');
        }
      }}
    >
      <input name="file" type="file" className="rounded border p-2" />
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Загрузить</button>
      {status && <p className="text-sm">{status}</p>}
    </form>
  );
}
