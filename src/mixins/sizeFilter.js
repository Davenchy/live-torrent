export default {
  filters: {
    size(n) {
      const types = ["bytes", "Kb", "Mb", "Gb", "Tb"];
      let size = n;
      let i = 0;
      while (size >= 1024) {
        size /= 1024;
        i++;
      }
      return `${parseFloat(size).toFixed(2)} ${types[i] || "?"}`;
    }
  }
};
