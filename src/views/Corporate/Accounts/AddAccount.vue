<template>
  <div class="">
    <div class="flex mb-2" @click="changePage('index')">
      <span class="font-semibold text-gray-600 uppercase"><i class="mr-2 material-icons">arrow_back</i></span><strong class="pb-4 text-gray-600 uppercase">Back</strong>
    </div>
    <form @submit.prevent="add">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            New User
          </h3>
          <p class="text-gray-600">Add a new user!</p>
        </div>
        <div class="w-2/3">
          <div class="flex mt-4 space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">First Name</span>
              <input
                v-model="firstName"
                class="block w-full form-input"
                placeholder="Abbay"
              />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">
                Last Name
              </span>
              <input
                v-model="lastName"
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
                v-model="email"
                class="block w-full form-input"
                type="email"
                placeholder="contact@sheraton.com"
              />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">
                Password
              </span>
              <input
                v-model="password"
                class="block w-full form-input"
                type="Password"
                placeholder="password"
              />
            </label>
            <label class="block w-1/2 mt-2">
              <span class="text-gray-700">
                Confirm Password
              </span>
              <input
                v-model="confirmPassword"
                class="block w-full form-input"
                type="password"
                placeholder="password"
              />
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
              Add
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["corporate", "changePage"],
  data() {
    return {
      busy: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles:[],
      roleSelection: {},
      loadingRoles: true,
    };
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    add() {
      const corporateRoles = Object.entries(this.roleSelection).filter(([, v]) => v).map(([k]) => k)

      if (this.password != "" && this.password == this.confirmPassword) {
        var data = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          corporate: this.corporate._id,
          corporateRoles,
        };
        console.log(data);
        this.busy = true;
        this.$misc
          .post("/accounts", data)
          .then((response) => {
            console.log(response);
            window.flash({
              body: "User created successfully!",
              type: "success",
            });
            this.changePage("index")
          })
          .catch(err => console.log(err))
          .finally(() => (this.busy = false));
      }
    },
    fetchRoles() {
      this.loadingRoles = true;
      this.$http
        .get(`/corporates/${this.corporate._id}/roles`)
        .then(({ data : { data } }) => {
          this.roles = data
          for (const role of data) {
            this.roleSelection[role._id] = false
          }
          this.loadingRoles = false;
        });

    },
  }
};
</script>
