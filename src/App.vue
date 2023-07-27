<script setup>
</script>


<template>
  <div class="root">
    <router-view></router-view>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  /*webkit浏览器*/
  -moz-user-select: none;
  /*火狐*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
}

root {
  height: 100vh;
}</style>
