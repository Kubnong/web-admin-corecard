<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900">Client not found</h3>
        <button @click="router.back()" class="mt-4 text-indigo-600 hover:text-indigo-800">Go Back</button>
      </div>

      <div v-else class="max-w-5xl mx-auto space-y-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ client?.client_name }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-gray-500">Client ID:</span>
              <span class="font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-700 text-sm">
                {{ client?.client_id }}
              </span>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium capitalize bg-green-100 text-green-800">
            {{ client?.status }}
          </span>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">General Information</h2>
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

        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 class="text-lg font-medium text-gray-900">mTLS Certificates</h2>
            </div>
            <button @click="openModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              Upload CSR
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Environment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject DN</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="certificates.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">No active certificates found.</td>
                </tr>
                <tr v-for="cert in certificates" :key="cert.id">
                  <td class="px-6 py-4">{{ cert.environment }}</td>
                  <td class="px-6 py-4 text-xs font-mono">{{ cert.subject_dn }}</td>
                  <td class="px-6 py-4">{{ formatDate(cert.valid_to) }}</td>
                  <td class="px-6 py-4">{{ cert.status }}</td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-indigo-600 hover:text-indigo-900">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div class="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Upload CSR</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">✕</button>
          </div>
          
          <form @submit.prevent="submitUpload" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CSR File</label>
              <input type="file" accept=".csr" @change="onFileChange" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>

            <div v-if="selectedFile" class="bg-gray-50 p-4 rounded-lg border">
                <h4 class="text-sm font-semibold mb-2">Validation Results:</h4>
                <ul class="space-y-1 text-sm">
                    <li :class="validation.format ? 'text-green-600' : 'text-red-600'">
                        {{ validation.format ? '✅ Valid CSR Format' : '❌ Invalid Format' }}
                    </li>
                    <li :class="validation.cn ? 'text-green-600' : 'text-red-600'">
                        {{ validation.cn ? '✅ CN Contains Client ID' : '❌ CN Mismatch' }}
                    </li>
                    <li :class="validation.org ? 'text-green-600' : 'text-red-600'">
                        {{ validation.org ? '✅ Organization (O) Matches' : '❌ Organization (O) Mismatch' }}
                    </li>
                    <li :class="validation.ou ? 'text-green-600' : 'text-red-600'">
                        {{ validation.ou ? '✅ Organization Unit (OU) Matches Client Name' : '❌ Organization Unit (OU) Mismatch' }}
                    </li>
                </ul>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select v-model="env" class="block w-full px-3 py-2 border rounded-md">
                <option value="MTF">Sandbox (MTF)</option>
                <option value="PROD">Production</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 border rounded-lg">Cancel</button>
              <button type="submit" :disabled="!canSubmit || isUploading" class="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                {{ isUploading ? 'Uploading...' : 'Confirm' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import { getClientById, uploadCsr } from '@/services/webAdminService';
import forge from 'node-forge';

const route = useRoute();
const router = useRouter();

const client = ref<any>(null);
const certificates = ref<any[]>([]);
const loading = ref(true);
const error = ref(false);

const showModal = ref(false);
const selectedFile = ref<File | null>(null);
const env = ref('MTF');
const isUploading = ref(false);

const validation = ref({
  format: false,
  cn: false,
  org: false,
  ou: false
});

const fetchData = async () => {
  const client_id = history.state.client_id || route.params.id;
  
  if (!client_id) {
    error.value = true;
    loading.value = false;
    return;
  }
  
  try {
    const res = await getClientById({ client_id: client_id });
    client.value = res.data;
    certificates.value = [];
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  selectedFile.value = file;

  validation.value = { format: false, cn: false, org: false, ou: false };

  try {
    const text = await file.text();
    const csr = forge.pki.certificationRequestFromPem(text);
    validation.value.format = true;

    const attrs = csr.subject.attributes;
    
    const cnVal = attrs.find((a: any) => a.shortName === 'CN' || a.name === 'commonName')?.value as string;
    const oVal = attrs.find((a: any) => a.shortName === 'O' || a.name === 'organizationName')?.value as string;
    const ouVal = attrs.find((a: any) => a.shortName === 'OU' || a.name === 'organizationalUnitName')?.value as string;

    if (client.value) {
      // 1. Check CN contains Client ID
      if (cnVal && cnVal.includes(client.value.client_id)) {
        validation.value.cn = true;
      }

      // 2. Check Organization (O) matches DB organization_name
      if (oVal && oVal === client.value.client_name) {
        validation.value.org = true;
      }

      // 3. Check Org Unit (OU) matches DB client_name
      if (ouVal && ouVal === client.value.organization_name) {
        validation.value.ou = true;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const canSubmit = computed(() => {
  return selectedFile.value && 
         validation.value.format && 
         validation.value.cn && 
         validation.value.org &&
         validation.value.ou;
});

const submitUpload = async () => {
  if (!canSubmit.value || !client.value) return;
  isUploading.value = true;

  try {
    // เตรียมข้อมูลในรูปแบบ FormData
    const formData = new FormData();
    formData.append('file', selectedFile.value as File);
    formData.append('environment', env.value);
    // ใช้ clientId เพื่อให้สอดคล้องกับ DTO ของ Java
    formData.append('clientId', client.value.client_id); 

    // ยิง API ผ่าน Service ที่ export ไว้
    await uploadCsr(formData); 
    
    alert('Certificate Issued Successfully');
    closeModal();
    fetchData(); // รีเฟรชข้อมูลในหน้าจอ
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Failed to upload CSR';
    alert(msg);
  } finally {
    isUploading.value = false;
  }
};

const openModal = () => {
  showModal.value = true;
  selectedFile.value = null;
  validation.value = { format: false, cn: false, org: false, ou: false };
};

const closeModal = () => showModal.value = false;

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('th-TH');
};

onMounted(() => fetchData());
</script>