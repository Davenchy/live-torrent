import Vue from "vue";
import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  showConfirmButton: false
});

Vue.prototype.Swal = Swal;
Vue.prototype.Toast = Toast;

export default Swal;
