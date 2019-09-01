import Vue from "vue";
import Swal from "sweetalert2";

Vue.prototype.Swal = Swal;
Vue.prototype.Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000
});
