const API_BASE = '/api'; 

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) {
        let errMessage = 'Request failed';
        try {
            const errData = await res.json();
            errMessage = errData.message || errData.error || errMessage;
        } catch(e) { /* ignore */ }
        throw new Error(errMessage);
    }
    let json;
    try { json = await res.json(); } catch(e) { return null; }
    if (json && typeof json === 'object' && json.success !== undefined) {
      if (!json.success) throw new Error(json.error || json.message || 'Request failed');
      return json.data !== undefined ? json.data : json;
    }
    return json;
  },
  post: async (path: string, body: unknown) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
        let errMessage = 'Request failed';
        try {
            const errData = await res.json();
            errMessage = errData.message || errData.error || errMessage;
        } catch(e) { /* ignore */ }
        throw new Error(errMessage);
    }
    let json;
    try { json = await res.json(); } catch(e) { return null; }
    if (json && typeof json === 'object' && json.success !== undefined) {
      if (!json.success) throw new Error(json.error || json.message || 'Request failed');
      return json.data !== undefined ? json.data : json;
    }
    return json;
  },
};
