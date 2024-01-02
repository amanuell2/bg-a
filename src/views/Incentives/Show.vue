<template>
  <div>
    <back-button class="flex items-center h-12 gap-2">
      <i class="material-icons">
        arrow_back
      </i>
      Go Back
    </back-button>

    <div class="space-y-10">
      <div class="flex justify-between"></div>
      <div class="inline-block min-w-full -lg">
        <transition name="fade">
          <div
            class="p-4 px-8 pb-10 mx-auto space-y-8 bg-white rounded-md shadow-xl"
            style="width: 26rem"
            v-if="!loading && deposit != null"
          >
            <div class="w-full py-5 text-center">
              <h2 class="font-semibold text-gray-600">
                <span class="uppercase">Bank Deposit Detail</span>
              </h2>
            </div>
            <div class="space-y-6 divide-y">
              <div class="flex justify-between w-full">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <span>Bank</span>
                </h2>
                <div>
                  <span>{{ deposit.bank }}</span>
                </div>
              </div>
              <div class="flex justify-between w-full">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <span>By</span>
                </h2>
                <div>
                  <span>{{ deposit.by }}</span>
                </div>
              </div>
              <div class="flex justify-between w-full">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <span>Transaction</span>
                </h2>
                <div>
                  <span>{{ deposit.narrative }}</span>
                </div>
              </div>
              <div class="flex justify-between w-full">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <span>Date</span>
                </h2>
                <div>
                  {{ deposit.date }}
                </div>
              </div>
              <div class="flex justify-between w-full p-2 pl-0">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <span>Status</span>
                </h2>
                <transition name="status-label">
                  <div
                    class="p-1 px-4 uppercase"
                    :class="{
                      'bg-red-200': deposit.status === 'denied',
                      'bg-green-200': deposit.status === 'paid',
                      'bg-blue-200': deposit.status === 'unpaid',
                    }"
                  >
                    <!-- {{ deposit. }} -->
                    {{ deposit.status }}
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div
            class="p-6 px-8 pb-10 mx-auto mt-6 space-y-6 text-sm text-gray-600 transition duration-500 ease-in-out bg-white rounded-md shadow-xl"
            style="width: 26rem"
            v-if="!loading && deposit != null && deposit.status === 'unpaid'"
          >
            Please verify the payment by:
            <div
              class="flex gap-8 p-4 py-2 my-2 text-lg font-semibold text-gray-700 uppercase border"
            >
              <div class="inline-block">
                <div class="text-xs font-thin text-gray-800">Transaction:</div>
                <div>
                  {{ deposit.transaction }}
                </div>
              </div>

              <div class="inline-block">
                <div class="text-xs font-thin text-gray-800">Bank:</div>
                <div>
                  {{ deposit.bank }}
                </div>
              </div>
            </div>
            <div>and click the following button to mark this deposit PAID.</div>
            <hr />
            <button
              class="w-full h-12 text-lg font-semibold text-gray-800 bg-shuufare-400"
              @click="markPaid"
            >
              Mark as PAID
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<style scoped>
.status-label-enter,
.status-label-leave-to {
  opacity: 0;
}
.status-label-enter-active,
.status-label-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<script>
import BackButton from '../../components/BackButton.vue';

export default {
  data() {
    return {
      loading: true,
      deposit: null,
    };
  },
  components: {
    BackButton,
  },
  watch: {},
  created() {
    this.loading = true;
    this.$misc
      .get(`/wallet-histories/${this.$route.params.id}`)
      .then(({ data }) => {
        this.deposit = data.deposit;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    markPaid() {
      this.loading = true;
      this.$misc
        .post(`/wallet-histories/${this.$route.params.id}/mark-paid`)
        .then(() => {
          return this.$misc
            .get(`/wallet-histories/${this.$route.params.id}`)
            .then(({ data }) => {
              this.deposit = data.deposit;
            });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
