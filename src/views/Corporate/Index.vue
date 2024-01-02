<template>
  <div class="relative w-full h-full">
    <div class="absolute inset-0 m-4 overflow-hidden">
      <div class="flex w-full h-full bg-white rounded-lg">
        <div class="box-border w-1/4 h-full overflow-y-auto border-r-2">
          <div class="p-4">
            <router-link
              to="/corporate/add"
              class="inline-block w-full py-2 font-semibold text-center rounded shadow bg-shuufare-500 text-shuufare-900 hover:bg-shuufare-600"
            >Add Corporate</router-link>
          </div>
          <!--  -->
          <div class="px-4 py-2 border-t">
            <input
              type="text"
              v-model="searchKey"
              class="w-full form-input"
              placeholder="Search..."
            />
          </div>
          <div
            v-for="(corporate, index) in corporates"
            :key="corporate._id"
            @click="selectCorporate(index)"
            class="flex items-center px-4 py-2 mb-1 space-x-4 border-t border-b cursor-pointer hover:bg-gray-200"
            :class="
              selectedCorporate && corporate._id === selectedCorporate._id
                ? 'bg-gray-200'
                : ''
            "
          >
            <div class="w-12 h-12 bg-teal-500 rounded"></div>
            <div>
              <h1 class="text-xl">{{ corporate.name }}</h1>
              <p class="text-sm text-gray-700">{{ corporate.email }}</p>
            </div>
          </div>
          <!--  -->
        </div>
        <div class="w-3/4 overflow-y-auto">
          <div v-if="selectedCorporate !== null">
            <div class="w-full px-4 py-2 bg-shuufare-500">
              <strong>{{ selectedCorporate.name }}</strong>

              <!-- Rounded switch -->
              <label class="float-right switch">
                <input type="checkbox" @change="updateState" v-model="selectedCorporate.active" />
                <span class="slider round"></span>
              </label>
            </div>
            <ul class="flex border-b">
              <li
                v-bind:class="[
                  selectedTab == 'profile' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('profile')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'profile'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Profile</span>
              </li>
              <li
                v-bind:class="[selectedTab == 'rides' ? '-mb-px mr-1' : 'mr-1']"
                @click="selectTab('rides')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'rides'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Trips</span>
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'tickets' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('tickets')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'tickets'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Tickets</span>
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'rbac' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('rbac')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'rbac'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >RBAC</span>
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'accounts' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('accounts')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'accounts'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Users</span>
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'pricing' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('pricing')"
                class="cursor-pointer"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'pricing'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Pricings</span>
              </li>
              <li></li>
            </ul>
            <div class="p-4">
              <Profile v-if="selectedTab == 'profile'" :corporate="selectedCorporate"></Profile>
              <Rides v-if="selectedTab == 'rides'" :corporate="selectedCorporate"></Rides>
              <Tickets v-if="selectedTab == 'tickets'" :corporate="selectedCorporate"></Tickets>
              <CorporateRbac v-if="selectedTab == 'rbac'" :corporate="selectedCorporate"></CorporateRbac>
              <Accounts v-if="selectedTab == 'accounts'" :corporate="selectedCorporate"></Accounts>
              <CorporatePricing v-if="selectedTab == 'pricing'" :corporate="selectedCorporate"></CorporatePricing>
            </div>
          </div>
          <div v-else>
            <h3
              class="p-4 text-xl font-semibold text-gray-700"
            >Select a corporate from the list on the left!</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Rides from "@/views/Corporate/Rides";
import Profile from "@/views/Corporate/Profile";
import Tickets from "@/views/Corporate/Tickets";
import CorporateRbac from "@/views/Corporate/CorporateRbac";
import Accounts from "@/views/Corporate/Accounts/Accounts";
import CorporatePricing from "@/views/Corporate/CorporatePricing";
export default {
  components: {
    Rides,
    Profile,
    Tickets,
    Accounts,
    CorporateRbac,
    CorporatePricing
  },
  data() {
    return {
      corporates: [],
      selectedCorporate: null,
      selectedTab: "profile",
      loading: false,
      searchKey: ""
    };
  },
  watch: {
    selectedCorporate() { },
    searchKey() {
      this.getCorporates();
    },
    $route:{
      handler() {
        this.selectedTab = 'profile'
      },
      deep: true,
    }
  },
  created() {
    this.getCorporates()
    this.getCorporate(this.$route.params.id).then(({ data }) => {
      // console.log(JSON.stringify(corporate, null, 2))
      this.selectedCorporate = data

    });
  },
  methods: {
    getCorporates() {
      return this.$http
        .get("/corporates?q=" + this.searchKey)
        .then(response => (this.corporates = response.data.data))
        .catch(err => console.log(err));
    },
    getCorporate(id) {
      return this.$http
        .get("/corporates/" + id)
    },
    selectCorporate(index) {
      this.selectedCorporate = this.corporates[index];
      this.$router.push(`/corporate/${this.selectedCorporate._id}`)
    },
    updateState() {
      this.$http
        .patch("/corporates/" + this.selectedCorporate._id, {
          active: this.selectedCorporate.active
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
    },
    selectTab(tab) {
      this.selectedTab = tab;
    }
  }
};
</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 25px;
  width: 25px;
  left: 0px;
  bottom: 0px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>