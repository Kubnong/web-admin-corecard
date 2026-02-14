<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">แก้ไขประเภทบัตรเดบิต</h1>
        <button @click="handleCancel" class="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <span class="text-2xl">×</span>
        </button>
      </div>

      <div v-if="isLoadingData" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6 animate-fade-in">
        
        <div class="border-b border-gray-200 pb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-4">รูปภาพบัตร</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <label>
              <label class="block text-xs text-gray-600 mb-2">รูปภาพหลัก (แสดงผล)</label>
              <div class="relative">
                <input 
                  type="file" 
                  @change="handleImageUpload($event, 0)"
                  accept="image/*"
                  class="hidden"
                  ref="fileInput1"
                />
                <div 
                  class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-colors relative overflow-hidden"
                >
                  <img 
                    v-if="formData.images[0]" 
                    :src="formData.images[0]" 
                    class="absolute inset-0 w-full h-full object-cover"
                    alt="Preview 1"
                  />
                  <div v-else class="text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span class="text-xs">คลิกเพื่ออัปโหลดใหม่</span>
                  </div>
                </div>
              </div>
            </label>

            <label>
              <label class="block text-xs text-gray-600 mb-2">รูปภาพขนาดกลาง</label>
              <div class="relative">
                <div class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden opacity-50 bg-gray-50">
                   <span class="text-xs text-gray-400">ยังไม่เปิดใช้งาน</span>
                </div>
              </div>
            </label>

            <label>
              <label class="block text-xs text-gray-600 mb-2">รูปภาพขนาดใหญ่</label>
              <div class="relative">
                <div class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden opacity-50 bg-gray-50">
                   <span class="text-xs text-gray-400">ยังไม่เปิดใช้งาน</span>
                </div>
              </div>
            </label>

          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อบัตร</label>
          <input 
            v-model="formData.type_debit_name" 
            type="text" 
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="เช่น Platinum Card"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">คำอธิบาย</label>
          <textarea 
            v-model="formData.type_debit_description" 
            rows="3"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="รายละเอียดของบัตร"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">ประเภทบัตร</label>
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="formData.can_physical" 
                :value="false"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-700">Virtual</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="formData.can_physical" 
                :value="true"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-700">Physical</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">ค่าธรรมเนียมแรกเข้า</label>
            <input 
              v-model.number="formData.entrance_fee" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">ค่าธรรมเนียมรายปี</label>
            <input 
              v-model.number="formData.annual_fee" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">วงเงินขั้นต่ำ</label>
            <input 
              v-model.number="formData.min_limit" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">วงเงินเริ่มต้น</label>
            <input 
              v-model.number="formData.default_limit" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">วงเงินสูงสุด</label>
            <input 
              v-model.number="formData.max_limit" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">อายุการใช้งาน (ปี)</label>
            <input 
              v-model.number="formData.expiry_year" 
              type="number" 
              min="1"
              max="10"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button 
            type="button"
            @click="handleCancel"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}</span>
          </button>
        </div>

      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTypeDebitById, updateDebitType } from '@/services/webAdminService';
import MainLayout from '@/components/MainLayout.vue';
import Swal from 'sweetalert2';

const router = useRouter();

// Structure เดียวกับหน้า Add แต่เพิ่ม field 'type_debit_id'
interface DebitTypeForm {
  type_debit_id: string; // สำคัญสำหรับหน้า Edit
  type_debit_image: string;
  type_debit_name: string;
  type_debit_description: string;
  can_physical: boolean;
  entrance_fee: number;
  annual_fee: number;
  min_limit: number;
  default_limit: number;
  max_limit: number;
  expiry_year: number;
  images: string[]; 
}

// Initial Data
const formData = ref<DebitTypeForm>({
  type_debit_id: '',
  type_debit_image: '',
  type_debit_name: '',
  type_debit_description: '',
  can_physical: false,
  entrance_fee: 0,
  annual_fee: 0,
  min_limit: 0,
  default_limit: 0,
  max_limit: 0,
  expiry_year: 3,
  images: ['', '', ''] // ใช้สำหรับแสดงผล Preview ใน UI
});

const isSubmitting = ref(false);
const isLoadingData = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

// --- 1. Fetch Data Logic ---
const fetchData = async () => {
    const typeId = history.state.type_debit_id;

    if (!typeId) {
        Swal.fire('Error', 'ไม่พบรหัสบัตร (ID Missing)', 'error');
        router.push('/debit-type-manage');
        return;
    }

    try {
        isLoadingData.value = true;
        // เรียก API ดึงข้อมูล
        const response = await getTypeDebitById({ type_debit_id: typeId });
        
        if (response.data) {
            const data = response.data;
            // Map ข้อมูลเข้า FormData
            formData.value = { 
                ...data,
                images: ['', '', ''] // Reset images array
            };

            // จัดการรูปภาพเก่า: ถ้ามีรูปมา ให้ใส่ prefix เพื่อแสดงผล
            if (data.type_debit_image) {
                // เช็คว่ามี prefix อยู่แล้วหรือเปล่า (บางที DB อาจเก็บเต็ม)
                const prefix = "data:image/png;base64,";
                const imgStr = data.type_debit_image.startsWith("data:image") 
                    ? data.type_debit_image 
                    : prefix + data.type_debit_image;
                
                formData.value.images[0] = imgStr;
                formData.value.type_debit_image = data.type_debit_image; // เก็บค่าเดิมไว้ก่อน
            }
        }
    } catch (error) {
        console.error('Error fetching details:', error);
        Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
        router.push('/debit-type-manage');
    } finally {
        isLoadingData.value = false;
    }
};

onMounted(() => {
    fetchData();
});

// --- 2. Image Handling Logic (เหมือน AddDebitType) ---
const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
      setTimeout(() => errorMessage.value = '', 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // 1. อัปเดตเพื่อแสดงผล Preview
      formData.value.images[index] = result;
      
      // 2. ถ้าเป็นรูปหลัก (index 0) ให้เตรียมข้อมูลสำหรับส่งไป Backend
      if (index === 0) {
        // ตัด Data URI scheme ออก (ส่งเฉพาะ Base64 เพียวๆ)
        formData.value.type_debit_image = (result.split(',')[1] || result);
      }
    };
    reader.onerror = () => {
      errorMessage.value = 'เกิดข้อผิดพลาดในการอ่านไฟล์';
    };
    reader.readAsDataURL(file);
  }
};

// --- 3. Submit Logic (เหมือน AddDebitType แต่เปลี่ยน API) ---
const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Validation Logic (เหมือนหน้า Add)
    if (formData.value.min_limit > formData.value.default_limit) {
      throw new Error('วงเงินขั้นต่ำต้องไม่มากกว่าวงเงินเริ่มต้น');
    }
    if (formData.value.default_limit > formData.value.max_limit) {
      throw new Error('วงเงินเริ่มต้นต้องไม่มากกว่าวงเงินสูงสุด');
    }

    // เตรียม Payload สำหรับส่งไป Update
    // ต้องระวังเรื่องรูป: ถ้า user ไม่ได้อัปรูปใหม่ ค่าใน type_debit_image จะเป็นค่าเดิมจาก fetch
    // ซึ่งถ้าค่าเดิมมี prefix "data:image..." ติดมาต้องเอาออกก่อน หรือถ้าเป็น base64 เพียวๆ ก็ส่งได้เลย
    let finalImage = formData.value.type_debit_image;
    if (finalImage.startsWith('data:image')) {
         finalImage = finalImage.split(',')[1] || finalImage;
    }

    const payload = {
      type_debit_id: formData.value.type_debit_id, // *สำคัญ* ต้องส่ง ID ไปด้วย
      type_debit_image: finalImage,
      type_debit_name: formData.value.type_debit_name,
      type_debit_description: formData.value.type_debit_description,
      can_physical: formData.value.can_physical,
      entrance_fee: formData.value.entrance_fee,
      annual_fee: formData.value.annual_fee,
      min_limit: formData.value.min_limit,
      default_limit: formData.value.default_limit,
      max_limit: formData.value.max_limit,
      expiry_year: formData.value.expiry_year,
    };

    // เรียก API Update แทน Add
    await updateDebitType(payload);

    successMessage.value = 'แก้ไขข้อมูลสำเร็จ! กำลังกลับไปหน้าหลัก...';
    
    setTimeout(() => {
      router.push('/debit-type-manage');
    }, 1500);

  } catch (error: any) {
    console.error('Error updating debit type:', error);
    errorMessage.value = error.message || error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/debit-type-manage');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

input, textarea, select {
  transition: all 0.2s ease;
}

input:focus, textarea:focus, select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>