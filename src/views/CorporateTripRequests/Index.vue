<template>
  <div>
    <div class="space-y-4">
      <div>
        <h2 class="font-semibold text-gray-600 uppercase">Trip Requests</h2>
      </div>

      <div class="flex justify-between">
        <!-- <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input class="w-full py-2 pl-10 pr-4 border rounded" placeholder="Search" />
        </div> -->
        <div class="flex justify-between w-full">
          <div class="flex">
            <div class="">
              <span class="text-gray-700">Status</span>
              <select
                class="w-full mt-1 form-select"
                v-model="selectedFilter"
                @change="gettripRequests"
              >
                <option :selected="selectedFilter === 'all'" value="all">
                  All
                </option>
                <option
                  v-for="status in statuses"
                  :key="`status-${status}`"
                  :selected="selectedFilter === status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </div>
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
            </div> -->

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
                <div
                  v-if="driverSearchResults.length"
                  class="absolute inset-x-0 z-50 mt-1"
                >
                  <div
                    class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                  >
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
                <div
                  v-if="passengerSearchResults.length"
                  class="absolute inset-x-0 z-50 mt-1"
                >
                  <div
                    class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                  >
                    <ul>
                      <li
                        v-for="(result, index) in passengerSearchResults"
                        :key="result._id"
                        @click="selectPassenger(index)"
                        class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                      >
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
                <div
                  v-if="userSearchResults.length"
                  class="absolute inset-x-0 z-50 mt-1"
                >
                  <div
                    class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                  >
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
              <div class="pb-1 text-sm text-center text-gray-700">
                Filter by Date
              </div>
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
          <div class="pt-5 pr-3 text-blue-500">
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
              >
                Dispatcher
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Scheduled
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Passenger Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Driver Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Started At
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Pick / Drop Address
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Vehicle Type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Status
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Cancelled By
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Active
              </th>
            </tr>
          </thead>
          <tbody class="relative" v-if="tripRequests.length">
            <tr v-for="tripRequest in tripRequests" :key="tripRequest._id" class="bg-white">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    tripRequest.dispatcher
                      ? tripRequest.dispatcher.firstName +
                        " " +
                        tripRequest.dispatcher.lastName
                      : " - "
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ tripRequest.schedule ? "Scheduled" : "Now" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div class="flex flex-col text-gray-900 whitespace-no-wrap">
                  <p>
                  {{
                    tripRequest.passenger
                      ? tripRequest.passenger.firstName +
                        " " +
                        tripRequest.passenger.lastName
                      : "Unknown"
                  }}
                  </p>
                  <p>
                    {{ tripRequest.passenger ? tripRequest.passenger.phoneNumber : " - " }}
                  </p>
                </div>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div class="flex flex-col text-gray-900 whitespace-no-wrap">
                  <p>
                  {{
                    tripRequest.driver
                      ? tripRequest.driver.firstName +
                        " " +
                        tripRequest.driver.lastName
                      : "Unknown"
                  }}
                  </p>
                  <p>
                    {{ tripRequest.driver ? tripRequest.driver.phoneNumber : " - " }}
                  </p>
                </div>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ formatDate(tripRequest.createdAt) }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div>
                  <div class="flex items-center space-x-2">
                    <i class="text-green-600 material-icons">location_on</i>
                    <span>{{ tripRequest.pickUpAddress.name }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="text-red-600 material-icons">location_on</i>
                    <span>{{
                      tripRequest.dropOffAddress
                        ? tripRequest.dropOffAddress.name
                        : "-"
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    tripRequest.vehicleType ? tripRequest.vehicleType.name : "-"
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ tripRequest.status }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    tripRequest.dispatcherWhoCancelled
                      ? `${tripRequest.dispatcherWhoCancelled.firstName} ${tripRequest.dispatcherWhoCancelled.lastName}`
                      : "-"
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ tripRequest.active }}
                </p>
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
                  <span class="block">No trip Requests found!</span>
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

      driverId: null,

      userId: null,

      passengerId: null,

      range: {
        start: null,
        end: null,
      },

      statuses: ["IN_REQUEST", "CANCELLED", "EXPIRED", "DECLINED"],
    };
  },
  components: {
    ExportButton,
    Pagination,
  },
  watch: {
    currentPage() {
      this.getTripRequests();
    },
    perPage() {
      this.currentPage === 1 ? this.getTripRequests() : (this.currentPage = 1);
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
      this.$misc
        .get("users/" + this.$route.query.passenger)
        .then(({ data: { firstName, lastName, phoneNumber } }) => {
          this.selectedPassenger = `${firstName} ${lastName} - ${phoneNumber}`;
        });
    }
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.$misc.get("drivers/" + this.$route.query.driver).then(({ data }) => {
        const { firstName, lastName, phoneNumber } = data.driver;
        this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
        this.selectedDriverObj = data.driver;
      });
    }

    this.getTripRequests();
    this.$misc
      .get("/accounts")
      .then((response) => (this.accounts = response.data.data))
      .catch((err) => console.log(err));
  },
  computed: {
    driverFilter() {
      return this.$route.query.driver || null;
    },
    corporateId() {
      return this.$store.state.auth.account.corporate
        ? this.$store.state.auth.account.corporate._id
        : null;
    },
    riderFilter() {
      return this.$route.query.passenger || null;
    },
    reportDownloadUrl() {
      return (
        `corporates/${this.corporateId}/trip-requests/export?` +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              driver: this.driverId ? this.driverId : undefined,
              dispatcher: this.userId ? this.userId : undefined,
              passenger: this.passengerId ? this.passengerId : undefined,
              status:
                this.selectedFilter && this.selectedFilter != "all"
                  ? this.selectedFilter
                  : undefined,
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
    getTripRequests() {
      this.loading = true;
      var path = `corporates/${this.corporateId}/trip-requests?limit=${this.perPage}&page=${this.currentPage}`;

      if (this.$route.query.tripSearch) {
        path += `&tripSearch=${this.$route.query.tripSearch}`
      }
      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }

      if (this.passengerId) {
        path += "&passenger=" + this.passengerId;
      }

      if (this.userId) {
        path += "&dispatcher=" + this.userId;
      }

      if (this.selectedFilter && this.selectedFilter != "all") {
        path += "&status=" + this.selectedFilter;
      }

      if (this.range && this.range.start && this.range.end) {
        path += "&from=" + this.range.start + "&to=" + this.range.end;
      }

      this.$http
        .get(path)
        .then((response) => {
          this.tripRequests = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
  },
};
</script>
