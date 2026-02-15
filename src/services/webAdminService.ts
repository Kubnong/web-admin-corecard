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

interface MfaSetupRequest {
    temp_token: string;
}

interface MfaVerifyRequest {
    temp_token: string;
    totp_code: number;
}

interface cardIdRequest {
    card_id : string;
}

interface AddDebitTypeRequest {
    type_debit_image: string;
    type_debit_name: string;
    type_debit_description: string;
    can_physical: boolean;
    entrance_fee: number;
    annual_fee: number;
    min_limit: number;
    default_limit: number;
    max_limit: number;
    expiry_year: number;
    // images: string[]; // base64 strings (without data:image prefix)
}
interface ChangePasswordRequest {
    email: string;
    old_password: string;
    new_password: string;
}
interface ForgotPasswordRequest {
    email: string;
}
interface VerifyOtpRequest {
    otp: string;
    ref_code: string;
}
interface ResetPasswordRequest {
    otp: string;
    ref_code: string;
    new_password: string;
}

interface TypeDebitIdRequest {
    type_debit_id: string;
}

interface SearchCustomerRequest {
    first_name?: string;
    last_name?: string;
}

interface CreateClientRequest {
    client_name: string;
    organization_name: string;
    description?: string;
}
interface ClientIdRequest {
    client_id: string;
}

export const authorize = (payload: AuthorizeRequest) => {
    return api.post('/web/authorize', payload) // ตรงกับ @PostMapping("/authorize")
}

export const getToken = (payload: TokenRequest) => {
    return api.post('/web/token', payload) // ตรงกับ @PostMapping("/token")
}

export const setup2FA = (payload: MfaSetupRequest) => {
    return api.post('/web/2fa/setup', payload);
}

export const verify2FA = (payload: MfaVerifyRequest) => {
    return api.post('/web/2fa/verify', payload);
}

export const getCards = () => {
    return api.get('/cards')
}

export const getDetailCard = (payload: cardIdRequest) => {
    return api.post('/cards/detail', payload)
}

export const getTypeDebits = () => {
    return api.get('/cards/type-debits')
}

export const getHistoryLogs = (payload: cardIdRequest) => {
    return api.post('/web/history-logs', payload)
}

export const addTypeDebit = (payload: AddDebitTypeRequest) => {
    return api.post('/cards/type-debits', payload)
}

export const changePassword = (payload: ChangePasswordRequest) => {
    return api.put('/web/change-password', payload)
}

export const sendOTP = (payload: ForgotPasswordRequest) => {
    return api.post('/web/send-otp', payload, {timeout: 30000})
}

export const verifyOTP = (payload: VerifyOtpRequest) => {
    return api.post('/web/verify-otp', payload)
}

export const resetPassword = (payload: ResetPasswordRequest) => {
    return api.post('/web/reset-password', payload)
}

export const updateDebitType = (payload: AddDebitTypeRequest) => {
  return api.put('/cards/type-debits/detail', payload);
};

export const getTypeDebitById = (payload: TypeDebitIdRequest) => {
    return api.post('/cards/type-debits/detail', payload);
}

export const searchCustomer = (payload: SearchCustomerRequest) => {
    return api.post('/web/search-user', payload);
}

export const getClients = () => {
    return api.get('/web/clients');
};

export const createClient = (payload: CreateClientRequest) => {
    return api.post('/web/add-client', payload);
};

export const getClientById = (clientId: ClientIdRequest) => {
    return api.get(`/api/v1/clients/${clientId}`);
};
