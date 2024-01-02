<template>
  <div class="space-y- w-ful max-w-8xl">
    <h2 class="font-semibold uppercase text-gray-600">
      Driver and User reviews
    </h2>
    <form @submit.prevent="add" class="space-y-4">
      <label class="block px-2">
        <span class="text-gray-700">Rating Groups</span>
        <select class="form-select block w-full mt-1">
          <option disabled selected hidden>Select rating group</option>
          <option>Driver rating</option>
          <option>Passanger rating</option>
        </select>
      </label>

      <hr />
      <div>
        <div class="relative max-w-sm w-full">
          <div class="absolute inset-y-0 flex items-center px-3">
            <i class="material-icons text-gray-500">search</i>
          </div>
          <input
            class="rounded border pl-10 pr-4 py-2 w-full"
            placeholder="Search"
          />
        </div>
      </div>
      <table class="table-auto rounded text-sm w-full bg-white">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-1 py-2">No #</th>
            <th class="border px-2 py-2">Trip id</th>
            <th class="border px-3 y-2">From (driver)</th>
            <th class="border px-3 py-2">To (passanger)</th>
            <th class="border px-3 py-2">Rating</th>
            <th class="border px-3 py-2">Date &amp; time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="index in 10" :key="index">
            <td class="border px-1 py-2 text-center">{{ index }}</td>
            <td class="border px-2 py-2">5353130320201342</td>
            <td class="border px-3 py-2">Girma ayalew</td>
            <td class="border px-3 py-2">Helen kidus</td>
            <td class="border px-3 py-2">5</td>
            <td class="border px-3 py-2">12 June 2020 15:13:53</td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    add() {
      console.log("sending data...");
    },
  },
};
</script>
