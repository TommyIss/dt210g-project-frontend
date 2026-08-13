import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import type { AuthContextType, User, LoginCredintials } from "../types/auth.types";

// Skapa kontext
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    const [user, setUser] = useState<User | null>(null);

    // Logga in användare
    async function login(credintials: LoginCredintials) {
        try {
            const response = await fetch('https://tois-dt210g-project-webservice.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credintials)
            });

            if(!response.ok) {
                throw new Error('Inloggning misslyckades');
            }

            const data = await response.json();


            localStorage.setItem('token', data.access_token);

            setUser(data.user);

        } catch (error) {
            throw error;
        }
        
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('pathname');
        setUser(null);
    }

    async function checkToken() {
        const token = localStorage.getItem('token');

        if(!token) {
            return;
        }

        try {
            const response = await fetch('https://tois-dt210g-project-webservice.onrender.com/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if(response.ok) {
                const data = await response.json();

                setUser(data.userProfile);
            }
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        }
    }

    useEffect(() => {
        checkToken();
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('userAuth måste användas inom en AuthProvider');
    }

    return context;
}