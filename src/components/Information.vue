<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { CONFIG } from "../config/config";

const messages = CONFIG.messages;
const currentMessageIndex = ref(0);
let intervalId = null;

const getRandomIndex = () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * messages.length);
  } while (newIndex === currentMessageIndex.value && messages.length > 1);
  return newIndex;
};

onMounted(() => {
  intervalId = setInterval(() => {
    currentMessageIndex.value = getRandomIndex();
  }, 10000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="info flex flex-col items-center gap-3">
    <button class="info-button flex items-center justify-center">
      <img src="/info-icon.png" alt="" />
    </button>
    <p>{{ messages[currentMessageIndex] }}</p>
  </div>
</template>

<style scoped>
.info {
  width: fit-content;
}

button {
  width: 2.5rem;
  height: 2.5rem;

  border-radius: 5px;
  background: linear-gradient(138.85deg, #0068ee 29.42%, #004eb3 98.71%);
  cursor: pointer;
}

.info-button > img {
  width: 1.5rem;
}

.info > p {
  font-family: "Radio Canada Big";
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;

  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;

  color: #b3b3b3;
}
</style>
