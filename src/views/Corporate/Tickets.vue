<template>
  <div @click="openDropdown = false">
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Tickets</h2>
      </div>

      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input
            v-model="searchKey"
            @keyup="getTickets"
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
                code
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                elmployee name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Active
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Created
              </th>
            </tr>
          </thead>
          <tbody class="relative" v-if="tickets.length">
            <tr v-for="ticket in tickets" :key="ticket._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ ticket.code }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ ticket.employee ? ticket.employee.name : "" }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ ticket.active }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ formatDate(ticket.createdAt) }}
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
                  <span class="block">No Tickets!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-end justify-between" v-if="!results.length">
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
// import moment from 'moment';

export default {
  mixins: [PaginationMixin],
  props: ["corporate"],
  data() {
    return {
      allTickets: [],
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
    corporate() {
      this.getTickets();
    },
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
      // return moment(date).format("MMM D, YYYY HH:mm");
      return date ? date.replace("T", " ").slice(0, 16) : "-";
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
      this.$misc
        .get(
          `corporates/${
            this.corporate._id
          }/tickets?populate=["employee"]&page=${this.currentPage}${
            this.searchKey ? "&q=" + this.searchKey : ""
          }&limit=${this.perPage}&${active !== null ? "active=" + active : ""}`
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
            employeeName: this.employeeName,
          })
          .then((response) => {
            this.employeeName = "";
            console.log({ response });
            this.getTickets();
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
