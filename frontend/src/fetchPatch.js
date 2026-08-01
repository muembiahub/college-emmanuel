const API_BASE = import.meta.env.VITE_API_URL || "";

console.log("🌍 API BASE :", API_BASE);


const originalFetch = window.fetch.bind(window);

const redirectToLogin = () => {
  if (!window.location.hash.includes("/login")) {
    window.location.hash = "#/login";
  }
};

window.fetch = (input, init = {}) => {
  let url = input;

  if (
    typeof input === "string" &&
    !input.startsWith("http://") &&
    !input.startsWith("https://")
  ) {
    url = `${API_BASE}${input}`;
  }

  const token = localStorage.getItem("token");
  const headers = new Headers(init?.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log("FETCH =>", url);

  return originalFetch(url, {
    credentials: "include",
    ...init,
    headers,
  }).then((response) => {
    if ((response.status === 401 || response.status === 403) && !String(url).includes("/login")) {
      localStorage.removeItem("token");
      redirectToLogin();
    }
    return response;
  });
};