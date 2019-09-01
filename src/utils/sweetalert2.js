import Vue from "vue";
import Swal from "sweetalert2";

Vue.prototype.Swal = Swal;
Vue.prototype.Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  showConfirmButton: false
});
