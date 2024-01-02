<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl">Driver Wallets</h2>
    <div class>
      <div class="flex justify-between w-full">
        <div class="flex">
          <div class="relative mt-4 mr-4">
            <label class="block">
              <span class="text-gray-700">Driver</span>
              <input
                v-model="selectedDriver"
                @keyup="searchDriver"
                class="block w-full mt-1 form-input"
                placeholder="Search drivers..."
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
                v-if="driverSearchResults.length"
                class="absolute inset-x-0 z-50 mt-1"
              >
                <div
                  class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                >
                  <ul>
                    <li
                      v-for="(result, index) in driverSearchResults"
                      :key="result._id"
                      @click="selectDriver(index)"
                      class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                    >
                      <img
                        class="object-cover w-12 h-12 rounded-full"
                        :src="result.profileImage"
                        :alt="`${result.firstName} ${result.lastName}`"
                      />
                      <div>
                        <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                        <p class="text-sm font-semibold text-gray-600">
                          {{ result.phoneNumber }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>

          <div class="relative mt-4 mr-4">
            <label class="block">
              <span class="text-gray-700">User</span>
              <input
                v-model="selectedAccount"
                @keyup="searchAccount"
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
                v-if="accountSearchResults.length"
                class="absolute inset-x-0 z-50 mt-1"
              >
                <div
                  class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
                >
                  <ul>
                    <li
                      v-for="(result, index) in accountSearchResults"
                      :key="result._id"
                      @click="selectAccount(index)"
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

          <div v-if="accountId == null" class="relative mt-5">
            <div class="pr-3">
              <label class="block">
                <span class="text-gray-700">By</span>
                <select
                  class="w-full form-select"
                  v-model="by"
                  @change="getAllWallets"
                >
                  <option :selected="by === 'all'" value="all">All</option>
                  <option :selected="by === 'admin'" value="admin">
                    Admin
                  </option>
                  <option :selected="by === 'system'" value="System">
                    System
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div class="relative pl-1 mt-5">
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
    <hr v-if="driverId" />
    <div>
      <transition name="fade">
        <div
          class="flex justify-start w-full"
          v-if="driverId"
        >
          <div class="flex flex-col w-full gap-2" v-if="adding">
            <div class="flex">
              <div class="flex gap-4">
                <div class="relative w-56">
                  <select class="w-full form-select" v-model="paymentType">
                    <option value="cash">Cash</option>
                    <option value="bank_deposit">Bank Deposit</option>
                  </select>
                </div>
                <div class="relative flex w-64 h-10">
                  <input
                    v-model="amount"
                    type="number"
                    class="w-full pl-10 rounded-r-none form-input"
                    :class="amountError ? 'border-red-800 bg-red-200' : ''"
                    ref="amountInput"
                    placeholder="Enter the amount"
                  />
                  <span
                    @click="adding = false"
                    class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 cursor-pointer hover:text-gray-900"
                  >
                    <i class="material-icons">close</i>
                  </span>
                </div>
                <div class="relative w-56">
                  <input
                    v-model="reason"
                    type="text"
                    class="w-full pl-10 rounded-l-none rounded-r-none form-input"
                    placeholder="Enter reason"
                  />
                </div>
              </div>
            </div>
            <div class="flex">
              <div v-if="paymentType === 'bank_deposit'" class="flex gap-4">
                <!-- a. Bank (Pick List)
    b. Deposited By:
    c. Transaction #
    d. Narrative#
    e. Deposit Date -->
                <div class="relative flex w-64 h-10">
                  <select class="w-full form-select" v-model="deposit.bank">
                    <option value="" disabled hidden>Bank</option>
                    <option value="awash">Awash International Bank</option>
                    <option value="abyssinia">Bank of Abyssinia</option>
                    <option value="berhan">
                      Berhan International Bank S.C.
                    </option>
                    <option value="cbe">
                      Commercial Bank of Ethiopia (CBE)
                    </option>
                    <option value="dashen">Dashen Bank</option>
                    <option value="enat">Enat Bank</option>
                    <option value="lion">Lion International Bank S.C</option>
                    <option value="NBE">
                      National Bank of Ethiopia (NBE) (Central Bank)
                    </option>
                    <option value="nib">Nib International Bank</option>
                    <option value="united">United Bank</option>
                    <option value="wegagen">Wegagen Bank</option>
                    <option value="zemen">Zemen Bank S.C</option>
                    <option value="coop">
                      Cooperative Bank of Oromia(s.c.)
                    </option>
                    <option value="debub">Debub Global Bank</option>
                    <option value="bunna">Bunna International Bank</option>
                  </select>
                </div>
                <div class="relative w-84">
                  <input
                    v-model="deposit.by"
                    type="text"
                    class="w-full pl-10 rounded-r-none form-input"
                    placeholder="Deposited By"
                  />
                </div>
                <div class="relative w-84">
                  <input
                    v-model="deposit.transaction"
                    type="text"
                    class="w-full pl-10 rounded-r-none form-input"
                    placeholder="Transaction"
                  />
                </div>
                <div class="relative w-84">
                  <input
                    v-model="deposit.narrative"
                    type="text"
                    class="w-full pl-10 rounded-r-none form-input"
                    placeholder="Narrative"
                  />
                </div>
                <div class="relative w-84">
                  <v-date-picker
                    v-model="deposit.date"
                    :popover="{ visibility: 'click' }"
                  >
                    <template v-slot="{ inputValue, inputEvents }">
                      <div class="flex items-center justify-center">
                        <input
                          :value="inputValue"
                          v-on="inputEvents"
                          placeholder="Date"
                          class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                        />
                      </div>
                    </template>
                  </v-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between w-full">
            <button
              :disabled="busy || invalidTransaction"
              @click="handleClick"
              class="flex items-center justify-center h-12 px-4 py-2 space-x-2 text-white border rounded w-52 border-shuufare-600"
              :class="{
                'rounded-l-none': adding,
                'bg-shuufare-300 cursor-not-allowed': busy,
                'bg-shuufare-500 hover:bg-shuufare-600 focus:bg-shuufare-600':
                  !busy && !invalidTransaction,
                'bg-shuufare-200 border-shuufare-300 text-gray-500': invalidTransaction,
              }"
            >
              <template v-if="adding">
                <i class="material-icons">account_balance_wallet</i>
                <span> Add Transaction </span>
              </template>
              <template v-else>
                <i class="material-icons">add_box</i>
                <span> New Transaction </span>
              </template>
            </button>

            <div class="inline-flex justify-end gap-5">
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">Selected Driver:</p>
                <p class="inline-flex text-2xl font-semibold divide-y">
                  {{ driverName }}
                </p>
              </div>
              <div
                class="px-4 py-2 text-right border rounded border-shuufare-700"
              >
                <p class="text-sm text-gray-600 uppercase">Balance:</p>
                <p class="text-2xl font-semibold">
                  {{ driverBalance }}
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
          <span>Wallet History / Transactions:</span>
        </h3>
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Driver
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Amount
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Payment type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                By
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                User
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Reason
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
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Balance (then)
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >
                Bank Receipt
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
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
                    wallet.driver
                      ? wallet.driver.firstName + " " + wallet.driver.lastName
                      : "-"
                  }}
                </p>
                <!-- <p class="text-gray-600 whitespace-no-wrap">
                  {{ wallet.driver ? wallet.driver._id : "-" }}
                </p> -->
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.amount.toFixed(2) }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ wallet.paymentType }}
                </p>
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.by }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{
                  wallet.account
                    ? wallet.account.firstName + " " + wallet.account.lastName
                    : wallet.from
                    ? wallet.from.firstName + " " + wallet.from.lastName
                    : "-"
                }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.reason }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {{ wallet.updatedAt }}
              </td>
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div
                  class="p-1 px-4 uppercase"
                  :class="{
                    'bg-green-200': wallet.status === 'paid',
                    'bg-blue-200': wallet.status === 'unpaid',
                  }"
                >
                  {{ wallet.status }}
                </div>
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
              <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <router-link
                  :to="'/wallet-managment/' + wallet._id + '/show'"
                  v-if="wallet.paymentType === 'bank_deposit'"
                >
                  <p
                    class="flex justify-center h-8 pt-1 text-center text-gray-700 whitespace-no-wrap hover:bg-gray-50 hover:text-gray-900 w-7"
                  >
                    <i class="mr-2 material-icons">account_balance</i>
                  </p>
                </router-link>
                <div v-else class="pr-2 font-bold text-center text-gray-500">
                  -
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
                colspan="11"
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
      selectedDriver: "",
      drivers: [],
      driverSearchResults: [],
      driverId: null,
      by: "all",
      accountId: null,
      paymentType: "cash",
      accounts: [],
      adding: false,
      amount: 10,
      accountSearchResults: [],
      selectedAccount: "",
      reason: "Topup",
      amountError: false,
      busy: false,
      selectedDriverObj: null,
      range: {
        start: null,
        end: null,
      },
      deposit: {
        bank: "",
        by: "",
        transaction: "",
        narrative: "",
        date: "",
      },
      driverResultIndex: null,
    };
  },
  components: {
    ExportButton,
    Pagination,
  },
  watch: {
    amount() {
      this.amountError = false;
    },
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
    $route() {
      if (this.$route.query.driver) {
        this.driverId = this.$route.query.driver;
        this.$misc
          .get(`/drivers/${this.driverId}`)
          .then(({ data: { driver } }) => {
            this.selectedDriverObj = driver;
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
    driverBalance() {
      if (this.selectedDriverObj)
        return this.selectedDriverObj.ballance.toFixed(2);
      else return " N/A ";
    },
    driverName() {
      if (this.selectedDriverObj)
        return [
          this.selectedDriverObj.firstName,
          this.selectedDriverObj.lastName,
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
        "wallet-histories/export?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              driver: this.driverId ? this.driverId : undefined,
              account: this.accountId ? this.accountId : undefined,
              by: this.by && this.by != "all" ? this.by : undefined,
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
    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.adding = true;
      this.$misc
        .get(`/drivers/${this.driverId}`)
        .then(({ data: { driver } }) => {
          this.selectedDriverObj = driver;
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
    console.log(this.$store.state.auth.account._id);
    this.$misc
      .get("/drivers")
      .then((response) => {
        this.drivers = response.data.data;
        let driver = this.drivers.find((driver) => driver._id == this.driverId);
        if (driver) {
          this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
        }
      })
      .catch((err) => console.log(err));

    this.$misc
      .get("/accounts")
      .then((response) => (this.accounts = response.data.data))
      .catch((err) => console.log(err));
  },
  methods: {
    handleClick() {
      this.adding ? this.add() : this.openAdd();
    },
    openAdd() {
      this.adding = true;
      this.$nextTick(() => {
        this.$refs.amountInput.focus();
      });
    },
    // getWallets(driverId) {
    //   this.loading = true;
    //   this.$misc
    //     .get(`/drivers/${this.driverId}/wallet-history`)
    //     .then(response => {
    //       this.wallets = response.data;
    //     })
    //     .catch(err => console.log(err))
    //     .finally(() => (this.loading = false));
    // },
    getAllWallets() {
      this.loading = true;
      var path = `/wallet-histories?populate=["driver","account","from", "ride"]&page=${this.currentPage}&limit=${this.perPage}`;
      if (this.driverId) {
        path += "&driver=" + this.driverId;
      }
      if (this.accountId) {
        path += "&account=" + this.accountId;
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
    searchDriver(e) {
      if (e.target.value.trim() === "") {
        this.driverSearchResults = [];
        this.driverId = null;
        this.getAllWallets();
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.driverSearchResults = [];
          this.$misc
            .get("drivers/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              console.log(data);
              this.driverSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.drivers = [];
        }
      }
    },
    searchAccount(e) {
      if (e.target.value.trim() === "") {
        this.accountSearchResults = [];
        this.accountId = null;
        this.getAllWallets();
      } else if (!isNaN(parseInt(e.target.value))) {
        this.accountSearchResults = this.accounts.filter((account) => {
          return account.phoneNumber.slice(-4).includes(e.target.value);
        });
      } else {
        this.accountSearchResults = this.accounts.filter((account) => {
          let name = account.firstName + " " + account.lastName;
          return name.toLowerCase().includes(e.target.value.toLowerCase());
        });
      }
    },
    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriverObj = driver;
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.driverId = driver._id;
      this.driverSearchResults = [];
      this.getAllWallets();
    },
    selectAccount(index) {
      let account = this.accountSearchResults[index];
      this.selectedAccount = `${account.firstName} ${account.lastName}`;
      this.accountId = account._id;
      this.accountSearchResults = [];
      this.by = "all";
      this.getAllWallets();
    },
    add() {
      this.busy = true;
      const amount = parseInt(this.amount);
      if (isNaN(amount)) {
        this.amountError = true;
        this.busy = false;
        return false;
      }
      this.$misc
        .post(`/drivers/${this.driverId}/top-up`, {
          amount,
          account: this.$store.state.auth.account._id,
          reason: this.reason ? this.reason : "Topup",
          paymentType: this.paymentType,
          deposit:
            this.paymentType === "bank_deposit" ? this.deposit : undefined,
        })
        .then(() => {
          this.getAllWallets();
          this.$misc
            .get(`/drivers/${this.driverId}`)
            .then(({ data: { driver } }) => {
              this.selectedDriverObj = driver;
            })
            .catch(() => {
              window.flash({
                type: "error",
                body: "Failed to fetch the new balance! please refresh",
              });
            });
          window.flash({
            type: "success",
            body: "Wallet added successfully to driver!",
          });
          this.adding = false;
          this.amount = 0;
        })
        .catch((err) => {
          console.log(err);
          window.flash({
            type: "error",
            body: "Failed to add wallet!",
          });
        })
        .finally(() => {
          this.busy = false;
        });
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