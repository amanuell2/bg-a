<template>
  <div>
    <div class="space-y-4">
      <div>
        <h2 class="font-semibold text-gray-600 uppercase">Trips</h2>
      </div>

      <div class="flex justify-between">
        <!-- <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input class="w-full py-2 pl-10 pr-4 border rounded" placeholder="Search" />
        </div>-->
        <div class="flex justify-between w-full">
          <div class="flex">
            <!-- <div class="relative ml-4">
              <label class="block">
                <span class="text-gray-700">User</span>
                <input
                  v-model="selectedAccount"
                  @keyup="searchAccount"
                  class="block w-full mt-1 form-input"
                  placeholder="Search account..."
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
                  v-if="accountSearchResults.length"
                  class="absolute inset-x-0 z-50 mt-1"
                >
                  <div
                    class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                  >
                    <ul>
                      <li
                        v-for="(result, index) in accountSearchResults"
                        :key="result._id"
                        @click="selectAccount(index)"
                        class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                      >
                        <div>
                          <p>
                            {{
                              `${result.firstName} ${result.lastName} - ${result.email}`
                            }}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>-->
            <!-- <template v-if="!$store.getters.corporateRole">
              <div class="relative ml-5">
                <label class="block">
                  <span class="text-gray-700">Driver</span>
                  <input
                    v-model="selectedDriver"
                    @keyup="searchDriver"
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
                  <div v-if="driverSearchResults.length" class="absolute inset-x-0 z-50 mt-1">
                    <div class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64">
                      <ul>
                        <li
                          v-for="(result, index) in driverSearchResults"
                          :key="result._id"
                          @click="selectDriver(index)"
                          class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                        >
                          <img
                            class="object-cover w-12 h-12 rounded-full"
                            :src="result.profileImage"
                            :alt="`${result.firstName} ${result.lastName}`"
                          />
                          <div>
                            <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                            <p class="text-sm font-semibold text-gray-600">{{ result.phoneNumber }}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </transition>
              </div>
            </template> -->
            <div class="pt-1 mx-8">
              <div class="pb-1 text-sm text-center text-gray-700">Filter by Date</div>
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
          <div class="pt-5 pr-3 text-blue-500" v-if="!$store.getters.corporateRole">
            <export-button
              class="border-blue-500"
              :downloadUrl="reportDownloadUrl"
              :working="loading"
            ></export-button>
          </div>
        </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Driver ID</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Name</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >No of Orders Regular</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >KM</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Amount Cash</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >No of Orders CORPORATE</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >CORPORATE KM</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >CORPORATE AMOUNT</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >TOTAL Km</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >TOTAL Amount</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Commission</th>
            </tr>
          </thead>
          <tbody class="relative" v-if="records.length">
            <tr v-for="record in records" :key="record._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    record.driverId
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.name }}</p>
              </td>

              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.regularTripCount }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.regularDistance }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.regularFare }}</p>
              </td>

              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.corporateTripCount }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.corporateDistance }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.corporateFare }}</p>
              </td>

              <!-- <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{                    record.totalTripCount}}
                </p>
              </td>-->
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.totalDistance }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.totalFare }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ record.commission }}</p>
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
              <td colspan="10" class="py-4 font-semibold text-center text-gray-600 bg-white">
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No latest records!</span>
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
// import moment from "moment";
import PaginationMixin from "@/mixins/Pagination";
import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      records: [],
      openDropdown: false,
      selectedAccount: "",
      loading: true,
      accounts: [],
      accountId: null,
      selectedFilter: "all",

      selectedDriver: "",

      driverSearchResults: [],
      userSearchResults: [],
      passengerSearchResults: [],

      driverId: null,

      userId: null,

      passengerId: null,

      range: {
        start: null,
        end: null,
      },
    };
  },
  components: {
    ExportButton,
    Pagination,
  },
  watch: {
    currentPage() {
      this.getDriversFinances();
    },
    perPage() {
      this.currentPage === 1 ? this.getDriversFinances() : (this.currentPage = 1);
    },
    range: {
      handler() {
        this.getDriversFinances();
      },
      deep: true,
    },
    $route() {
      if (this.$route.query.status) {
        this.selectedFilter = this.$route.query.status;
      }
    },
  },
  created() {
    // var sd = new Date();
    // sd.setDate(0);
    // sd.setDate(1);
    // var ed = new Date();
    // ed.setMonth(ed.getMonth() + 1);
    // ed.setDate(0);
    // this.range.start = sd;
    // this.range.end = ed;

    if (this.$route.query.status) {
      this.selectedFilter = this.$route.query.status;
    }
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page;
    }
    if (this.$route.query.passenger) {
      this.passengerId = this.$route.query.passenger;
      this.$misc
        .get("users/" + this.$route.query.passenger)
        .then(({ data: { firstName, lastName, phoneNumber } }) => {
          this.selectedPassenger = `${firstName} ${lastName} - ${phoneNumber}`;
        });
    }
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.$misc
        .get("drivers/" + this.$route.query.driver)
        .then(({ data }) => {
          const { firstName, lastName, phoneNumber } = data.driver
          this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
          this.selectedDriverObj = data.driver
        });
    }

    this.getDriversFinances();
    this.$misc
      .get("/accounts")
      .then((response) => (this.accounts = response.data.data))
      .catch((err) => console.log(err));
  },
  computed: {
    driverFilter() {
      return this.$route.query.driver || null;
    },
    riderFilter() {
      return this.$route.query.passenger || null;
    },
    reportDownloadUrl() {
      return (
        "drivers-finance/export?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              ...(this.range || {}),
            }).filter(([key, val]) => key && val)
          ),
        })
          .map(([key, value]) => [key, value].join("="))
          .join("&")
      );
    },
  },
  methods: {
    searchDriver(e) {
      if (e.target.value.trim() === "") {
        this.selectedDriverObj = null;
        this.selectedDriver = '';
        this.driverId = null;
        this.driverSearchResults = [];
        const query = { ...this.$route.query, driver: null };
        this.$router.push({ query });
        this.getDriversFinances();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.driverSearchResults = [];
          this.$misc
            .get("drivers/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.driverSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.driverSearchResults = [];
        }
      }
    },

    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriverObj = driver;
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.driverId = driver._id;
      this.driverSearchResults = [];
      const query = { ...this.$route.query, driver: this.driverId };
      this.$router.push({ query });
      this.getDriversFinances();
    },


    formatDate(date) {
      // return moment(date).format("MMM D, YYYY HH:mm");
      return date ? date.replace("T", " ").slice(0, 16) : "";
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    getDriversFinances() {
      this.loading = true;
      var path = `drivers-finance?limit=${this.perPage}&page=${this.currentPage}&populate=["driver","passenger","vehicleType","dispatcher"]`;

      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }

      if (this.range && this.range.start && this.range.end) {
        path += "&from=" + this.range.start + "&to=" + this.range.end;
      }

      this.$misc
        .get(path)
        .then((response) => {
          // alert(JSON.stringify(response.data.data.map(x => ({
          //   id: x._id,
          //   name: x.firstName,
          //   totalTripCount: x.totalTripsCount,
          //   regularTripCount: x.regularTripsCount,
          //   corporateTripCount: x.corporateTripsCount,
          //   totalFare: x.totalFare,
          //   corporateFare: x.corporateFare,
          //   regularFare: x.regularFare,
          // })).slice(1,), null, 2))
          this.records = response.data.data.map(x => ({
            id: x._id,
            driverId: x.driverId,
            name: x.firstName + ' ' + x.lastName,
            totalTripCount: x.totalTripsCount && x.totalTripsCount.value ? x.totalTripsCount.value : '-',
            regularTripCount: x.regularTripsCount && x.regularTripsCount.value ? x.regularTripsCount.value : '-',
            corporateTripCount: x.corporateTripsCount && x.corporateTripsCount.value ? x.corporateTripsCount.value : '-',
            totalFare: x.totalFare && x.totalFare.value ? x.totalFare.value.toFixed(2) : '-',
            corporateFare: x.corporateFare && x.corporateFare.value ? x.corporateFare.value.toFixed(2) : '-',
            regularFare: x.regularFare && x.regularFare.value ? x.regularFare.value.toFixed(2) : '-',

            totalDistance: x.totalDistance && x.totalDistance.value ? x.totalDistance.value.toFixed(2) : '-',
            corporateDistance: x.corporateDistance && x.corporateDistance.value ? x.corporateDistance.value.toFixed(2) : '-',
            regularDistance: x.regularDistance && x.regularDistance.value ? x.regularDistance.value.toFixed(2) : '-',
            commission: x.commission && x.commission.value ? x.commission.value.toFixed(2) : '-',
          }));
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
          this.loading = false;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
  },
};
</script>
