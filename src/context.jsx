
import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "./hooks/use-fetch";
import { getCurrentUser } from "./db/apiAuth";

const UrlContext = createContext(null);

const UrlProvider = ({ children }) => {
  const { data: user, fn: fetchUser } = useFetch(getCurrentUser);

  // Wait until Supabase finishes checking the session
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isAuthenticated = Boolean(user?.id);

  return (
    <UrlContext.Provider
      value={{ user, fetchUser, loading, isAuthenticated }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  const context = useContext(UrlContext);

  if (!context) {
    throw new Error("UrlState must be used inside UrlProvider");
  }

  return context;
};

export default UrlProvider;
