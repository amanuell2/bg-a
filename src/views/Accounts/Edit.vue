<template>
  <div class="p-8">
    <form @submit.prevent="edit">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Edit User
          </h3>
          <p class="text-gray-600">{{ id }}</p>
        </div>
        <div class="w-2/3">
          <div class="flex mt-4 space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">First Name</span>
              <input
                v-model="account.firstName"
                class="block w-full form-input"
                placeholder="Abbay"
              />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">
                Last Name
              </span>
              <input
                v-model="account.lastName"
                class="block w-full form-input"
                placeholder="Kassa"
              />
            </label>
            <label class="block w-1/2">
              <div class="text-gray-700">
                Role
              </div>
              <div v-if="loadingRoles">
                Loading...
              </div>
              <div class="flex flex-wrap" v-else>
                <label v-for="role in roles" :key="role._id" :for="role.roleName" class="mr-3">
                  <input
                    type="checkbox"
                    :name="role.roleName"
                    v-model="roleSelection[role._id]"
                    :id="role.roleName"
                    class="mr-2"
                  />
                  <span>{{role.roleName}}</span>
                </label>
              </div>
            </label>
          </div>
          <div class="flex mt-4 space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">
                Email
              </span>
              <input
                v-model="account.email"
                class="block w-full form-input"
                type="email"
                placeholder="contact@sheraton.com"
              />
            </label>
          </div>
          <div class="mt-4">
            <back-button></back-button>
            <button
              :disabled="busy"
              class="w-32 py-2 rounded shadow text-shuufare-900"
              :class="
                busy
                  ? 'bg-shuufare-200 cursor-not-allowed'
                  : 'bg-shuufare-500 hover:bg-shuufare-600'
              "
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: {
    BackButton,
  },
  data() {
    return {
      busy: false,
      vehicleTypes: [],
      account: {
          firstName: "",
          lastName: "",
          email: "",
          active: null,
          roles: []
      },
      roles:[],
      roleSelection: {},
      loadingRoles: true,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  created() {
    this.$misc
      .get(`/accounts/${this.id}`)
      .then(response => (this.account = response.data))
      .catch(err => console.log(err));
    this.fetchRoles();
  },
  methods: {
    edit() {
      this.busy = true;
      this.account.roles = Object.entries(this.roleSelection).filter(([, v]) => v).map(([k]) => k)
      this.$misc
        .patch(`accounts/${this.id}`, this.account)
        .then(() => {
          window.flash({
            body: "User updated successfully!",
            type: "success",
          });
          this.$router.push("/accounts");
        })
        .catch(err => {
          window.flash({ body: "Failed to edit account!", type: "error" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
    fetchRoles() {
      this.loadingRoles = true;
      this.$misc
        .get("roles/")
        .then(({ data : { data } }) => {
          this.roles = data
          for (const role of data) {
            this.roleSelection[role._id] = this.account.roles.includes(role._id)
          }
          this.loadingRoles = false;
        });

    },
    changeRole(roleId) {
      if(this.account.roles.includes(roleId)) {
        this.account.roles.splice(this.account.roles.indexOf(roleId), 1);
      } else {
        this.account.roles.push(roleId);      
      }
    }
  },
};
</script>
