<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Client not found</h3>
        <button @click="router.back()" class="mt-4 text-indigo-600 hover:text-indigo-800">Go Back</button>
      </div>

      <div v-else class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ client?.client_name }}</h1>
            <p class="text-gray-500 mt-1">Client ID: <span class="font-mono bg-gray-100 px-2 py-0.5 rounded">{{ client?.client_id }}</span></p>
          </div>
          <span 
            :class="client?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            class="px-3 py-1 rounded-full text-sm font-medium capitalize"
          >
            {{ client?.status }}
          </span>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">General Information</h2>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Company Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ client?.organization_name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(client?.created_at) }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ client?.description || '-' }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white shadow rounded-lg p-6 opacity-50">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Certificates & Keys</h2>
          <p class="text-gray-500">ส่วนจัดการ Certificate (mTLS) และ Keys (JWS) จะเพิ่มใน Phase ถัดไป</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import { getClientById } from '@/services/webAdminService';

const route = useRoute();
const router = useRouter();

// ใช้ Interface เดียวกับหน้า List
interface Client {
  client_id: string;
  client_name: string;
  organization_name: string;
  description?: string;
  status: string;
  created_at: string;
}

const client = ref<Client | null>(null);
const loading = ref(true);
const error = ref(false);

const fetchClientDetail = async () => {
  const clientId = history.state.client_id
  if (!clientId) return;

  try {
    const response = await getClientById({ client_id: clientId });
    client.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchClientDetail();
});
</script>