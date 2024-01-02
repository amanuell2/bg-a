<template>
  <div class="p-8">
    <h2 class="font-semibold text-gray-600 uppercase">Push Notification</h2>
    <form @submit.prevent="send" class="flex pt-4 mt-4 border-t">
      <div class="w-1/3">
        <h3 class="text-xl">Send a Push Notification</h3>
        <div class="text-gray-600">Quickly send out a push notification to your users!</div>
      </div>
      <div class="w-2/3">
        <label class="block">
          <span class="text-gray-700">To</span>
          <select @change="setAudience" class="block w-full mt-1 form-select">
            <option value="driver">All Drivers</option>
            <option value="passenger">All Passengers</option>
            <option value="all">All</option>
          </select>
        </label>
        <label class="block mt-4">
          <span class="text-gray-700">Title</span>
          <input v-model="title" class="block w-full mt-1 form-input" placeholder="Fare change" />
        </label>
        <label class="block mt-4">
          <span class="text-gray-700">Message</span>
          <textarea
            v-model="body"
            class="block w-full mt-1 form-textarea"
            rows="3"
            placeholder="Push notification message..."
          ></textarea>
        </label>
        <label class="block mt-4">
          <span class="text-gray-700">Medium</span>
          <select v-model="medium" class="block w-full mt-1 form-select">
            <option value="push">Push Notification</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
          </select>
        </label>
        <div class="block mt-4">
          <button
            :disabled="busy"
            class="px-20 py-2 font-semibold rounded text-shuufare-900"
            :class="
              busy
                ? 'bg-shuufare-300 cursor-not-allowed'
                : 'bg-shuufare-500 hover:bg-shuufare-600'
            "
          >Send</button>
        </div>
      </div>
    </form>
    <hr class="my-6" />

    <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="text-gray-500 material-icons">search</i>
          </div>
          <input
            class="w-full py-2 pl-10 pr-4 border rounded"
            v-model="searchKey"
            placeholder="Search"
            @keyup="search"
          />
        </div>

        <div class="w-48">
          <select class="w-full form-select" v-model="type" @change="getNotifications">
            <option :selected="type === 'all'" value="all">All</option>
            <option :selected="type === 'passenger'" value="passenger">Passenger</option>
            <option :selected="type === 'driver'" value="driver">Driver</option>
          </select>
        </div>
      </div>
      <div class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >No #</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Sent To</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Message</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Sent On</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Medium</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Status</th>
              <th class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody v-if="notifications.length">
            <tr v-for="notification in notifications" :key="notification._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-600 whitespace-no-wrap">{{ notification._id }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ toString(notification.to) }}</p>
                <!-- <p class="text-gray-600 whitespace-no-wrap">967</p> -->
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="font-semibold text-gray-900 whitespace-no-wrap">{{ notification.title }}</p>
                <p class="text-gray-600 whitespace-no-wrap">{{ notification.body }}</p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p>{{ fromNow(notification.createdAt) }}</p>
                <p class="text-gray-600 whitespace-no-wrap">{{ formatDate(notification.createdAt) }}</p>
              </td>
              <td class="px-5 py-5 text-sm text-gray-600 bg-white border-b border-gray-200">
                <p>{{ notification.status.toUpperCase() }}</p>
              </td>
              <td class="px-5 py-5 text-sm text-gray-600 bg-white border-b border-gray-200">
                <p>{{ notification.medium.toUpperCase() }}</p>
              </td>
              <td class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200">
                <button type="button" class="inline-block text-gray-500 hover:text-gray-700">
                  <svg class="inline-block w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z"
                    />
                  </svg>
                </button>
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
          <tbody v-else class="bg-white">
            <tr>
              <td colspan="7">
                <p class="py-8 text-center uppercase">No notification!</p>
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
import moment from "moment";
import Pagination from "@/components/Pagination";
import PaginationMixin from "@/mixins/Pagination";

export default {
  mixins: [PaginationMixin],
  components: {
    Pagination
  },
  data() {
    return {
      busy: false,
      to: "driver",
      title: "",
      type: "all",
      searchKey: "",
      loading: true,
      body: "",
      notifications: [],
      change: "",
      medium: "push"
    };
  },
  created() {
    this.getNotifications();
  },
  watch: {
    currentPage() {
      this.getNotifications();
    },
    perPage() {
      this.getNotifications();
    }
  },
  methods: {
    getNotifications() {
      this.loading = true;
      var path = `/notifications?limit=${this.perPage}&page=${this.currentPage}`;

      if (this.searchKey) {
        path += "&q=" + this.searchKey;
      }

      if (this.type) {
        path += "&to=" + this.type;
      }

      this.$misc
        .get(path)
        .then(response => {
          this.notifications = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count
          };
          this.loading = false;
        })
        .catch(err => console.log(err));
    },
    setAudience(e) {
      if (["driver", "passenger", "all"].includes(e.target.value)) {
        this.to = e.target.value;
      }
    },
    search: _.debounce(function(e) {
      this.searchKey = e.target.value.trim();
      this.getNotifications();
    }, 500),
    send() {
      this.busy = true;
      if (!this.to) return;

      this.$misc
        .post(`/notifications/topic/${this.to}`, {
          title: this.title,
          body: this.body,
          medium: this.medium,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: "Notification sent successfully!"
          });
          this.getNotifications();
        })
        .catch(err => console.log(err))
        .finally(() => (this.busy = false));
    },
    formatDate(date) {
      return date ? date.replace('T', ' ').slice(0, 16) : '-'

      // return moment(date).format("MMM D, Y hh:mm A");
    },
    fromNow(date) {
      return moment(date).fromNow();
    },
    toString(to) {
      if (to === "driver") {
        return "All Drivers";
      }
      if (to === "passenger") {
        return "All Passengers";
      }
      if (to === "all") {
        return "All Users";
      }
    }
  }
};
</script>
