import io from "socket.io-client";
import Vue from "vue";

const socket = io({
  path: "/api/sockets"
});

socket.on("connect", () => console.log("Connected to backend"));

Vue.prototype.$socket = socket;
export default socket;
