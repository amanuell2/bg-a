<template>
  <div @click="openDropdown = false">
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold uppercase text-gray-600">Tickets</h2>
        <div class="flex">
          <div class="w-1/2 mr-2">
            <input
              v-model="employeeName"
              @keyup="getEmployees"
              class="rounded border pl-4 py-2 w-full"
              placeholder="Employee name"
            />
            <ul
              v-if="employees.length"
              class="absolute max-h-56 mt-1 bg-white border rounded shadow overflow-y-auto"
            >
              <li
                v-for="(result, index) in employees"
                :key="`pickadd-${index}`"
                class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                v-bind:class="{
                  'bg-red-100 hover:bg-blue-700 hover:text-red-500 cursor-not-allowed':
                    result.disabled,
                }"
                @click="selectEmployee(result)"
              >
                {{ result.name }},
                {{ result.phone }}
              </li>
            </ul>
          </div>
          <div class="w-1/2">
            <button
              :disabled="selectedEmployee == null"
              @click="generateTicket"
              class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
            >Generate ticket</button>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <div class="relative max-w-sm w-full">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="material-icons text-gray-500">search</i>
          </div>
          <input
            v-model="searchKey"
            @keyup="getTickets"
            class="rounded border pl-10 pr-4 py-2 w-full"
            placeholder="Search"
          />
        </div>
        <div class="w-64">
          <select class="form-select w-full" @change="setActiveFilter">
            <option :selected="selectedActiveFilter === 'both'" value="both">All Status</option>
            <option :selected="selectedActiveFilter === 'active'" value="active">Active</option>
            <option :selected="selectedActiveFilter === 'inactive'" value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="inline-block min-w-full shadow rounded-lg mt-4">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >code</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >elmployee name</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >Active</th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >Created</th>
            </tr>
          </thead>
          <tbody class="relative" v-if="tickets.length">
            <tr v-for="ticket in tickets" :key="ticket._id">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ ticket.code }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p
                  class="text-gray-900 whitespace-no-wrap"
                >{{ ticket.employee ? ticket.employee.name : "" }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ ticket.active }}</p>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">{{ formatDate(ticket.createdAt) }}</p>
              </td>
            </tr>
            <div
              v-if="loading"
              class="absolute inset-0 h-full w-full flex items-center justify-center bg-black bg-opacity-25"
            >
              <i class="material-icons text-6xl spin">sync</i>
              <span class="block invisible">Loading...</span>
            </div>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="bg-white py-4 text-center text-gray-600 font-semibold">
                <div v-if="loading" class="inline-block">
                  <i class="material-icons text-6xl spin">sync</i>
                  <span class="block invisible">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="material-icons text-6xl">warning</i>
                  <span class="block">No Tickets!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-end" v-if="!results.length">
        <pagination
          class="space-x-2 flex"
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

// import moment from 'moment';

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      allTickets: [],
      employees: [],
      selectedEmployee: null,
      employeeName: "",
      openDropdown: false,
      loading: true,
      searchKey: "",
      confirmOpen: false,
      deleting: false,
      results: [],
      selectedActiveFilter: "both",
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.getTickets();
  },
  mounted() {
    document.body.addEventListener("keyup", this.escapeListener);
  },
  beforeDestroy() {
    document.body.removeEventListener("keyup", this.escapeListener);
  },
  watch: {
    selectedActiveFilter() {
      this.getTickets();
    },
    currentPage() {
      this.getTickets();
    },
    perPage() {
      this.currentPage === 1 ? this.getTickets() : (this.currentPage = 1);
    },
  },
  computed: {
    tickets() {
      return this.results.length ? this.results : this.allTickets;
    },
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
    formatDate(date) {
      return date ? date.replace("T", " ").slice(0, 16) : "-";

      // return moment(date).format("MMM D, YYYY HH:mm");
    },
    getTickets() {
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
          `corporates/${this.corporateId}/tickets?populate=["employee"]&page=${this.currentPage
          }${this.searchKey ? "&q=" + this.searchKey : ""}&limit=${this.perPage
          }&${active !== null ? "active=" + active : ""}`
        )
        .then((response) => {
          this.allTickets = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    getEmployees() {
      if (this.employeeName) {
        this.$http
          .get(
            `corporates/${this.corporateId}/employees?active=${true}&q=${this.employeeName
            }&limit=5`
          )
          .then((response) => {
            this.selectedEmployee = null;
            this.employees = response.data.data;
          })
          .catch((err) => console.log(err));
      } else {
        this.employees = [];
        this.selectedEmployee = null;
      }
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    // deleteDriver(id) {
    //   this.deleting = true;
    //   this.$misc
    //     .delete(`drivers/${id}`)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err))
    //     .finally(() => {
    //       this.deleting = false;
    //       this.confirmOpen = false;
    //       this.openDropdown = false;
    //       this.getTickets();
    //     });
    // },
    search: _.debounce(function (e) {
      if (e.target.value.trim() === "") {
        this.results = [];
        return;
      }

      this.$misc
        .get(`/tickets/search?q=${e.target.value}`)
        .then((response) => {
          this.results = response.data;
        })
        .catch((err) => console.log(err));
    }, 500),
    generateTicket() {
      if (this.employeeName) {
        this.$misc
          .post(`/tickets/generate/${this.$store.state.auth.account._id}`, {
            employee: this.selectedEmployee._id,
          })
          .then((response) => {
            this.employeeName = "";
            this.selectedEmployee = null;
            console.log({ response });
            this.getTickets();
          })
          .catch((err) => console.log(err));
      }
    },
    selectEmployee(employee) {
      this.selectedEmployee = employee;
      this.employeeName = employee.name + ", " + employee.phone;
      this.employees = [];
    },
  },
};
</script>
