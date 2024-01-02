<template>
  <div class="">
    <div class="flex hover:bg-gray-100 cursor-pointer items-center mb-2 justify-center w-32" @click="changePage('index')">
      <span class="font-semibold text-gray-600 uppercase pt-2"><i class="material-icons">arrow_back</i></span><strong class="text-gray-600 uppercase">Back</strong>
    </div>
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
          <div class="flex mt-4 space-x-4">
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
          <div class="mt-4">
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

export default {
  props: ['account', 'changePage'],
  data() {
    return {
      busy: false,
      roles:[],
      roleSelection: {},
      loadingRoles: true,
      corporateId: null,
    };
  },
  computed: {
    id() {
      return this.account ? this.account._id : "";
    },
  },
  created() {
    this.corporateId = this.$route.params.id
    this.fetchRoles();
  },
  methods: {
    edit() {
      this.busy = true;
      const corporateRoles = Object.entries(this.roleSelection).filter(([, v]) => v).map(([k]) => k)

      this.$misc
        .patch(`accounts/${this.id}`, {
          ...this.account,
        corporateRoles,
        })
        .then(() => {
          window.flash({
            body: "User updated successfully!",
            type: "success",
          });
          this.changePage('index');
        })
        .catch(err => {
          window.flash({ body: "Failed to edit user!", type: "error" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
    fetchRoles() {
      this.loadingRoles = true;
      this.$http
        .get(`/corporates/${this.corporateId}/roles`)
        .then(({ data : { data } }) => {
          this.roles = data
          for (const role of data) {
            this.roleSelection[role._id] = false
          }
          this.loadingRoles = false;
        });

    },
  },
};
</script>
