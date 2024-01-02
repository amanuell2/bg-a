<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">RBAC</h2>
    <div class>
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

// import moment from 'moment';

export default {
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


      roles: [],

      activeRole: {},

      creatingNewRole: false,
      newRole: "",

      savingRBAC: false,
      deletingRBAC: false,
      creatingRBAC: false,
    };
  },
  components: {
    RolePermissions,
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
  created() {
    this.fetchRoles()
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

    fetchRoles() {

      this.$http
        .get(`/corporates/${this.corporate._id}/roles/`)
        .then(({ data: { data } }) => {
          this.roles = data
          if (this.roles && this.roles.length)
            this.activeRole = this.roles[0]
        });

    },
    selectRole(role) {
      this.activeRole = role;
    },
    saveRBAC() {
      this.savingRBAC = true;
      this.$http
        .patch(`/corporates/${this.corporate._id}/roles/${this.activeRole._id}`, this.activeRole)
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
      this.$http
        .delete(`/corporates/${this.corporate._id}/roles/${this.activeRole._id}`)
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
      this.$http
        .post(`/corporates/${this.corporate._id}/roles/`, {
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
