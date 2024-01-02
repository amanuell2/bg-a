<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">Loan</h2>
    <div class>
      <div class="flex w-full">
        <div class="relative mt-4 mr-4">
          <label class="block">
            <span class="text-gray-700">From</span>
            <input
              v-model="selectedDriverFrom"
              @keyup="searchDriverFrom"
              class="block w-full mt-1 form-input"
              placeholder="Search drivers..."
            />
          </label>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="fromSearchResult.length"
              class="absolute inset-x-0 z-50 mt-1"
            >
              <div
                class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
              >
                <ul>
                  <li
                    v-for="(result, index) in fromSearchResult"
                    :key="result._id"
                    @click="selectDriverFrom(index)"
                    class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                  >
                    <img
                      class="object-cover w-12 h-12 rounded-full"
                      :src="result.profileImage"
                      :alt="`${result.firstName} ${result.lastName}`"
                    />
                    <div>
                      <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                      <p class="text-sm font-semibold text-gray-600">
                        {{ result.phoneNumber }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative mt-4 mr-4">
          <label class="block">
            <span class="text-gray-700">To</span>
            <input
              v-model="selectedDriverTo"
              @keyup="searchDriverTo"
              class="block w-full mt-1 form-input"
              placeholder="Search drivers..."
            />
          </label>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="toSearchResult.length"
              class="absolute inset-x-0 z-50 mt-1"
            >
              <div
                class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
              >
                <ul>
                  <li
                    v-for="(result, index) in toSearchResult"
                    :key="result._id"
                    @click="selectDriverTo(index)"
                    class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                  >
                    <img
                      class="object-cover w-12 h-12 rounded-full"
                      :src="result.profileImage"
                      :alt="`${result.firstName} ${result.lastName}`"
                    />
                    <div>
                      <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                      <p class="text-sm font-semibold text-gray-600">
                        {{ result.phoneNumber }}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative mt-5">
          <div class="pr-3">
            <label class="block">
              <span class="text-gray-700">Status</span>
              <select
                class="w-full form-select"
                v-model="paid"
                @change="getAllLoans"
              >
                <option :selected="paid === null" :value="null">All</option>
                <option :selected="paid === true" :value="true">Paid</option>
                <option :selected="paid === false" :value="false">
                  Unpaid
                </option>
              </select>
            </label>
          </div>
        </div>

        <div class="relative pl-1 mt-4">
          <div class="pb-1 text-center text-gray-700">Filter by Date</div>
          <v-date-picker v-model="range" is-range>
            <template v-slot="{ inputValue, inputEvents }">
              <div class="flex items-center justify-center">
                <input
                  :value="inputValue.start"
                  v-on="inputEvents.start"
                  placeholder="From Date"
                  class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                />
                <svg
                  class="w-10 h-6 mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <input
                  :value="inputValue.end"
                  v-on="inputEvents.end"
                  placeholder="To Date"
                  class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                />
              </div>
            </template>
          </v-date-picker>
        </div>
      </div>
    </div>
    <div>
      <div class="flex space-x-4">
        <h3 class="flex items-center space-x-4">
          <span>loans</span>
        </h3>
      </div>

      <div
        class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow"
      >
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Loan ID
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                From
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                To
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Amount
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Paid
              </th>
              <!-- <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Paid amount
              </th> -->
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Last Transaction Date
              </th>
            </tr>
          </thead>
          <tbody v-if="loans.length" class="relative">
            <tr v-for="wallet in loans" :key="wallet._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">{{ wallet._id }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">
                  {{
                    wallet.from
                      ? wallet.from.firstName + " " + wallet.from.lastName
                      : "-"
                  }}
                </p>
                <p class="text-gray-600 whitespace-no-wrap">
                  {{ wallet.from ? wallet.from._id : "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">
                  {{
                    wallet.to
                      ? wallet.to.firstName + " " + wallet.to.lastName
                      : "-"
                  }}
                </p>
                <p class="text-gray-600 whitespace-no-wrap">
                  {{ wallet.to ? wallet.to._id : "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.amount.toFixed(2) }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.paid }}
              </td>
              <!-- <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.paidAmount.toFixed(2) }}
              </td> -->
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.updatedAt }}
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
                colspan="7"
                class="py-4 font-semibold text-center text-gray-600 bg-white"
              >
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No loans!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-end justify-between">
        <pagination
          class="flex space-x-2"
          :currentPage="currentPage"
          :total="total"
          @goto="goToPage"
          @setPerPage="setPerPage"
          :perPage="perPage"
          :start="start"
          :end="end"
          :count="paginator.count"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationMixin from "@/mixins/Pagination";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      loading: false,
      paid: null,
      loans: [],
      selectedDriverFrom: "",
      selectedDriverTo: "",
      drivers: [],
      fromSearchResult: [],
      toSearchResult: [],
      fromId: null,
      toId: null,
      range: {
        start: null,
        end: null,
      },
    };
  },
  components: {
    Pagination,
  },
  watch: {
    range: {
      handler() {
        this.getAllLoans();
      },
      deep: true,
    },
    currentPage() {
      this.getAllLoans();
    },
    perPage() {
      this.getAllLoans();
    },
  },
  created() {
    var sd = new Date();
    sd.setDate(0);
    sd.setDate(1);
    var ed = new Date();
    ed.setMonth(ed.getMonth() + 1);
    ed.setDate(0);
    this.startDate = sd;
    this.endDate = ed;
    this.getAllLoans();
    this.$misc
      .get("/drivers")
      .then((response) => {
        this.drivers = response.data.data;
        let driver = this.drivers.find((driver) => driver._id == this.driverId);
        if (driver) {
          this.selectedDriverFrom = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
        }
      })
      .catch((err) => console.log(err));
  },
  methods: {
    getAllLoans() {
      this.loading = true;
      var path = `/loan-histories?populate=["from","to"]&page=${this.currentPage}&limit=${this.perPage}`;
      if (this.fromId) {
        path += "&from=" + this.fromId;
      }
      if (this.toId) {
        path += "&to=" + this.toId;
      }
      if (this.paid && this.paid != "all") {
        path += "&paid=" + this.paid;
      }
      if (this.range.start) {
        path += "&start=" + this.range.start;
      }
      if (this.range.end) {
        path += "&end=" + this.range.end;
      }
      this.$misc
        .get(path)
        .then((response) => {
          this.loans = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    searchDriverFrom(e) {
      if (e.target.value.trim() === "") {
        this.fromSearchResult = [];
        this.fromId = null;
        this.getAllLoans();
      } else if (!isNaN(parseInt(e.target.value))) {
        this.fromSearchResult = this.drivers.filter((driver) => {
          return driver.phoneNumber.slice(-4).includes(e.target.value);
        });
      } else {
        this.fromSearchResult = this.drivers.filter((driver) => {
          let name = driver.firstName + " " + driver.lastName;
          return name.toLowerCase().includes(e.target.value.toLowerCase());
        });
      }
    },
    searchDriverTo(e) {
      if (e.target.value.trim() === "") {
        this.toSearchResult = [];
        this.toId = null;
        this.getAllLoans();
      } else if (!isNaN(parseInt(e.target.value))) {
        this.toSearchResult = this.drivers.filter((driver) => {
          return driver.phoneNumber.slice(-4).includes(e.target.value);
        });
      } else {
        this.toSearchResult = this.drivers.filter((driver) => {
          let name = driver.firstName + " " + driver.lastName;
          return name.toLowerCase().includes(e.target.value.toLowerCase());
        });
      }
    },
    selectDriverFrom(index) {
      let driver = this.fromSearchResult[index];
      this.selectedDriverFrom = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.fromId = driver._id;
      this.fromSearchResult = [];
      this.getAllLoans();
    },
    selectDriverTo(index) {
      let driver = this.toSearchResult[index];
      this.selectedDriverTo = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.toId = driver._id;
      this.toSearchResult = [];
      this.getAllLoans();
    },
  },
};
</script>
