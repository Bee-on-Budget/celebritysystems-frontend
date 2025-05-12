export const setToken = (token) => {
  document.cookie = `jwt=${token}; path=/; max-age=86400; Secure; SameSite=Strict`; // 1 day expiry
};

export const getToken = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "jwt") return value;
  }
  return null;
};

export const removeToken = () => {
  document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
};
