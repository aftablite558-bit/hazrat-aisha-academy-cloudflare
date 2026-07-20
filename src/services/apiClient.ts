const API_BASE = '/api'; // This will need to be configured for the deployed worker URL

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`);
    return res.json();
  },
  post: async (path: string, body: any) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};
