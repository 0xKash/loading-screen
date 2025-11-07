<script setup>
import Information from "./components/Information.vue";
import LoadingBar from "./components/LoadingBar.vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import SocialButtons from "./components/SocialButtons.vue";
import { useResizer } from "./composables/useResizer";

useResizer();
</script>

<template>
  <div class="resize-div">
    <div class="frame">
      <SocialButtons class="social-buttons" />
      <Information class="information" />
      <MusicPlayer class="music-player" />
      <LoadingBar class="loading-container" />
      <img src="/8mile.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.resize-div {
  width: 100vw;
  height: 100vh;
}

img {
  width: 30rem;

  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  box-sizing: border-box;
  padding: 4rem;

  zoom: var(--app-resize);
}

.social-buttons {
  position: absolute;
  top: 4rem;
  left: 4rem;
}

.information {
  position: absolute;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
}

.music-player {
  position: absolute;
  top: 4rem;
  right: 4rem;
}

.loading-container {
  position: absolute;
  bottom: 4rem; /* o 0 si quieres que toque el borde inferior */
  left: 0;
  right: 0;

  padding-right: 4rem;
  padding-left: 4rem;
}
</style>
