<template>
  <div>
    <div class="space-y-4">
      <div>
        <div class="flex justify-between mb-4">
          <div class="flex">
            <div class="flex">
              <div class="relative w-full max-w-sm">
                <div class="pr-3">
                  <label class="block">
                    <span class="text-gray-700">Search driver</span>
                    <input
                      class="w-full py-2 pl-10 pr-4 border rounded"
                      v-model="searchText"
                      placeholder="Search"
                      @keyup="search"
                    />
                  </label>
                </div>
                <ul
                  v-if="drivers.length"
                  class="absolute mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
                >
                  <li
                    v-for="(result, index) in drivers"
                    :key="`driver-${index}`"
                    class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                    @click="filterFinance('driver', result)"
                  >
                    {{ result.firstName + " " + result.lastName }},
                    {{ result.phoneNumber }}
                  </li>
                </ul>
              </div>
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

            <div>
              <button
                class="px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                @click="filter"
              >
                Filter
              </button>
            </div>
          </div>

          <div class="pt-6 pr-3 text-blue-500">
            <export-button
              class="border-blue-500"
              :downloadUrl="reportDownloadUrl"
              :working="loading"
            ></export-button>
          </div>
        </div>

        <div class="flex">
          <div class="w-1/2 mr-4">
            <div class="p-4 space-y-2 border rounded-lg">
              <h2 class="font-semibold text-gray-600 uppercase">Trip</h2>
              <div class="flex flex-wrap -mx-4 -mt-4">
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div class="text-3xl text-indigo-600">ETB</div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Normal Trips</p>
                        <p class="text">
                          Fare - {{ finance.normalTripsFare.toFixed(2) }}
                        </p>
                        <p class="text">
                          Net - {{ finance.normalTripsNet.toFixed(2) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-blue-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Corporate Trips</p>
                        <p class="text">
                          Fare - {{ finance.corporateTripsFare.toFixed(2) }}
                        </p>
                        <p class="text">
                          Net - {{ finance.corporateTripsNet.toFixed(2) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-green-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Tax</p>
                        <p class="text-4xl">
                          {{
                            (
                              finance.normalTripsTax + finance.corporateTripsTax
                            ).toFixed(2)
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-teal-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Total</p>
                        <p class="text-1xl">
                          Fare -
                          {{
                            (
                              finance.normalTripsFare +
                              finance.corporateTripsFare
                            ).toFixed(2)
                          }}
                        </p>
                        <p class="text-1xl">
                          Net -
                          {{
                            (
                              finance.normalTripsNet + finance.corporateTripsNet
                            ).toFixed(2)
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <div class="p-4 space-y-2 border rounded-lg">
              <h2 class="font-semibold text-gray-600 uppercase">Rent</h2>
              <div class="flex flex-wrap -mx-4 -mt-4">
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-indigo-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Rent Fare</p>
                        <p class="text-4xl">
                          {{ finance.rentFare.toFixed(2) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-blue-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Rent Net</p>
                        <p class="text-4xl">{{ finance.rentNet.toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-1/2">
                  <div class="p-4">
                    <div
                      class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                      style="min-height: 150px"
                    >
                      <div>
                        <div class="text-3xl text-green-600">ETB</div>
                      </div>
                      <div class="font-semibold">
                        <p class="text-gray-600">Rent Tax</p>
                        <p class="text-4xl">{{ finance.rentTax.toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h2 class="font-semibold text-gray-600 uppercase">Payment Summery</h2>
        </div>
        <div class="flex">
          <div class="w-1/3">
            <div class="p-4">
              <div
                class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                style="min-height: 150px"
              >
                <div>
                  <div class="text-3xl text-green-600">ETB</div>
                </div>
                <div class="font-semibold">
                  <p class="text-gray-600">Fare</p>
                  <p class="text-4xl">
                    {{
                      (
                        finance.normalTripsFare +
                        finance.corporateTripsFare +
                        finance.rentFare
                      ).toFixed(2)
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-1/3">
            <div class="p-4">
              <div
                class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                style="min-height: 150px"
              >
                <div>
                  <div class="text-3xl text-indigo-600">ETB</div>
                </div>
                <div class="font-semibold">
                  <p class="text-gray-600">Tax</p>
                  <p class="text-4xl">
                    {{
                      (
                        finance.corporateTripsTax +
                        finance.normalTripsTax +
                        finance.rentTax
                      ).toFixed(2)
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="w-1/3">
            <div class="p-4">
              <div
                class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow"
                style="min-height: 150px"
              >
                <div>
                  <div class="text-3xl text-green-600">ETB</div>
                </div>
                <div class="font-semibold">
                  <p class="text-gray-600">Net</p>
                  <p class="text-4xl">
                    {{
                      (
                        finance.normalTripsNet +
                        finance.corporateTripsNet +
                        finance.rentNet
                      ).toFixed(2)
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-gray-600 uppercase">Payment records</h2>
      </div>

      <div class="flex justify-between">
        <div class="w-64 pt-1">
          <select
            class="w-full form-select"
            v-model="selectedFilter"
            @change="getRides"
          >
            <option :selected="selectedFilter === 'all'" value="all">
              All
            </option>
            <option
              :selected="selectedFilter === 'Completed'"
              value="Completed"
            >
              Completed
            </option>
            <option :selected="selectedFilter === 'Canceled'" value="Canceled">
              Canceled
            </option>
            <option :selected="selectedFilter === 'Started'" value="Started">
              Started
            </option>
          </select>
        </div>
        <div class="pr-3 text-blue-500">
          <export-button
            class="border-blue-500"
            :downloadUrl="tripsReportDownloadUrl"
            :working="loading"
          ></export-button>
        </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full leading-normal responsive">
          <thead>
            <tr>
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
                style="min-width: 200px"
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
                Type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Vehicle Type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Fare
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Status
              </th>

              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              ></th>
            </tr>
          </thead>
          <tbody class="relative" v-if="rides.length">
            <tr v-for="trip in rides" :key="trip._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ trip.passenger.firstName + " " + trip.passenger.lastName }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    trip.driver
                      ? trip.driver.firstName + " " + trip.driver.lastName
                      : "-"
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div>
                  <div class="flex items-center space-x-2">
                    <i class="text-green-600 material-icons">location_on</i>
                    <span>{{ trip.pickUpAddress ? trip.pickUpAddress.name : "-" }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="text-red-600 material-icons">location_on</i>
                    <span>{{ trip.dropOffAddress? trip.dropOffAddress.name :"-" }}</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ formatDate(trip.createdAt) }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ trip.type }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ trip.vehicleType.name }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ (trip.fare || 0).toFixed(2) }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ trip.status }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  <router-link :to="'/finance/' + trip._id + '/show'"
                    ><i class="mr-2 material-icons">visibility</i></router-link
                  >
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
                colspan="13"
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
import _ from "lodash";
import PaginationMixin from "@/mixins/Pagination";
import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      rides: [],
      openDropdown: false,
      loading: true,
      selectedFilter: "all",
      startDate: null,
      searchText: "",
      range: {
        start: null,
        end: null,
      },
      drivers: [],
      passengers: [],
      passengerId: "",
      driverId: "",
      finance: {
        normalTripsFare: 0,
        normalTripsNet: 0,
        normalTripsTax: 0,
        corporateTripsFare: 0,
        corporateTripsNet: 0,
        corporateTripsTax: 0,
        rentFare: 0,
        rentNet: 0,
        rentTax: 0,
      },
    };
  },
  components: {
    ExportButton,
    Pagination,
  },
  watch: {
    currentPage() {
      this.getRides();
    },
    perPage() {
      this.currentPage === 1 ? this.getRides() : (this.currentPage = 1);
    },
  },
  created() {
    var sd = new Date();
    sd.setDate(0);
    sd.setDate(1);
    var ed = new Date();
    ed.setMonth(ed.getMonth() + 1);
    ed.setDate(0);
    this.range.start = sd;
    this.range.end = ed;
    this.getFinance();
    this.getRides();
  },
  computed: {
    driverFilter() {
      return this.$route.query.driver || null;
    },
    riderFilter() {
      return this.$route.query.passenger || null;
    },
    tripsReportDownloadUrl() {
      var path = `trips/export?limit=${this.perPage}&page=${this.currentPage}&populate=["driver","passenger","vehicleType"]&from=${this.range.start}&to=${this.range.end}`;

      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }
      if (this.selectedFilter && this.selectedFilter != "all") {
        path += "&status=" + this.selectedFilter;
      }

      return path;
    },
    reportDownloadUrl() {
      var path = `finance/export?from=${this.range.start}&to=${this.range.end}`;
      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }
      return path;
    },
  },
  methods: {
    filter() {
      this.getFinance();
      this.getRides();
    },
    filterFinance(type, data) {
      this.passengerId = "";
      this.driverId = "";
      this.drivers = [];
      this.passengers = [];

      if (type == "passenger") {
        this.passengerId = data._id;
        this.searchText =
          data.firstName +
          " " +
          data.lastName +
          ", " +
          data.phoneNumber +
          ", " +
          type;
      } else if (type == "driver") {
        this.driverId = data._id;
        this.searchText =
          data.firstName + " " + data.lastName + ", " + data.phoneNumber;
      }
    },
    getFinance() {
      var path = `finance?from=${this.range.start}&to=${this.range.end}`;
      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }
      this.$misc
        .get(path)
        .then((response) => {
          this.finance = response.data;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    formatDate(date) {
      return date ? date.replace("T", " ").slice(0, 16) : "-";

      // return moment(date).format("MMM D, YYYY HH:mm");
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    search: _.debounce(function (e) {
      if (!e.target.value.trim()) {
        this.results = [];
        this.drivers = [];
        this.passengers = [];
        this.driverId = "";
        this.passengerId = "";
        this.getRides();
        return;
      }

      this.$misc
        .get(`/drivers/search?limit=5&q=${e.target.value}`)
        .then((response) => {
          this.drivers = response.data;
        })
        .catch((err) => console.log(err));
    }, 500),
    getRides() {
      this.loading = true;
      var path = `trips?limit=${this.perPage}&page=${this.currentPage}&populate=["driver","passenger","vehicleType"]&from=${this.range.start}&to=${this.range.end}`;

      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }
      if (this.selectedFilter && this.selectedFilter != "all") {
        path += "&status=" + this.selectedFilter;
      }

      console.log(path);

      this.$misc
        .get(path)
        .then((response) => {
          this.rides = response.data.data;
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
