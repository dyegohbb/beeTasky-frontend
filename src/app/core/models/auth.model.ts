export interface AuthResponse {
    apiVersion: string;
    content?: {
        token: string;
        expiresAt: string;
    };
    message: string;
    timestamp: string;
}

export interface LoginRequest {
    login: string;
    password: string;
}