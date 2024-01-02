<template>
  <div id="app" class="font-sans text-gray-800">
    <div class="flex h-screen min-h-screen overflow-hidden">
      <div
        class="flex-shrink-0 w-full max-w-xs min-h-full overflow-y-auto shadow-md mr-1 text-gray-800 bg-white"
        v-if="!collapsed"
      >
        <div class="pl-4 space-y-4 flex flex-col h-full" id="observer-root">
          <div class="space-t-4 pt-6 w-full pr-8 flex flex-col gap-2">
            <div class="flex flex-col gap-2 items-center">
              <h1 class="text-2xl font-semibold uppercase bg-gray-50 flex items-center">
                ILift
              </h1>

              <p
                class="text-xs font-semibold tracking-wide text-gray-800 uppercase pl-4 pt-3"
              >{{ corporateRole ? currentCorporateRole.roleName : currentRole.roleName }}{{ date }}</p>
            </div>
            <transition name="fade">
              <div v-if="showFilter || filter">
                <hr class="border-gray-400 mb-3 mx-24" />

                <div class="flex">
                  <div class="relative md:mr-0 hidden md:block">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email-adress-icon"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                      placeholder="Filter modules..."
                      v-model="filter"
                    />
                  </div>
                  <!-- <input
                  type="text"
                  placeholder="filter modules..."
                  class="h-12 w-full px-4 text-gray-700 border"
                  v-model="filter"
                  ref="search"
                  />-->
                </div>
              </div>
            </transition>

            <hr class="border-gray-400 mt-1 mx-12" />
          </div>
          <template v-if="corporateRole">
            <div v-if="corporateNavs.length" class="overflow-y-auto flex-grow">
              <div class="space-y-4">
                <ul class="space-y-2 text-sm font-semibold tracking-wide">
                  <li v-for="(nav, i) in corporateNavs" :key="nav.url" class="observable">
                    <Observer
                      v-if="i === 1"
                      @intersected="intersected"
                      @separated="separated"
                      :options="{ threshold: 1 }"
                    />
                    <router-link
                      class="flex items-center px-2 py-3 rounded hover:bg-shuufare-300"
                      :to="nav.url"
                      :class="{ 'bg-shuufare-400': $route.path === nav.url }"
                    >
                      <i class="mr-2 material-icons">{{ nav.icon }}</i>
                      {{ nav.title }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else-if="filter">No Modules found matching your search</div>
            <div v-else>No modules found</div>
          </template>
          <template v-else>
            <div v-if="navs.length" class="overflow-y-auto flex-grow">
              <div class="space-y-4">
                <ul class="space-y-2 text-sm font-semibold tracking-wide">
                  <li v-for="(nav, i) in navs" :key="nav.url" class="observable">
                    <Observer
                      v-if="i === 1"
                      @intersected="intersected"
                      @separated="separated"
                      :options="{ threshold: 1 }"
                    />
                    <router-link
                      class="flex items-center px-2 py-3 rounded hover:bg-shuufare-300"
                      :to="nav.url"
                      :class="{ 'bg-shuufare-400': $route.path === nav.url }"
                    >
                      <i class="mr-2 material-icons">{{ nav.icon }}</i>
                      {{ nav.title }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else-if="filter">No Modules found matching your search</div>
            <div v-else>No modules found</div>
          </template>
        </div>
      </div>

      <div class="flex flex-col flex-1 overflow-y-auto bg-white">
        <div class="z-30 px-6 py-4 bg-gray-50 border-gray-200 border-b">
          <div class="flex items-center justify-between">
            <div class="flex gap-5">
              <button
                class="flex items-center justify-center w-12 h-12 text-gray-700 hover:border hover:bg-gray-100 hover:text-gray-900"
                @click="collapsed = !collapsed"
              >
                <span class="material-icons">
                  {{
                    collapsed ? "menu" : "arrow_back"
                  }}
                </span>
              </button>
              <div v-if="collapsed" class="flex items-center justify-start">
                <h1 class="text-2xl font-semibold uppercase">
                  ILift
                </h1>
              </div>
            </div>

            <div
              class="flex items-center space-x-2 text-sm font-semibold tracking-wide text-gray-600 uppercase"
            >
              <div v-for="(path, index) in paths" :key="path.path">
                <span v-if="index" class="mr-2">/</span>
                <span v-if="path.current">{{ path.text || path.path }}</span>
                <router-link
                  v-else
                  :to="path.to"
                  class="hover:text-gray-800 hover:underline"
                >{{ path.text || path.path }}</router-link>
              </div>
            </div>
            <div
              @click="dropdown = !dropdown"
              class="relative flex items-center space-x-3 cursor-pointer"
            >
              <div class="flex flex-col">
                <div class="font-medium capitalize">{{ name }}</div>
                <div
                  v-if="$store.getters.corporate"
                  class="text-sm text-gray-600"
                >{{ $store.getters.corporate }}</div>
              </div>
              <div class="w-10 h-10 bg-gray-300 border border-gray-500 rounded-full"></div>
              <transition>
                <div
                  v-if="dropdown"
                  class="absolute top-0 right-0 w-56 mt-12 bg-white border rounded shadow-lg"
                >
                  <button
                    v-if="roles.length > 0 || corporateRoles.length > 0"
                    @click.stop="changeRole"
                    type="button"
                    class="block w-full px-6 py-3 text-left outline-none hover:bg-gray-200 active:outline-none"
                  >Change Role</button>
                  <button
                    @click.stop="logout"
                    type="button"
                    class="block w-full px-6 py-3 text-left outline-none hover:bg-gray-200 active:outline-none"
                  >Logout</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <router-view />
        </div>
      </div>
    </div>

    <portal-target name="modals"></portal-target>
  </div>
</template>

<script>
// import { ROLES } from "@/config";
import Observer from '../components/Observer.vue'

export default {
  data() {
    return {
      dropdown: false,
      collapsed: false,
      filter: "",
      allNavs: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: "dashboard",
          moduleName: "dashboard",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
        },
        {
          title: "Users",
          url: "/accounts",
          icon: "dashboard",
          // roles: [ROLES.ADMIN],
          moduleName: "users",
        },
        {
          title: "Corporate Management",
          url: "/corporate",
          icon: "domain",
          // roles: [ROLES.ADMIN],
          moduleName: "corporate-management",
        },
        {
          title: "Passengers",
          url: "/passengers",
          icon: "directions_walk",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "passengers",
        },
        {
          title: "Incentives",
          url: "/incentives",
          icon: "volunteer_activism",
          // roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
          moduleName: "incentives",
        },
        {
          title: "Drivers",
          url: "/drivers",
          icon: "people_alt",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "drivers",

        },
        // {
        //   title: "Drivers Finance",
        //   url: "/drivers-finance",
        //   icon: "people_alt",
        //   // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        //   moduleName: "drivers-finance",

        // },
        {
          title: "RBAC",
          url: "/rbac",
          icon: "security",
          // roles: [ROLES.ADMIN],
          moduleName: "rbac",

        },
        {
          title: "Reports",
          url: "/reports",
          icon: "summarize",
          // roles: [ROLES.ADMIN],

          moduleName: "reports",
        },
        {
          title: "Corporate Reports",
          url: "/corporate-reports",
          icon: "summarize",
          // roles: [ROLES.ADMIN],

          moduleName: "corporate-reports",
        },
        {
          title: "Trips",
          url: "/rides",
          icon: "electric_car",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "trips",

        },
        {
          title: "Trips Searches (Passengers)",
          url: "/trip-searches",
          icon: "hail",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "trip-searches",

        },
        {
          title: "Trip Requests (Drivers)",
          url: "/trip-requests",
          icon: "swipe",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "trip-requests",

        },
        {
          title: "Rents",
          url: "/rents",
          icon: "electric_car",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "rents",

        },
        {
          title: "Reward History",
          url: "/rewards",
          icon: "emoji_events",
          // roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
          moduleName: "reward-history",

        },
        {
          title: "Reward Packages",
          url: "/reward-packages",
          icon: "emoji_events",
          // roles: [ROLES.ADMIN],
          moduleName: "reward-packages",

        },
        {
          title: "Reward Inventory",
          url: "/rewards-inventory",
          icon: "emoji_events",
          // roles: [ROLES.ADMIN],
          moduleName: "reward-inventory",

        },
        {
          title: "Manual Trip Booking",
          url: "/manual-trip-booking",
          icon: "edit_road",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "manual-trip-booking",

        },
        {
          title: "Finance",
          url: "/finance",
          icon: "calculate",
          // roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
          moduleName: "finance",

        },
        {
          title: "Wallet Managment",
          url: "/wallet-managment",
          icon: "account_balance_wallet",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FINANCE, ROLES.OPERATION],
          moduleName: "wallet-managment",

        },
        {
          title: "Loan History",
          url: "/loan-history",
          icon: "account_balance_wallet",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
          moduleName: "loan-history",

        },
        {
          title: "Vehicle Type",
          url: "/vehicle-types",
          icon: "commute",
          // roles: [ROLES.ADMIN],
          moduleName: "vehicle-type",

        },
        {
          title: "Vehicles",
          url: "/vehicles",
          icon: "directions_car",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "vehicles",

        },
        {
          title: "Promo History",
          url: "/promos",
          icon: "emoji_events",
          // roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
          moduleName: "promo-history",

        },
        {
          title: "Device Bans",
          url: "/device-bans",
          icon: "block",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],

          moduleName: "device-bans",
        },
        {
          title: "Driver Bans",
          url: "/driver-bans",
          icon: "block",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],

          moduleName: "device-bans",
        },
        {
          title: "Drivers Leaderboard",
          url: "/driver-leaderboard",
          icon: "leaderboard",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
          moduleName: "drivers-leaderboard",

        },
        {
          title: "Passengers Leaderboard",
          url: "/passenger-leaderboard",
          icon: "leaderboard",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
          moduleName: "passengers-leaderboard",

        },
        {
          title: "Mock Reports",
          url: "/mock-reports",
          icon: "warning",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],

          moduleName: "mock-reports",
        },
        // {
        //   title: "Payment Records",
        //   url: "/payment-records",
        //   icon: "money",
        //   // roles: [ROLES.ADMIN, ROLES.FINANCE],
        // },
        // {
        //   title: "Reviews & Ratings",
        //   url: "/reviews-and-ratings",
        //   icon: "stars",
        //   // roles: [ROLES.ADMIN],
        // },
        {
          title: "Bird's-Eye View",
          url: "/birds-eye-view",
          icon: "gps_fixed",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "birds-eye-view",

        },
        {
          title: "SOS",
          url: "/sos",
          icon: "announcement",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "sos",

        },
        {
          title: "SOSHistory",
          url: "/sos-history",
          icon: "announcement",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],

          moduleName: "sos-history",
        },
        {
          title: "Push Notification",
          url: "/push-notification",
          icon: "notifications_active",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
          moduleName: "push-notification",

        },
        {
          title: "Localizations",
          url: "/Localizations",
          icon: "language",
          // roles: [ROLES.ADMIN, ROLES.OPERATION],
          moduleName: "localization"
        },
        {
          title: "Site Setting",
          url: "/setting",
          icon: "settings",
          // roles: [ROLES.ADMIN],
          moduleName: "site-setting",

        },
        // {
        //   title: "Site Setting (new)",
        //   url: "/setting-new",
        //   icon: "settings",
        //   // roles: [ROLES.ADMIN],
        // },
        {
          title: "Activity Logs",
          url: "/activity-logs",
          icon: "receipt_long",
          // roles: [ROLES.ADMIN],
          moduleName: "activity-logs",

        },
        {
          title: "Logs",
          url: "/logs",
          icon: "article",
          // roles: [ROLES.ADMIN],
          moduleName: "logs",

        },
      ],
      allCorporateNavs: [
        {
          title: "Corporate Dashboard",
          url: "/corporate/dashboard",
          icon: "dashboard",
          // roles: [ROLES.CORPORATE],
          moduleName: "corporate-dashboard",
        },
        {
          title: "Tickets",
          url: "/corporate/tickets",
          icon: "receipt",
          // roles: [ROLES.CORPORATE],
          moduleName: "tickets",
        },
        {
          title: "Employees",
          url: "/corporate/employees",
          icon: "people",
          // roles: [ROLES.CORPORATE],
          moduleName: "employees",
        },
        {
          title: "Dispatcher",
          url: "/corporate/dispatcher",
          icon: "edit_road",
          // roles: [ROLES.CORPORATE],
          moduleName: "corporate-dispatcher",
        },
        {
          title: "Trips",
          url: "/corporate/trips",
          icon: "electric_car",
          // roles: [ROLES.CORPORATE],
          moduleName: "corporate-trips",
        },
        {
          title: "Scheduled Trips",
          url: "/corporate/scheduled-trips",
          icon: "electric_car",
          // roles: [ROLES.CORPORATE],
          moduleName: "corporate-trips",
        },
        {
          title: "Trip Searches (Passengers)",
          url: "/corporate/trip-searches",
          icon: "hail",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "corporate-trip-searches",
        },
        {
          title: "Trip Requests (Drivers)",
          url: "/corporate/trip-requests",
          icon: "swipe",
          // roles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
          moduleName: "corporate-trip-requests",
        },
      ],
      paths: [],
      date: "",
      observer: null,
      showFilter: false,
    };
  },
  watch: {
    $route(to) {

      this.filter = ""
      let pathArray = to.path.split("/");

      pathArray.shift();

      this.paths = pathArray.map((path, index) => {
        return {
          path: path,
          to: index > 0 ? "/" + pathArray[index - 1] + "/" + path : "/" + path,
          text: to.matched[index] ? to.matched[index].name : "magic",
          current:
            pathArray.length < 1 || pathArray[pathArray.length - 1] === path,
        };
      });
    }
  },
  components: {
    Observer,
  },
  created() {
    this.$misc.get("/date").then(({ data }) => {
      this.date = " - " + data.replace("T", " ").slice(0, 16);
    });
    setInterval(() => {
      this.$misc.get("/date").then(({ data }) => {
        this.date = " - " + data.replace("T", " ").slice(0, 16);
      });
    }, 30000);
  },
  computed: {
    // roleName() {
    //   return ROLES.resolveName(this.role);
    // },
    roles() {
      return this.$store.getters.isLoggedIn
        ? this.$store.state.auth.account.roles
        : [];
    },
    role() {
      return this.$store.getters.isLoggedIn && this.$store.getters.hasRole
        ? this.$store.state.role
        : null;
    },
    currentRole() {
      return this.$store.getters.role ? this.$store.getters.role : {}
    },
    navs() {
      return this.allNavs.filter(({ title, moduleName }) => {
        const permissions = this.currentRole.permissions[moduleName]
        return title.toLowerCase().includes(this.filter.toLowerCase()) && permissions && permissions.canAccess
      });
    },
    corporateRoles() {
      return this.$store.getters.isLoggedIn
        ? this.$store.state.auth.account.corporateRoles
        : [];
    },
    corporateRole() {
      return this.$store.getters.isLoggedIn && this.$store.getters.hasCorporateRole
        ? this.$store.state.corporateRole
        : null;
    },
    currentCorporateRole() {
      return this.$store.getters.corporateRole ? this.$store.getters.corporateRole : {}
    },
    corporateNavs() {
      return this.allCorporateNavs.filter(({ title, moduleName }) => {
        const permissions = this.currentCorporateRole.permissions[moduleName]
        return title.toLowerCase().includes(this.filter.toLowerCase()) && permissions && permissions.canAccess
      });
    },
    name() {
      if (!this.$store.getters.isLoggedIn) return null;

      const auth = this.$store.state.auth.account;
      return `${auth.firstName} ${auth.lastName}`;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").finally(() => this.$router.push("/login"));
    },
    changeRole() {
      this.$router.push("/role");
    },
    async intersected() {
      this.showFilter = false;
    },
    async separated() {
      this.showFilter = true;
    }
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 12px;
  height: 16px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #edf2f7;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 100vh;
  border: 3px solid #edf2f7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>