<template>
  <div class="relative flex" v-click-outside="hideSelectors">
    <input
      type="text"
      class="z-0 cursor-pointer form-input"
      :placeholder="placeholder"
      :value="`${value.hour}:${value.minute == 0? '00' : value.minute}`"
      @click="selectorOpen = !selectorOpen"
      readonly
    />
    <div
      class="absolute left-0 z-40 flex w-full gap-2 p-2 mt-12 bg-white shadow-lg"
      v-show="selectorOpen"
    >
      <div class="flex flex-col w-1/2">
        Hour:
        <select
          class="form-input"
          :value="value.hour"
          ref="hourPicker"
          @input="updateDate()"
        >
          <option
            :value="hr"
            v-for="hr of new Array(24).fill(undefined).map((_, i) => i)"
            :key="`hr-${hr}`"
          >
            {{ hr.toString().padStart(2, "0") }}
          </option>
        </select>
      </div>
      <div class="flex flex-col w-1/2">
        Minute
        <select
          class="form-input"
          :value="value.minute"
          ref="minutePicker"
          @input="updateDate()"
        >
          <option
            :value="min"
            v-for="min of [0, 10, 20, 30, 40, 50]"
            :key="`min-${min}`"
          >
            {{ min.toString().padStart(2, "0") }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["placeholder", "value"],
  data() {
    return {
      selectorOpen: false,
    };
  },
  methods: {
    hideSelectors() {
      this.selectorOpen = false;
    },
    updateDate() {
      this.$emit("input", {
        hour: +this.$refs.hourPicker.value,
        minute: +this.$refs.minutePicker.value,
      });
    },
  },
};
</script>