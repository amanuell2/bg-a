<template>
  <div class="flex w-full justify-between items-center">
    <div class="text-gray-600 pt-4">
      Showing <strong>{{ start }}</strong> to <strong>{{ end }}</strong> of
      <strong>{{ count }}</strong> entries (page {{currentPage}} of {{total}} pages) 
    </div>
    <div class="pt-4">
      Per page:
      <select
        class="form-select"
        name="perPage"
        id="perPage"
        v-model="perPage"
        @change="$emit('setPerPage', perPage)"
      >
        <option :selected="perPage === '10'" value="10">10</option>
        <option :selected="perPage === '25'" value="25">25</option>
        <option :selected="perPage === '50'" value="50">50</option>
        <option :selected="perPage === '100'" value="100">100</option>
      </select>
    </div>
    <div class="space-x-2 flex pt-4">
      <button
        @click="$emit('goto', 1)"
        type="button"
        class="flex items-center p-2 text-gray-500 hover:text-gray-800 outline-none focus:outline-none"
      >
        <i class="material-icons">first_page</i>
      </button>
      <button
        @click="$emit('goto', currentPage == 1 ? 1 : parseInt(currentPage) - 1)"
        type="button"
        class="flex items-center p-2 text-gray-500 hover:text-gray-800 outline-none focus:outline-none"
      >
        <i class="material-icons">chevron_left</i>
      </button>
      <span v-for="page in paginationPages" :key="`pageLink-${page}`">
        <button
          v-if="page !== '-'"
          type="button"
          class="p-2"
          :class="{
            'text-gray-500 hover:text-gray-800': currentPage !== page,
            'text-gray-900': currentPage == page,
          }"
          :disabled="currentPage === page"
          @click="$emit('goto', page)"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="w-20 justify-center text-gray-500 font-bold items-baseline h-full pt-1 flex"
        >
          . . .
        </span>
      </span>
      <button
        @click="
          $emit(
            'goto',
            parseInt(currentPage) + 1 <= parseInt(total)
              ? parseInt(currentPage) + 1
              : parseInt(currentPage)
          )
        "
        type="button"
        class="flex items-center p-2 text-gray-500 hover:text-gray-800 outline-none focus:outline-none"
      >
        <i class="material-icons">chevron_right</i>
      </button>
      <button
        @click="$emit('goto', parseInt(total))"
        type="button"
        class="flex items-center p-2 text-gray-500 hover:text-gray-800 outline-none focus:outline-none"
      >
        <i class="material-icons">last_page</i>
      </button>
    </div>
    <div class="flex flex-col">
      <div class="text-gray-600 text-sm h-6">Jump to specific page:</div>
      <div class="flex h-10">
        <input
          type="number"
          class="w-24 border-2 p-2 text-black"
          placeholder="Page"
          v-model="pageToJumpInto"
        />
        <button
          class="p-1 bg-shuufare-500 hover:bg-shuufare-600 shadow mx-1 w-20 text-gray-800"
          @click="$emit('goto', pageToJumpInto)"
        >
          Jump
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["currentPage", "total", "perPage", "start", "end", "count"],
  data() {
    return {
      pageToJumpInto: "",
    };
  },
  computed: {
    paginationPages() {
      const paginationLimit = 11;

      const curr = parseInt(this.currentPage);
      const total = parseInt(this.total);

      if (curr < paginationLimit / 2) {
        return Array(total > paginationLimit ? paginationLimit : total)
          .fill(undefined)
          .map((_, i) => i + 1);
      } else if (total - curr < paginationLimit) {
        return Array(total > paginationLimit ? paginationLimit : total)
          .fill(total - (total > paginationLimit ? paginationLimit : total))
          .map((x, i) => x + i + 1);
      } else {
        return Array(paginationLimit)
          .fill(curr - Math.ceil(paginationLimit / 2))
          .map((x, i) => x + i + 1);
      }
    },
  },
};
</script>
