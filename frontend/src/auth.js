
const TOKEN_KEY = "spendwise_token";
const USER_KEY = "spendwise_user";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

export const saveAuth = (authData) => {
  if (!authData?.token) {
    throw new Error("Authentication token is missing.");
  }

  localStorage.setItem(TOKEN_KEY, authData.token);

  if (authData.userId !== undefined) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        userId: authData.userId,
        name: authData.name || "",
        email: authData.email || "",
      })
    );
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url}`;

  return fetch(requestUrl, {
    ...options,
    headers,
  });
};

export const apiFetch = async (url, options = {}) => {
  const requestUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url}`;

  return fetch(requestUrl, options);
};
