<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="p-8">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
          </div>
          <button 
            @click="showCreateModal = true"
            class="text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Client
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client ID</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Name</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>    
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr 
                  v-for="client in clients" 
                  :key="client.client_id"
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="viewClientDetail(client.client_id)"
                >
                  <td class="px-6 py-4">
                    <p class="font-medium">{{ client.client_id }}</p>
                  </td>
                  <td class="px-6 py-4 text-gray-900">
                    {{ client.organization_name }}
                  </td>
                  <td class="px-6 py-4 font-mono text-sm text-gray-600 select-all">
                    {{ client.client_name }}
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-xs text-gray-500 truncate max-w-50">{{ client.description || '-' }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ formatDate(client.created_at) }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="w-2 h-2 rounded-full mr-1.5">{{ client.status }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      @click.stop="viewClientDetail(client.client_id)"
                      class="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr v-if="clients.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <p>No clients found. Click "Create New Client" to start.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
          <div class="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Create Client</h2>
            <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form @submit.prevent="handleCreateClient" class="p-8 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client Name <span class="text-red-500">*</span></label>
              <input v-model="formData.client_name" type="text" required placeholder="e.g., NovaPay iOS App" 
                     class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Company Name <span class="text-red-500">*</span></label>
              <input v-model="formData.organization_name" type="text" required placeholder="e.g., NovaPay Co., Ltd." 
                     class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <p class="text-xs text-gray-500 mt-1">Must match the Organization (O) in CSR.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="formData.description" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <div v-if="errorMessage" class="text-sm text-red-600 bg-red-50 p-3 rounded">
              {{ errorMessage }}
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeCreateModal" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                {{ isSubmitting ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import { getClients, createClient } from '@/services/webAdminService';

const router = useRouter();

// ✅ Interface ตรงกับ DTO ของ Java เป๊ะๆ
interface Client {
  client_id: string;
  client_name: string;
  organization_name: string;
  description?: string;
  status: string;
  created_at: string;
}

const clients = ref<Client[]>([]);
const showCreateModal = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const formData = ref({
  client_name: '',
  organization_name: '',
  description: '',
});

const fetchClients = async () => {
  try {
    const response = await getClients();
    clients.value = response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleCreateClient = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    await createClient(formData.value);
    showCreateModal.value = false;
    resetForm();
    await fetchClients(); // โหลดข้อมูลใหม่ทันที
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create client';
  } finally {
    isSubmitting.value = false;
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetForm();
  errorMessage.value = '';
};

const resetForm = () => {
  formData.value = { client_name: '', organization_name: '', description: '' };
};

const viewClientDetail = (clientId: string) => {
  router.push(`/client-detail/${clientId}`);
};

// ใช้แสดงวันที่แบบเรียบง่าย
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

onMounted(() => {
  fetchClients();
});
</script>