<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">RBAC</h2>
    <div class>
      <div class="flex justify-between w-full" v-if="loadingRoles">Loading roles...</div>
      <div class="flex justify-between w-full">
        <div class="flex gap-2 items-end">
          <div
            v-for="role in roles"
            :key="role.roleName"
            @click="selectRole(role)"
            class="px-3 py-2 h-12 flex items-center border cursor-pointer hover:bg-shuufare-400"
            :class="{ 'bg-shuufare-400': activeRole.roleName === role.roleName }"
            style="min-width: 8rem;"
          >{{ role.roleName }}</div>
        </div>
        <div class="flex gap-2 flex-wrap w-full items-end h-16">
          <div v-if="creatingNewRole" class="flex ml-8 gap-4 border p-2 border-shuufare-200">
            <div class="flex flex-col">
              <span class="text-xs">New Role:</span>
              <input type="text" v-model="newRole" class="border" />
            </div>
            <div
              class="px-3 py-2 border cursor-pointer items-center flex hover:bg-shuufare-400"
              @click="createRole()"
            >
              <i v-if="creatingRBAC" class="mr-2 material-icons animate-spin">loop</i>
              <i v-else class="mr-2 material-icons">check</i>
              Done
            </div>
            <div
              class="px-3 py-2 border cursor-pointer items-center flex hover:bg-shuufare-400"
              @click="creatingNewRole = false"
            >
              <i class="mr-2 material-icons">cancel</i>
              Cancel
            </div>
          </div>
          <div
            v-else
            @click="creatingNewRole = true"
            class="px-3 py-2 border cursor-pointer items-center flex ml-8 hover:bg-shuufare-400"
          >
            <i class="mr-2 material-icons">add</i>
            Create a new Role
          </div>
        </div>
      </div>
    </div>
    <hr v-if="passengerId" />
    <div>
      <transition name="fade">
        <div class="flex justify-start w-full" v-if="passengerId && selectedPassenger">
          <div class="flex justify-end w-full">
            <div class="inline-flex justify-end gap-5">
              <div class="px-4 py-2 text-right border rounded border-shuufare-700">
                <p class="text-sm text-gray-600 uppercase">Selected Passenger:</p>
                <p class="inline-flex text-2xl font-semibold divide-y">{{ passengerName }}</p>
              </div>
              <div class="px-4 py-2 text-right border rounded border-shuufare-700">
                <p class="text-sm text-gray-600 uppercase">Balance:</p>
                <p class="text-2xl font-semibold">{{ passengerBalance }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

    
      <div class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow">
        <h3 class="flex items-center justify-between p-4 space-x-4 font-medium">
          <span>Choose modules are accessible from {{ activeRole.roleName }} role</span>
          <div class="flex gap-4">
            <div
              class="px-3 py-2 border cursor-pointer items-center flex hover:bg-shuufare-400"
              @click="saveRBAC()"
              :disabled="activeRole.roleName === 'Super Admin'"
            >
              <i v-if="savingRBAC" class="mr-2 material-icons animate-spin">loop</i>
              <i v-else class="mr-2 material-icons">save</i>
              Save
            </div>
            <div
              class="px-3 py-2 border cursor-pointer items-center flex hover:bg-shuufare-400"
              @click="deleteRBAC()"
              :disabled="activeRole.roleName === 'Super Admin'"
            >
              <i v-if="deletingRBAC" class="mr-2 material-icons animate-spin">loop</i>
              <i v-else class="mr-2 material-icons">delete</i>
              Delete Role
            </div>
          </div>
        </h3>
        <role-permissions :role-name="activeRole.roleName" v-model="activeRole.permissions"></role-permissions>
      </div>
    </div>
  </div>
</template>

<script>
import RolePermissions from "@/components/RolePermissions";

export default {
  data() {
    return {
      tripRequests: [],
      openDropdown: false,
      selectedAccount: "",
      loading: true,
      accounts: [],
      accountId: null,
      selectedFilter: "all",

      selectedDriver: "",

      driverSearchResults: [],
      userSearchResults: [],
      passengerSearchResults: [],
      selectedPassenger: "",

      selectedUser: "",

      driverId: null,

      userId: null,

      passengerId: null,

      range: {
        start: null,
        end: null,
      },

      statuses: ["IN_REQUEST", "CANCELLED", "EXPIRED", "DECLINED"],

      roles: [],

      activeRole: "",

      creatingNewRole: false,
      newRole: "",

      savingRBAC: false,
      deletingRBAC: false,
      creatingRBAC: false,

      loadingRoles: false,
    };
  },
  components: {
    RolePermissions,
  },
  watch: {
    selectAll(newValue) {
      this.activeRole.permissions.forEach(x => {
        console.log(x)
        x.value = newValue
      });
    },
    selectedFilter() {
      this.getTripRequests();
    },
    range: {
      handler() {
        this.getTripRequests();
      },
      deep: true,
    },
    $route() {
      if (this.$route.query.status) {
        this.selectedFilter = this.$route.query.status;
      }
    },
  },
  created() {
    // var sd = new Date();
    // sd.setDate(0);
    // sd.setDate(1);
    // var ed = new Date();
    // ed.setMonth(ed.getMonth() + 1);
    // ed.setDate(0);
    // this.range.start = sd;
    // this.range.end = ed;

    if (this.$route.query.status) {
      this.selectedFilter = this.$route.query.status;
    }
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page;
    }
    if (this.$route.query.passenger) {
      this.passengerId = this.$route.query.passenger;
      this.$misc
        .get("users/" + this.$route.query.passenger)
        .then(({ data: { firstName, lastName, phoneNumber } }) => {
          this.selectedPassenger = `${firstName} ${lastName} - ${phoneNumber}`;
        });
    }
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.$misc.get("drivers/" + this.$route.query.driver).then(({ data }) => {
        const { firstName, lastName, phoneNumber } = data.driver;
        this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
        this.selectedDriverObj = data.driver;
      });
    }
    this.loading = false;

    this.fetchRoles()

  },
  computed: {
    driverFilter() {
      return this.$route.query.driver || null;
    },
    riderFilter() {
      return this.$route.query.passenger || null;
    },
    reportDownloadUrl() {
      return (
        "export-batch?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              driver: this.driverId ? this.driverId : undefined,
              dispatcher: this.userId ? this.userId : undefined,
              passenger: this.passengerId ? this.passengerId : undefined,
              ...(this.range || {}),
            }).filter(([key, val]) => key && val)
          ),
        })
          .map(([key, value]) => [key, value].join("="))
          .join("&")
      );
    },
  },
  methods: {
    searchDriver(e) {
      if (e.target.value.trim() === "") {
        this.driverSearchResults = [];
        this.driverId = null;
        this.getTripRequests();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.driverSearchResults = [];
          this.$misc
            .get("drivers/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.driverSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.driverSearchResults = [];
        }
      }
    },

    searchUser(e) {
      if (e.target.value.trim() === "") {
        this.userSearchResults = [];
        this.userId = null;
        this.getTripRequests();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.userSearchResults = [];
          this.$misc
            .get("accounts/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.userSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.userSearchResults = [];
        }
      }
    },

    searchPassenger(e) {
      if (e.target.value.trim() === "") {
        this.passengerSearchResults = [];
        this.passengerId = null;
        this.getTripRequests();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.passengerSearchResults = [];
          this.$misc
            .get("users/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.passengerSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.passengerSearchResults = [];
        }
      }
    },

    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriverObj = driver;
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.driverId = driver._id;
      this.driverSearchResults = [];
      const query = { ...this.$route.query, driver: this.driverId };
      this.$router.push({ query });
      this.getTripRequests();
    },

    selectUser(index) {
      let user = this.userSearchResults[index];
      this.selectedUserObj = user;
      this.selectedUser = `${user.firstName} ${user.lastName}`;
      this.userId = user._id;
      this.userSearchResults = [];
      this.getTripRequests();
    },

    selectPassenger(index) {
      let user = this.passengerSearchResults[index];
      this.selectedPassengerObj = user;
      this.selectedPassenger = `${user.firstName} ${user.lastName} - ${user.phoneNumber}`;
      this.passengerId = user._id;
      this.passengerSearchResults = [];
      const query = { ...this.$route.query, passenger: this.passengerId };
      this.$router.push({ query });

      this.getTripRequests();
    },

    fetchRoles() {

      this.loadingRoles = true;
      this.$misc
        .get("roles/")
        .then(({ data: { data } }) => {
          this.roles = data
          this.activeRole = this.roles[0]
        })
        .finally(() => {
          this.loadingRoles = false
        });

    },
    selectRole(role) {
      this.activeRole = role;
    },
    formatDate(date) {
      // return moment(date).format("MMM D, YYYY HH:mm");
      return date ? date.replace("T", " ").slice(0, 16) : "";
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    hideDropdown() {
      this.openDropdown = false;
    },

    saveRBAC() {
      this.savingRBAC = true;
      this.$misc
        .patch(`roles/${this.activeRole._id}`, this.activeRole)
        .then(() => {
          window.flash({
            type: "success",
            body: "Role updated successfully!",
          });
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('ValidationError')) {
            window.flash({
              type: "error",
              body: err.response.data.message.split(':').slice(1).join(':').split(',').join('<br/>'),
            });
            console.log(err);
          } else {
            window.flash({
              type: "error",
              body: "Role couldn't be updated!",
            });
            console.log(err);
          }
        })
        .finally(() => (this.savingRBAC = false));
    },
    deleteRBAC() {
      this.deletingRBAC = true;
      this.$misc
        .delete(`roles/${this.activeRole._id}`)
        .then(() => {
          window.flash({
            type: "success",
            body: "Role deleted successfully!",
          });
          this.fetchRoles();
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('ValidationError')) {
            window.flash({
              type: "error",
              body: err.response.data.message.split(':').slice(1).join(':').split(',').join('<br/>'),
            });
            console.log(err);
          } else {
            window.flash({
              type: "error",
              body: "Error: couldn't delete the role.",
            });
            console.log(err);
          }
        })
        .finally(() => (this.deletingRBAC = false));
    },
    createRole() {
      this.creatingRBAC = true;
      this.$misc
        .post("roles/", {
          roleName: this.newRole
        })
        .then(() => {
          this.creatingNewRole = false;
          this.fetchRoles();
        })
        .catch((err) => console.log(err))
        .finally(() => (this.creatingRBAC = false));
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
