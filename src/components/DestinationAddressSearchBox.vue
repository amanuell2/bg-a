<template>
  <div class="font-amharic">
    <span class="text-gray-700">Destination Address</span>
    <input
      type="text"
      class="block w-full mt-1 form-input"
      placeholder="Enter a Destination Location"
      v-model="label"
      ref="searchText"
    />
    <ul
      v-if="results.length"
      class="absolute z-50 mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
    >
      <li
        v-for="(result, index) in results"
        :key="`pickadd-${index}`"
        class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
        @click="select(index)"
      >
        {{ result.structured_formatting.main_text }},
        {{ result.structured_formatting.secondary_text }}
      </li>
    </ul>
  </div>
</template>

<script>
// import _ from "lodash";
import init from "@/gmaps";

export default {
  data() {
    return {
      label: "",
      results: [],
      mapsService: null,
      google: null
    };
  },
  props: {
    initialValue: Object
  },
  async mounted() {
    try {
      this.google = await init();
      // this.mapsService = new this.google.maps.places.AutocompleteService();
      // this.geocoder = new this.google.maps.Geocoder();

      const autocomplete = new this.google.maps.places.Autocomplete(this.$refs.searchText, {
        fields: ["name", "geometry.location"]
      })

      this.google.maps.event.addListener(autocomplete, 'place_changed', () => {
        console.log("results:")
        console.log(autocomplete.getPlace());

        const place = autocomplete.getPlace();

        this.$emit("input", {
          name: place.name,
          coordinate: {
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng()
          }
        });
      });
    } catch (error) {
      console.error("KEBAD ERROR", error);
    }

    window.events.$on("dispatched", () => (this.label = ""));
  },
  created() {
    if (this.initialValue) {
      this.label = this.initialValue.name;
    }
  },
  watch: {
    initialValue: {
      handler(newValue) {
        // alert(JSON.stringify(newValue, null, 2));
        if (newValue && newValue.name) {
          this.label = newValue.name;
        }
      },
      deep: true,
    },
  },
  methods: {
    // select(index) {
    //   let result = this.results[index];
    //   this.label =
    //     result.structured_formatting.main_text +
    //     ", " +
    //     result.structured_formatting.secondary_text;
    //   // this.$emit("input", {
    //   //   place_id: result.place_id,
    //   //   name: result.description
    //   // });
    //   this.geocoder.geocode({
    //     placeId: result.place_id,
    //   }, (results, status) => {
    //     if (status == 'OK' && results.length > 0) {
    //       this.label =
    //         result.structured_formatting.main_text +
    //         ", " +
    //         result.structured_formatting.secondary_text;

    //       this.$emit("input", {
    //         name: result.description,
    //         coordinate: {
    //           lat: results[0].geometry.location.lat(),
    //           long: results[0].geometry.location.lng()
    //         }
    //       });
    //     } else {
    //       alert("network issue. please try again.")
    //     }
    //   })
    //   this.results = [];
    // },
    // search: _.debounce(function(e) {
    //   if (!this.mapsService || e.target.value.trim() == "" || e.target.value.trim().length <= 3) {
    //     this.results = [];
    //     return false;
    //   }

    //   this.mapsService.getQueryPredictions(
    //     {
    //       input: e.target.value,
    //       location: new this.google.maps.LatLng(8.9806034, 38.7577605),
    //       radius: 20000
    //     },
    //     (predictions, status) => {
    //       if (status !== this.google.maps.places.PlacesServiceStatus.OK) {
    //         return;
    //       }

    //       this.results = predictions;
    //     }
    //   );
    // }, 750)
  }
};
</script>
