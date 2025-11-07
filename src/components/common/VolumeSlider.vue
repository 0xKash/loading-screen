<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: 100 },
  videoPlayer: { type: Object, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const volume = ref(props.modelValue);
const sliderTrack = ref(null);
const isDragging = ref(false);
const isMuted = ref(false);
const volumeBeforeMute = ref(100);

watch(
  () => props.modelValue,
  (newValue) => {
    volume.value = newValue;
  }
);

/** Updates volume based on position */
const updateVolume = (clientX) => {
  if (!sliderTrack.value) return;

  const rect = sliderTrack.value.getBoundingClientRect();
  const relativeX = clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

  volume.value = Math.round(percentage);
  emit("update:modelValue", volume.value);

  if (props.videoPlayer) {
    props.videoPlayer.volume = volume.value / 100;
  }

  if (volume.value > 0) {
    isMuted.value = false;
  }
};

/** Toggles mute state */
const toggleMute = () => {
  if (isMuted.value) {
    volume.value = volumeBeforeMute.value;
    isMuted.value = false;
  } else {
    volumeBeforeMute.value = volume.value;
    volume.value = 0;
    isMuted.value = true;
  }

  emit("update:modelValue", volume.value);

  if (props.videoPlayer) {
    props.videoPlayer.volume = volume.value / 100;
  }
};

/** Handles mouse down event */
const handleMouseDown = (event) => {
  isDragging.value = true;
  updateVolume(event.clientX);

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

/** Handles mouse move event */
const handleMouseMove = (event) => {
  if (isDragging.value) {
    updateVolume(event.clientX);
  }
};

/** Handles mouse up event */
const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

/** Handles touch start event */
const handleTouchStart = (event) => {
  isDragging.value = true;
  const touch = event.touches[0];
  updateVolume(touch.clientX);

  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchend", handleTouchEnd);
};

/** Handles touch move event */
const handleTouchMove = (event) => {
  if (isDragging.value) {
    const touch = event.touches[0];
    updateVolume(touch.clientX);
  }
};

/** Handles touch end event */
const handleTouchEnd = () => {
  isDragging.value = false;
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", handleTouchEnd);
};
</script>

<template>
  <div class="volume-slider-wrapper">
    <div
      class="volume-slider-container"
      @mousedown="handleMouseDown"
      @touchstart.passive="handleTouchStart"
      ref="sliderTrack"
    >
      <!-- Gray background SVG -->
      <svg
        width="38"
        height="33"
        viewBox="0 0 38 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.55176 32.3584C2.90083 29.7075 1.09553 26.33 0.364137 22.653C-0.367252 18.9761 0.00812445 15.1649 1.4428 11.7013C2.87747 8.23765 5.30699 5.27726 8.42416 3.19444C11.5413 1.11162 15.2061 -8.09404e-05 18.9551 -7.92545e-05C22.7041 -7.92545e-05 26.3688 1.11162 29.486 3.19444C32.6032 5.27726 35.0327 8.23765 36.4674 11.7013C37.902 15.1649 38.2774 18.9761 37.546 22.653C36.8146 26.33 35.0093 29.7075 32.3584 32.3584L30.4712 30.4712C32.7489 28.1935 34.3 25.2916 34.9284 22.1324C35.5568 18.9731 35.2343 15.6985 34.0016 12.7226C32.769 9.74666 30.6815 7.2031 28.0032 5.41354C25.325 3.62398 22.1762 2.66881 18.9551 2.66881C15.734 2.66881 12.5852 3.62398 9.90691 5.41354C7.22865 7.2031 5.14119 9.74666 3.90852 12.7226C2.67585 15.6985 2.35333 18.9731 2.98174 22.1324C3.61015 25.2916 5.16127 28.1935 7.43894 30.4712L5.55176 32.3584Z"
          fill="#B3B3B3"
          fill-opacity="0.25"
        />
      </svg>

      <!-- Blue fill SVG with clip-path -->
      <svg
        class="blue"
        :style="{ clipPath: `inset(0 ${100 - volume}% 0 0)` }"
        width="38"
        height="33"
        viewBox="0 0 38 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.55176 32.3584C2.90083 29.7075 1.09553 26.33 0.364137 22.653C-0.367252 18.9761 0.00812445 15.1649 1.4428 11.7013C2.87747 8.23765 5.30699 5.27726 8.42416 3.19444C11.5413 1.11162 15.2061 -8.09404e-05 18.9551 -7.92545e-05C22.7041 -7.92545e-05 26.3688 1.11162 29.486 3.19444C32.6032 5.27726 35.0327 8.23765 36.4674 11.7013C37.902 15.1649 38.2774 18.9761 37.546 22.653C36.8146 26.33 35.0093 29.7075 32.3584 32.3584L30.4712 30.4712C32.7489 28.1935 34.3 25.2916 34.9284 22.1324C35.5568 18.9731 35.2343 15.6985 34.0016 12.7226C32.769 9.74666 30.6815 7.2031 28.0032 5.41354C25.325 3.62398 22.1762 2.66881 18.9551 2.66881C15.734 2.66881 12.5852 3.62398 9.90691 5.41354C7.22865 7.2031 5.14119 9.74666 3.90852 12.7226C2.67585 15.6985 2.35333 18.9731 2.98174 22.1324C3.61015 25.2916 5.16127 28.1935 7.43894 30.4712L5.55176 32.3584Z"
          fill="url(#paint0_linear_10025_157)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_10025_157"
            x1="30.4354"
            y1="6.16954"
            x2="5.55176"
            y2="32.3584"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.225962" stop-color="#0068EE" />
            <stop offset="1" stop-color="#004EB3" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Volume icons -->
    <div class="volume-icon-container" @click="toggleMute">
      <!-- Volume on icon -->
      <svg
        v-if="!isMuted"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class="volume-icon"
      >
        <path
          d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"
          fill="white"
        />
      </svg>

      <!-- Volume muted icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class="volume-icon"
      >
        <path
          d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"
          fill="white"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.volume-slider-wrapper {
  position: relative;
  width: fit-content;
}

.volume-slider-container {
  position: relative;
  width: fit-content;
  cursor: pointer;
  user-select: none;
}

.blue {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: clip-path 0.05s ease-out;
}

.volume-icon-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.volume-icon {
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease;
}

.volume-icon-container:hover .volume-icon {
  opacity: 0.8;
}
</style>
