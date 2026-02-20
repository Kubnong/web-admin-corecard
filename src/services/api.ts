import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const apiEndpoint = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL : apiEndpoint,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// --- ตัวแปรสำหรับระบบ Lock ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

// ฟังก์ชันสำหรับจัดการ Request ที่ค้างอยู่
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 🟢 เพิ่มโค้ดบรรทัดนี้: ตรวจสอบว่าเป็น API ที่เกี่ยวกับการ Login หรือ Auth หรือไม่
        const isAuthPath = originalRequest.url?.includes('/web/auth/authorize') || 
                           originalRequest.url?.includes('/web/auth/token') || 
                           originalRequest.url?.includes('/web/auth/refresh') || 
                           originalRequest.url?.includes('/web/auth/2fa/');

        // 🟢 แก้ไขเงื่อนไข: เพิ่ม !isAuthPath เข้าไป เพื่อบอกว่า "ถ้าเป็นหน้า Login ห้ามทำ Refresh Token เด็ดขาด!"
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !isAuthPath && originalRequest && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token available");

                console.log("Attempting Refresh Token...");

                const response = await axios.post(`${apiEndpoint}/web/auth/refresh`, {
                    refresh_token: refreshToken
                });

                const newToken = response.data.access_token; 

                if (newToken) {
                    localStorage.setItem('accessToken', newToken);
                    
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    processQueue(null, newToken);
                    
                    return api(originalRequest);
                } else {
                    throw new Error("No access token in response");
                }

            } catch (err) {
                console.error("Refresh failed:", err);
                const axiosError = err as AxiosError;
                processQueue(axiosError, null);
                
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // 🟢 ถ้าเป็น Error จากหน้า Login (เช่น totp_required หรือ รหัสผิด) มันจะหลุดมาตรงนี้
        // และคืนค่า Error กลับไปให้ Login.vue จัดการเปิดหน้าต่าง OTP ต่อได้ทันที
        return Promise.reject(error);
    }
);


export default api;