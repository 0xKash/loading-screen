<script setup>
import { openUrl } from "../lib/openURL";
import { CONFIG } from "../config/config";

const handleDiscordClick = () => {
  openUrl("openURL", CONFIG.links.discord);
};

const handleShopClick = () => {
  openUrl("openURL", CONFIG.links.shop);
};
</script>

<template>
  <div class="socials flex gap-3">
    <button
      class="discord flex items-center justify-center"
      @click="handleDiscordClick"
    >
      <img src="/discord.png" alt="" />
    </button>

    <button
      class="shop flex items-center justify-center"
      @click="handleShopClick"
    >
      <img src="/cart.png" alt="" />
    </button>
  </div>
</template>

<style scoped>
.discord,
.shop {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 5px;
  background: linear-gradient(138.85deg, #0068ee 29.42%, #004eb3 98.71%);
  cursor: pointer;
}

.discord > img,
.shop > img {
  width: 1.5rem;
}
</style>
