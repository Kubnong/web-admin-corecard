<template>
    <div class="min-h-screen bg-slate-50 text-slate-800">
        <header class="bg-white border-b">
            <div class="max-w-6xl mx-auto flex items-center justify-between p-4">
                <h1 class="text-lg font-semibold">Web Admin Corecard</h1>
                <nav class="flex items-center gap-3">
                    <router-link to="/login" class="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Login</router-link>
                    <button @click="goLogin" class="px-3 py-2 rounded-md border text-sm">Go to Login</button>
                </nav>
            </div>
        </header>

        <main class="max-w-6xl mx-auto p-6">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goLogin = () => router.push('/login')
</script>
