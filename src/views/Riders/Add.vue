<template>
  <div class="space-y-4 w-ful max-w-4xl">
    <h2 class="font-semibold uppercase text-gray-600">
      Add Passenger
    </h2>
    <form @submit.prevent="add" class="space-y-4">
      <div class="flex -mx-2">
        <div class="w-1/2">
          <label class="block px-2">
            <span class="text-gray-700">First Name</span>
            <input class="form-input mt-1 block w-full" placeholder="Jane" />
          </label>
        </div>
        <div class="w-1/2">
          <label class="block px-2">
            <span class="text-gray-700">Last Name</span>
            <input class="form-input mt-1 block w-full" placeholder="Doe" />
          </label>
        </div>
      </div>
      <label class="block">
        <span class="text-gray-700">Email</span>
        <input
          class="form-input mt-1 block w-full"
          type="email"
          placeholder="johndoe@gmail.com"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Contact Number</span>
        <input
          class="form-input mt-1 block w-full"
          type="text"
          placeholder="+251 912345678"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Profile Picture</span>
        <input class="form-input mt-1 block w-full" type="file" />
      </label>
      <button
        class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
      >
        Add Passenger
      </button>
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
