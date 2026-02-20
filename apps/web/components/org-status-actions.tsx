'use client';

export function OrgStatusActions({ orgId }: { orgId: string }): JSX.Element {
  const change = async (status: 'approved' | 'rejected'): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${orgId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  };

  return (
    <div className="mt-2 flex gap-2">
      <button onClick={() => void change('approved')} className="rounded bg-emerald-600 px-3 py-1 text-xs text-white" type="button">
        Approve
      </button>
      <button onClick={() => void change('rejected')} className="rounded bg-red-600 px-3 py-1 text-xs text-white" type="button">
        Reject
      </button>
    </div>
  );
}
