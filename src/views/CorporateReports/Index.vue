<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">Corporate Reports</h2>
    <div class>
      <div class="flex justify-between w-full">
        <div class="flex">
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
          <span>Choose corporates to include in the export</span>
          <export-batch-corporates
            class="border-blue-500"
            :working="loading"
            :corporates="corporatesList"
            :filters="filters"
          ></export-batch-corporates>
        </h3>
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Module</th>
              <th
                class="flex items-center px-5 w-full h-20 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                <input type="checkbox" v-model="selectAll" />
              </th>
            </tr>
          </thead>
          <tbody v-if="corporatesList.length" class="relative">
            <tr v-for="corporate in corporatesList" :key="corporate.fieldName">
              <label class="contents">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="whitespace-no-wrap">
                    {{
                      corporate.label
                    }}
                  </p>
                </td>

                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <input type="checkbox" v-model="corporate.value" />
                </td>
              </label>
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
                  <span class="block">No corporates found!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ExportBatchCorporates from "@/components/ExportBatchCorporates";
// import AppModules from "@/components/AppModules";

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

      corporatesList: [],


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
    ExportBatchCorporates,
    // AppModules,
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
    this.$http
      .get("corporates/list")
      .then(({ data: { data } }) => {
        this.corporatesList = data.map(x => {
          return {
            label: `${x.name} (${x.shortName})`,
            fieldName: x._id,
            value: true,
            exportUrl: `corporates/report/${x._id}`
          }
        })
      });

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
      this.userSearchResults = [];
      this.getTripRequests();
    },

    selectPassenger(index) {
      let user = this.passengerSearchResults[index];
      this.selectedPassengerObj = user;
      this.selectedPassenger = `${user.firstName} ${user.lastName} - ${user.phoneNumber}`;
      this.passengerId = user._id;
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