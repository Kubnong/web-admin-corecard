<template>
  <MainLayout>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Debit Configuration</h2>
      <router-link
        to="/add-debit-type" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span class="text-lg">+</span>
        Create New
      </router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-semibold border-b">Card Image</th>
            <th class="px-6 py-4 font-semibold border-b">Card Name</th>
            <th class="px-6 py-4 font-semibold border-b">Description</th>
            <th class="px-6 py-4 font-semibold border-b">Limit (Max)</th>
            <th class="px-6 py-4 font-semibold border-b">Fee (Annual)</th>
            <th class="px-6 py-4 font-semibold border-b text-center">Status</th>
            <th class="px-6 py-4 font-semibold border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr
            v-for="typeDebit in typeDebits"
            :key="typeDebit.type_debit_id"
            class="hover:bg-gray-50 transition-colors border-b last:border-b-0"
          >
            <td class="px-6 py-3">
              <img
                v-if="typeDebit.type_debit_image"
                :src="typeDebit.type_debit_image"
                class="w-16 h-10 object-cover rounded-md shadow-sm"
                alt="Card Image"
              />
              <div
                v-else
                class="w-16 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md shadow-sm flex items-center justify-center text-white text-[10px] font-bold"
              >
                No Image
              </div>
            </td>

            <td class="px-6 py-3 font-medium text-gray-900">
              {{ typeDebit.type_debit_name }}
            </td>

            <td class="px-6 py-3 text-gray-500">
              {{ typeDebit.type_debit_description }}
            </td>

            <td class="px-6 py-3">
              {{ typeDebit.max_limit?.toLocaleString() }}
            </td>

            <td class="px-6 py-3">
              {{ typeDebit.annual_fee?.toLocaleString() }}
            </td>

            <td class="px-6 py-3 text-center">
              <span 
                :class="getStatusBadgeClass(typeDebit.status)"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ typeDebit.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td class="px-6 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="goToDebitTypeDetail(typeDebit.type_debit_id)"
                  class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md transition-colors"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="handleToggleStatus(typeDebit)"
                  :disabled="isTogglingStatus"
                  :class="typeDebit.status === 'active' 
                    ? 'text-red-600 hover:text-red-900 bg-red-50' 
                    : 'text-green-600 hover:text-green-900 bg-green-50'"
                  class="p-1.5 rounded-md transition-colors disabled:opacity-50"
                  :title="typeDebit.status === 'active' ? 'Deactivate' : 'Activate'"
                >
                  <svg
                    v-if="typeDebit.status === 'active'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { getTypeDebits, getImage, updateTypeDebitStatus } from "@/services/webAdminService";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/MainLayout.vue";
import Swal from "sweetalert2";

const router = useRouter();

interface DebitType {
  filename: string;
  type_debit_id: string;
  type_debit_image: string;
  type_debit_name: string;
  type_debit_description: string;
  can_physical: boolean;
  entrance_free: number;
  annual_fee: number;
  min_limit: number;
  default_limit: number;
  max_limit: number;
  expiry_year: number;
  status: string;
}

const typeDebits = ref<DebitType[]>([]);
const isTogglingStatus = ref(false);

const getStatusBadgeClass = (status: string) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';
};

const handleToggleStatus = async (typeDebit: DebitType) => {
  const newStatus = typeDebit.status === 'active' ? 'inactive' : 'active';
  const actionText = newStatus === 'inactive' ? 'ปิดการใช้งาน' : 'เปิดใช้งาน';
  const actionColor = newStatus === 'inactive' ? 'warning' : 'success';

  const result = await Swal.fire({
    title: `ยืนยันการ${actionText}ประเภทบัตร`,
    html: `
      <div class="text-left">
        <p class="mb-3">คุณแน่ใจหรือไม่ที่จะ<strong>${actionText}</strong>ประเภทบัตรนี้?</p>
        <div class="bg-gray-50 p-3 rounded-lg mb-3">
          <p class="font-semibold">${typeDebit.type_debit_name}</p>
          <p class="text-sm text-gray-600">${typeDebit.type_debit_description}</p>
        </div>
        ${newStatus === 'inactive' 
          ? '<p class="text-sm text-red-600">⚠️ ผู้ใช้จะไม่สามารถสร้างบัตรประเภทนี้ได้อีกต่อไป</p>' 
          : '<p class="text-sm text-green-600">✅ ผู้ใช้จะสามารถสร้างบัตรประเภทนี้ได้อีกครั้ง</p>'
        }
      </div>
    `,
    icon: actionColor,
    showCancelButton: true,
    confirmButtonColor: newStatus === 'inactive' ? '#d33' : '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: `ยืนยัน${actionText}`,
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  isTogglingStatus.value = true;

  try {
    await updateTypeDebitStatus({
      type_debit_id: typeDebit.type_debit_id,
      status: newStatus
    });

    // Update local data
    typeDebit.status = newStatus;

    Swal.fire({
      title: 'สำเร็จ!',
      text: `${actionText}ประเภทบัตรเรียบร้อยแล้ว`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error: any) {
    console.error('Error toggling status:', error);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || `ไม่สามารถ${actionText}ได้`,
      icon: 'error',
      confirmButtonText: 'ตกลง'
    });
  } finally {
    isTogglingStatus.value = false;
  }
};

const fetchTypeDebitsData = async () => {
  try {
    const response = await getTypeDebits();
    const data = response.data; 

    // 🚨 นำข้อมูลมาวนลูปเพื่อดึงรูปภาพ Base64 ทีละรายการ
    const enhancedData = await Promise.all(
      data.map(async (item: any) => {
        // ถ้ามีชื่อไฟล์ส่งมา
        if (item.type_debit_image) {
          try {
            const imgRes = await getImage({ fileName: item.type_debit_image });
            
            item.type_debit_image = `data:image/png;base64,${imgRes.data.imageBase64}`;
          } catch (imgError) {
            console.error(`ไม่สามารถโหลดรูปภาพได้: ${item.fileName}`, imgError);
            item.type_debit_image = ''; // ถ้าพังให้เป็นค่าว่าง Template จะได้ขึ้น No Image
          }
        }
        return item;
      })
    );

    // นำข้อมูลที่ประกอบร่างรูปภาพเสร็จแล้ว ไปแสดงผล
    typeDebits.value = enhancedData;
    console.log("Data with images:", typeDebits.value);

  } catch (error) {
    console.error("Error fetching debits:", error);
  }
};

const goToDebitTypeDetail = (type_debit_id: string) => {
  // ส่งข้อมูล item ทั้งก้อนไปหน้า Edit ผ่าน state
  router.push({ 
    path: 'edit-debit-type', 
    state: { type_debit_id: type_debit_id } 
  });
};

onMounted(() => {
  fetchTypeDebitsData();
});
</script>
