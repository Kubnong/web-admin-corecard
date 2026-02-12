<template>
  <div class="min-h-screen w-full bg-[#E2E9FF] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[5px] shadow-xl w-full max-w-[458px] relative overflow-hidden flex flex-col items-center pt-[33px] pb-10 px-8">
      <h1 class="text-black text-[16px] font-normal mb-10 text-center">Admin Login</h1>

      <form @submit.prevent="handleLoginFlow" class="w-full space-y-6">
        
        <div v-if="!showOtpInput">
            <div class="space-y-2 mb-4">
              <label class="block text-[14px] text-black pl-1">อีเมล</label>
              <input v-model="email" type="email" placeholder="admin@example.com"
                class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none" required />
            </div>
            <div class="space-y-2">
              <label class="block text-[14px] text-black pl-1">รหัสผ่าน</label>
              <input v-model="password" type="password" placeholder="*******"
                class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none" required />
            </div>
        </div>

        <div v-else class="space-y-4 animate-fade-in">
            <div class="text-center">
                <p class="text-sm text-gray-600 mb-2">กรุณากรอกรหัสยืนยัน 2 ขั้นตอน (2FA)</p>
                <input 
                  v-model="otpCode" 
                  type="text" 
                  maxlength="6"
                  placeholder="000000"
                  class="w-full text-center text-2xl tracking-[0.5em] h-14 rounded-[15px] border border-[#4F39F6] focus:outline-none"
                  autofocus
                />
            </div>
            <button type="button" @click="showOtpInput = false" class="text-sm text-gray-500 hover:text-blue-600 w-full text-center">
                กลับไปแก้ไขอีเมล/รหัสผ่าน
            </button>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading" 
          class="w-full h-[49px] bg-[#4F39F6] text-white text-[20px] font-bold rounded-[15px] hover:bg-[#3d2bd6] transition-colors mt-8 disabled:bg-gray-400">
          {{ isLoading ? 'กำลังตรวจสอบ...' : (showOtpInput ? 'ยืนยันรหัส OTP' : 'เข้าสู่ระบบ') }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authorize, getToken } from '@/services/webAdminService';
import { generateCodeVerifier, generateCodeChallenge, randomString } from '@/utils/security'; // เช็คชื่อไฟล์ utils ดีๆ นะครับ

const router = useRouter();
const email = ref('');
const password = ref('');
const otpCode = ref(''); // เพิ่มตัวแปรเก็บ OTP
const showOtpInput = ref(false); // เพิ่มตัวแปรคุมการแสดงผล
const isLoading = ref(false);
const errorMessage = ref('');

// เก็บ PKCE ไว้ใช้ต่อเนื่อง (เพราะต้องใช้ code_verifier เดิมตอนแลก Token)
let codeVerifier = '';

const handleLoginFlow = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        // สร้าง PKCE ใหม่เฉพาะตอนเริ่ม Flow แรก (ยังไม่มี OTP)
        codeVerifier = generateCodeVerifier();
        
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = randomString(16);
        const nonce = randomString(16);

        // Prepare Payload
        const payload: any = {
            email: email.value,
            password: password.value,
            code_challenge: codeChallenge,
            state: state,
            nonce: nonce
        };

        // ถ้ามี OTP ให้แนบไปด้วย (รอบที่ 2)
        if (showOtpInput.value && otpCode.value) {
            payload.totp_code = parseInt(otpCode.value);
        }

        const authResponse = await authorize(payload);
        
        const authCode = authResponse.data.auth_code;

        if (!authCode) {
            throw new Error("ไม่ได้รับ Authorization Code");
        }

        // --- STEP 2: Exchange Token ---
        const tokenResponse = await getToken({
            auth_code: authCode,
            code_verify: codeVerifier
        });

        const { access_token, id_token } = tokenResponse.data;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('idToken', id_token);
        
        console.log('Login Success!');
        router.push('/debit-manage'); 

    } catch (error: any) {
        console.error('Login Failed:', error);
        const errorData = error.response?.data;

        // 🟢 Case 1: ยังไม่เคยทำ 2FA -> ไปหน้า Setup
        if (errorData?.error === 'mfa_setup_required') {
             sessionStorage.setItem('temp_token', errorData.temp_token);
             router.push('/setup2fa'); 
             return;
        } 
        
        // 🟡 Case 2: ต้องกรอก OTP -> เปิดช่องกรอก
        else if (errorData?.error === 'totp_required') {
             showOtpInput.value = true;
             errorMessage.value = ''; // เคลียร์ Error เดิม (ถ้ามี)
             otpCode.value = ''; // เคลียร์ช่องให้พร้อมกรอก
        } 
        
        // 🔴 Case 3: Error จริงๆ (รหัสผิด / OTP ผิด)
        else {
             errorMessage.value = errorData?.message || 'เข้าสู่ระบบไม่สำเร็จ';
             if (showOtpInput.value) {
                 otpCode.value = ''; // ถ้า OTP ผิด ให้ลบรอพิมพ์ใหม่
             }
        }
    } finally {
        isLoading.value = false;
    }
}
</script>