<template>
  <div class="flex min-h-screen bg-gray-50 font-sans text-gray-800">
    
    <aside class="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
      <div class="p-6 text-xl font-bold flex items-center gap-2">
        Admin Dashboard
      </div>

      <nav class="flex-1 mt-4">
        <ul>
          <li class="mb-1">
            <a href="#" class="flex items-center gap-3 px-6 py-4 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Client Management
            </a>
          </li>
          
          <li class="mb-1">
            <a href="#" class="flex items-center gap-3 px-6 py-4 bg-gray-800 text-white border-l-4 border-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Debit Management
            </a>
          </li>

          <li class="mb-1">
            <a href="#" class="flex items-center gap-3 px-6 py-4 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <span class="ml-9">Debit Card Types</span>
            </a>
          </li>

          <li class="mb-1">
            <a href="#" class="flex items-center gap-3 px-6 py-4 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Setting
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      
      <div class="flex justify-end mb-8">
        <button class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 mb-10">
        
        <div class="w-full lg:w-[400px] h-[240px] rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-6 relative shadow-xl flex flex-col justify-between overflow-hidden">
            <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-xl"></div>

            <div class="flex justify-between items-start z-10">
                <div class="w-12 h-9 border border-yellow-500/50 bg-yellow-400/20 rounded flex items-center justify-center">
                    <div class="w-full h-[1px] bg-yellow-500/50 absolute"></div>
                    <div class="h-full w-[1px] bg-yellow-500/50 absolute"></div>
                </div>
                <div class="text-2xl font-bold italic opacity-80">N<span class="text-sm not-italic align-top">★</span></div>
            </div>

            <div class="z-10 mt-4">
                <div class="flex items-center gap-4 text-2xl tracking-widest font-mono">
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <div class="flex items-center gap-2">
                        <span>{{ cardData?.last_digits }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex justify-between items-end z-10">
                <div>
                    <div class="text-xs opacity-70 uppercase mb-1">Card Holder</div>
                    <div class="text-lg font-medium tracking-wide">Phatthrapong Rodyo</div>
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
                    <p class="text-gray-500 text-sm">{{ cardData?.virtual ? 'Virtual' : 'Physical' }}</p>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 mb-1">Card Created</h3>
                    <p class="text-gray-500 text-sm">{{ cardData?.created_at }}</p>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 mb-1">Expiry</h3>
                    <p class="text-gray-500 text-sm">{{ cardData?.expiry }}</p>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 mb-1">Spending Limit</h3>
                    <p class="text-gray-500 text-sm">{{ cardData?.current_spending_limit }}</p>
                </div>

                <div>
                    <h3 class="font-bold text-gray-900 mb-1">Status : 
                        <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </h3>
                </div>

                 <div class="hidden lg:block"></div>

                <div class="md:col-span-3">
                    <h3 class="font-bold text-gray-900 mb-1">Shipping address</h3>
                    <p class="text-gray-500 text-sm">-</p>
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
                            {{ log.timestamp}}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-800">
                            {{ log.action }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailCard, getHistoryLogs } from '@/services/webAdminService';

const route = useRoute();
const cardData = ref<CardDetail>();
const logData = ref<LogDetail[]>([]);

interface CardDetail {
  card_id: string;
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
}

interface LogDetail {
  log_id: string;
  action: string;
  timestamp: Date;
  card_id: string;
}

const fetchCardDetail = async () => {
  const card_id = history.state.card_id as string;
  console.log("fetch data from id : ",card_id)

  try {
    const response = await getDetailCard({ card_id : card_id });
    cardData.value = response.data;
  } catch (error: any) {
    console.error('Error fetching card detail:', error);
  }
};

const fetchHistoryLog = async () => {
    const card_id = history.state.card_id as string;
    console.log("fetch data from id : ",card_id)
    try {
        const response = await getHistoryLogs({ card_id : card_id })
        logData.value = response.data;
    } catch(error) {
        console.log(error)
        console.error('Error fetching log detail:', error);
    }
}

onMounted(() => {
  fetchCardDetail()
  fetchHistoryLog()
})

</script>