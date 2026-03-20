import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { generateKeyPair, exportJWK, compactDecrypt, importSPKI, CompactEncrypt } from 'jose'

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean
        _privateKey?: CryptoKey  
    }
}

const apiEndpoint = import.meta.env.VITE_API_BASE_URL

let sessionKeys: { publicKeyJwk: string; privateKey: CryptoKey } | null = null

const getSessionKeys = async () => {
    if (sessionKeys) return sessionKeys
    const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256', { modulusLength: 2048 })
    sessionKeys = { publicKeyJwk: JSON.stringify(await exportJWK(publicKey)), privateKey }
    return sessionKeys
}

let backendPublicKey: CryptoKey | null = null

const getBackendPublicKey = async (): Promise<CryptoKey> => {
    if (backendPublicKey) return backendPublicKey
    const rawKey = (import.meta.env.VITE_BACKEND_PUBLIC_KEY as string)
        .replace(/\\n/g, '\n').trim()
    backendPublicKey = await importSPKI(rawKey, 'RSA-OAEP-256')
    return backendPublicKey
}

const isAuthPath = (url?: string) =>
    ['/web/auth/authorize', '/web/auth/token', '/web/auth/refresh',
     '/web/auth/2fa/', '/web/auth/send-otp', '/web/auth/verify-otp',
     '/web/auth/reset-password']
    .some(p => url?.includes(p))

const api = axios.create({
    baseURL: apiEndpoint,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`

    const keys = await getSessionKeys()
    config.headers['X-Client-Public-Key'] = keys.publicKeyJwk
    config._privateKey = keys.privateKey

    if (config.data) {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            return config;
        } 
        
        const backendKey = await getBackendPublicKey()
        const jwe = await new CompactEncrypt(
            new TextEncoder().encode(JSON.stringify(config.data))
        )
            .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
            .encrypt(backendKey)

        config.data = jwe
        config.headers['Content-Type'] = 'text/plain'
    }

    return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v?: unknown) => void; reject: (r?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
    failedQueue = []
}

api.interceptors.response.use(
    async (response: AxiosResponse) => {
        const config = response.config as InternalAxiosRequestConfig

        if (config._privateKey && typeof response.data === 'string' && response.data.startsWith('eyJ')) {
            try {
                const { plaintext } = await compactDecrypt(response.data, config._privateKey)
                response.data = JSON.parse(new TextDecoder().decode(plaintext))
            } catch (e) {
                return Promise.reject(new Error('Response decryption failed'))
            }
        }
        return response
    },

    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig

        if (error.response && originalRequest._privateKey && typeof error.response.data === 'string' && error.response.data.startsWith('eyJ')) {
            try {
                const { plaintext } = await compactDecrypt(error.response.data, originalRequest._privateKey)
                error.response.data = JSON.parse(new TextDecoder().decode(plaintext))
            } catch (decryptionError) {
                console.error('Error response decryption failed:', decryptionError)
            }
        }

        if (
            error.response &&
            [401, 403].includes(error.response.status) &&
            !isAuthPath(originalRequest.url) &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return api(originalRequest)
                    })
                    .catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) throw new Error('No refresh token')

                const res = await api.post('/web/auth/refresh', {
                    refresh_token: refreshToken,
                })
                const newToken = res.data.access_token
                if (!newToken) throw new Error('No access token in response')

                localStorage.setItem('accessToken', newToken)
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`
                originalRequest.headers.Authorization = `Bearer ${newToken}`

                processQueue(null, newToken)
                return api(originalRequest)

            } catch (err) {
                processQueue(err)
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api