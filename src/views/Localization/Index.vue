<template>
  <div class="relative w-full h-full">
    <div class="absolute inset-0 m-4 overflow-hidden">
      <div class="flex w-full h-full bg-white rounded-lg">
        <div class="box-border w-1/4 h-full overflow-y-auto border-r-2">
          <div
            v-for="(localization, index) in localizations"
            :key="localization._id"
            @click="selectLocalization(index)"
            class="flex items-center px-4 py-2 mb-1 space-x-4 border-t border-b cursor-pointer hover:bg-gray-200"
            :class="
              selectedLocalization && localization._id === selectedLocalization._id
                ? 'bg-gray-200'
                : ''
            "
          >
            <div class="w-12 h-12 bg-teal-500 rounded"></div>
            <div class="flex-grow">
              <h1 class="text-xl">{{ localization.name }}</h1>
            </div>
            <button
              class="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center"
              @click="deleteLocalization(localization._id)"
              v-if="localization.name != 'english'"
            >
              <i class="material-icons">close</i>
            </button>
          </div>
          <div
            @click="addingLocalizations = !addingLocalizations"
            class="flex items-center px-4 py-3 mb-1 space-x-4 border-t border-b cursor-pointer hover:bg-gray-200 justify-center bg-gray-200"
          >
            <div>
              <h1 class="text-xl">Add Localization</h1>
            </div>
          </div>
          <div class="flex flex-col items-center bg-gray-200" v-if="addingLocalizations">
            <div class="block w-4/5">
              <input
                class="h-12 px-2 w-full mb-2 mt-4"
                placeholder="language name"
                v-model="newLocalizationName"
              />
            </div>
            <button
              class="px-4 py-2 my-2 space-x-4 border-t border-b cursor-pointer border justify-center"
              :class="newLocalizationName.length > 3 ? 'bg-shuufare-300 hover:bg-shuufare-400' : 'bg-gray-300 text-gray-500'"
              :disabled="newLocalizationName.length < 3"
              @click="addLocalization()"
            >
              <h1 class="text-xl">Done</h1>
            </button>
          </div>
          <!--  -->
        </div>
        <div class="w-3/4 overflow-y-auto">
          <div v-if="selectedLocalization !== null">
            <div class="w-full px-4 py-2 bg-shuufare-500">
              <strong>{{ selectedLocalization.name }}</strong>
            </div>
            <ul class="flex border-b">
              <li
                v-bind:class="[
                  selectedTab == 'driver' ? '-mb-px mr-1' : 'mr-1'
                ]"
                @click="selectTab('driver')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'driver'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Driver</span>
              </li>

              <li
                v-bind:class="[selectedTab == 'passenger' ? '-mb-px mr-1' : 'mr-1']"
                @click="selectTab('passenger')"
              >
                <span
                  v-bind:class="[
                    selectedTab == 'passenger'
                      ? 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                      : 'bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
                  ]"
                >Passenger</span>
              </li>

              <li></li>
            </ul>
            <div class="p-4">
              <Driver v-if="selectedTab == 'driver'" :localization="selectedLocalization"></Driver>
              <Passenger v-if="selectedTab == 'passenger'" :localization="selectedLocalization"></Passenger>
            </div>
          </div>
          <div v-else>
            <h3
              class="p-4 text-xl font-semibold text-gray-700"
            >Select a localization from the list on the left!</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Driver from "@/views/Localization/Driver";
import Passenger from "@/views/Localization/Passenger";

export default {
  components: {
    Driver,
    Passenger
  },
  data() {
    return {
      localizations: [],
      selectedLocalization: null,
      selectedTab: "profile",
      loading: false,
      searchKey: "",
      addingLocalizations: false,
      newLocalizationName: ""
    };
  },
  watch: {
    selectedLocalization() {
      this.selectedTab = "passenger";
    },
    searchKey() {
      this.getLocalizations();
    }
  },
  created() {
    this.getLocalizations();
  },
  methods: {
    getLocalizations() {
      this.$misc
        .get("/localization-languages")
        .then(response => {
          this.localizations = response.data
          this.selectedLocalization = this.localizations[0];
          this.selectedTab = 'passenger'
        })
        .catch(err => console.log(err));
    },
    selectLocalization(index) {
      this.selectedLocalization = this.localizations[index];
    },
    updateState() {
      this.$misc
        .patch("/localizations/" + this.selectedLocalization._id, {
          active: this.selectedLocalization.active
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
    },
    addLocalization() {
      this.$misc
        .post("/localization-languages", {
          name: this.newLocalizationName
        })
        .then(() => {
          this.getLocalizations();
        })
        .catch(err => alert(JSON.stringify(err.response.data)));
    },
    deleteLocalization(id) {
      var r = confirm("Are you sure you want to delete this localization?");
      if (r == true) {
        Promise.all([
          this.$misc
            .delete(`/passenger-localizations/${id}`),

          this.$misc
            .delete(`/driver-localizations/${id}`)
        ])
          .catch(() => alert("something went wrong while deleting the localization"))
          .finally(() => {
            this.getLocalizations();
          })
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    }
  }
};
</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 25px;
  width: 25px;
  left: 0px;
  bottom: 0px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>