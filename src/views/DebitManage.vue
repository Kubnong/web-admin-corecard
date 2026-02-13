<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="text-2xl font-bold p-6 border-b border-gray-700">
        Admin Dashboard
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <div class="px-4 py-3 hover:bg-gray-800 rounded cursor-pointer">
          Client Management
        </div>

        <div class="px-4 py-3 bg-gray-800 rounded cursor-pointer border-l-4 border-red-500">
          Debit Management
        </div>

        <div class="px-4 py-3 hover:bg-gray-800 rounded cursor-pointer">
          Debit Card Types
        </div>

        <div class="px-4 py-3 hover:bg-gray-800 rounded cursor-pointer">
          Setting
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 p-8">
      <!-- Top Bar -->
      <div class="flex justify-end mb-6">
        <button
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-blue-500 text-white rounded-xl p-6 shadow">
          <div class="text-3xl font-bold">total</div>
          <div>จำนวนบัตรทั้งหมด</div>
          <div>{{ cards.length }}</div>
        </div>

        <div class="bg-green-500 text-white rounded-xl p-6 shadow">
          <div class="text-3xl font-bold">active </div>
          <div>บัตรที่ใช้งานอยู่</div>
          <div>{{ cards.filter(card => card.status === 'active').length }}</div>
        </div>

        <div class="bg-orange-500 text-white rounded-xl p-6 shadow">
          <div class="text-3xl font-bold">summary.pending </div>
          <div>อยู่ระหว่างจัดส่ง</div>
        </div>

        <div class="bg-red-500 text-white rounded-xl p-6 shadow">
          <div class="text-3xl font-bold">summary.blocked </div>
          <div>ถูกระงับ/อายัด</div>
          <div>{{ cards.filter(card => card.status === 'frozen' || card.status === 'locked' ).length }}</div>
        </div>
      </div>

      <!-- Filters -->
      <!-- <div class="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Card Number"
          class="border rounded px-4 py-2 w-1/4"
        />

        <input
          type="text"
          placeholder="เบอร์โทรศัพท์"
          class="border rounded px-4 py-2 w-1/4"
        />

        <select
          class="border rounded px-4 py-2"
        >
          <option value="">Type</option>
          <option value="virtual">Virtual</option>
          <option value="physical">Physical</option>
        </select>

        <select
          class="border rounded px-4 py-2"
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Frozen">Frozen</option>
          <option value="Lock">Lock</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          @click="resetFilter"
          class="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div> -->

      <!-- Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="min-w-full text-sm">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-6 py-3 text-left">Card Number (PAN)</th>
              <th class="px-6 py-3 text-left">Customer Name</th>
              <th class="px-6 py-3 text-left">Type</th>
              <th class="px-6 py-3 text-left">Card Product</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-left">Created</th>
              <th class="px-6 py-3 text-left">Expiry</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="card in cards"
              :key="card.card_id"
              class="border-t"
            >
              <td class="px-6 py-4">{{ card.last_digits }}</td>
              <td class="px-6 py-4">{{ card.holder_id }}</td>
              <td class="px-6 py-4 capitalize">{{ card.type_debit_id }}</td>
              <td class="px-6 py-4">{{ card.virtual ? 'vitual' : 'physical' }}</td>

              <td class="px-6 py-4">
                <div
                  :class="card.status"
                  class="px-3 py-1 rounded text-xs w-fit"
                >
                  {{ card.status }}
                </div>
              </td>

              <td class="px-6 py-4">{{ card.created_at }}</td>
              <td class="px-6 py-4">{{ card.expiry }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { getCards } from "@/services/webAdminService"
import { onMounted, ref } from 'vue';

interface Card {
  card_id: string,
  holder_id: string,
  type_debit_id: string,
  last_digits: string,
  virtual: boolean,
  current_spending_limit: number;
  created_at: Date;
  status: string;
  expiry: Date;
}

const cards = ref<Card[]>([]);

const fetchCardsData = async () => {
    try {
        const response = await getCards()
        const data = response.data
        cards.value = data
        console.log(cards.value)
    } catch (error) { 
        console.log(error)
    }
}

onMounted(() => {
  fetchCardsData()
})

</script>
