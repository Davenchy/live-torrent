import { Toast } from "./sweetalert2";

export const copy = (text, msg = "Copied") => {
  let dom = document.createElement("textarea");
  dom.value = text;
  dom.style.visibility = "none";
  dom = document.body.appendChild(dom);
  dom.focus();
  dom.select();
  document.execCommand("copy", false);
  dom.remove();
  Toast.fire({
    title: msg,
    type: "success"
  });
};

export default {
  copy
};
