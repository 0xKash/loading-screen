<template>
  <div class="spinner-container">
    <svg class="spinner" viewBox="0 0 50 50">
      <circle
        class="spinner-track"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
      ></circle>
      <circle
        class="spinner-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style scoped>
.spinner-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 42px;
  height: 42px;
  animation: rotate 1.5s linear infinite;
}

.spinner-track {
  stroke: rgba(255, 255, 255, 0.2);
}

.spinner-path {
  stroke: #a8b3c8;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
