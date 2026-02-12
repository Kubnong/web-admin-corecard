import api from "./api";
interface AuthorizeRequest {
    email: string;
    password: string;
    code_challenge: string;
    state: string;
    nonce?: string;
    totp_code?: number; 
    temp_token?: string; 
}
interface TokenRequest {
    auth_code: string;
    code_verify: string;
}

export const authorize = (payload: AuthorizeRequest) => {
    return api.post('/web/authorize', payload) // ตรงกับ @PostMapping("/authorize")
}

export const getToken = (payload: TokenRequest) => {
    return api.post('/web/token', payload) // ตรงกับ @PostMapping("/token")
}

// เพิ่ม Interface
interface MfaSetupRequest {
    temp_token: string;
}

interface MfaVerifyRequest {
    temp_token: string;
    totp_code: number;
}

// เพิ่ม Function
export const setup2FA = (payload: MfaSetupRequest) => {
    return api.post('/web/2fa/setup', payload);
}

export const verify2FA = (payload: MfaVerifyRequest) => {
    return api.post('/web/2fa/verify', payload);
}

export const getCards = () => {
    return api.get('/cards')
}

export const getTypeDebits = () => {
    return api.get('/cards/type-debits')
}