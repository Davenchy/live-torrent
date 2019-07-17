<template>
  <div>
    <nav-bar />
    <router-view />
  </div>
</template>

<script>
export default {
  components: {
    NavBar: () => import("@/components/NavBar")
  }
};
</script>
