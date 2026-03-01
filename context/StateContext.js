import { useRouter } from "next/router";
import React, { createContext, useContext, useState, useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/backend/Firebase";

const Context = createContext();

export const StateContext = ({ children }) => {
  // Variables to Carry Across Multiple Pages
  const [user, setUser] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  const router = useRouter();
  const { asPath } = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        authLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
