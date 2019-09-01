<template>
  <div ref="feedback"></div>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    const tag = document.createElement("script");
    tag.src = [
      "https:" === location.protocol ? "https://" : "http://",
      "widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdyvFhC7sq8eqCvG9QaH9oQvI20MyTW5uVhcmSVfXgduc.js"
    ].join("");
    tag.type = "text/javascript";
    tag.id = "smcx-sdk";
    tag.async = true;
    this.$refs.feedback.appendChild(tag);
  }
};
</script>