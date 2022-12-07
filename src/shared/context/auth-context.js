import { createContext } from "react";

const AuthContext = createContext({
    userId: null,
    token: null,
    isLoggedIn: false,
    login: () => {},
    logout: () => {}
});

export default AuthContext;