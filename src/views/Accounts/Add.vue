<template>
  <div class="p-8">
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
              <span class="text-red-500" v-if="firstNameError">{{firstNameError}}</span>
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
              <span class="text-red-500" v-if="lastNameError">{{lastNameError}}</span>
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
              <span class="text-red-500" v-if="emailError">{{emailError}}</span>
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
              <span class="text-red-500" v-if="passwordError">{{passwordError}}</span>
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
              <span class="text-red-500" v-if="confirmPasswordError">{{confirmPasswordError}}</span>
            </label>
          </div>
          <div class="mt-4">
            <back-button></back-button>
            <button
              :disabled="busy || !isValid"
              class="w-32 py-2 rounded shadow text-shuufare-900"
              :class="
                (busy || !isValid)
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
import BackButton from "@/components/BackButton.vue";

export default {
  components: {
    BackButton,
  },
  data() {
    return {
      busy: false,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
      dataValidationError: {
        email: null
      },
      roles:[],
      roleSelection: {},
      loadingRoles: true,
    };
  },
  created() {
    this.fetchRoles();
  },
  computed: {
    firstNameError() {
      if (this.firstName === null) return null;

      if (this.firstName.length < 2) return "Must be > 2 in length";

      return null;
    },
    lastNameError() {
      if (this.lastName === null) return null;

      if (this.lastName.length < 2) return "Must be > 2 in length";

      return null;
    },
    emailError() {
      if (this.email === null) return null;

      if (this.email.length < 2) return "Must be > 2 in length";

      if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(this.email)) {
        return "Invalid email address";
      }

      return null;
    },
    passwordError() {
      if (this.password === null) return null;

      if (this.password.length < 2) return "Must be > 2 in length";

      return null;
    },
    confirmPasswordError() {
      if (this.confirmPassword === null) return null;

      if (this.confirmPassword.length < 2) return "Must be > 2 in length";

      if (this.confirmPassword !== this.password) return "Passwords don't match.";

      return null;
    },
    isValid() {
      return [
        this.firstName,
        this.lastName,
        this.password,
        this.confirmPassword,
        this.email,
      ].every(x => x) && [
        this.firstNameError,
        this.lastNameError,
        this.emailError,
        this.passwordError,
        this.confirmPasswordError,
      ].every(x => x == null);
    }
  },
  methods: {
    add() {
      const roles = Object.entries(this.roleSelection).filter(([, v]) => v).map(([k]) => k)
      if (this.password != "" && this.password == this.confirmPassword) {
        var data = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          roles
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
              // this.$router.push("/accounts")
            })
            .catch(err => {
              window.flash({
                type: "error",
                body: err.response.data,
              });
            })
            .finally(() => (this.busy = false));
            
      }
    },

    fetchRoles() {
      this.loadingRoles = true;
      this.$misc
        .get("roles/")
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
