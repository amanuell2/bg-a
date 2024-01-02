<template>
  <div class="p-8">
    <div>
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">SOS LIST</h2>
      </div>

      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input
            class="w-full py-2 pl-10 pr-4 border rounded"
            v-model="searchText"
            placeholder="Search"
            @keyup="search"
          />
          <ul
            v-if="results && results.length"
            class="absolute mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
          >
            <li
              v-for="(result, index) in results"
              :key="`driver-${index}`"
              class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
              @click="filterSos('driver', result)"
            >
              {{ result.firstName + " " + result.lastName }},
              {{ result.phoneNumber }}, Driver
            </li>

            <li
              v-for="(result, index) in results"
              :key="`passenger-${index}`"
              class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
              @click="filterSos('passenger', result)"
            >
              {{ result.firstName + " " + result.lastName }},
              {{ result.phoneNumber }}, passenger
            </li>
          </ul>
        </div>

        <div class="w-48">
          <select class="w-full form-select" v-model="type" @change="getSos">
            <option :selected="type === 'all'" value="all">All</option>
            <option :selected="type === 'passenger'" value="passenger">
              Passenger
            </option>
            <option :selected="type === 'driver'" value="driver">Driver</option>
          </select>
        </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Driver Fullname
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Passanger Fullname
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Driver Phonenumber
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Passanger Phonenumber
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Happened AT
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              ></th>
            </tr>
          </thead>
          <tbody class v-if="allSos.length">
            <tr v-for="sos in allSos" :key="sos._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <router-link
                  :to="{ path: '/drivers/' + sos.driver._id }"
                  class="whitespace-no-wrap"
                  >{{
                    sos.driver.firstName + " " + sos.driver.lastName || "__"
                  }}</router-link
                >
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    sos.passenger.firstName + " " + sos.passenger.lastName ||
                    "__"
                  }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ sos.driver.phoneNumber || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ sos.passenger.phoneNumber || "-" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ sos.type || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ formatDate(sos.createdAt) }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p v-if="sos.trip" class="text-gray-900 whitespace-no-wrap">
                  <a :href="'/rides/' + sos.trip + '/show'" target="self"
                    ><i class="mr-2 material-icons">visibility</i></a
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
                colspan="7"
                class="py-4 font-semibold text-center text-gray-600 bg-white"
              >
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No SOS History found!</span>
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
import _ from "lodash";
import PaginationMixin from "@/mixins/Pagination";
import Pagination from "@/components/Pagination";
// import moment from "moment";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      allSos: [],
      openDropdown: false,
      loading: true,
      drivers: [],
      passengers: [],
      passengerId: "",
      driverId: "",
      searchText: "",
      type: "all",
      results: [],
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.getSos();
  },
  watch: {
    currentPage() {
      this.getSos();
    },
    perPage() {
      this.getSos();
    },
  },
  computed: {
    passengersComputed() {
      return this.results.length ? this.results : this.allSos;
    },
  },
  methods: {
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    getSos() {
      this.loading = true;
      var path = `/sos?limit=${this.perPage}&page=${this.currentPage}&populate=["driver","passenger","vehicle"]`;

      if (this.passengerId) {
        path += "&passenger=" + this.passengerId;
      }

      if (this.type && this.type != "all") {
        path += "&type=" + this.type;
      }

      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }

      this.$http
        .get(path)
        .then((response) => {
          this.allSos = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    filterSos(type, data) {
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
          data.firstName +
          " " +
          data.lastName +
          ", " +
          data.phoneNumber +
          ", " +
          type;
      }

      this.getSos();
    },
    search: _.debounce(function (e) {
      if (!e.target.value.trim()) {
        this.results = [];
        this.drivers = [];
        this.passengers = [];
        this.driverId = "";
        this.passengerId = "";
        this.getSos();
        return;
      }

      this.$http
        .get(`/drivers/search?limit=5&q=${e.target.value}`)
        .then((response) => {
          this.drivers = response.data;
          this.results = response.data;
        })
        .catch((err) => console.log(err));

      this.$http
        .get(`/users/search?limit=5&q=${e.target.value}`)
        .then((response) => {
          this.passengers = response.data;
        })
        .catch((err) => console.log(err));
    }, 500),
    remove(index) {
      //   this.$http
      //     .delete(`/passengers/${this.passengers[index]._id}`)
      //     .then(response => console.log(response))
      //     .catch(err => console.log(err));
      this.sos.splice(index, 1);
      this.openDropdown = false;
    },
    formatDate(date) {
      return date ? date.replace("T", " ").slice(0, 16) : "-";

      // return moment(date).format("MMM D, YYYY HH:mm");
    },
  },
};
</script>
