import { SERVER_URL } from "../constants";

interface LoginResponse {
  token: string;
}

export const login = async (email: string, password: string) => {
  const requestUrl = `${SERVER_URL}/auth/login`;
  const body = JSON.stringify({ email, password });
  const res = await fetch(requestUrl, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Invalid username or password");
  }
  const json: LoginResponse = await res.json();
  return json.token;
};
