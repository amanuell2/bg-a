<template>
  <div class="p-6">
    <div class="space-y-6">
      <div class="flex">
        <div class="w-full space-y-2 rounded-lg">
          <h2 class="font-semibold text-gray-600 uppercase">Site Statstics</h2>
          <div class="flex flex-wrap -mx-4 -mt-4">
            <div class="w-1/4">
              <div class="p-4">
                <div
                  class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                >
                  <div>
                    <i class="text-6xl text-indigo-600 material-icons">
                      person
                    </i>
                  </div>
                  <div class="font-semibold">
                    <p class="text-gray-600">Total Trips</p>
                    <p class="text-4xl">{{ stats.totalTrips }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/4">
              <div class="p-4">
                <div
                  class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                >
                  <div>
                    <i class="text-6xl text-blue-600 material-icons">
                      theaters
                    </i>
                  </div>
                  <div class="font-semibold">
                    <p class="text-gray-600">Total Tickets</p>
                    <p class="text-4xl">{{ stats.tickets }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/4">
              <div class="p-4">
                <div
                  class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                >
                  <div>
                    <i class="text-6xl text-green-600 material-icons">
                      attach_money
                    </i>
                  </div>
                  <div class="font-semibold">
                    <p class="text-gray-600">Current Month Cost</p>
                    <p class="text-4xl">{{ stats.monthlyCost.toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/4">
              <div class="p-4">
                <div
                  class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                >
                  <div>
                    <i class="text-6xl text-teal-600 material-icons">
                      local_taxi
                    </i>
                  </div>
                  <div class="font-semibold">
                    <p class="text-gray-600">Current Month Trips</p>
                    <p class="text-4xl">{{ stats.monthlyTrip }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <h2 class="font-semibold text-gray-600 uppercase">Trips</h2>
        <div class="flex items-center justify-between">
          <v-date-picker v-model="range" is-range timezone="UTC">
            <template v-slot="{ inputValue, inputEvents }">
              <div class="flex items-center justify-between w-full">
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
              </div>
            </template>
          </v-date-picker>
          <div class="flex items-center space-x-4">
            <div
              class="px-4 py-2 text-right border rounded border-shuufare-700"
            >
              <p class="text-sm text-gray-600 uppercase">Number of Trips</p>
              <p class="text-2xl font-semibold">{{ rides.length }}</p>
            </div>
            <div
              class="px-4 py-2 text-right border rounded border-shuufare-700"
            >
              <p class="text-sm text-gray-600 uppercase">Cost</p>
              <p class="text-2xl font-semibold">{{ fareSum }}</p>
            </div>
          </div>
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
                  Trip ID
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
                  Pick / Drop Address
                </th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >
                  Date
                </th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >
                  Trip Fare
                </th>
                <th
                  class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody v-if="rides.length">
              <tr v-for="trip in rides" :key="trip._id">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="whitespace-no-wrap">{{ trip._id }}</p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{
                      `${trip.passenger.firstName} ${
                        trip.passenger.lastName ? trip.passenger.lastName : ""
                      }`
                    }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {{ trip.driver.firstName + " " + trip.driver.lastName }}
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center space-x-2">
                    <i class="text-green-600 material-icons">location_on</i>
                    <span>
                      {{ trip.pickUpAddress.name }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="text-red-600 material-icons">location_on</i>
                    <span>
                      {{ trip.dropOffAddress.name }}
                    </span>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ formatDate(trip.pickupTimestamp) }}
                  </p>
                  <p class="mt-1 text-gray-900 whitespace-no-wrap">
                    {{ formatDate(trip.endTimestamp) }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ trip.fare ? trip.fare.toFixed(2) : "0" }}
                  </p>
                </td>
                <td
                  class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200"
                >
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
                  >
                    <span
                      aria-hidden=""
                      class="absolute inset-0 bg-green-200 rounded-full opacity-50"
                    ></span>
                    <span class="relative">{{ trip.status }}</span>
                  </span>
                </td>
              </tr>
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
                    <span class="block">No latest trips!</span>
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
      range: {
        start: null,
        end: null,
      },
      stats: {
        totalTrips: 0,
        monthlyTrip: 0,
        tickets: 0,
        monthlyCost: 0,
      },
      rides: [],
      loading: false,
    };
  },
  created() {
    this.getStats();
    this.getRides();

    console.log(this.$store.getters.isLoggedIn);
  },
  computed: {
    corporateId() {
      return this.$store.state.auth.account.corporate
        ? this.$store.state.auth.account.corporate._id
        : null;
    },
    fareSum() {
      return this.rides.length
        ? this.rides
            .map((trip) => trip.fare)
            .reduce((fare, current) => fare + current)
            .toFixed(2)
        : 0;
    },
  },
  watch: {
    range: {
      deep: true,
      handler() {
        this.getRides();
      },
    },
  },
  methods: {
    getStats() {
      this.$http
        .get(`/corporates/${this.corporateId}/dashboard`)
        .then((response) => (this.stats = response.data))
        .catch((err) => console.log(err));
    },
    getRides() {
      const { range } = this;
      let url = `/corporates/${this.corporateId}/trips?populate=["driver", "passenger"]`;

      if (range.start) url += `start=${new Date(range.start).toISOString()}`;
      if (range.end) url += `&end=${new Date(range.end).toISOString()}`;

      this.loading = true;
      this.$misc
        .get(url)
        .then((response) => {
          this.rides = response.data.data;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    formatDate(date) {
      // return moment(date).format("MMM D, YYYY HH:mm");
      return date ? date.replace("T", " ").slice(0, 16) : "-";
    },
  },
};
</script>
