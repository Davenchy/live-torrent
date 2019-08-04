export const copy = text => {
  let dom = document.createElement("textarea");
  dom.value = text;
  dom.style.visibility = "none";
  dom = document.body.appendChild(dom);
  dom.focus();
  dom.select();
  document.execCommand("copy", false);
  dom.remove();
};

export default {
  copy
};
