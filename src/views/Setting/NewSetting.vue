<template>
  <div class="relative w-full h-full">
    <div class="absolute inset-0 m-4 overflow-hidden">
      <div class="flex w-full h-full bg-white rounded-lg">
        <div class="box-border w-1/4 h-full overflow-y-auto border-r-2">
          <div class="px-4 py-2 border-t">
            <input
              type="text"
              v-model="searchKey"
              class="w-full form-input"
              placeholder="Search..."
            />
          </div>
          <router-link
            v-for="setting in availableSettings"
            :key="setting.route"
            :to="setting.route"
            class="flex items-center px-4 py-2 space-x-4 border-b cursor-pointer hover:bg-gray-200"
            :class="
              $route.matched.some(({ name }) => name === setting.name)
                ? 'bg-gray-200'
                : ''
            "
          >
            <div class="flex items-center justify-center w-12 h-12 text-gray-800 bg-gray-100 border border-gray-300 rounded material-icons">
                {{ setting.icon }}
            </div>
            <div>
              <h1 class="text-lg">{{ setting.title }}</h1>
              <p class="text-sm font-light text-gray-600">{{ setting.subtitle }}</p>
            </div>
          </router-link>
          <!--  -->
        </div>
        <div class="w-3/4 overflow-y-auto">
          <div v-if="selectedCorporate !== null">
            <div class="w-full px-4 py-2 bg-shuufare-500">
              <strong>{{ selectedCorporate.name }}</strong>

              <!-- Rounded switch -->
              <label class="float-right switch">
                <input
                  type="checkbox"
                  @change="updateState"
                  v-model="selectedCorporate.active"
                />
                <span class="slider round"></span>
              </label>
            </div>
            <ul class="flex border-b">
              <li
                v-bind:class="[
                  selectedTab == 'profile' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('profile')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'profile'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                  >Profile</span
                >
              </li>
              <li
                v-bind:class="[selectedTab == 'rides' ? '-mb-px mr-1' : 'mr-1']"
                @click="selectTab('rides')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'rides'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                  >Trips</span
                >
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'tickets' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('tickets')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'tickets'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                  >Tickets</span
                >
              </li>
              <li
                v-bind:class="[
                  selectedTab == 'accounts' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('accounts')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'accounts'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                  >Users</span
                >
              </li>
              <li></li>
            </ul>
            <div class="p-4">
              <Profile
                v-if="selectedTab == 'profile'"
                :corporate="selectedCorporate"
              ></Profile>
              <Rides
                v-if="selectedTab == 'rides'"
                :corporate="selectedCorporate"
              ></Rides>
              <Tickets
                v-if="selectedTab == 'tickets'"
                :corporate="selectedCorporate"
              ></Tickets>
              <Accounts
                v-if="selectedTab == 'accounts'"
                :corporate="selectedCorporate"
              ></Accounts>
            </div>
          </div>
          <div v-else>
            <h3 class="p-4 text-xl font-semibold text-gray-700">
              Select a corporate from the list on the left!
            </h3>
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
import Accounts from "@/views/Corporate/Accounts/Accounts";
export default {
  components: {
    Rides,
    Profile,
    Tickets,
    Accounts
  },
  data() {
    return {
      availableSettings: [
        {
            icon: "people_alt",
            title: "Driver Settings",
            subtitle: "Set the settings related to drivers",
            route: "driver-settings",
            name: "driver-settings"
        },
        {
            icon: "groups",
            title: "Pool Settings",
            subtitle: "Set the settings related to pool",
            route: "pool-settings",
            name: "pool-settings"
        },
        {
            icon: "local_taxi",
            title: "Trip Settings",
            subtitle: "Set the settings related to rides/trips",
            route: "trip-settings",
            name: "trip-settings"
        },
        {
            icon: "share",
            title: "Invitation Promo Settings ",
            subtitle: "Invitation Promo Settings",
            route: "promo-settings",
            name: "promo-settings"
        },
        {
            icon: "emoji_events",
            title: "CashBack/Incentive Settings ",
            subtitle: "Set the settings related to incentive",
            route: "incentive-settings",
            name: "incentive-settings"
        },
        {
            icon: "price_change",
            title: "Voucher Settings",
            subtitle: "Set the settings related to voucher cashout",
            route: "voucher-settings",
            name: "voucher-settings"
        },
        {
            icon: "textsms",
            title: "SMS Settings ",
            subtitle: " Set the settings related to SMS messages ",
            route: "sms-settings",
            name: "sms-settings"
        },
        {
            icon: "redeem",
            title: "Promo Settings ",
            subtitle: "Set the settings related to promo",
            route: "promo-settings",
            name: "promo-settings"
        },
        {
            icon: "facebook",
            title: "Social Media Settings ",
            subtitle: "Set the settings related social medias",
            route: "social-media-settings",
            name: "social-media-settings"
        },
        {
            icon: "business",
            title: "Company Settings ",
            subtitle: "Set the settings related to the company",
            route: "company-settings",
            name: "company-settings"
        },
        {
            icon: "apps",
            title: "App Settings ",
            subtitle: "Set the settings related app version",
            route: "app-settings",
            name: "app-settings"
        },
        {
            icon: "block",
            title: "Device Ban Settings ",
            subtitle: "Set the settings related to unsupported devices restriction",
            route: "device-ban-settings",
            name: "device-ban-settings"
        },
      ],
      selectedCorporate: null,
      selectedTab: "profile",
      loading: false,
      searchKey: ""
    };
  },
  watch: {
    selectedCorporate() {},
    searchKey() {
      this.getCorporates();
    }
  },
  created() {
  },
  methods: {
    getCorporates() {
      this.$http
        .get("/availableSettings?q=" + this.searchKey)
        .then(response => (this.availableSettings = response.data.data))
        .catch(err => console.log(err));
    },
    selectCorporate(index) {
      this.selectedCorporate = this.availableSettings[index];
    },
    updateState() {
      this.$http
        .patch("/availableSettings/" + this.selectedCorporate._id, {
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