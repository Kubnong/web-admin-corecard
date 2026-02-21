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

interface RefreshTokenRequest {
    refresh_token: string;
}

interface UpdateTrackingStatusRequest {
    card_id: string;
    delivery_status: string;
}

export const authorize = (payload: AuthorizeRequest) => {
    return api.post('/web/auth/authorize', payload) // ตรงกับ @PostMapping("/authorize")
}

export const getToken = (payload: TokenRequest) => {
    return api.post('/web/auth/token', payload) // ตรงกับ @PostMapping("/token")
}

export const setup2FA = (payload: MfaSetupRequest) => {
    return api.post('/web/auth/2fa/setup', payload);
}

export const verify2FA = (payload: MfaVerifyRequest) => {
    return api.post('/web/auth/2fa/verify', payload);
}

export const getCards = () => {
    return api.get('/cards')
}

export const getDetailCard = (payload: cardIdRequest) => {
    return api.post('/cards/detail', payload)
}

export const getTypeDebits = () => {
    return api.get('/cards/type-debits?image_size=image_large')
}

export const getHistoryLogs = (payload: cardIdRequest) => {
    return api.post('/web/history-logs', payload)
}

export const addTypeDebit = (payload: FormData) => {
    return api.post('/cards/type-debits', payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const changePassword = (payload: ChangePasswordRequest) => {
    return api.put('/web/change-password', payload)
}

export const sendOTP = (payload: ForgotPasswordRequest) => {
    return api.post('/web/auth/send-otp', payload, {timeout: 30000})
}

export const verifyOTP = (payload: VerifyOtpRequest) => {
    return api.post('/web/auth/verify-otp', payload)
}

export const resetPassword = (payload: ResetPasswordRequest) => {
    return api.post('/web/auth/reset-password', payload)
}

export const updateDebitType = (payload: AddDebitTypeRequest) => {
  return api.put('/cards/type-debits/detail', payload);
};

export const getTypeDebitById = (payload: TypeDebitIdRequest) => {
    return api.post('/cards/type-debits/detail?image_size=all', payload);
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

export const getClientById = (payload: ClientIdRequest) => {
    return api.post('/web/client/detail', payload);
};

export const uploadCsr = (formData: FormData) => {
    return api.post('/web/client/add-certificate', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
};

export const getClientCertificateById = (payload: ClientIdRequest) => {
    return api.post('/web/client-certificate/detail', payload);
};

export const refreshAccessToken = (payload: RefreshTokenRequest) => {
    return api.post('/web/auth/refresh', payload); 
};

export const getAllTrackingStatus = () => {
    return api.get('/cards/tracking-status');
};

export const updateTrackingStatus = (payload: UpdateTrackingStatusRequest) => {
    return api.post('/cards/tracking-status', payload);
};