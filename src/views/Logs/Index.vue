<template>
  <div>
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Logs</h2>
        <select class="form-select" v-model="level" @change="getLogs">
            <option :selected="level === 'all'" value="all">
              All
            </option>
            <option :selected="level === 'info'" value="info">
              Info
            </option>
            <option :selected="level === 'error'" value="error">
              Error
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
            >time</th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >message</th>
          </tr>
        </thead>
        <tbody class="relative" v-if="logs.data && logs.data.length">
          <div
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25"
          >
            <i class="text-6xl material-icons spin">sync</i>
            <span class="invisible block">Loading...</span>
          </div>
          <tr v-else v-for="(log, index) in logs.data" :key="index">
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">{{ log.timestamp }}</td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">{{ log.message }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="py-4 font-semibold text-center text-gray-600 bg-white">
              <div v-if="loading" class="inline-block">
                <i class="text-6xl material-icons spin">sync</i>
                <span class="invisible block">Loading...</span>
              </div>
              <div v-else class="inline-block">
                <i class="text-6xl material-icons">warning</i>
                <span class="block">No logs found!</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex items-end justify-between">
      <p class="text-gray-600"></p>
      <div class="flex items-center space-x-4">
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
// import _ from "lodash";
import PaginationMixin from "@/mixins/Pagination";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      logs: [],
      loading: true,
      perPage: 30,
      level: "all",
      searchKey: ""
    };
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page;
    }
    this.getLogs();
  },
  components: {
    Pagination,
  },
  watch: {
    currentPage() {
      this.getLogs();
    },
    perPage() {
      this.currentPage === 1 ? this.getLogs() : (this.currentPage = 1);
    },
    selectedFilter() {
      this.getLogs();
    },
    range: {
      handler() {
        this.getLogs();
      },
      deep: true,
    },
    $route() {
      if (this.$route.query.status) {
        this.selectedFilter = this.$route.query.status;
      }
    },
  },
  methods: {
    getLogs() {
      this.loading = true;
      var path =
        'logs?limit=' + this.perPage + "&page=" + this.currentPage;

      if (this.searchKey) {
        path += "&q=" + this.searchKey;
      }

      if (this.level && this.level != "all") {
        path += "&level=" + this.level;
      }
      this.$misc
        .get(path)
        .then(response => {
          this.logs = response.data;
          this.paginator = {
            nextPage: response.data.data.nextPage,
            count: response.data.data.count
          };
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })

    }
  }
};
</script>