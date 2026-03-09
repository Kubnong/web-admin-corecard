<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50">
      <div class="p-8">

        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">Physical Card Tracking</h1>
            <p class="text-sm text-gray-500">จัดการสถานะการจัดส่งบัตรเดบิต Physical</p>
          </div>
          <!-- Summary Badges -->
          <div class="flex gap-3">
            <span class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Pending: {{ countByStatus('pending') }}
            </span>
            <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              In Transit: {{ countByStatus('in_transit') }}
            </span>
            <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Success: {{ countByStatus('success') }}
            </span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 items-center">
          <div class="flex-1 relative">
            <input
              v-model="searchText"
              type="text"
              placeholder="ค้นหาด้วย Card ID หรือ ที่อยู่..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
          >
            <option value="">ทุกสถานะ</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="success">Success</option>
          </select>
          <button
            @click="fetchTrackingData"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            รีเฟรช
          </button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else-if="filteredData.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p class="text-lg font-medium">ไม่พบข้อมูลการติดตาม</p>
          </div>

          <table v-else class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tracking ID</th>
                <!-- <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Card ID</th> -->
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">ที่อยู่จัดส่ง</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">จังหวัด</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">รหัสไปรษณีย์</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">เปลี่ยนสถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in filteredData" :key="item.trackingId" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-gray-500">{{ item.trackingId.substring(0, 8) }}...</span>
                </td>
                <!-- <td class="px-6 py-4">
                  <span class="font-mono text-xs text-gray-700">{{ item.cardId.substring(0, 8) }}...</span>
                </td> -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-800">{{ item.address }}</div>
                  <div class="text-xs text-gray-400">{{ item.district }}, {{ item.amphoe }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ item.province }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ item.zipcode }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClass(item.deliveryStatus)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                    {{ getStatusLabel(item.deliveryStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <select
                    v-model="item.deliveryStatus"
                    @change="handleStatusChange(item)"
                    :disabled="item.deliveryStatus === 'success' || updatingId === item.trackingId"
                    class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="success">Success</option>
                  </select>
                  <div v-if="updatingId === item.trackingId" class="flex justify-center mt-1">
                    <svg class="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toast.show"
        :class="['fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 z-50',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']"
      >
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </transition>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/components/MainLayout.vue';
import { getAllTrackingStatus, updateTrackingStatus } from '@/services/webAdminService';

interface TrackingItem {
  trackingId: string;
  cardId: string;
  address: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  deliveryStatus: string;
}

const trackingList = ref<TrackingItem[]>([]);
const isLoading = ref(false);
const updatingId = ref<string | null>(null);
const searchText = ref('');
const filterStatus = ref('');

const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const fetchTrackingData = async () => {
  isLoading.value = true;
  try {
    const response = await getAllTrackingStatus();
    trackingList.value = response.data;
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleStatusChange = async (item: TrackingItem) => {
  updatingId.value = item.trackingId;
  try {
    await updateTrackingStatus({
      card_id: item.cardId,
      delivery_status: item.deliveryStatus
    });
    showToast(`อัปเดตสถานะเป็น "${getStatusLabel(item.deliveryStatus)}" สำเร็จ`);
  } catch (error: any) {
    console.error('Error updating status:', error);
    showToast(error.response?.data?.message || 'อัปเดตสถานะไม่สำเร็จ', 'error');
    // revert by refetch
    await fetchTrackingData();
  } finally {
    updatingId.value = null;
  }
};

const filteredData = computed(() => {
  return trackingList.value.filter(item => {
    const matchSearch = !searchText.value ||
      item.cardId.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.trackingId.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      item.province?.toLowerCase().includes(searchText.value.toLowerCase());
    const matchStatus = !filterStatus.value || item.deliveryStatus === filterStatus.value;
    return matchSearch && matchStatus;
  });
});

const countByStatus = (status: string) =>
  trackingList.value.filter(i => i.deliveryStatus === status).length;

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    success: 'Delivered'
  };
  return map[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

onMounted(() => fetchTrackingData());
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>