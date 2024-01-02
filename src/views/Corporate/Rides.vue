<template>
  <div>
    <h3 class="text-xl font-semibold text-gray-700">Trips</h3>
    <div class="pt-2 space-x-4">
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
            <div class="flex items-center justify-end space-x-4">
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">Number of Trips</p>
                <p class="text-2xl font-semibold">
                  {{ corporateTrips.length }}
                </p>
              </div>
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">Cost</p>
                <p class="text-2xl font-semibold">{{ fareSum }}</p>
              </div>
            </div>
          </div>
        </template>
      </v-date-picker>
    </div>
    <div
      class="box-border inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow"
    >
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Ticket
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Driver Name
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Employee
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
          </tr>
        </thead>
        <tbody v-if="corporateTrips.length">
          <tr v-for="trip in corporateTrips" :key="trip._id">
            <!-- <tr v-for="trip in 10" :key="trip"> -->
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="whitespace-no-wrap">
                {{ trip.ticket ? trip.ticket.code : "-" }}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              {{ trip.driver.firstName + " " + trip.driver.lastName }}
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              {{ trip.employee ? `${trip.employee.name} (${trip.employee.phone})` : '-' }}
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
                {{ trip.fare }}
              </p>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <!-- <tbody> -->
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
                <span class="block">No latest rides!</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
// import moment from "moment";
export default {
  props: ["corporate"],
  data() {
    return {
      corporates: [],
      corporateTrips: [],
      range: {
        start: null,
        end: null,
      },
      loading: false,
    };
  },
  computed: {
    fareSum() {
      return this.corporateTrips.length
        ? this.corporateTrips
            .map((trip) => trip.fare)
            .reduce((fare, current) => fare + current)
            .toFixed(2)
        : 0;
    },
  },
  watch: {
    corporate() {
      this.getCorporateTrips();
    },
    range: {
      deep: true,
      handler() {
        this.getCorporateTrips();
      },
    },
  },
  created() {
    this.getCorporateTrips();
  },
  methods: {
    getCorporateTrips() {
      // console.log(this.corporate);
      // this.$misc
      //   .get(`/corporates/${this.corporate._id}/trips`)
      //   .then((response) => (this.corporateTrips = response.data))
      //   .catch((err) => console.log(err));
      const { range } = this;
      let url = `/corporates/${this.corporate._id}/trips?populate=["driver", "passenger", "ticket"]`;

      if (range.start) url += `start=${new Date(range.start).toISOString()}`;
      if (range.end) url += `&end=${new Date(range.end).toISOString()}`;

      this.loading = true;
      this.$http
        .get(url)
        .then((response) => {
          this.corporateTrips = response.data.data;
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
