<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">Reports</h2>
    <div class>
      <div class="flex justify-between w-full">
        <div class="flex">
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

          <div class="relative ml-5">
            <label class="block">
              <span class="text-gray-700">Passenger</span>
              <input
                v-model="selectedPassenger"
                @keyup="searchPassenger"
                class="block w-full mt-1 form-input"
                placeholder="Search passenger..."
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
              <div v-if="passengerSearchResults.length" class="absolute inset-x-0 z-50 mt-1">
                <div class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64">
                  <ul>
                    <li
                      v-for="(result, index) in passengerSearchResults"
                      :key="result._id"
                      @click="selectPassenger(index)"
                      class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                    >
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
          <div class="relative ml-5">
            <label class="block">
              <span class="text-gray-700">User</span>
              <input
                v-model="selectedUser"
                @keyup="searchUser"
                class="block w-full mt-1 form-input"
                placeholder="Search user..."
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
              <div v-if="userSearchResults.length" class="absolute inset-x-0 z-50 mt-1">
                <div class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64">
                  <ul>
                    <li
                      v-for="(result, index) in userSearchResults"
                      :key="result._id"
                      @click="selectUser(index)"
                      class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                    >
                      <div>
                        <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>

          <div class="pt-1 mx-8">
            <div class="pb-1 text-sm text-center text-gray-700">Filter by Date</div>
            <v-date-picker v-model="filters.range" is-range>
              <template v-slot="{ inputValue, inputEvents }">
                <div class="flex items-center justify-center">
                  <input
                    :value="inputValue.start"
                    v-on="inputEvents.start"
                    placeholder="From Date"
                    class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                  />
                  <svg class="w-10 h-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
    <hr v-if="passengerId" />
    <div>
      <transition name="fade">
        <div class="flex justify-start w-full" v-if="passengerId && selectedPassenger">
          <div class="flex justify-end w-full">
            <div class="inline-flex justify-end gap-5">
              <div class="px-4 py-2 text-right border rounded border-shuufare-700">
                <p class="text-sm text-gray-600 uppercase">Selected Passenger:</p>
                <p class="inline-flex text-2xl font-semibold divide-y">{{ passengerName }}</p>
              </div>
              <div class="px-4 py-2 text-right border rounded border-shuufare-700">
                <p class="text-sm text-gray-600 uppercase">Balance:</p>
                <p class="text-2xl font-semibold">{{ passengerBalance }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow">
        <h3 class="flex items-center justify-between p-4 space-x-4 font-medium">
          <span>Choose modules to include in the export</span>
          <export-batch
            class="border-blue-500"
            :working="loading"
            :app-modules="appModules"
            :filters="filters"
          ></export-batch>
        </h3>
        <app-modules v-model="appModules"></app-modules>
      </div>
    </div>
  </div>
</template>

<script>
import ExportBatch from "@/components/ExportBatch";
import AppModules from "@/components/AppModules";

export default {
  data() {
    return {
      tripRequests: [],
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
      selectedPassenger: "",

      selectedUser: "",

      driverId: null,

      userId: null,

      passengerId: null,

      range: {
        start: null,
        end: null,
      },

      statuses: ["IN_REQUEST", "CANCELLED", "EXPIRED", "DECLINED"],
      
      appModules: [],

      filters: {
        driverId: null,

        userId: null,

        passengerId: null,

        range: {
          start: null,
          end: null,
        },
      }
    };
  },
  components: {
    ExportBatch,
    AppModules,
  },
  watch: {
    selectAll(newValue) {
      this.appModules.forEach(x => x.value = newValue);
    },
    selectedFilter() {
      this.getTripRequests();
    },
    range: {
      handler() {
        this.getTripRequests();
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
      this.filters.passengerId = this.$route.query.passenger;
      this.$misc
        .get("users/" + this.$route.query.passenger)
        .then(({ data: { firstName, lastName, phoneNumber } }) => {
          this.selectedPassenger = `${firstName} ${lastName} - ${phoneNumber}`;
        });
    }
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.filters.driverId = this.$route.query.driver;
      this.$misc.get("drivers/" + this.$route.query.driver).then(({ data }) => {
        const { firstName, lastName, phoneNumber } = data.driver;
        this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
        this.selectedDriverObj = data.driver;
      });
    }
    this.loading = false;
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
        "export-batch?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              driver: this.driverId ? this.driverId : undefined,
              dispatcher: this.userId ? this.userId : undefined,
              passenger: this.passengerId ? this.passengerId : undefined,
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
        this.driverSearchResults = [];
        this.driverId = null;
        this.filters.driverId = null;
        this.getTripRequests();
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

    searchUser(e) {
      if (e.target.value.trim() === "") {
        this.userSearchResults = [];
        this.userId = null;
        this.filters.userId = null;
        this.getTripRequests();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.userSearchResults = [];
          this.$misc
            .get("accounts/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.userSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.userSearchResults = [];
        }
      }
    },

    searchPassenger(e) {
      if (e.target.value.trim() === "") {
        this.passengerSearchResults = [];
        this.passengerId = null;
        this.filters.passengerId = null;
        this.getTripRequests();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.passengerSearchResults = [];
          this.$misc
            .get("users/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.passengerSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.passengerSearchResults = [];
        }
      }
    },

    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriverObj = driver;
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.driverId = driver._id;
      this.filters.driverId = driver._id;
      this.driverSearchResults = [];
      const query = { ...this.$route.query, driver: this.driverId };
      this.$router.push({ query });
      this.getTripRequests();
    },

    selectUser(index) {
      let user = this.userSearchResults[index];
      this.selectedUserObj = user;
      this.selectedUser = `${user.firstName} ${user.lastName}`;
      this.userId = user._id;
      this.filters.userId = user._id;
      this.userSearchResults = [];
      this.getTripRequests();
    },

    selectPassenger(index) {
      let user = this.passengerSearchResults[index];
      this.selectedPassengerObj = user;
      this.selectedPassenger = `${user.firstName} ${user.lastName} - ${user.phoneNumber}`;
      this.passengerId = user._id;
      this.filters.passengerId = user._id;
      this.passengerSearchResults = [];
      const query = { ...this.$route.query, passenger: this.passengerId };
      this.$router.push({ query });

      this.getTripRequests();
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
    hideDropdown() {
      this.openDropdown = false;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>