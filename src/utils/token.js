const JWT = 'auth_token';

export const tokenStorage = {
    get: () => localStorage.getItem(JWT),
    set: (token) => localStorage.setItem(JWT, token),
    clear: () => localStorage.removeItem(JWT)
};