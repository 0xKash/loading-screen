<script setup>
import { ref, onMounted, computed } from "vue";
import LoadingSpinner from "./common/LoadingSpinner.vue";

const progress = ref(0);
const loadingMessage = ref("Preparing assets...");

const percentageText = computed(() => {
  return Math.floor(progress.value) + "%";
});

onMounted(() => {
  window.addEventListener("message", (event) => {
    const data = event.data;

    if (data.eventName === "loadProgress") {
      progress.value = data.loadFraction * 100;

      if (data.message) {
        loadingMessage.value = data.message;
      }
    }
  });
});
</script>

<template>
  <div class="loading">
    <div class="text flex items-center gap-3">
      <LoadingSpinner />
      <div class="left-text">
        <h1>NOW LOADING</h1>
        <p>{{ loadingMessage }}</p>
      </div>
      <div class="percentage flex items-center justify-center">
        <h1>{{ percentageText }}</h1>
      </div>
    </div>
    <div class="loading-bar">
      <div
        class="completed-loading-bar"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  width: 100%;
}

.percentage {
  height: 2rem;
  width: 4rem;

  margin-left: auto;
  border-radius: 0.5rem;
  border: 1px solid #40557059;
}

.percentage > h1 {
  font-family: "Radio Canada Big";
  font-weight: 500;
  font-style: Medium;
  font-size: 20px;

  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;

  color: #ffffff;
}

.text > .left-text > h1 {
  font-family: "Radio Canada Big";
  font-weight: 700;
  font-style: Bold;
  font-size: 20px;

  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  text-transform: uppercase;

  color: #ffffff;
}

.text {
  margin-bottom: 0.25rem;
}

.text > div > p {
  font-family: "Radio Canada Big";
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;

  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

  color: #b3b3b3;
}

.loading-bar {
  width: 100%;
  height: 1rem;
  border-radius: 0.3rem;

  background-color: #004eb340;
  border: 1px solid #004eb380;
}

.completed-loading-bar {
  height: 100%;
  border-radius: 0.25rem;

  background: linear-gradient(90deg, #004eb3 0%, #0068ee 100%);
  transition: width 0.1s ease-out;
}
</style>
