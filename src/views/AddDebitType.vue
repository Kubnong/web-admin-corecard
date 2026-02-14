<template>
  <MainLayout>

    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">เพิ่มประเภทบัตรเดบิต</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div class="border-b border-gray-200 pb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-4">รูปภาพบัตร (3 ขนาด)</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Image 1 -->
              <label>
                <label class="block text-xs text-gray-600 mb-2">รูปภาพขนาดเล็ก</label>
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
                      <span class="text-xs">คลิกเพื่ออัปโหลด</span>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Image 2 -->
              <label>
                <label class="block text-xs text-gray-600 mb-2">รูปภาพขนาดกลาง</label>
                <div class="relative">
                  <input 
                    type="file" 
                    @change="handleImageUpload($event, 1)"
                    accept="image/*"
                    class="hidden"
                    ref="fileInput2"
                    disabled
                  />
                  <div 
                    class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors relative overflow-hidden opacity-50"
                  >
                    <img 
                      v-if="formData.images[1]" 
                      :src="formData.images[1]" 
                      class="absolute inset-0 w-full h-full object-cover"
                      alt="Preview 2"
                    />
                    <div v-else class="text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span class="text-xs">คลิกเพื่ออัปโหลด</span>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Image 3 -->
              <label>
                <label class="block text-xs text-gray-600 mb-2">รูปภาพขนาดใหญ่</label>
                <div class="relative">
                  <input 
                    type="file" 
                    @change="handleImageUpload($event, 2)"
                    accept="image/*"
                    class="hidden"
                    ref="fileInput3"
                    disabled
                  />
                  <div 
                    class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors relative overflow-hidden opacity-50"
                  >
                    <img 
                      v-if="formData.images[2]" 
                      :src="formData.images[2]" 
                      class="absolute inset-0 w-full h-full object-cover"
                      alt="Preview 3"
                    />
                    <div v-else class="text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span class="text-xs">คลิกเพื่ออัปโหลด</span>
                    </div>
                  </div>
                </div>
              </label>

            </div>
          </div>

          <!-- Card Name -->
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

          <!-- Description -->
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

          <!-- Physical Card Option -->
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

          <!-- Fees Row -->
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
                placeholder="0.00"
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
                placeholder="0.00"
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
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Limits Row -->
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
                placeholder="0.00"
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
                placeholder="0.00"
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
                placeholder="3"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- Action Buttons -->
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
              class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึก' }}</span>
            </button>
          </div>

        </form>
      </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addTypeDebit } from '@/services/webAdminService';
import MainLayout from '@/components/MainLayout.vue';

const router = useRouter();

interface DebitTypeForm {
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

const formData = ref<DebitTypeForm>({
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
  images: ['', '', '']
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Convert image to base64
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
      formData.value.images[index] = result;
      if (index === 0) {
        // Store the first image as the payload image (strip data URI prefix)
        formData.value.type_debit_image = (result.split(',')[1] || result);
      }
    };
    reader.onerror = () => {
      errorMessage.value = 'เกิดข้อผิดพลาดในการอ่านไฟล์';
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Validate
    if (formData.value.min_limit > formData.value.default_limit) {
      throw new Error('วงเงินขั้นต่ำต้องไม่มากกว่าวงเงินเริ่มต้น');
    }
    if (formData.value.default_limit > formData.value.max_limit) {
      throw new Error('วงเงินเริ่มต้นต้องไม่มากกว่าวงเงินสูงสุด');
    }

    // Prepare payload - convert base64 images to just the data part (remove data:image/png;base64,)
    const payload = {
      type_debit_image: formData.value.type_debit_image,
      type_debit_name: formData.value.type_debit_name,
      type_debit_description: formData.value.type_debit_description,
      can_physical: formData.value.can_physical,
      entrance_fee: formData.value.entrance_fee,
      annual_fee: formData.value.annual_fee,
      min_limit: formData.value.min_limit,
      default_limit: formData.value.default_limit,
      max_limit: formData.value.max_limit,
      expiry_year: formData.value.expiry_year,
    //   images: formData.value.images.map(img => {
    //     if (img) {
    //       // Remove data:image/...;base64, prefix if exists
    //       return img.split(',')[1] || img;
    //     }
    //     return '';
    //   })
    };

    await addTypeDebit(payload);

    successMessage.value = 'เพิ่มประเภทบัตรสำเร็จ! กำลังกลับไปหน้าหลัก...';
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/debit-type-manage');
    }, 2000);

  } catch (error: any) {
    console.error('Error adding debit type:', error);
    errorMessage.value = error.message || error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  if (confirm('คุณต้องการยกเลิกการเพิ่มข้อมูลหรือไม่?')) {
    router.push('/debit-type-manage');
  }
};
</script>

<style scoped>
input, textarea, select {
  transition: all 0.2s ease;
}

input:focus, textarea:focus, select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>