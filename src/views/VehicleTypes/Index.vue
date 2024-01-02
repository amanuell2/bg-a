<template>
  <div>
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Vehicle type</h2>
      </div>
      <div class="inline-flex justify-end w-full gap-4 my-2">
        <div v-if="!adjustingOrder">
          <router-link to="/vehicle-types/add">
            <button
              class="h-10 px-4 mx-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Add Vehicle Type
            </button>
          </router-link>
          <button
            class="h-10 px-4 mx-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
            @click="adjustingOrder = true"
          >
            Adjust Ordering
          </button>
        </div>
        <div v-else>
          <button
            class="h-10 px-4 mx-2 font-semibold text-white bg-green-500 rounded hover:bg-green-700"
            @click="applyOrder"
          >
            Done Sorting
          </button>
        </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full overflow-y-visible leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"
                v-if="adjustingOrder"
              >
                Order
              </th>

              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Image
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Base Fare
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Price Per KM
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Price Per MIN
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Pool Base Fare
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Pool Price Per KM
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Pool Price Per MIN
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Number of seats
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                City
              </th>
              <th class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody class="" v-if="vehicleTypes.length">
            <tr
              v-for="(vehicleType, index) in vehicleTypes"
              :key="vehicleType._id"
            >
              <td
                class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                v-if="adjustingOrder"
              >
                {{ index + 1 }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">{{ vehicleType.name }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <img
                  class="object-cover w-16 h-16 rounded-lg"
                  :src="
                    vehicleType.photo ||
                    'https://img.pngio.com/error-inoperative-invalid-none-nothing-null-void-icon-nothing-png-512_512.png'
                  "
                />
              </td>

              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ vehicleType.baseFare || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.pricePerKM || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.pricePerMin || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ vehicleType.poolBaseFare || "-" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.poolPricePerKM || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.poolPricePerMin || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.numberOfSeats || "0.0" }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ vehicleType.city || "-" }}
              </td>
              <td
                class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200"
                v-if="!adjustingOrder"
              >
                <div class="relative inline-block text-left">
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
                            ? 'vehicle-type-dropdown-trigger-' + ref
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
                      class="absolute right-0 z-30 w-56 origin-top-right rounded-md shadow-lg"
                      :ref="
                        openDropdown === index
                          ? 'vehicle-type-dropdown-' + ref
                          : ''
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
                            :to="`/vehicle-types/${vehicleType._id}/edit`"
                            class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            Edit
                          </router-link>
                        </div>
                        <div class="border-t border-gray-100"></div>
                        <div class="py-1">
                          <button
                            type="button"
                            @click="openConfirmBox"
                            class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
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
                                        @click="remove(index)"
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
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </td>
              <td
                class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200"
                v-else
              >
                <div class="inline-flex gap-4">
                  <button
                    class="h-10 p-2 text-green-500 shadow"
                    v-if="index != 0"
                    @click="moveItem(vehicleType._id, -1)"
                    :disabled="orderingUnderProgress"
                  >
                    <i class="material-icons">arrow_upward</i>
                  </button>
                  <button
                    class="h-10 p-2 text-red-500 shadow"
                    @click="moveItem(vehicleType._id, +1)"
                    :disabled="orderingUnderProgress"
                  >
                    <i class="material-icons">arrow_downward</i>
                  </button>
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
                  <span class="block">No vehicle types found!</span>
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
import PaginationMixin from "@/mixins/Pagination";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      vehicleTypes: [],
      openDropdown: false,
      loading: true,
      confirmOpen: false,
      deleting: false,
      adjustingOrder: false,
      orderingUnderProgress: false,
      ref: "",
      perPage: 10,
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.getVehicleTypes();
    this.ref = Math.random().toString(36).substr(2, 5);
  },
  watch: {
    currentPage() {
      this.getVehicleTypes();
    },
    openDropdown(newVal) {
      if (newVal !== false) {
        document.body.addEventListener("click", this.clickAwayHandler);
      } else {
        document.body.removeEventListener("click", this.clickAwayHandler);
      }
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
    getVehicleTypes() {
      this.loading = true;
      this.paginator = {
        count: 0,
        nextPage: 1,
        prevPage: null,
      };
      return this.$misc
        .get(`vehicleTypes?page=${this.currentPage}`)
        .then((response) => {
          this.vehicleTypes = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    openConfirmBox() {
      this.confirmOpen = true;
    },
    closeConfirmBox() {
      this.confirmOpen = false;
    },
    remove(index) {
      this.deleting = true;
      this.$misc
        .delete(`/vehicleTypes/${this.vehicleTypes[index]._id}`)
        .then(() => {
          this.vehicleTypes.splice(index, 1);
          window.flash({ type: "success", body: "Vehicle type deleted!" });
          this.openDropdown = false;
        })
        .catch(() => {
          window.flash({
            type: "error",
            body: "Vehicle type couldn't be deleted!",
          });
        })
        .finally(() => {
          this.deleting = false;
          this.openDropdown = false;
          this.confirmOpen = false;
        });
    },
    moveItem(id, direction) {
      this.orderingUnderProgress = true;

      this.$misc
        .post(`/vehicleTypes/adjust-order`, {
          id,
          direction,
        })
        .then(() => {
          return this.getVehicleTypes();
        })
        .catch(() => {
          window.flash({
            type: "error",
            body: "Error while adjusting the sorting order!",
          });
        })
        .finally(() => {
          this.orderingUnderProgress = false;
        });
    },
    applyOrder() {
      this.adjustingOrder = false;
    },
    cancelOrdering() {
      this.orderChanges = {};
      this.adjustingOrder = false;
    },
    clickAwayHandler(e) {
      console.log(this.$refs["vehicle-type-dropdown-" + this.ref]);
      if (
        (this.$refs["vehicle-type-dropdown-trigger-" + this.ref] &&
          this.$refs["vehicle-type-dropdown-trigger-" + this.ref][0].contains(
            e.target
          )) ||
        (this.$refs["vehicle-type-dropdown-" + this.ref] &&
          this.$refs["vehicle-type-dropdown-" + this.ref][0].contains(e.target))
      ) {
        return;
      }

      this.openDropdown = false;
    },
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.clickAwayHandler);
  },
};
</script>
