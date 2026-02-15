<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-100 flex">
      <div class="flex-1 p-8">
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-blue-500 text-white rounded-xl p-6 shadow">
            <div class="text-3xl font-bold">total</div>
            <div>จำนวนบัตรทั้งหมด</div>
            <div>{{ cards.length }}</div>
          </div>

          <div class="bg-green-500 text-white rounded-xl p-6 shadow">
            <div class="text-3xl font-bold">active</div>
            <div>บัตรที่ใช้งานอยู่</div>
            <div>{{ activeCount }}</div>
          </div>

          <div class="bg-orange-500 text-white rounded-xl p-6 shadow">
            <div class="text-3xl font-bold">summary.pending</div>
            <div>อยู่ระหว่างจัดส่ง</div>
            <div>{{ pendingCount }}</div>
          </div>

          <div class="bg-red-500 text-white rounded-xl p-6 shadow">
            <div class="text-3xl font-bold">summary.blocked</div>
            <div>ถูกระงับ/อายัด</div>
            <div>{{ blockedCount }}</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow mb-6">
          <div class="text-lg font-bold mb-4 text-gray-700">ค้นหาลูกค้า</div>
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >ชื่อจริง (First Name)</label
              >
              <input
                v-model="searchFirstName"
                type="text"
                placeholder="ระบุชื่อจริง (ไทย/Eng)"
                class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                @keyup.enter="handleSearch"
              />
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >นามสกุล (Last Name)</label
              >
              <input
                v-model="searchLastName"
                type="text"
                placeholder="ระบุนามสกุล (ไทย/Eng)"
                class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                @keyup.enter="handleSearch"
              />
            </div>

            <button
              @click="handleSearch"
              :disabled="isSearching"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 h-[42px] disabled:opacity-50"
            >
              <svg
                v-if="!isSearching"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span v-else>กำลังค้นหา...</span>
              ค้นหา
            </button>

            <button
              @click="resetFilter"
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors h-[42px]"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-100">
              <tr>
                <th class="px-6 py-3 text-left">Card Number (PAN)</th>
                <th class="px-6 py-3 text-left">Customer Name Th</th>
                <th class="px-6 py-3 text-left">Customer Name Eng</th>
                <th class="px-6 py-3 text-left">Type</th>
                <th class="px-6 py-3 text-left">Card Product</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-left">Created</th>
                <th class="px-6 py-3 text-left">Expiry</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="card in displayedCards"
                :key="card.cardId"
                @click="goToDetail(card.cardId)"
                class="border-t cursor-pointer hover:bg-gray-50"
              >
                <td class="px-6 py-4 font-mono">
                  {{
                    card.last_digits
                      ? `**** **** **** ${card.last_digits}`
                      : "-"
                  }}
                </td>
                <td class="px-6 py-4">{{ card.name_th }}</td>
                <td class="px-6 py-4">{{ card.name_eng }}</td>
                <td class="px-6 py-4 capitalize">{{ card.type_debit_id }}</td>
                <td class="px-6 py-4">
                  {{ card.virtual ? "Virtual" : "Physical" }}
                </td>

                <td class="px-6 py-4">
                  <div
                    :class="getStatusClass(card.status)"
                    class="px-3 py-1 rounded text-xs w-fit text-center min-w-[80px]"
                  >
                    {{ card.status }}
                  </div>
                </td>

                <td class="px-6 py-4">{{ formatDate(card.created_at) }}</td>
                <td class="px-6 py-4">{{ card.expiry }}</td>
              </tr>

              <tr v-if="displayedCards.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  ไม่พบข้อมูลบัตร
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { getCards, searchCustomer } from "@/services/webAdminService"; // ✅ Import searchCustomer เพิ่ม
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/MainLayout.vue";

const router = useRouter();

interface Card {
  cardId: string;
  holder_id: string;
  type_debit_id: string;
  last_digits: string;
  virtual: boolean;
  current_spending_limit: number;
  created_at: string | Date; // แนะนำให้รองรับ String จาก JSON
  status: string;
  expiry: string | Date;
  name_th: string;
  name_eng: string;
}

// ✅ สร้างตัวแปร State
const cards = ref<Card[]>([]); // เก็บข้อมูลทั้งหมด (Master Data)
const displayedCards = ref<Card[]>([]); // เก็บข้อมูลที่ใช้แสดงผลจริง (Filtered Data)
const searchFirstName = ref("");
const searchLastName = ref("");
const isSearching = ref(false);

const fetchCardsData = async () => {
  try {
    const response = await getCards();
    const data = response.data;
    cards.value = data;
    displayedCards.value = data; // ✅ เริ่มต้นให้แสดงทั้งหมด
    console.log(cards.value);
  } catch (error) {
    console.log(error);
  }
};

// ✅ ฟังก์ชันค้นหา
const handleSearch = async () => {
  // ถ้าช่องค้นหาว่างทั้งคู่ ให้รีเซ็ตกลับไปแสดงทั้งหมด
  if (!searchFirstName.value.trim() && !searchLastName.value.trim()) {
    resetFilter();
    return;
  }

  isSearching.value = true;
  try {
    // 1. เรียก API ค้นหา User
    const payload = {
      first_name: searchFirstName.value || undefined,
      last_name: searchLastName.value || undefined,
    };

    const response = await searchCustomer(payload);
    const foundUsers = response.data; // List ของ User ที่เจอ

    if (foundUsers.length === 0) {
      displayedCards.value = []; // ถ้าไม่เจอ User เลย ก็ไม่ต้องโชว์การ์ด
    } else {
      // 2. ดึง ID ของ User ที่เจอทั้งหมดออกมา
      // หมายเหตุ: เช็ค field ID ให้ตรงกับ Backend (เช่น customerUserId หรือ id)
      const foundUserIds = foundUsers.map((u: any) => u.customerUserId || u.id);

      // 3. กรองการ์ด ให้เหลือเฉพาะใบที่เป็นของ User กลุ่มนี้
      displayedCards.value = cards.value.filter((card) =>
        foundUserIds.includes(card.holder_id),
      );
    }
  } catch (error) {
    console.error("Search failed:", error);
    alert("เกิดข้อผิดพลาดในการค้นหา");
  } finally {
    isSearching.value = false;
  }
};

// ✅ ฟังก์ชันรีเซ็ต
const resetFilter = () => {
  searchFirstName.value = "";
  searchLastName.value = "";
  displayedCards.value = cards.value; // คืนค่าทั้งหมดจาก Master Data
};

const goToDetail = (card_id: string) => {
  router.push({
    path: "/debit-detail",
    state: { card_id: card_id },
  });
};

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper สำหรับแต่งสี Status
const getStatusClass = (status: string) => {
  // ใส่ Logic สีตามต้องการได้เลย
  return status === "active"
    ? "bg-green-100 text-green-800"
    : status === "frozen"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
};

const activeCount = computed(
  () => cards.value.filter((card) => card.status === "active").length,
);

// Blocked (frozen / locked)
const blockedCount = computed(
  () =>
    cards.value.filter(
      (card) => card.status === "frozen" || card.status === "locked",
    ).length,
);

// Pending (เช่น pending / shipping แล้วแต่ backend)
const pendingCount = computed(
  () => cards.value.filter((card) => card.status === "pending").length,
);

onMounted(() => {
  fetchCardsData();
});
</script>
