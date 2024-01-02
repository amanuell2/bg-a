<template>
  <div class="p-8">
    <form @submit.prevent>
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            New Employee
          </h3>
          <p class="text-gray-600">Add a new employee!</p>
        </div>
        <div class="w-2/3">
          <div class="flex space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">Name</span>
              <input
                v-model="name"
                class="block w-full form-input"
                placeholder="Employee name"
              />
              <div class="text-sm text-red-400" v-if="nameError">
                {{ nameError }}
              </div>
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">Phone</span>
              <input
                v-model="phone"
                minlength="9"
                maxlength="10"
                class="block w-full rounded-l-none form-input"
                placeholder="Phone number"
                :class="{
                  'border-red-400': phoneNumberError,
                }"
              />
              <div class="text-sm text-red-400" v-if="phoneNumberError">
                {{ phoneNumberError }}
              </div>
            </label>
          </div>
          <div class="mt-4">
            <button
              :disabled="busy || !isValid"
              @click="add"
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
export default {
  data() {
    return {
      busy: false,
      name: "",
      phone: "",
    };
  },
  computed: {
    corporateId() {
      return this.$store.state.auth.account.corporate._id;
    },
    nameError() {
      if (this.name === null) return null;

      if (this.name.length < 2) return "Must be > 2 in length";

      return null;
    },
    phoneNumberError() {
      if (this.phone === null) return null;

      if (this.phone.length < 2) return "Must be > 2 in length";

      var intPhone = parseInt(this.phone);
      if (!intPhone || intPhone.toString().length != 9)
        return `Invalid Phone Number. please write in 09... or 9... format`
      
      return null;
    },
    isValid() {
      return [
        this.name,
        this.phone
      ].every(x => x) && [
        this.nameError,
        this.phoneNumberError,
      ].every(x => x == null);
    }
  },
  methods: {
    add() {
      this.phoneNumberValidationError = "";
      var intPhone = parseInt(this.phone);
      if (intPhone && intPhone.toString().length == 9 && this.name) {
        this.busy = true;
        this.$misc
          .post("/employees", {
            name: this.name,
            phone: "+251" + intPhone.toString(),
            corporate: this.corporateId
          })
          .then(() => {
            window.flash({
              body: "Employee added successfully!",
              type: "success"
            });
            this.$router.push("/corporate/employees");
          })
          .catch(err => {
            console.log(err);
            window.flash({
              type: "error",
              body: err.response.data,
            });
            // window.flash({ body: "Failed to add employee!", type: "error" });
          })
          .finally(() => (this.busy = false));
      }
    }
  }
};
</script>
