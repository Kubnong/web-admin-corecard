<template>
  <MainLayout>
    <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <!-- Top Bar -->
        <!-- Settings Content -->
        <div class="max-w-2xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-900 mb-8">Setting</h1>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              เปลี่ยนรหัสผ่าน
            </h2>

            <form @submit.prevent="handleChangePassword" class="space-y-6">
              <!-- Email (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Email</label
                >
                <input
                  v-model="formData.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <!-- Old Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Old Password</label
                >
                <div class="relative">
                  <input
                    v-model="formData.oldPassword"
                    :type="showOldPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                    placeholder="กรอกรหัสผ่านเก่า"
                  />
                  <button
                    type="button"
                    @click="showOldPassword = !showOldPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      v-if="!showOldPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >New Password</label
                >
                <div class="relative">
                  <input
                    v-model="formData.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                    placeholder="กรอกรหัสผ่านใหม่"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      v-if="!showNewPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                </p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Confirm Password</label
                >
                <div class="relative">
                  <input
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      v-if="!showConfirmPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>

              <!-- Success Message -->
              <div
                v-if="successMessage"
                class="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p class="text-sm text-green-600">{{ successMessage }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  @click="handleCancel"
                  class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{ isSubmitting ? "กำลังบันทึก..." : "Confirm" }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { changePassword } from "@/services/webAdminService";
import MainLayout from "@/components/MainLayout.vue";

const router = useRouter();

interface ChangePasswordForm {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const formData = ref<ChangePasswordForm>({
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Decode JWT to get email
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      throw new Error("Invalid token format");
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Load email from id_token
onMounted(() => {
  const idToken = localStorage.getItem("idToken");
  console.log(idToken);

  if (!idToken) {
    alert("กรุณาเข้าสู่ระบบใหม่");
    router.push("/login");
    return;
  }

  const decoded = decodeJWT(idToken);
  console.log(decoded);

  if (decoded && decoded.email) {
    formData.value.email = decoded.email;
  } else {
    alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาเข้าสู่ระบบใหม่");
    router.push("/login");
  }
});

const handleChangePassword = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Validate passwords match
    if (formData.value.newPassword !== formData.value.confirmPassword) {
      throw new Error("รหัสผ่านใหม่ไม่ตรงกัน");
    }

    // Validate password length
    if (formData.value.newPassword.length < 8) {
      throw new Error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    }

    // Validate old password is different from new password
    if (formData.value.oldPassword === formData.value.newPassword) {
      throw new Error("รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านเก่า");
    }

    // Prepare payload
    const payload = {
      email: formData.value.email,
      old_password: formData.value.oldPassword,
      new_password: formData.value.newPassword,
    };

    await changePassword(payload);

    successMessage.value = "เปลี่ยนรหัสผ่านสำเร็จ! กำลังออกจากระบบ...";

    // Clear form
    formData.value.oldPassword = "";
    formData.value.newPassword = "";
    formData.value.confirmPassword = "";

    // Logout after 2 seconds
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");
      router.push("/login");
    }, 2000);
  } catch (error: any) {
    console.error("Error changing password:", error);
    errorMessage.value =
      error.message ||
      error.response?.data?.message ||
      "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  formData.value.oldPassword = "";
  formData.value.newPassword = "";
  formData.value.confirmPassword = "";
  errorMessage.value = "";
  successMessage.value = "";
};


</script>

<style scoped>
/* Optional: Add smooth transitions */
input,
button {
  transition: all 0.2s ease;
}

input:focus {
  transform: translateY(-1px);
}
</style>
