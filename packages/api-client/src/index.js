export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `API ${status}`);
    this.status = status;
    this.body = body;
  }
}

export function createClient({ base = '/api', fetch: fetchFn = globalThis.fetch } = {}) {
  async function request(method, path, body) {
    const headers = {};
    const init = { method, credentials: 'include', headers };
    if (body !== undefined) {
      headers['content-type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    const res = await fetchFn(`${base}${path}`, init);
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status, data);
    return data;
  }

  return {
    health: () => request('GET', '/health'),
    auth: {
      me: () => request('GET', '/auth/me'),
      login: (body) => request('POST', '/auth/login', body),
      logout: () => request('POST', '/auth/logout'),
    },
    content: {
      list: (resource, query = '') => request('GET', `/content/${resource}${query}`),
      art: (slug) => request('GET', `/content/art/${encodeURIComponent(slug)}`),
    },
    media: {
      sign: (body) => request('POST', '/admin/media/sign', body),
      confirm: (body) => request('POST', '/admin/media/confirm', body),
      thumb: (body) => request('POST', '/admin/media/thumb', body),
    },
  };
}
