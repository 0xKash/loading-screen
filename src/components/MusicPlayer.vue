<script setup>
import { onMounted, ref, computed } from "vue";
import formatTime from "../lib/formatTime";
import VolumeSlider from "../components/common/VolumeSlider.vue";

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

/** Seeks to specific time in video */
const seekToTime = (event) => {
  const newTime = parseFloat(event.target.value);
  videoPlayer.value.currentTime = newTime;
  currentTime.value = newTime;
};

/** Loads next video in queue */
const nextVideo = () => {
  window.dispatchEvent(new CustomEvent("loadNextVideo"));
};

/** Restarts current video */
const previousVideo = () => {
  videoPlayer.value.currentTime = 0;
  currentTime.value = 0;
};

/** Toggles play/pause state */
const togglePlay = () => {
  if (isPlaying.value) {
    videoPlayer.value.pause();
    isPlaying.value = false;
  } else {
    videoPlayer.value.play();
    isPlaying.value = true;
  }
};

/** Toggles mute state */
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
        <!-- Custom SVG Volume Slider -->
        <VolumeSlider
          v-model="volume"
          :video-player="videoPlayer"
          class="w-4"
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

.volume-control > img {
  position: absolute;
  top: 6rem;
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
