<script setup>
import { onMounted, ref, computed } from "vue";
import formatTime from "../lib/formatTime";

const videoPlayer = ref(null);
const isPlaying = ref(true);
const isMuted = ref(false);

const duration = ref(0);
const currentTime = ref(0);
const currentArtist = ref("Artist");
const currentSong = ref("Song Name");
const volume = ref(100);

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const updateDuration = () => {
  if (videoPlayer.value && videoPlayer.value.duration) {
    duration.value = videoPlayer.value.duration;
  }
};

const updateCurrentTime = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
  }
};

// Seek to specific time
const seekToTime = (event) => {
  const newTime = parseFloat(event.target.value);
  videoPlayer.value.currentTime = newTime;
  currentTime.value = newTime;
};

// Change volume
const changeVolume = (event) => {
  volume.value = parseFloat(event.target.value);
  videoPlayer.value.volume = volume.value / 100;
};

// Load next video
const nextVideo = () => {
  window.dispatchEvent(new CustomEvent("loadNextVideo"));
};

// Load previous video (for now just restart current)
const previousVideo = () => {
  videoPlayer.value.currentTime = 0;
  currentTime.value = 0;
};

const togglePlay = () => {
  if (isPlaying.value) {
    videoPlayer.value.pause();
    isPlaying.value = false;
  } else {
    videoPlayer.value.play();
    isPlaying.value = true;
  }
};

const toggleVolume = () => {
  videoPlayer.value.muted = !videoPlayer.value.muted;
  isMuted.value = videoPlayer.value.muted;
};

onMounted(() => {
  setTimeout(() => {
    videoPlayer.value = document.getElementById("bg-video");

    if (videoPlayer.value) {
      if (videoPlayer.value.readyState >= 1) {
        updateDuration();
      }

      videoPlayer.value.addEventListener("loadedmetadata", updateDuration);
      videoPlayer.value.addEventListener("timeupdate", updateCurrentTime);
      videoPlayer.value.addEventListener("durationchange", updateDuration);
    }

    // Listen for video changes
    window.addEventListener("videoChanged", (event) => {
      currentArtist.value = event.detail.artist;
      currentSong.value = event.detail.song;
    });
  }, 100);
});
</script>

<template>
  <div class="audio-player">
    <div class="action-buttons flex justify-center gap-3">
      <button class="previous" @click="previousVideo">
        <img src="/next.png" alt="" />
      </button>
      <button class="play flex items-center justify-center" @click="togglePlay">
        <!-- Play icon -->
        <svg
          v-if="!isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          class="play-icon"
        >
          <path
            d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
            fill="white"
          />
        </svg>
        <!-- Pause icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          class="play-icon"
        >
          <path
            d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"
            fill="white"
          />
        </svg>
      </button>
      <button class="next" @click="nextVideo">
        <img src="/next.png" alt="" />
      </button>
    </div>
    <div class="timeline flex flex-col mb-4">
      <div class="flex justify-between text-[#B3B3B3]">
        <p class="elapsed-time">{{ formatTime(currentTime) }}</p>
        <p class="total-time">{{ formatTime(duration) }}</p>
      </div>
      <div class="lenth flex w-full">
        <input
          type="range"
          min="0"
          :max="duration"
          :value="currentTime"
          @input="seekToTime"
          class="progress-slider"
          :style="{ '--progress': progressPercentage }"
        />
      </div>
    </div>
    <div class="song flex justify-between">
      <div class="song-data flex flex-col items-start justify-start">
        <p>{{ currentArtist }}</p>
        <h1>{{ currentSong }}</h1>
      </div>
      <div class="volume-control flex flex-col items-center gap-2">
        <button @click="toggleVolume">
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
        </button>
        <input
          type="range"
          min="0"
          max="100"
          :value="volume"
          @input="changeVolume"
          class="volume-slider"
          :style="{ '--volume': volume }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  width: 20rem;
  padding: 1rem 1rem;
  background-color: #26313c59;
  border-radius: 0.35rem;
  border: 1px solid #40557059;
}

.play-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.song > button > img {
  width: 1.5rem;
  margin-right: 0.3rem;
}

.song-data > p {
  font-family: "Radio Canada Big";
  font-weight: 400;
  font-style: Regular;
  font-size: 10px;

  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

  color: #b3b3b3;
}

.song-data > h1 {
  font-family: "Radio Canada Big";
  font-weight: 600;
  font-style: SemiBold;
  font-size: 12px;

  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

  color: #ffffff;
}

.previous {
  transform: rotateY(-180deg);
}

.volume-control {
  margin-right: 0.3rem;
}

.volume-icon {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}

.volume-slider {
  width: 4rem;
  height: 0.3rem;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    #004eb3 0%,
    #0068ee calc(var(--volume) * 1%),
    #2c2c2c calc(var(--volume) * 1%),
    #2c2c2c 100%
  );
  border-radius: 0.25rem;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-track {
  width: 100%;
  height: 0.3rem;
  background: transparent;
  border-radius: 0.25rem;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
}

.volume-slider::-moz-range-track {
  width: 100%;
  height: 0.3rem;
  background: #2c2c2c;
  border-radius: 0.25rem;
}

.volume-slider::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.volume-slider::-moz-range-progress {
  height: 0.3rem;
  background: linear-gradient(90deg, #004eb3 0%, #0068ee 100%);
  border-radius: 0.35rem;
}

.progress-slider {
  width: 100%;
  height: 0.3rem;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    #004eb3 0%,
    #0068ee calc(var(--progress) * 1%),
    black calc(var(--progress) * 1%),
    black 100%
  );
  border-radius: 0.25rem;
  outline: none;
  cursor: pointer;
}

.progress-slider::-webkit-slider-track {
  width: 100%;
  height: 0.3rem;
  background: transparent;
  border-radius: 0.25rem;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
}

.progress-slider::-moz-range-track {
  width: 100%;
  height: 0.3rem;
  background: black;
  border-radius: 0.25rem;
}

.progress-slider::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.progress-slider::-moz-range-progress {
  height: 0.3rem;
  background: linear-gradient(90deg, #004eb3 0%, #0068ee 100%);
  border-radius: 0.35rem;
}

.elapsed-time,
.total-time {
  font-family: "Radio Canada Big";
  font-weight: 400;
  font-style: Regular;
  font-size: 10px;

  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.play {
  width: 2.5rem;
  height: 2.5rem;

  border-radius: 5px;
  background: linear-gradient(138.85deg, #0068ee 29.42%, #004eb3 98.71%);
  cursor: pointer;
}

img {
  width: 1.25rem;
}
</style>
