import { create } from "zustand";
import * as jwt_decode from "jwt-decode"; // FIX for Vite

const useAuthStore = create((set) => ({
  auth: null,
  token: null,

 login: (token) => {
    console.log("LOGIN() RECEIVED TOKEN:", token);

    const decoded = jwt_decode.jwtDecode(token);
    console.log("DECODED JWT:", decoded);

  set({ 
      auth: {
        username: decoded.sub,
        role: decoded.roles[0],
        roles: decoded.roles,
        token: token // <- make sure token is here
      },
      token: token
    });

    localStorage.setItem("token", token);
    localStorage.setItem("auth", JSON.stringify({
      username: decoded.sub,
      role: decoded.roles[0],
      roles: decoded.roles,
      token: token
    }));
  },

  logout: () => {
    set({ auth: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const auth = localStorage.getItem("auth");
    if (token && auth) {
      set({ token, auth: JSON.parse(auth) });
    }
  },
}));

export default useAuthStore;
