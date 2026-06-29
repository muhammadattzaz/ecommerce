const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function doUpload(formData: FormData): Promise<Response> {
  return fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  let res = await doUpload(formData);

  if (res.status === 401) {
    // Access token expired — attempt a silent refresh then retry once
    const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!refreshed.ok) {
      throw new Error('Session expired. Please log in again.');
    }
    res = await doUpload(formData);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((body as { message?: string }).message ?? 'Upload failed');
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}
