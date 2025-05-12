import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

// Change from default export to named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
