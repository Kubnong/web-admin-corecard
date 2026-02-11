<template>
  <div class="min-h-screen w-full bg-[#E2E9FF] flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-[5px] shadow-xl w-full max-w-[458px] relative overflow-hidden flex flex-col items-center pt-[33px] pb-10 px-8">
      <div class="w-[78px] h-[78px] bg-[#4F39F6] rounded-full flex items-center justify-center mb-4 shadow-sm"></div>

      <h1 class="text-black text-[16px] font-normal mb-10 text-center">Admin Login</h1>

      <form @submit.prevent="handleSubmit" class="w-full space-y-6">
        <div class="space-y-2">
          <label class="block text-[14px] text-black pl-1">อีเมล</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              class="w-full h-12.25 pl-4 pr-4 rounded-[15px] border border-[#858080] text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#4F39F6] transition-colors"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-[14px] text-black pl-1">รหัสผ่าน</label>
          <div class="relative">
            <input
              v-model="password"
              type="password"
              placeholder="*******"
              class="w-full h-[49px] pl-4 pr-4 rounded-[15px] border border-[#858080] text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#4F39F6] transition-colors"
            />
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <a href="#" class="text-[#4F39F6] text-[16px] font-medium hover:underline">ลืมรหัสผ่าน?</a>
        </div>

        <button type="submit" class="w-full h-[49px] bg-[#4F39F6] text-white text-[20px] font-bold rounded-[15px] hover:bg-[#3d2bd6] transition-colors mt-8">เข้าสู่ระบบ</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('Login attempt', { email: email.value, password: password.value })
  // TODO: call auth service and navigate on success
}
</script>
