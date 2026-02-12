<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>

    <div class="relative z-10 w-full max-w-lg p-6">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-2">ตั้งค่าความปลอดภัย 2 ขั้นตอน</h2>
        <p class="text-blue-200 text-sm mb-6">สแกน QR Code ด้วยแอป Google Authenticator</p>

        <div v-if="isLoadingQR" class="flex justify-center py-8">
            <ArrowPathIcon class="animate-spin h-8 w-8 text-white" />
        </div>

        <div v-else-if="qrCodeUrl" class="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg">
            <img :src="`data:image/png;base64,${qrCodeUrl}`" alt="2FA QR Code" class="w-48 h-48 mx-auto" />
        </div>
        
        <div v-if="secretKey" class="mb-6 bg-black/20 p-3 rounded-lg border border-white/10">
            <p class="text-xs text-gray-400 mb-1">หรือกรอกรหัสนี้ด้วยตนเอง:</p>
            <code class="text-blue-300 font-mono tracking-wider select-all">{{ secretKey }}</code>
        </div>

        <form @submit.prevent="handleVerifySetup" class="space-y-4">
            <input 
              v-model="otpCode" 
              type="text" 
              placeholder="กรอกรหัส 6 หลักจากแอป" 
              maxlength="6"
              class="w-full text-center text-xl tracking-[0.5em] bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-400"
            />
            
            <div v-if="errorMessage" class="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                {{ errorMessage }}
            </div>

            <button type="submit" :disabled="isVerifying || otpCode.length !== 6"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
              {{ isVerifying ? 'กำลังยืนยัน...' : 'ยืนยันและเปิดใช้งาน' }}
            </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setup2FA, verify2FA } from '@/services/webAdminService'; // ต้องไปเพิ่ม service นี้

const router = useRouter();
const qrCodeUrl = ref('');
const secretKey = ref('');
const otpCode = ref('');
const isLoadingQR = ref(true);
const isVerifying = ref(false);
const errorMessage = ref('');
const tempToken = sessionStorage.getItem('temp_token'); // รับค่าจากหน้า Login

onMounted(async () => {
    if (!tempToken) {
        alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
        router.replace('/login');
        return;
    }

    try {
        // ยิง API ไปขอ QR Code
        const response = await setup2FA({ temp_token: tempToken });
        console.log(response.data.qr_code)
        qrCodeUrl.value = response.data.qr_code;
        secretKey.value = response.data.secret;
    } catch (error) {
        console.error('Failed to load QR:', error);
        errorMessage.value = 'ไม่สามารถโหลด QR Code ได้';
    } finally {
        isLoadingQR.value = false;
    }
});

const handleVerifySetup = async () => {
    isVerifying.value = true;
    errorMessage.value = '';

    try {
        // ยิง API ยืนยันว่า Setup สำเร็จ
        await verify2FA({
            temp_token: tempToken!,
            totp_code: parseInt(otpCode.value)
        });

        alert('ตั้งค่า 2FA สำเร็จ! กรุณาเข้าสู่ระบบอีกครั้ง');
        sessionStorage.removeItem('temp_token'); // เคลียร์ token ชั่วคราว
        router.replace('/login'); // กลับไปหน้า Login เพื่อเริ่ม Flow จริง

    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'รหัส OTP ไม่ถูกต้อง';
    } finally {
        isVerifying.value = false;
    }
};
</script>