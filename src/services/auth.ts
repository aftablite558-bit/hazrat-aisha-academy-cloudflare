export const authService = {
  logout: async () => {
    // Placeholder for Cloudflare Auth
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  getCurrentUser: async () => {
    // Placeholder
    return null;
  }
};
