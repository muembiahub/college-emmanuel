const API_BASE = import.meta.env.VITE_API_URL || "";

console.log("🌍 API BASE :", API_BASE);


const originalFetch = window.fetch.bind(window);


window.fetch = (input, init = {}) => {

  let url = input;


  if (
    typeof input === "string" &&
    !input.startsWith("http://") &&
    !input.startsWith("https://")
  ) {

    url = `${API_BASE}${input}`;

  }


  console.log("FETCH =>", url);


  return originalFetch(url, {
    credentials: "include",
    ...init,
  });

};