<template>
  <div class="min-h-screen w-full bg-[#E2E9FF] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[5px] shadow-xl w-full max-w-[458px] relative overflow-hidden flex flex-col items-center pt-[33px] pb-10 px-8">
      <h1 class="text-black text-[16px] font-normal mb-2 text-center">ลืมรหัสผ่าน</h1>
      
      <!-- Progress indicator -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
          currentStep >= 1 ? 'bg-[#4F39F6] text-white' : 'bg-gray-200 text-gray-500']">
          1
        </div>
        <div :class="['w-12 h-1 transition-colors', currentStep >= 2 ? 'bg-[#4F39F6]' : 'bg-gray-200']"></div>
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
          currentStep >= 2 ? 'bg-[#4F39F6] text-white' : 'bg-gray-200 text-gray-500']">
          2
        </div>
        <div :class="['w-12 h-1 transition-colors', currentStep >= 3 ? 'bg-[#4F39F6]' : 'bg-gray-200']"></div>
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
          currentStep >= 3 ? 'bg-[#4F39F6] text-white' : 'bg-gray-200 text-gray-500']">
          3
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="w-full space-y-6">
        
        <!-- Step 1: Enter Email -->
        <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
          <p class="text-sm text-gray-600 text-center mb-4">กรุณากรอกอีเมลของคุณเพื่อรับรหัส OTP</p>
          <div class="space-y-2">
            <label class="block text-[14px] text-black pl-1">อีเมล</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="admin@example.com"
              class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none" 
              required 
            />
          </div>
        </div>

        <!-- Step 2: Enter OTP -->
        <div v-else-if="currentStep === 2" class="space-y-4 animate-fade-in">
          <p class="text-sm text-gray-600 text-center mb-2">รหัส OTP ถูกส่งไปที่อีเมลของคุณแล้ว</p>
          <p class="text-xs text-gray-500 text-center mb-4">กรุณาตรวจสอบอีเมลและกรอกรหัส OTP พร้อม Ref Code</p>
          
          <!-- <div class="space-y-2">
            <label class="block text-[14px] text-black pl-1">Ref Code</label>
            <input 
              v-model="refCode" 
              type="text" 
              placeholder="XXXXXXXX"
              maxlength="8"
              class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none uppercase" 
              required 
            />
          </div> -->

          <div class="space-y-2">
            <label class="block text-[14px] text-black pl-1">รหัส OTP (6 หลัก)</label>
            <input 
              v-model="otp" 
              type="text" 
              maxlength="6"
              placeholder="000000"
              class="w-full text-center text-2xl tracking-[0.5em] h-14 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none"
              required
            />
          </div>

          <button 
            type="button" 
            @click="resendOTP" 
            :disabled="countdown > 0"
            class="text-sm w-full text-center transition-colors"
            :class="countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#4F39F6] hover:text-[#3d2bd6]'"
          >
            {{ countdown > 0 ? `ส่ง OTP อีกครั้งใน ${countdown} วินาที` : 'ส่ง OTP อีกครั้ง' }}
          </button>

          <button type="button" @click="backToStep1" class="text-sm text-gray-500 hover:text-blue-600 w-full text-center">
            กลับไปแก้ไขอีเมล
          </button>
        </div>

        <!-- Step 3: Enter New Password -->
        <div v-else-if="currentStep === 3" class="space-y-4 animate-fade-in">
          <p class="text-sm text-gray-600 text-center mb-4">ตั้งรหัสผ่านใหม่</p>
          
          <div class="space-y-2">
            <label class="block text-[14px] text-black pl-1">รหัสผ่านใหม่</label>
            <input 
              v-model="newPassword" 
              type="password" 
              placeholder="*******"
              class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none" 
              required 
            />
          </div>

          <div class="space-y-2">
            <label class="block text-[14px] text-black pl-1">ยืนยันรหัสผ่านใหม่</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="*******"
              class="w-full h-12 px-4 rounded-[15px] border border-[#858080] focus:border-[#4F39F6] outline-none" 
              required 
            />
          </div>

          <div v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="text-red-500 text-sm">
            รหัสผ่านไม่ตรงกัน
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading || (currentStep === 3 && newPassword !== confirmPassword)"
          class="w-full h-[49px] bg-[#4F39F6] text-white text-[20px] font-bold rounded-[15px] hover:bg-[#3d2bd6] transition-colors mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ getButtonText() }}
        </button>

        <!-- Back to Login -->
        <div class="text-center pt-4">
          <router-link to="/login" class="text-sm text-[#4F39F6] hover:text-[#3d2bd6] transition-colors">
            กลับไปหน้าเข้าสู่ระบบ
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { sendOTP, verifyOTP, resetPassword } from '@/services/webAdminService';

const router = useRouter();

// Form data
const email = ref('');
const otp = ref('');
const refCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// UI state
const currentStep = ref(1);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const countdown = ref(0);

let countdownInterval: number | null = null;

const getButtonText = () => {
  if (isLoading.value) return 'กำลังดำเนินการ...';
  
  switch (currentStep.value) {
    case 1: return 'ส่ง OTP';
    case 2: return 'ยืนยัน OTP';
    case 3: return 'รีเซ็ตรหัสผ่าน';
    default: return 'ดำเนินการต่อ';
  }
};

const startCountdown = () => {
  countdown.value = 60;
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (currentStep.value === 1) {
    await handleSendOTP();
  } else if (currentStep.value === 2) {
    await handleVerifyOTP();
  } else if (currentStep.value === 3) {
    await handleResetPassword();
  }
};

const handleSendOTP = async () => {
  isLoading.value = true;
  
  try {
    const response = await sendOTP({ email: email.value });
    
    successMessage.value = 'ส่ง OTP ไปยังอีเมลของคุณเรียบร้อยแล้ว';
    currentStep.value = 2;
    startCountdown();

    if (response.data.ref_code) {
      refCode.value = response.data.ref_code;
      console.log('Ref Code received:', refCode.value);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

  } catch (error: any) {
    console.error('Send OTP Failed:', error);
    console.log(error)
    errorMessage.value = error.response?.data?.message || 'ไม่พบอีเมลในระบบ';
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyOTP = async () => {
  isLoading.value = true;
  
  try {
    const response = await verifyOTP({
      otp: otp.value,
      ref_code: refCode.value
    });
    
    if (response.data.status === 'success') {
      successMessage.value = 'ยืนยัน OTP สำเร็จ';
      currentStep.value = 3;
      
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    }

  } catch (error: any) {
    console.error('Verify OTP Failed:', error);
    errorMessage.value = error.response?.data?.message || 'รหัส OTP หรือ Ref Code ไม่ถูกต้อง';
    otp.value = ''; // Clear OTP for retry
  } finally {
    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'รหัสผ่านไม่ตรงกัน';
    return;
  }

  isLoading.value = true;
  
  try {
    const response = await resetPassword({
      otp: otp.value,
      ref_code: refCode.value,
      new_password: newPassword.value
    });
    
    if (response.data.status === 'success') {
      successMessage.value = 'เปลี่ยนรหัสผ่านสำเร็จ กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...';
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  } catch (error: any) {
    console.error('Reset Password Failed:', error);
    const errorData = error.response?.data;
    errorMessage.value = errorData?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้';
    
    // If OTP expired or already used, go back to step 1
    if (errorData?.message?.includes('expired') || errorData?.message?.includes('already been used')) {
      setTimeout(() => {
        currentStep.value = 1;
        resetForm();
      }, 2000);
    }
  } finally {
    isLoading.value = false;
  }
};

const resendOTP = async () => {
  if (countdown.value > 0) return;
  
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    const response = await sendOTP({ email: email.value });
    
    if (response.data.ref_code) {
      refCode.value = response.data.ref_code;
      console.log('New Ref Code received:', refCode.value);
    }

    successMessage.value = 'ส่ง OTP ใหม่เรียบร้อยแล้ว';
    otp.value = '';
    refCode.value = '';
    startCountdown();
    
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'ไม่สามารถส่ง OTP ได้';
  } finally {
    isLoading.value = false;
  }
};

const backToStep1 = () => {
  currentStep.value = 1;
  otp.value = '';
  refCode.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdown.value = 0;
};

const resetForm = () => {
  email.value = '';
  otp.value = '';
  refCode.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdown.value = 0;
};

// Cleanup on component unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Remove number input arrows */
input[type="text"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  -moz-appearance: textfield;
}
</style>