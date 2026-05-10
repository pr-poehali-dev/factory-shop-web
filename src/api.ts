import func2url from "../backend/func2url.json";

const AUTH_URL = func2url.auth;
const CLIENTS_URL = func2url.clients;
const ORDERS_URL = func2url.orders;
const PRODUCTS_URL = func2url.products;

async function req<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data as T;
}

export const api = {
  login: (login: string, password: string) =>
    req<{ ok: boolean; user: { id: number; login: string; name: string; role: string } }>(AUTH_URL, "POST", { action: "login", login, password }),

  register: (name: string, login: string, password: string) =>
    req<{ ok: boolean; user: { id: number; login: string; name: string; role: string } }>(AUTH_URL, "POST", { action: "register", name, login, password }),

  getClients: () => req<Client[]>(CLIENTS_URL),
  createClient: (data: Omit<Client, "id">) => req<Client>(CLIENTS_URL, "POST", data),
  updateClient: (id: number, data: Omit<Client, "id">) => req<Client>(`${CLIENTS_URL}/${id}`, "PUT", data),
  deleteClient: (id: number) => req<{ ok: boolean }>(`${CLIENTS_URL}/${id}`, "DELETE"),

  getProducts: () => req<Product[]>(PRODUCTS_URL),
  createProduct: (data: Omit<Product, "id">) => req<Product>(PRODUCTS_URL, "POST", data),
  updateProduct: (id: number, data: Omit<Product, "id">) => req<Product>(`${PRODUCTS_URL}/${id}`, "PUT", data),
  deleteProduct: (id: number) => req<{ ok: boolean }>(`${PRODUCTS_URL}/${id}`, "DELETE"),

  getOrders: () => req<Order[]>(ORDERS_URL),
  createOrder: (data: Omit<Order, "id">) => req<Order>(ORDERS_URL, "POST", data),
  updateOrder: (id: number, data: Omit<Order, "id">) => req<Order>(`${ORDERS_URL}/${id}`, "PUT", data),
  deleteOrder: (id: number) => req<{ ok: boolean }>(`${ORDERS_URL}/${id}`, "DELETE"),
};

export interface Client {
  id: number;
  company: string;
  contact: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  article: string;
  category: string;
  price: number;
  stock: number;
}

export interface Order {
  id: number;
  clientId: number;
  date: string;
  status: "new" | "processing" | "shipped" | "completed" | "cancelled";
  amount: number;
}
