<template>
  <div class="flex gap-8">
    <div class="w-1/2">
      <h2 class="mb-8 font-semibold text-gray-600 uppercase">
        Edit Reward Package
      </h2>

      <form @submit.prevent class="space-y-4">
        <div class="flex -mx-2">
          <div class="w-full">
            <label class="block px-2">
              <span class="text-gray-700">Name</span>
              <input
                v-model="rewardPackage.name"
                class="block w-full mt-1 form-input"
                placeholder="Package #1"
                required
              />
            </label>
          </div>
        </div>
        <label class="block">
          <span class="text-gray-700"
            >Minimum Wallet Balance Required to participate</span
          >
          <input
            v-model="rewardPackage.minimumWalletAmountToQualify"
            class="block w-full mt-1 form-input"
            type="number"
            placeholder="100"
            required
          />
        </label>
        <back-button></back-button>
        <button
          class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
          @click="addPackage"
        >
          Add Package
        </button>
      </form>
    </div>
    <div class="flex flex-col w-1/2 gap-2">
      <h2 class="font-semibold text-gray-600 uppercase">Prizes</h2>

      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Initial Amount in Stock
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Currently in Stock
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Prize Item
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >Created</th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            ></th>
          </tr>
        </thead>
        <tbody class="relative" v-if="rewardPackage.prizes.length">
          <tr v-for="prize in rewardPackage.prizes" :key="prize._id">
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ prize.initialAmountInStock }}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ prize.amountInStock }}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ prize.minimumWalletAmountToQualify }}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ prize.createdAt }}
              </p>
            </td>
            <td
              class="flex items-center justify-around h-24 px-5 text-sm bg-white border-gray-200"
            >
            <button class="flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-600" @click="removePrize(prize)">x</button>
            </td>
          </tr>
          <div
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25"
          >
            <i class="text-6xl material-icons spin">sync</i>
            <span class="invisible block">Loading...</span>
          </div>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              colspan="10"
              class="py-4 font-semibold text-center text-gray-600 bg-white"
            >
              <div v-if="loading" class="inline-block">
                <i class="text-6xl material-icons spin">sync</i>
                <span class="invisible block">Loading...</span>
              </div>
              <div v-else class="inline-block">
                <i class="text-6xl material-icons">warning</i>
                <span class="block">No reward package found!</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="relative">
        <button
          class="flex w-full h-10 px-4 pt-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
          @click="togglePrizes()"
        >
          <svg
            class="mr-2 text-light-blue-500"
            width="12"
            height="20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
            />
          </svg>
          Add New Prize
        </button>
        <div
          class="absolute left-0 z-50 flex h-64 max-w-full p-4 mt-2 bg-gray-200 shadow top-full"
          v-if="addingPrize"
        >
          <div class="flex items-center justify-center min-w-full gap-4 pb-2" v-if="loadingPrizes">
            Loading prizes...
          </div>
          <div class="flex max-w-full gap-4 pb-2 overflow-x-scroll" v-else-if="availablePrizes && availablePrizes.length">
            <div
              class="flex items-end justify-center h-full text-white bg-gray-400 bg-cover cursor-pointer hover:shadow-lg"
              :style="{
                width: '14rem',
                minWidth: '14rem',
                backgroundImage: `url('${prize.prizeImage}')`
              }"
              v-for="prize in availablePrizes"
              :key="prize._id"
              @click="addPrize(prize)"
            >
              {{ prize.prizeItem }}
            </div>
          </div>
          <div class="flex items-center justify-center min-w-full gap-4 pb-2" v-else>
            No Prizes found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: {
    BackButton,
  },
  data() {
    return {
      rewardPackage: {
        name: null,
        minimumWalletAmountToQualify: null,
        prizes: [],
      },
      loading: false,
      addingPrize: false,
      availablePrizes: [],
      loadingPrizes: true
    };
  },
  created() {
  },
  methods: {
    addPrize(prize) {
      this.rewardPackage.prizes =  [...this.rewardPackage.prizes.filter(x => x._id !== prize._id), prize ]
      this.addingPrize = false
    },
    removePrize(prize) {
      this.rewardPackage.prizes = this.rewardPackage.prizes.filter(x => x._id !== prize._id)
    },
    togglePrizes() {
      this.addingPrize = !this.addingPrize
       this.$misc
        .get(`rewards-inventory`)
        .then((response) => {
          this.availablePrizes = response.data.data;
          this.loadingPrizes = false
        })
        .catch((err) => console.log(err));
    },
    addPackage() {
      this.$misc
        .post(`reward-packages`, {
          ...this.rewardPackage,
          prizes: this.rewardPackage.prizes.map(({ _id }) => _id)
        })
        .then(() => {
          window.flash({
            type: "success",
            body: "package added successfully!",
          });
          this.$router.push("/reward-packages");
        })
        .catch((err) => {
          window.flash({
            type: "error",
            body: "Failed to add the package!",
          });
          console.log(err);
        });
    },
  },
};
</script>