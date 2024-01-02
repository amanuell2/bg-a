<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="font-semibold text-gray-600 uppercase">Users</h2>
      <router-link
        to="/accounts/add"
        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        >Add User</router-link
      >
    </div>

    <div class="flex justify-between">
      <div class="relative w-full max-w-sm">
        <div class="absolute inset-y-0 flex items-center px-3">
          <i class="text-gray-500 material-icons">search</i>
        </div>
        <input
          @keyup="search"
          class="w-full py-2 pl-10 pr-4 border rounded"
          placeholder="Search"
        />
      </div>
    </div>

    <div class="inline-block min-w-full mt-4 rounded-lg shadow">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              ID
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Full name
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Email
            </th>
            <!-- <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Corporate
            </th> -->
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Role
            </th>
            <th
              class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
            >
              Status
            </th>
            <th class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"></th>
          </tr>
        </thead>
        <tbody class="relative" v-if="accounts.data && accounts.data.length">
          <tr v-for="(account, index) in accounts.data" :key="index">
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="whitespace-no-wrap">{{ account._id }}</p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="whitespace-no-wrap">
                {{ account.firstName + " " + account.lastName }}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ account.email }}
              </p>
            </td>
            <!-- <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ account.corporate ? account.corporate.name : "-" }}
              </p>
            </td> -->
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <span
                class="px-2 py-1 mr-2 text-xs text-white bg-teal-500 rounded-full"
                v-for="role in account.roles"
                :key="role._id"
              >
                {{ role.roleName }}</span
              >
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <span
                class="px-2 py-1 mr-2 text-xs text-white bg-teal-500 rounded-full"
                v-if="account.active"
              >
                Active</span
              >
              <span
                class="px-2 py-1 mr-2 text-xs text-white bg-red-500 rounded-full"
                v-else
              >
                Inactive</span
              >
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
                      :ref="
                        openDropdown === index
                          ? 'accounts-dropdown-trigger-' + ref
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
                      openDropdown === index ? 'accounts-dropdown-' + ref : ''
                    "
                  >
                    <div
                      class="bg-white rounded-md shadow-xs"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div class="py-1">
                        <router-link
                          :to="`accounts/${account._id}/edit`"
                          class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          <i class="material-icons">edit</i>
                          <span>Edit</span>
                        </router-link>
                      </div>
                      <div class="py-1">
                        <router-link
                          :to="`accounts/${account._id}/reset-password`"
                          class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          <i class="material-icons">vpn_key</i>
                          <span>Reset Password</span>
                        </router-link>
                      </div>
                      <button
                        @click="toggleActive(account._id)"
                        type="button"
                        class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        role="menuitem"
                      >
                        <i v-if="account.active" class="material-icons"
                          >close</i
                        >
                        <i v-else class="material-icons">check</i>
                        <span>
                          {{ account.active ? "Make Inactive" : "Make Active" }}
                        </span>
                      </button>
                      <div class="border-t border-gray-300"></div>
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
                                    <i class="text-4xl material-icons"
                                      >warning</i
                                    >
                                    <div>
                                      <p>
                                        Are you sure you want to delete this
                                        account?
                                      </p>
                                      <p>
                                        <em class="text-sm text-gray-600"
                                          >This action can not be undone!</em
                                        >
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
                                      @click="deleteAccount(account._id)"
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
                                        >sync</i
                                      >
                                      <i v-else class="material-icons"
                                        >delete</i
                                      >
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
                <span class="block">No user found!</span>
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
</template>

<script>
import _ from "lodash";
import PaginationMixin from "@/mixins/Pagination";
import Pagination from "@/components/Pagination";
// import { ROLES } from "@/config";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      accounts: [],
      openDropdown: false,
      perPage: 10,
      searchKey: "",
      loading: true,
      confirmOpen: false,
      deleting: false,
      ref: "",
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.getAccounts();
  },
  mounted() {
    this.ref = Math.random().toString(36).substr(2, 5);
  },
  watch: {
    currentPage() {
      this.getAccounts();
    },
    openDropdown(newVal) {
      if (newVal !== false) {
        document.body.addEventListener("click", this.clickAwayHandler);
      } else {
        document.body.removeEventListener("click", this.clickAwayHandler);
      }
    },
  },
  computed: {},
  methods: {
    // roleName(id) {
    //   return ROLES.resolveName(id);
    // },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
        document.body.removeEventListener("click", this.clickAwayHandler);
      } else {
        this.openDropdown = index;
        document.body.addEventListener("click", this.clickAwayHandler);
      }
    },
    getAccounts() {
      this.loading = true;
      var path = "accounts?&page=" + this.currentPage + "limit=" + this.perPage;

      if (this.searchKey) {
        path += "&q=" + this.searchKey;
      }
      this.$misc
        .get(path)
        .then((response) => {
          this.accounts = response.data;
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
    deleteAccount(id) {
      this.deleting = true;
      this.$misc
        .delete(`accounts/${id}`)
        .then((result) => {
          window.flash({
            type: "success",
            body: "User was deleted successfully!",
          });
          this.getAccounts();
          console.log(result);
        })
        .catch((err) => {
          window.flash({
            type: "error",
            body: "Failed to delete the user!",
          });
          console.log(err);
        })
        .finally(() => {
          this.deleting = false;
          this.confirmOpen = false;
          this.openDropdown = false;
          this.getAccounts();
        });
    },
    search: _.debounce(function (e) {
      this.searchKey = e.target.value.trim();
      this.getAccounts();
    }, 500),
    toggleActive(id) {
      const currentStatus = this.accounts.data.find(
        (account) => account._id === id
      ).active;
      this.$misc
        .patch(`/accounts/${id}`, {
          active: !currentStatus,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: currentStatus
              ? "User is now Inactive!"
              : "User is now Active!",
          });
          this.getAccounts();
        })
        .catch((err) => {
          window.flash({
            type: "error",
            body: "Failed to update user status!",
          });
          console.log(err);
        })
        .finally(() => (this.openDropdown = false));
    },
    clickAwayHandler(e) {
      if (
        (this.$refs["accounts-dropdown-trigger-" + this.ref] &&
          this.$refs["accounts-dropdown-trigger-" + this.ref][0].contains(
            e.target
          )) ||
        this.$refs["accounts-dropdown-" + this.ref] === e.target
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
