import Vue from "vue";
import Vuex from "vuex";
// import { http } from "../config";

import { miscServer } from "../config";

const http = miscServer

import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: null,
    role: null,
    corporateRole: null,
  },
  mutations: {
    setAuth: (state, auth) => (state.auth = auth),
    setRole: (state, role) => (state.role = role),
    removeRole: state => (state.role = null),
    setCorporateRole: (state, role) => (state.corporateRole = role),
    removeCorporateRole: state => (state.corporateRole = null),
    logout: state => {
      state.auth = null;
      state.role = null;
      state.corporateRole = null;
    },
  },
  getters: {
    corporate: state => state.auth && state.auth.account.corporate ? state.auth.account.corporate.name : "",
    isLoggedIn: state => state.auth !== null,
    hasRole: state => state.role !== null,
    hasCorporateRole: state => state.corporateRole !== null,
    role: state => state.role,
    corporateRole: state => state.corporateRole,
    token: state => state.auth ? state.auth.token : ""
  },
  actions: {
    setRole: (ctx, role) => {
      ctx.commit("setRole", role);
      window.localStorage.setItem("sh-role", JSON.stringify(role));

      return new Promise((resolve, reject) => {
        http
          .post("/accounts/set-role", {
            token: ctx.getters.token,
            roleId: ctx.getters.role._id
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
        })
    },
    setCorporateRole: (ctx, role) => {
      ctx.commit("setCorporateRole", role);
      window.localStorage.setItem("sh-c-role", JSON.stringify(role));

      return new Promise((resolve, reject) => {
        http
          .post("/accounts/set-corporate-role", {
            token: ctx.getters.token,
            roleId: ctx.getters.corporateRole._id
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
        })
    },
    login: (ctx, user) => {
      // request param => {email: 'dispatcher@test.et', password: 'password', role: 1}
      // response => { dispatcher: {}, role: '', token: '' }
      return new Promise((resolve, reject) => {
        http
          .post("/accounts/auth", user)
          .then(response => {
            console.log(response);
            ctx.commit("setAuth", response.data);
            window.localStorage.setItem("sh-auth", JSON.stringify(response.data));
            console.log("auth setting")

            resolve(true);
          })
          .catch(err => {
            if (err.response.data && err.response.data.error === "INACTIVE")
              window.flash({ type: "error", body: "Can't login! Your account has been deactivated." });
            else
              window.flash({ type: "error", body: "Failed to login!" });
            reject(err);
          });
      });
    },
    check: (ctx, token) => {
      return new Promise((resolve, reject) => {
        http
          .get(`/accounts/check/${token}`)
          .then(response => {
            ctx.commit("setAuth", response.data);
            window.localStorage.setItem("sh-auth", JSON.stringify(response.data));
            resolve(true);
          })
          .catch(err => {
            if (err.response && err.response.data && err.response.data.error === "INACTIVE") {
              ctx.dispatch('logout').finally(() => {
                router.replace('/login')
                window.flash({ type: "error", body: "Signing you out! Your account has been deactivated." });
              })
            } else if (err.response && err.response.data && err.response.status === 401) {
              ctx.dispatch('logout').finally(() => {
                router.replace('/login')
                window.flash({ type: "error", body: "Please sign-in again!" });
              })
            }
            else
              reject(err);
          });
      });
    },
    loadFromStorage(ctx) {
      const auth = window.localStorage.getItem("sh-auth");
      
      if (auth) {    
        ctx.commit("setAuth", JSON.parse(auth));
      }
      
      const role = window.localStorage.getItem("sh-role");
      if (role) {
        ctx.commit("setRole", JSON.parse(role));
      }
      
      const corporateRole = window.localStorage.getItem("sh-c-role");
      if (corporateRole) {
        ctx.commit("setCorporateRole", JSON.parse(corporateRole));
      }
    },
    logout: ctx => {
      // delete the token
      return new Promise((resolve, reject) => {
        try {
          window.localStorage.removeItem("sh-auth");
          window.localStorage.removeItem("sh-role");
          window.localStorage.removeItem("sh-c-role");
          ctx.commit("logout");
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
  modules: {},
});
