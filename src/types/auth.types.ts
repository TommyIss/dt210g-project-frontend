export interface User {
    id: number,
    firstname: string,
    lastname: string,
    password?: string,
    email: string,
    role: string
}

export interface LoginCredintials {
    email: string,
    password: string
}

export interface AuthResponse {
    message: string,
    access_token: string
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (credintials: LoginCredintials) => Promise<void>;
    logout: () => void;
}