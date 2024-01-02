<template>
  <div @click="openDropdown = false">
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Employees</h2>
        <div class="flex">
          <router-link
            to="/corporate/employees/add"
            class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Add Employee
          </router-link>
        </div>
      </div>

      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input
            v-model="searchKey"
            @keyup="getEmployees"
            class="w-full py-2 pl-10 pr-4 border rounded"
            placeholder="Search"
          />
        </div>
        <div class="w-64">
          <select class="w-full form-select" @change="setActiveFilter">
            <option :selected="selectedActiveFilter === 'both'" value="both">
              All Status
            </option>
            <option
              :selected="selectedActiveFilter === 'active'"
              value="active"
            >
              Active
            </option>
            <option
              :selected="selectedActiveFilter === 'inactive'"
              value="inactive"
            >
              Inavtive
            </option>
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
                id
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                elmployee name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                phone number
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Active
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              ></th>
            </tr>
          </thead>
          <tbody class="relative" v-if="employees.length">
            <tr v-for="(employee, index) in employees" :key="employee._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ employee._id }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ employee.name }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ employee.phone }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ employee.active }}
                </p>
              </td>
              <td
                class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200"
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
                    >
                      <div
                        class="bg-white rounded-md shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <!-- <div class="py-1">
                          <router-link
                            :to="`rides?driver=${employee._id}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i class="material-icons">history</i>
                            <span>Trip History</span>
                          </router-link>
                        </div>
                        <div class="border-t border-gray-100"></div> -->
                        <div class="py-1">
                          <!-- <router-link
                            :to="`drivers/${employee._id}/edit`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i class="material-icons">edit</i>
                            <span>Edit</span>
                          </router-link> -->
                          <button
                            @click="toggleActive(employee._id, employee.active)"
                            type="button"
                            class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i v-if="employee.active" class="material-icons">
                              close
                            </i>
                            <i v-else class="material-icons">check</i>
                            <span>{{
                              employee.active ? "Make Inactive" : "Make Active"
                            }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </transition>
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
                colspan="7"
                class="py-4 font-semibold text-center text-gray-600 bg-white"
              >
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No Employees!</span>
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
      employees: [],
      openDropdown: false,
      loading: true,
      searchKey: "",
      confirmOpen: false,
      deleting: false,
      selectedActiveFilter: "both",
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.getEmployees();
  },
  mounted() {
    document.body.addEventListener("keyup", this.escapeListener);
  },
  beforeDestroy() {
    document.body.removeEventListener("keyup", this.escapeListener);
    document.body.removeEventListener("click", this.clickAwayHandler);
  },
  watch: {
    selectedActiveFilter() {
      this.getEmployees();
    },
    currentPage() {
      this.getEmployees();
    },
    perPage() {
      this.currentPage === 1 ? this.getEmployees() : (this.currentPage = 1);
    },
    openDropdown(newVal) {
      if (newVal !== false) {
        document.body.addEventListener("click", this.clickAwayHandler);
      } else {
        document.body.removeEventListener("click", this.clickAwayHandler);
      }
    },
  },
  computed: {
    corporateId() {
      return this.$store.state.auth.account.corporate._id;
    },
  },
  methods: {
    setActiveFilter(e) {
      this.selectedActiveFilter = e.target.value;
    },
    escapeListener(e) {
      if (e.keyCode === 27) {
        this.closeConfirmBox();
      }
    },
    getEmployees() {
      let active;

      if (this.selectedActiveFilter === "active") {
        active = true;
      } else if (this.selectedActiveFilter === "inactive") {
        active = false;
      } else {
        active = null;
      }

      this.loading = true;
      this.$http
        .get(
          `corporates/${this.corporateId}/employees?page=${this.currentPage}${
            this.searchKey ? "&q=" + this.searchKey : ""
          }&limit=${this.perPage}&${active !== null ? "active=" + active : ""}`
        )
        .then((response) => {
          this.employees = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    toggleActive(id, active) {
      this.loading = true;
      this.openDropdown = false;
      this.$misc
        .patch(`employees/${id}`, { active: !active })
        .then(() => {})
        .catch((err) => console.log(err))
        .finally(() => this.getEmployees());
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    clickAwayHandler(e) {
      if (
        (this.$refs["drivers-dropdown-trigger-" + this.ref] &&
          this.$refs["drivers-dropdown-trigger-" + this.ref][0].contains(
            e.target
          )) ||
        this.$refs["drivers-dropdown-" + this.ref] === e.target
      ) {
        return;
      }

      this.openDropdown = false;
    },
  },
};
</script>
