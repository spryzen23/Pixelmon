import { api } from "../api";

const TOKEN_KEY = "pixelmon-auth-token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function verifySession(token) {
  return api.verify(token);
}

export async function login(credentials) {
  return api.login(credentials);
}

export async function register(data) {
  return api.register(data);
}
