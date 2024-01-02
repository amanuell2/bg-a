<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">Incentives/Giveaways</h2>
    <div class>
      <div class="flex justify-between w-full">
        <div class="flex">
          <div class="relative mt-4 mr-4">
            <label class="block">
              <span class="text-gray-700">Passenger</span>
              <input
                v-model="selectedPassenger"
                @keyup="searchPassenger"
                class="block w-full mt-1 form-input"
                placeholder="Search user..."
              />
            </label>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="passengerSearchResults.length"
                class="absolute inset-x-0 z-50 mt-1"
              >
                <div
                  class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                >
                  <ul>
                    <li
                      v-for="(result, index) in passengerSearchResults"
                      :key="result._id"
                      @click="selectPassenger(index)"
                      class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                    >
                      <div>
                        <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>

          <div class="relative pl-1 mt-4">
            <div class="pb-1 text-center text-gray-700">Filter by Date</div>
            <v-date-picker v-model="range" is-range>
              <template v-slot="{ inputValue, inputEvents }">
                <div class="flex items-center justify-center">
                  <input
                    :value="inputValue.start"
                    v-on="inputEvents.start"
                    placeholder="From Date"
                    class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                  />
                  <svg
                    class="w-10 h-6 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <input
                    :value="inputValue.end"
                    v-on="inputEvents.end"
                    placeholder="To Date"
                    class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                  />
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>

        <div class="pt-10 pr-3 text-blue-500">
          <export-button
            class="border-blue-500"
            :downloadUrl="reportDownloadUrl"
            :working="loading"
          ></export-button>
        </div>
      </div>
    </div>
    <hr v-if="passengerId" />
    <div>
      <transition name="fade">
        <div class="flex justify-start w-full" v-if="passengerId && selectedPassenger">
          <div class="flex justify-end w-full">
            <div class="inline-flex justify-end gap-5">
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">
                  Selected Passenger:
                </p>
                <p class="inline-flex text-2xl font-semibold divide-y">
                  {{ passengerName }}
                </p>
              </div>
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">Balance:</p>
                <p class="text-2xl font-semibold">
                  {{ passengerBalance }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div
        class="inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow"
      >
        <h3 class="flex items-center p-4 space-x-4 font-medium">
          <span>Incentive Records / History</span>
        </h3>
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Passenger
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Reason
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Trip Count (Then)
              </th>

              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Trip Fare
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Amount
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Wallet Balance (Then)
              </th>

              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Last Transaction Date
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Status
              </th>

              <th
                class="flex items-center justify-center w-full h-20 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Trip
              </th>
            </tr>
          </thead>
          <tbody v-if="wallets.length" class="relative">
            <tr v-for="wallet in wallets" :key="wallet._id">
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="whitespace-no-wrap">
                  {{
                    wallet.passenger
                      ? wallet.passenger.firstName +
                        " " +
                        wallet.passenger.lastName
                      : "-"
                  }} ({{ wallet.passenger.phoneNumber }})
                </p>
              </td>
              <td
                class="w-32 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.reason }}
                </p>
              </td>
              <td
                class="w-32 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.passengerTripCount === undefined ? '-' : wallet.passengerTripCount }}
                </p>
              </td>
              <td
                class="w-32 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.fare  === undefined ? '-' : (wallet.fare || 0).toFixed(2) }}
                </p>
              </td>

              <td
                class="w-32 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ (wallet.amount || 0).toFixed(2) }}
                </p>
              </td>
            
              <td
                class="items-center w-40 pl-6 text-sm bg-white py-auto"
                :class="{ 'text-gray-500': isNaN(wallet.currentAmount) }"
              >
                {{
                  wallet.currentAmount || wallet.currentAmount == 0
                    ? wallet.currentAmount.toFixed(2)
                    : "NO RECORD"
                }}
              </td>
                <td
                class="w-48 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                {{ wallet.updatedAt }}
              </td>

              <td
                class="w-24 px-5 py-5 text-sm bg-white border-b border-gray-200"
              >
                <div
                  class="p-1 px-4 uppercase"
                  :class="{
                    'bg-green-200': wallet.status === 'paid',
                    'bg-blue-200': wallet.status === 'collected',
                  }"
                >
                  {{ wallet.status }}
                </div>
              </td>

              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <router-link
                  :to="'/rides/' + wallet.ride._id + '/show'"
                  v-if="wallet.ride"
                >
                  <p
                    class="flex justify-center h-8 pt-1 text-center text-gray-700 whitespace-no-wrap hover:bg-gray-50 hover:text-gray-900 w-7"
                  >
                    <i class="mr-2 material-icons">visibility</i>
                  </p>
                </router-link>
                <div v-else class="pr-2 font-bold text-center text-gray-500">
                  -
                </div>
              </td>
            </tr>
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25"
            >
              <i class="text-6xl material-icons spin">sync</i>
              <span class="invisible block">Loading...</span>
            </div>
          </tbody>
          <tbody v-else>
            <tr>
              <td
                colspan="10"
                class="py-4 font-semibold text-center text-gray-600 bg-white"
              >
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No Wallets!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-end justify-between">
        <pagination
          class="flex space-x-2"
          :currentPage="currentPage"
          :total="total"
          @goto="goToPage"
          @setPerPage="setPerPage"
          :perPage="perPage"
          :start="start"
          :end="end"
          :count="paginator.count"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationMixin from "@/mixins/Pagination";
import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  data() {
    return {
      loading: false,
      wallets: [],
      range: {
        start: null,
        end: null,
      },

      passengers: [],

      passengerSearchResults: [],
      passengerId: null,
      selectedPassenger: null,
    };
  },
  components: {
    ExportButton,
    Pagination,
  },
  watch: {
    range: {
      handler() {
        this.getAllWallets();
      },
      deep: true,
    },
    currentPage() {
      this.getAllWallets();
    },
    perPage() {
      this.getAllWallets();
    },
    passengerId() {
      this.getAllWallets()
    },
    $route() {
      if (this.$route.query.passenger) {
        this.passengerId = this.$route.query.passenger;
        this.$misc
          .get(`/users/${this.passengerId}`)
          .then(({ data: { passenger } }) => {
            this.selectedPassengerObj = passenger;
          })
          .catch(() => {
            window.flash({
              type: "error",
              body: "Failed to fetch the new balance! please refresh",
            });
          });
      }
    },
  },
  computed: {
    role() {
      return this.$store.state.role;
    },
    passengerBalance() {
      if (this.passengerId && this.selectedPassengerObj && this.selectedPassengerObj.balance >= 0)
        return this.selectedPassengerObj.balance.toFixed(2);
      else return " N/A ";
    },
    passengerName() {
      if (this.passengerId && this.selectedPassengerObj && this.selectedPassengerObj.firstName)
        return [
          this.selectedPassengerObj.firstName,
          this.selectedPassengerObj.lastName,
        ].join(" ");
      else return " N/A ";
    },
    invalidTransaction() {
      if (this.paymentType === "bank_deposit") {
        if (
          this.deposit.by &&
          this.deposit.bank &&
          this.deposit.transaction &&
          this.deposit.narrative &&
          this.deposit.date
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    reportDownloadUrl() {
      return (
        "incentives/export?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
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
  created() {
    var sd = new Date();
    sd.setDate(0);
    sd.setDate(1);
    var ed = new Date();
    ed.setMonth(ed.getMonth() + 1);
    ed.setDate(0);
    this.range.start = sd;
    this.range.end = ed;
    if (this.$route.query.passenger) {
      this.passengerId = this.$route.query.passenger;
      this.$misc
        .get(`/users/${this.passengerId}`)
        .then(({ data: { passenger } }) => {
          this.selectedPassengerObj = passenger;
        })
        .catch(() => {
          window.flash({
            type: "error",
            body: "Failed to fetch the new balance! please refresh",
          });
        });
    } else {
      this.getAllWallets();
    }
  },
  methods: {
    handleClick() {
      this.adding ? this.add() : this.openAdd();
    },
    getAllWallets() {
      this.loading = true;
      var path = `/incentives?populate=["passenger","ride"]&page=${this.currentPage}&limit=${this.perPage}`;
      if (this.passengerId) {
        path += "&passenger=" + this.passengerId;
      }
      if (this.by && this.by != "all") {
        path += "&by=" + this.by;
      }
      if (this.range.start) {
        path += "&start=" + this.range.start;
      }
      if (this.range.end) {
        path += "&end=" + this.range.end;
      }
      return this.$misc
        .get(path)
        .then((response) => {
          this.wallets = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },

    searchPassenger(e) {
      if (e.target.value.trim() === "") {
        this.passengerSearchResults = [];
        this.passengerId = null;
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.passengerSearchResults = [];
          this.$misc
            .get("users/search?limit=5&q=" + name)
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

    selectPassenger(index) {
      let user = this.passengerSearchResults[index];
      this.selectedPassengerObj = user;
      this.selectedPassenger = `${user.firstName} ${user.lastName} - ${user.phoneNumber}`;
      this.passengerId = user._id;
      this.passengerSearchResults = [];
    },
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