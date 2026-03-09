<template>
  <MainLayout>
    <div class="flex flex-col lg:flex-row gap-8 mb-10">
      <div
        class="w-full lg:w-[400px] h-[240px] rounded-2xl text-white p-6 relative shadow-xl flex flex-col justify-between overflow-hidden"
        :class="
          !cardImageBase64
            ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800'
            : 'bg-gray-900'
        "
      >
        <img
          v-if="cardImageBase64" 
          :src="cardImageBase64"
          class="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          alt="Card Background"
        />
        <div
          class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl z-0"
        ></div>
        <div
          class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-xl z-0"
        ></div>

        <div class="flex justify-between items-start z-10">
          <div class="text-2xl font-bold italic opacity-80">
            N<span class="text-sm not-italic align-top">★</span>
          </div>
        </div>

        <div class="z-10 mt-4">
          <div v-if="sensitiveData" class="flex items-center gap-4 text-2xl tracking-widest font-mono">
            <span>{{ sensitiveData?.pan.substring(0, 4) }}</span>
            <span>{{ sensitiveData?.pan.substring(4, 8) }}</span>
            <span>{{ sensitiveData?.pan.substring(8, 12) }}</span>
            <div class="flex items-center gap-2">
              <span>{{ sensitiveData?.pan.substring(12, 16) }}</span>
              <div @click="handleGetSensitiveData(cardData?.cardId)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
            </div>
          </div>
          <div v-else class="flex items-center gap-4 text-2xl tracking-widest font-mono">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <div class="flex items-center gap-2">
              <span>{{ cardData?.last_digits }}</span>
              <div @click="handleGetSensitiveData(cardData?.cardId)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-end z-10">
          <div>
            <div class="text-xs opacity-70 uppercase mb-1">Card Holder</div>
            <div class="text-lg font-medium tracking-wide uppercase">
              {{ cardData?.name_eng || 'UNKNOWN HOLDER' }}
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="text-[10px] opacity-70 uppercase">Valid Thru</div>
            <div class="text-sm font-bold mb-2">{{ cardData?.expiry }}</div>
            <div class="flex relative">
              <div class="w-8 h-8 bg-red-500 rounded-full opacity-90"></div>
              <div class="w-8 h-8 bg-yellow-500 rounded-full opacity-90 -ml-4"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
          
          <div>
            <h3 class="font-bold text-gray-900 mb-1">Card Type</h3>
            <p class="text-gray-500 text-sm">
              {{ cardData?.virtual ? "Virtual" : "Physical" }}
            </p>
          </div>

          <div>
            <h3 class="font-bold text-gray-900 mb-1">Card Created</h3>
            <p class="text-gray-500 text-sm">{{ formatDate(cardData?.created_at) }}</p>
          </div>

          <div>
            <h3 class="font-bold text-gray-900 mb-1">Expiry</h3>
            <p class="text-gray-500 text-sm">{{ cardData?.expiry }}</p>
          </div>

          <div>
            <h3 class="font-bold text-gray-900 mb-1">CVV</h3>
            <p class="text-gray-500 text-sm font-mono tracking-widest font-semibold">
              {{ sensitiveData ? sensitiveData.cvv : '•••' }}
            </p>
          </div>

          <div>
            <h3 class="font-bold text-gray-900 mb-1">Spending Limit</h3>
            <p class="text-gray-500 text-sm">
              {{ cardData?.current_spending_limit?.toLocaleString() }}
            </p>
          </div>

          <div>
            <h3 class="font-bold text-gray-900 mb-1">
              Status :
              <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </h3>
          </div>

        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">History</h2>
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-blue-100/50 text-gray-700 text-sm font-semibold">
              <th class="px-6 py-4 border-b border-gray-200 w-1/4">Date</th>
              <th class="px-6 py-4 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="log in logData" :key="log.log_id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-800">
                {{ log.action }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getDetailCard,
  getHistoryLogs,
  getSensitiveData,
  getTypeDebits,
  getImage,
} from "@/services/webAdminService";
import MainLayout from "@/components/MainLayout.vue";

const cardData = ref<CardDetail>();
const logData = ref<LogDetail[]>([]);
const sensitiveData = ref<SensitiveDetail>();
const cardImageBase64 = ref<string>("");

interface CardDetail {
  cardId: string;
  holder_id: string;
  type_debit_id: string;
  last_digits: string;
  encrypted_pan: string;
  encrypted_cvv: string;
  virtual: boolean;
  current_spending_limit: number;
  created_at: string;
  expiry: string;
  status: string;
  request_physical: boolean;
  name_th: string;  
  name_eng: string; 
}

interface LogDetail {
  log_id: string;
  action: string;
  timestamp: Date;
  card_id: string;
}

interface SensitiveDetail {
  expiry: string;
  pan: string;
  cvv: string;
}

const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return "-";
  return new Date(dateInput).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const fetchCardDetail = async () => {
  const card_id = history.state.card_id as string;
  console.log("fetch data from id : ", card_id);

  try {
    const response = await getDetailCard({ card_id: card_id });
    cardData.value = response.data;

    if (cardData.value?.type_debit_id) {
      await fetchCardImage(cardData.value.type_debit_id);
    }

    console.log("👉 Data from Spring Boot:", response.data);
  } catch (error: any) {
    console.error("Error fetching card detail:", error);
  }
};

const fetchCardImage = async (typeDebitId: string) => {
  try {
    // 1. ค้นหาข้อมูลชนิดบัตรทั้งหมด
    const typesRes = await getTypeDebits();

    // 2. เอา type_debit_id ไปค้นหาชนิดบัตรที่ตรงกัน
    const matchedType = typesRes.data.find(
      (t: any) =>
        t.type_debit_id === typeDebitId || t.typeDebitId === typeDebitId,
    );

    // 🚨 3. ดึงเฉพาะชื่อไฟล์จากฟิลด์ image_large (เช็คเผื่อกรณี Backend ส่งมาเป็น camelCase)
    const imageLargeFileName =
      matchedType?.image_large || matchedType?.imageLarge;

    // 🚨 4. ถ้ามีชื่อไฟล์ image_large ค่อยเอามันไปค้นหา Base64
    if (imageLargeFileName) {
      const imgRes = await getImage({ fileName: imageLargeFileName });

      // ประกอบ Data URI แล้วนำไปแสดงผล
      cardImageBase64.value = `data:image/png;base64,${imgRes.data.imageBase64}`;
    } else {
      console.warn(`ไม่พบไฟล์ image_large สำหรับชนิดบัตร ID: ${typeDebitId}`);
    }
  } catch (error) {
    console.error("Error fetching card image:", error);
  }
};

const fetchHistoryLog = async () => {
  const card_id = history.state.card_id as string;
  console.log("fetch data from id : ", card_id);
  try {
    const response = await getHistoryLogs({ card_id: card_id });
    logData.value = response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching log detail:", error);
  }
};

const handleGetSensitiveData = async (cardId?: string) => {
  if (!cardId) {
    console.warn("ยังไม่มี Card ID ไม่สามารถดึงข้อมูล Sensitive ได้");
    return;
  }

  if (sensitiveData.value) {
    sensitiveData.value = undefined;
    return;
  }

  try {
    const response = await getSensitiveData({ card_id: cardId } as any);
    sensitiveData.value = response.data;
    console.log(sensitiveData);
  } catch (error) {
    console.error("Failed to get sensitive data:", error);
  }
};

onMounted(() => {
  fetchCardDetail();
  fetchHistoryLog();
});
</script>
