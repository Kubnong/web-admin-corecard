<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Debit Configuration</h2>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span class="text-lg">+</span>
        Create New
      </button>
    </div>

    <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50">
      <div class="relative">
        <input
          type="text"
          placeholder="Search Card Name..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
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
      </div>

      <select
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
      >
        <option value="">All Types</option>
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
      </select>

      <select
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <input
        type="date"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-500"
      />
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
                :src="`data:image/png;base64,${typeDebit.type_debit_image}`"
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
              <div class="flex items-center justify-center gap-2">
                <button
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
                  class="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md transition-colors"
                  title="Delete"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
    >
      <span class="text-sm text-gray-500">Showing 1 to 5 of 12 entries</span>
      <div class="flex gap-1">
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          disabled
        >
          Previous
        </button>
        <button class="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">
          1
        </button>
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          2
        </button>
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          3
        </button>
        <button
          class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTypeDebits } from "@/services/webAdminService";
import { ref, onMounted } from "vue";

interface DebitType {
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
}

const typeDebits = ref<DebitType[]>([]);

const fetchTypeDebitsData = async () => {
  try {
    const response = await getTypeDebits();
    const data = response.data;
    typeDebits.value = data;
    console.log(typeDebits.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchTypeDebitsData();
});

// // Define Types
// interface DebitCard {
//   id: number;
//   name: string;
//   bin: string;
//   type: 'Visa' | 'MasterCard';
//   status: 'Active' | 'Inactive';
//   createdAt: string;
// }

// // Mock Data
// const cards = ref<DebitCard[]>([
//   { id: 1, name: 'Platinum Rewards', bin: '424242', type: 'Visa', status: 'Active', createdAt: '2023-10-01' },
//   { id: 2, name: 'Travel Elite', bin: '510510', type: 'MasterCard', status: 'Active', createdAt: '2023-10-05' },
//   { id: 3, name: 'Student Saver', bin: '411111', type: 'Visa', status: 'Inactive', createdAt: '2023-11-12' },
//   { id: 4, name: 'Business Gold', bin: '550000', type: 'MasterCard', status: 'Active', createdAt: '2023-12-01' },
//   { id: 5, name: 'Shopping Plus', bin: '400000', type: 'Visa', status: 'Active', createdAt: '2024-01-15' },
// ]);

// // Filters
// const searchQuery = ref('');
// const selectedType = ref('');
// const selectedStatus = ref('');

// // Computed Property for Filtering
// const filteredCards = computed(() => {
//   return cards.value.filter(card => {
//     const matchSearch = card.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//                         card.bin.includes(searchQuery.value);
//     const matchType = selectedType.value ? card.type === selectedType.value : true;
//     const matchStatus = selectedStatus.value ? card.status === selectedStatus.value : true;

//     return matchSearch && matchType && matchStatus;
//   });
// });
</script>
