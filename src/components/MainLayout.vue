<template>
  <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300"
    >
      <div class="p-6 text-xl font-bold flex items-center gap-2">
        Admin Dashboard
      </div>

      <nav class="flex-1 mt-4">
        <ul>
          <li class="mb-1">
            <router-link
              to="/client-manage"
              :class="[
                'flex items-center gap-3 px-6 py-4 transition-colors',
                isActive('/client-manage')
                  ? 'bg-gray-800 text-white border-l-4 border-red-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Client Management
            </router-link>
          </li>

          <li class="mb-1">
            <router-link
              to="/debit-manage"
              :class="[
                'flex items-center gap-3 px-6 py-4 transition-colors',
                isActive('/debit-manage')
                  ? 'bg-gray-800 text-white border-l-4 border-red-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Debit Management
            </router-link>
          </li>

          <li class="mb-1">
            <router-link
              to="/debit-type-manage"
              :class="[
                'flex items-center gap-3 px-6 py-4 transition-colors',
                isActive('/debit-type-manage')
                  ? 'bg-gray-800 text-white border-l-4 border-red-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Debit Card Types
            </router-link>
          </li>

          <li class="mb-1">
            <router-link
              to="/setting"
              :class="[
                'flex items-center gap-3 px-6 py-4 transition-colors',
                isActive('/setting')
                  ? 'bg-gray-800 text-white border-l-4 border-red-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Setting
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">

      <!-- Content Slot -->
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};

const handleLogout = () => {
  // Add logout logic here
  router.push("/login");
};
</script>

<style scoped>
/* Optional: Add smooth transitions */
main {
  transition: all 0.2s ease;
}
</style>
