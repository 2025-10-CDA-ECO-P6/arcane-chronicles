import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiFetch, ApiError, toFormData } from './api';

function mockFetch(status: number, body?: unknown) {
  const response =
    body === undefined
      ? new Response(null, { status })
      : new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        });
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function lastCall(fetchMock: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  return { url, init, headers: init.headers as Headers };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('fait un GET sur /api avec les cookies, sans corps ni Content-Type', async () => {
    const fetchMock = mockFetch(200, { data: [] });

    const result = await apiFetch.get<{ data: unknown[] }>('/campaigns');

    const { url, init, headers } = lastCall(fetchMock);
    expect(url).toBe('/api/campaigns');
    expect(init.method).toBe('GET');
    expect(init.credentials).toBe('include');
    expect(init.body).toBeUndefined();
    expect(headers.has('Content-Type')).toBe(false);
    expect(result).toEqual({ data: [] });
  });

  it('envoie un objet en JSON', async () => {
    const fetchMock = mockFetch(201, { id: 'abc' });

    await apiFetch.post('/campaigns', { title: 'Ma campagne', isPublic: false });

    const { init, headers } = lastCall(fetchMock);
    expect(init.method).toBe('POST');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ title: 'Ma campagne', isPublic: false }));
  });

  it('envoie en multipart un objet qui contient un fichier', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    const image = new File(['image'], 'carte.webp', { type: 'image/webp' });

    await apiFetch.put('/campaigns/abc', { title: 'Ma campagne', image, tags: ['ciel'] });

    const { init, headers } = lastCall(fetchMock);
    expect(init.body).toBeInstanceOf(FormData);
    expect(headers.has('Content-Type')).toBe(false);
    const form = init.body as FormData;
    expect(form.get('title')).toBe('Ma campagne');
    expect((form.get('image') as File).name).toBe('carte.webp');
    expect(form.get('tags')).toBe('["ciel"]');
  });

  it('envoie un FormData tel quel', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    const form = new FormData();
    form.append('title', 'Carte');

    await apiFetch.patch('/scenes/abc', form);

    expect(lastCall(fetchMock).init.body).toBe(form);
  });

  it('renvoie null sur une réponse 204', async () => {
    mockFetch(204);

    await expect(apiFetch.delete('/campaigns/abc')).resolves.toBeNull();
  });

  it("lève une ApiError avec le code et la réponse de l'API", async () => {
    const errors = [{ field: 'title', message: 'Titre obligatoire' }];
    mockFetch(422, { errors });

    const error = await apiFetch.post('/campaigns', {}).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(422);
    expect((error as ApiError).data).toEqual({ errors });
  });
});

describe('toFormData', () => {
  it('ignore les valeurs vides et ajoute chaque fichier d’une liste', () => {
    const files = [new File(['a'], 'a.webp'), new File(['b'], 'b.webp')];

    const form = toFormData({ name: 'Goor', level: 3, empty: null, missing: undefined, files });

    expect(form.get('name')).toBe('Goor');
    expect(form.get('level')).toBe('3');
    expect(form.has('empty')).toBe(false);
    expect(form.has('missing')).toBe(false);
    expect(form.getAll('files')).toHaveLength(2);
  });
});
