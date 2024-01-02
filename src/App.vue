<template>
  <div>
    <router-view></router-view>
    <FlashMessage />
  </div>
</template>

<script>
import io from "socket.io-client";
import FlashMessage from "./components/FlashMessage";
import { config } from "@/config";

export default {
  components: {
    FlashMessage,
  },
  data() {
    return {
      socket: null,
    };
  },
  created() {
    this.socket = io(`${config.baseURL}/sos`, {
        transports: ['websocket'],
        withCredentials: true,
        upgrade: false,
        // rememberUpgrade: true,
        // reconnectionDelayMax: 1000,
        auth: {
          token: this.$store.getters.token,
        },
      });

    this.socket.on("sos", () => {
      console.log("incoming sos...");
    });
  },
};
</script>

<style src="@/assets/css/tailwind.css"></style>
