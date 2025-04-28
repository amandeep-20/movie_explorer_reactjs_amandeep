// src/context/RoleContext.tsx
import React, { createContext, useContext, ReactNode } from "react";

interface RoleContextType {
  role: string | null;
}

const RoleContext = createContext<RoleContextType>({ role: null });

interface RoleProviderProps {
  children: ReactNode;
  role: string | null;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children, role }) => {
  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export default RoleContext;