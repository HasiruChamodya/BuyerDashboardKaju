import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, getToken, setToken, clearToken } from "../lib/api";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  companyName?: string;
  businessRegNo?: string;
  tin?: string;
  district?: string;
  address?: string;
  defaultPaymentMethod?: "Digital" | "COD";
  bankAccountName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  notifyOutbid?: boolean;
  notifyAuctionEnding?: boolean;
  notifyOrderUpdates?: boolean;
  notifyMessages?: boolean;
  notifyPromotions?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, companyName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiFetch<AuthUser>("/auth/me");
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
  }

  async function signup(fullName: string, email: string, password: string, companyName?: string) {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/auth/signup", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ fullName, email, password, companyName }),
    });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}