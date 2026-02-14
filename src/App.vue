<template>
    <div class="min-h-screen bg-slate-50 text-slate-800">
        <header class="bg-white border-b sticky top-0 z-50">
            <div class="w-full max-w-[1920px] mx-auto flex items-center justify-between p-4">
                <h1 class="text-lg font-semibold">Web Admin Corecard</h1>
                <nav class="flex items-center gap-3">
                    <div v-if="userEmail" class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-sm font-semibold text-gray-900">{{ userEmail }}</p>
                        </div>
                        <button 
                            @click="handleLogout"
                            class="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                    <router-link v-else to="/login" class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Login</router-link>
                </nav>
            </div>
        </header>

        <main class="w-full max-w-[1920px] mx-auto">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const userEmail = ref<string>('')

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

// Load email from idToken on mount
onMounted(() => {
  const idToken = localStorage.getItem("idToken");
  
  if (idToken) {
    const decoded = decodeJWT(idToken);
    if (decoded && decoded.email) {
      userEmail.value = decoded.email;
    }
  }
});

const handleLogout = () => {
  if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    userEmail.value = '';
    router.push("/login");
  }
};
</script>