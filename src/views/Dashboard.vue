<template>
  <div class="p-8">
    <div class="space-y-6">
      <div class="relative">
        <div class="pb-1 text-sm text-center text-gray-700">Filter by Date</div>
        <v-date-picker v-model="range" is-range timezone="UTC">
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
      <div class="flex -mx-4">
        <div class="w-1/2">
          <div class="px-4">
            <div class="p-4 space-y-2 border rounded-lg">
              <h2 class="font-semibold text-gray-600 uppercase">Site Statstics</h2>
              <div class="flex flex-wrap -mx-4 -mt-4">
                <div class="w-1/2">
                  <router-link to="/drivers">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-indigo-600 material-icons">person</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Total Drivers</p>
                          <p class="text-4xl">{{ stats.totalDrivers }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>

                <div class="w-1/2">
                  <router-link to="/passengers">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-blue-600 material-icons">directions_walk</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Total Passengers</p>
                          <p class="text-4xl">{{ stats.totalUsers }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="w-1/2">
                  <router-link to="/vehicles?status=active">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-green-600 material-icons">local_taxi</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Total Active Fleets</p>
                          <p class="text-4xl">{{ stats.activeVehicles }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="w-1/2">
                  <router-link to="/vehicles?status=online">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-teal-600 material-icons">person</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Total Online Fleets</p>
                          <p class="text-4xl">{{ stats.totalActiveFleets }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <div class="px-4">
            <div class="p-4 space-y-2 border rounded-lg">
              <h2 class="font-semibold text-gray-600 uppercase">Trip Statstics</h2>
              <div class="flex flex-wrap -mx-4 -mt-4">
                <div class="w-1/2">
                  <router-link to="/rides">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-blue-600 material-icons">local_taxi</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Total Trips</p>
                          <p class="text-4xl">{{ stats.totalTrips }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="w-1/2">
                  <router-link to="/rides?status=CANCELLED">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-red-600 material-icons">cancel</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Cancelled Trips</p>
                          <p class="text-4xl">{{ stats.totalCanceledTrips }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="w-1/2">
                  <router-link to="/rides?status=Started">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-yellow-600 material-icons">loop</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Running Trips</p>
                          <p class="text-4xl">{{ stats.totalRunningTrips }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="w-1/2">
                  <router-link to="/rides?status=Completed">
                    <div class="p-4">
                      <div
                        class="flex items-center w-full px-8 py-4 space-x-4 bg-white shadow-md border rounded-md hover:shadow-xl"
                      >
                        <div>
                          <i class="text-6xl text-green-600 material-icons">check_circle_outline</i>
                        </div>
                        <div class="font-semibold">
                          <p class="text-gray-600">Completed Trips</p>
                          <p class="text-4xl">{{ stats.totalCompletedTrips }}</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <h2 class="font-semibold text-gray-600 uppercase">Recent Trips</h2>

        <div class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow-md border rounded-md hover:shadow-xl">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Dispatcher</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Passenger Name</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Driver Name</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Pick / Drop Address</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Type</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Date</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Trip Fare</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Status</th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                ></th>
              </tr>
            </thead>
            <tbody v-if="latestRides.length">
              <tr v-for="trip in latestRides" :key="trip._id">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="whitespace-no-wrap">
                    {{
                      trip.dispatcher
                        ? trip.dispatcher.firstName +
                        " " +
                        trip.dispatcher.lastName
                        : " - "
                    }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{
                      trip.passenger
                        ? trip.passenger.firstName +
                        " " +
                        (trip.passenger.lastName || "")
                        : "Unknown"
                    }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {{
                    trip.driver
                      ? trip.driver.firstName + " " + trip.driver.lastName
                      : "Unknown"
                  }}
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center space-x-2">
                    <i class="text-green-600 material-icons">location_on</i>
                    <span>{{ trip.pickUpAddress.name }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="text-red-600 material-icons">location_on</i>
                    <span>{{ trip.dropOffAddress ? trip.dropOffAddress.name : '-' }}</span>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">{{ trip.type }}</p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">{{ formatDate(trip.pickupTimestamp) }}</p>
                  <p
                    class="mt-1 text-gray-900 whitespace-no-wrap"
                  >{{ formatDate(trip.endTimestamp) }}</p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p
                    class="text-gray-900 whitespace-no-wrap"
                  >{{ trip.fare ? trip.fare.toFixed(2) : "0" }}</p>
                </td>
                <td class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
                  >
                    <span aria-hidden class="absolute inset-0 bg-green-200 rounded-full opacity-50"></span>
                    <span class="relative">{{ trip.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <a :href="'/rides/' + trip._id + '/show'" target="self">
                      <i class="mr-2 material-icons">visibility</i>
                    </a>
                  </p>
                </td>
              </tr>
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
                    <span class="block">No latest rides!</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from "moment";

export default {
  name: "Dashboard",
  data() {
    return {
      stats: {
        totalTrips: 0,
        totalUsers: 0,
        totalDrivers: 0,
        totalCompletedTrips: 0,
        totalRunningTrips: 0,
        totalCanceledTrips: 0,
        totalActiveFleets: 0,
        revenue: 0,
      },
      latestRides: [],
      loading: false,
      range: {
        start: null,
        end: null,
      },
    };
  },
  created() {
    this.getStats();
    this.getLatestRides();
  },
  computed: {
    dataRefreshTrigger() {
      return [
        this.range.start,
        this.range.end,
      ].join("|");
    },
  },
  watch: {
    dataRefreshTrigger() {
      this.getStats();
      this.getLatestRides();
    }
  },
  methods: {
    getStats() {
      this.$misc
        .get("dashboard", {
          params: {
            from: this.range.start ? this.range.start : undefined,
            to: this.range.end ? this.range.end : undefined,
          }
        })
        .then((response) => (this.stats = response.data))
        .catch((err) => console.log(err));
    },
    getLatestRides() {
      this.loading = true;
      this.$misc
        .get('trips?populate=["driver","passenger","dispatcher"]', {
          params: {
            from: this.range.start ? this.range.start : undefined,
            to: this.range.end ? this.range.end : undefined,
          }
        })
        .then((response) => (this.latestRides = response.data.data))
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    formatDate(date) {
      return date ? date.replace('T', ' ').slice(0, 16) : ''

      // return moment(date).format("MMM D, YYYY HH:mm");
    },
  },
};
</script>
