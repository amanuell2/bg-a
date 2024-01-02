<template>
    <button
        class="px-4 py-2 bg-gray-300 text-gray-500 font-semibold rounded hover:bg-gray-500 hover:text-gray-100 mr-4"
        @click="$router.back()"
      >
        <slot>
          Cancel
        </slot>
    </button>
</template>