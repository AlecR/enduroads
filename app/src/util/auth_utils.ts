import Cookies from "js-cookie";

export const isAuthenticated = () => {
  const authToken = Cookies.get("auth-token");
  return !!authToken;
};

export const storeAuthToken = (token: string) => {
  Cookies.set("auth-token", token);
};
