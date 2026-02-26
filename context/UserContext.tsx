"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserData {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userApiKey: string | null;
  token: string | null;
}

interface UserContextValue {
  user: UserData;
  setUser: (data: UserData) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

// ─── Defaults ────────────────────────────────────────────────────────────────
const defaultUser: UserData = {
  userId: null,
  userEmail: null,
  userName: null,
  userApiKey: null,
  token: null,
};

// ─── Context ─────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextValue>({
  user: defaultUser,
  setUser: () => {},
  clearUser: () => {},
  isAuthenticated: false,
});

// ─── Provider ────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(defaultUser);

  // Hydrate from localStorage on first load (so refresh doesn't lose data)
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken || storedUser) {
        const parsed = storedUser ? JSON.parse(storedUser) : {};
        setUserState({
          userId: parsed.userId ?? null,
          userEmail: parsed.userEmail ?? null,
          userName: parsed.userName ?? null,
          userApiKey: parsed.userApiKey ?? null,
          token: storedToken ?? null,
        });
      }
    } catch {
      // localStorage not available (SSR guard)
    }
  }, []);

  const setUser = (data: UserData) => {
    // Persist to localStorage for page refresh survival
    localStorage.setItem("token", data.token ?? "");
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userApiKey: data.userApiKey,
      }),
    );
    setUserState(data);
  };

  const clearUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(defaultUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        isAuthenticated: !!user.token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUser() {
  return useContext(UserContext);
}
