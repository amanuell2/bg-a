<template>
  <div>
    <div class="space-y-4">
      <div>
        <h2 class="font-semibold text-gray-600 uppercase">Driver Bans</h2>
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
                @change="getbanModels"
              >
                <option :selected="selectedFilter === 'all'" value="all">
                  All
                </option>
                <option :selected="selectedFilter === 'active'" value="active">
                  Active
                </option>
                <option :selected="selectedFilter === 'inactive'" value="inactive">
                  Inactive
                </option>
              </select>
            </div>
           
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
                Status
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Driver Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Note
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Banned At
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              ></th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              ></th>
            </tr>
          </thead>
          <tbody class="relative" v-if="banModels.length">
            <tr v-for="(banModel, index) in banModels" :key="banModel._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ banModel.active ? "active" : "inactive" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    banModel.driver
                      ? `${banModel.driver.firstName} ${banModel.driver.lastName}`
                      : "-"
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ banModel.note ? banModel.note : "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ formatDate(banModel.createdAt) }}
              </td>
              <td
                class="flex items-center justify-around h-24 px-5 text-sm bg-white border-gray-200"
              >
                <!-- <p class="flex items-center justify-center w-12 h-12 text-gray-800 whitespace-no-wrap hover:bg-gray-100 hover:border" v-if="banModel.trip">
                  <a :href="'/rides/' + banModel._id + '/show'" target="self"
                    ><i class="w-8 h-8 material-icons">electric_car</i></a>
                </p> -->
              </td>
              <td
                class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200"
                v-click-outside="hideDropdown"
              >
                <div 
                        v-if="banModel.active"
                @click.stop class="relative inline-block text-left">
                  <div>
                    <span class="rounded-md shadow-sm">
                      <button
                        @click="toggleDropdown(index)"
                        type="button"
                        class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        aria-haspopup="true"
                        :aria-expanded="openDropdown === index"
                        :ref="
                          openDropdown === index
                            ? 'vehicles-dropdown-trigger-' + ref
                            : ''
                        "
                      >
                        <i class="material-icons">more_vert</i>
                      </button>
                    </span>
                  </div>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div
                      v-if="openDropdown === index"
                      class="absolute right-0 z-10 w-56 origin-top-right rounded-md shadow-lg"
                      :ref="
                        openDropdown === index ? 'vehicles-dropdown-' + ref : ''
                      "
                    >
                      <div
                        class="bg-white rounded-md shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <button
                          @click="deleteBan(banModel._id)"
                          type="button"
                          class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          <i class="material-icons">close</i>
                          <span> Lift this ban</span>
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
                <div v-else class="text-gray-200">
                   -
                </div>
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
                  <span class="block">No Device Bans Found!</span>
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
// import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      banModels: [],
      openDropdown: null,
      loading: true,
      selectedFilter: "active",

      driverSearchResults: [],
      driverId: null,
      selectedDriver: "",

      range: {
        start: null,
        end: null,
      },
     
    };
  },
  components: {
    // ExportButton,
    Pagination,
  },
  watch: {
    currentPage() {
      this.getDriverBans();
    },
    selectedDeviceID(searchQuery) {
      if (searchQuery) this.getDriverBans();
    },
    selectedDeviceModelID() {
      this.getDriverBans();
    },
    perPage() {
      this.currentPage === 1 ? this.getDriverBans() : (this.currentPage = 1);
    },
    selectedFilter() {
      this.getDriverBans();
    },
    range: {
      handler() {
        this.getDriverBans();
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
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.$misc.get("drivers/" + this.$route.query.driver).then(({ data }) => {
        const { firstName, lastName, phoneNumber } = data.driver;
        this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
        this.selectedDriverObj = data.driver;
      });
    }

    this.getDriverBans();
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
        "bans/export?" +
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

        this.selectedDriverObj = {};
        this.selectedDriver = "";
        const query = { ...this.$route.query, driver: this.driverId };
        this.$router.push({ query });

        this.getDriverBans();
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
      this.getDriverBans();
    },

    deleteBan(banId) {
      this.$misc.delete(`driver-bans/${banId}`).then(() => {
        this.getDriverBans();
      });
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
    getDriverBans() {
      this.loading = true;
      var path = `driver-bans?limit=${this.perPage}&page=${this.currentPage}`;

      if (this.selectedFilter != "all") {
        path += "&status=" + this.selectedFilter;
      }


      if (this.driverId) {
        path += "&driverId=" + this.driverId;
      }

      if (this.range && this.range.start && this.range.end) {
        path += "&from=" + this.range.start + "&to=" + this.range.end;
      }
      
      this.$misc
        .get(path)
        .then((response) => {
          this.banModels = response.data.data;
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
