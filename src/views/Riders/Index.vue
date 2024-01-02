<template>
  <div>
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Passengers</h2>
        <!--         <router-link
          to="/passengers/add"
          class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Add Passenger
        </router-link> -->
      </div>

      <div class="flex items-center w-full justify-between">
        <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input
            class="w-full py-2 pl-10 pr-4 border rounded"
            placeholder="Search"
            v-model="q"
          />
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
        <div class="pt-5 pr-3 text-blue-500">
            <export-button
              class="border-blue-500"
              :downloadUrl="reportDownloadUrl"
              :working="loading"
            ></export-button>
          </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Email
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Contact Number
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Rating
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Image
              </th>
              <th class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody v-if="passengers.length" class="relative">
            <!-- <tr v-for="(passenger, index) in passengers" :key="passenger._id"> -->
            <tr v-for="(passenger, index) in passengers" :key="passenger._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">
                  {{ passenger.firstName + " " + passenger.lastName }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ passenger.email || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ passenger.phoneNumber || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ passenger.rating || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <img
                  class="object-fill w-10 h-10 rounded-full"
                  v-bind:src="
                    passenger.profileImage ||
                    'https://img.pngio.com/error-inoperative-invalid-none-nothing-null-void-icon-nothing-png-512_512.png'
                  "
                />
              </td>
              <td
                class="px-5 py-5 text-sm text-center bg-white border-b border-gray-200"
              >
                <!-- <div class="relative inline-block text-left">
                  <div>
                    <span class="rounded-md shadow-sm">
                      <button
                        @click="toggleDropdown(index)"
                        type="button"
                        class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        aria-haspopup="true"
                        :aria-expanded="openDropdown === index"
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
                      class="absolute right-0 z-50 w-56 origin-top-right rounded-md shadow-lg"
                    >
                      <div
                        class="bg-white rounded-md shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div class="py-1"> -->
                <router-link
                  :to="`/rides?passenger=${passenger._id}`"
                  class="px-4 py-2 text-sm leading-5 text-gray-700 border rounded hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                  >Trip History</router-link
                >
                <div @click.stop class="relative inline-block text-left">
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
                            ? 'drivers-dropdown-trigger-' + ref
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
                        openDropdown === index ? 'drivers-dropdown-' + ref : ''
                      "
                    >
                      <div
                        class="bg-white rounded-md shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div class="border-t border-gray-100"></div>
                        <div class="py-1">
                          <router-link
                            :to="`passengers/${passenger._id}/edit`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i class="material-icons">edit</i>
                            <span>Edit</span>
                          </router-link>
                        </div>
                        <!-- <div class="border-t border-gray-300"></div>
                        <div class="py-1">
                          <button
                            @click="openConfirmBox"
                            type="button"
                            class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-red-700 hover:bg-red-200 hover:text-red-800 focus:outline-none focus:bg-red-200 focus:text-red-800"
                            role="menuitem"
                          >
                            <i class="material-icons">delete</i>
                            <span>Delete</span>
                            <portal to="modals">
                              <transition
                                enter-active-class="transition duration-100 ease-out"
                                enter-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                              >
                                <div
                                  v-if="confirmOpen"
                                  @click="closeConfirmBox"
                                  class="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
                                >
                                  <div
                                    @click.stop
                                    class="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg"
                                  >
                                    <div class="bg-gray-100">
                                      <h3
                                        class="px-6 py-4 font-semibold text-gray-600"
                                      >
                                        Confirm Delete
                                      </h3>
                                    </div>
                                    <div
                                      class="flex items-center px-6 py-6 space-x-4"
                                    >
                                      <i class="text-4xl material-icons">
                                        warning
                                      </i>
                                      <div>
                                        <p>
                                          Are you sure you want to delete this
                                          driver?
                                        </p>
                                        <p>
                                          <em class="text-sm text-gray-600">
                                            This action can not be undone!
                                          </em>
                                        </p>
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      class="flex items-end justify-between px-6 py-4"
                                    >
                                      <button
                                        @click="closeConfirmBox"
                                        type="button"
                                        class="px-4 py-2 text-gray-600 hover:text-gray-900"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        @click="deleteDriver(driver._id)"
                                        type="button"
                                        :disabled="deleting"
                                        class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
                                        :class="
                                          deleting
                                            ? 'bg-red-100 text-red-500 cursor-not-allowed'
                                            : 'bg-red-200 text-red-700 hover:text-red-800 hover:border-red-800'
                                        "
                                      >
                                        <i
                                          v-if="deleting"
                                          class="text-red-700 material-icons spin"
                                        >
                                          sync
                                        </i>
                                        <i v-else class="material-icons">
                                          delete
                                        </i>
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </transition>
                            </portal>
                          </button>
                        </div> -->
                      </div>
                    </div>
                  </transition>
                </div>
                <!--
                        </div>
                        <div class="border-t border-gray-100"></div>
                        <div class="py-1">
                          <router-link
                            :to="`/passengers/${passenger._id}/edit`"
                            class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            Edit
                          </router-link>
                        </div>
                        <div class="border-t border-gray-100"></div>
                        <div class="py-1">
                          <button
                            @click="remove(index)"
                            type="button"
                            class="w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-red-100 hover:text-red-900 focus:outline-none focus:bg-red-100 focus:text-red-900"
                            role="menuitem"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div> -->
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
                  <span class="block">No passengers found!</span>
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
import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      allRiders: [],
      openDropdown: false,
      loading: true,
      results: [],
      q: "",
      range: {
        start: null,
        end: null,
      },
    };
  },
  components: {
    Pagination,
    ExportButton,
  },
  created() {
    this.getRiders();
  },
  computed: {
    passengers() {
      return this.results.length ? this.results : this.allRiders;
    },
    reportDownloadUrl() {
      return (
        "users/export?" + Object.entries({
          ...Object.fromEntries(
            Object.entries({
              q: this.q,
              from: this.range.start ? this.range.start : undefined,
              to : this.range.end ? this.range.end : undefined,
            }).filter(([key, val]) => key && val)
          ),
        })
          .map(([key, value]) => [key, value].join("="))
          .join("&")
      );
    },
  },
  watch: {
    currentPage() {
      this.getRiders();
    },
    range: {
      handler() {
        this.getRiders();
      },
      deep: true,
    },
    perPage() {
      this.currentPage === 1 ? this.getRiders() : (this.currentPage = 1);
    },
    q() {
      this.currentPage = 1;
      this.getRiders();
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
    getRiders() {
      this.loading = true;
      let path = `users/admin-search?q=${this.q}&limit=${this.perPage}&page=${this.currentPage}`;
      if (this.range && this.range.start && this.range.end) {
        path += "&from=" + this.range.start + "&to=" + this.range.end;
      }
      this.$misc
        .get(
          path
        )
        .then((response) => {
          this.allRiders = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    search: _.debounce(function (e) {
      if (!e.target.value.trim()) {
        this.results = [];
      }

      this.$misc
        .get(`/users/search?q=${e.target.value}`)
        .then((response) => {
          this.results = response.data;
        })
        .catch((err) => console.log(err));
    }, 500),
    remove(index) {
      //   this.$misc
      //     .delete(`/passengers/${this.passengers[index]._id}`)
      //     .then(response => console.log(response))
      //     .catch(err => console.log(err));
      this.passengers.splice(index, 1);
      this.openDropdown = false;
    },
  },
};
</script>
