import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import init from "./gmaps";
import { http, miscServer } from "./config";
import VCalendar from "v-calendar";
import VueDirectiveImagePreviewer from "vue-directive-image-previewer";
import "vue-directive-image-previewer/dist/assets/style.css";
import { config } from "@/config";
import io from "socket.io-client";

Vue.use(VueDirectiveImagePreviewer);

window.events = new Vue();
window.flash = message => {
  window.events.$emit("flash", message);
};

Vue.config.productionTip = false;

Vue.use(PortalVue);
Vue.use(VCalendar);

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
      el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
              vnode.context[binding.expression](event);
          }
      };
      document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

Vue.prototype.$sosSocket = io(`${config.baseURL}/sos-socket`, {
  transports: ['websocket'],
  withCredentials: true,
  upgrade: false,
  // rememberUpgrade: true,
  // reconnectionDelayMax: 1000,
  auth: {
    // token: this.$store.getters.token,
  },
});

Vue.prototype.$sosSocket.on("sos", (data) => {

  window.events.$emit("flash-sos", {
    type: "error", body: `
  <span class="font-semibold">NEW SOS Alert!</span><br/>
  Passenger: ${data.passenger ? [data.passenger.firstName, data.passenger.lastName].join(' ') : ' - '} <br/>
  Driver: ${data.driver ? [data.driver.firstName, data.driver.lastName].join(' ') : ' - '} <br/>
  type: ${data.type} <br/>
  Location: ${data.position.coordinates}
  ` });

  var audio = new Audio(require('@/assets/audios/siren.mp3'))
  audio.addEventListener("canplaythrough", () => {
    /* the audio is now playable; play it if permissions allow */
    audio.play(); // the audio now can be played
  });
});
init();

Vue.prototype.$http = http;
Vue.prototype.$misc = miscServer;

store.dispatch('loadFromStorage');

Vue.directive('click-outside', {
  bind (el, binding, vnode) {
      el.clickOutsideEvent = function (event) {
          // here I check that click was outside the el and his childrens
          if (!(el === event.target || el.contains(event.target))) {
              // and if it did, call method provided in attribute value
              vnode.context[binding.expression](event);
          }
      };
      document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

router.beforeEach((to, from, next) => {
  console.log("before router")

  Vue.prototype.$http.interceptors.request.use(function (config) {
    // sending TOKENS to 3rd party APIs will interfere with their operations
    const EXCLUDE_HOSTS = ["api.cloudinary.com"];
    if (!EXCLUDE_HOSTS.some(host => config.url.includes(host))) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  });
  Vue.prototype.$misc.interceptors.request.use(function (config) {
    // sending TOKENS to 3rd party APIs will interfere with their operations
    const EXCLUDE_HOSTS = ["api.cloudinary.com"];
    if (!EXCLUDE_HOSTS.some(host => config.url.includes(host))) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  });

  Vue.prototype.$misc.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    if (error && error.response && error.response.data) {
      switch (error.response.data) {
        case "ROLE_NOT_SPECIFIED":
          window.flash({ type: "error", body: "You must choose a role!" });
          router.replace('/role');
          break;
        case "ROLE_NOT_FOUND":
          window.flash({ type: "error", body: "Please login again." });
          await store.dispatch('logout')
          router.replace('/login');
          break;
        case "ACCOUNT_DEACTIVATED":
          window.flash({ type: "error", body: "Your account has been deactivated." });
          await store.dispatch('logout')
          router.replace('/login');
          break;
      }
    }
    throw error;
  });

  if (to.name === "404" || to.name === "PrivacyPolicy") {
    next();
  } else if (to.name == "Role") {
    if (!store.getters.isLoggedIn) {
      next("/login");
    } else {
      next();
    }
  } else if (to.meta.requiresAuth && store.getters.isLoggedIn) {
    if (!store.getters.role && !store.getters.corporateRole) {
      window.flash({ type: "success", body: "role not selected" });
      next("/role")
    } else {      
      store.dispatch('check', store.getters.token).then(() => {
        console.log("logged in");
        if (!store.getters.hasRole && !store.getters.corporateRole) {
          console.log("has no role");
          next("/role");
        } else {
          next()
        }
      })
    }
  } else if (to.meta.requiresGuest && store.getters.isLoggedIn) {
    // get the role homepage
    // redirect to that page
    if (!store.getters.hasRole) {
      next("/role");
      return;
    } else {
      console.log("already logged in");
      if (store.state.corporateRole) {
        return next("/dashboard")
      } else if (store.state.role) {
        return next("/corporate/dashboard");
      }
      return;
    }
  } else if (to.meta.requiresGuest) {
    next();
  } else {
    console.log("not logged in");
    next("/login");
  }
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount("#app");
