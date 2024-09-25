<template>
  <div class="scene" ref="sceneRef">Content</div>
</template>

<script setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

const sceneRef = ref();

onMounted(() => {
  gsap.timeline({
    scrollTrigger: {
      trigger: sceneRef.value,
      start: "top",
      end: "bottom",
      // scrub: true,
      pin: true,
      // pinSpacing: false, // Keep elements in place without adding extra space
    },
  });
});
</script>

<style scoped>
.scene {
  background-color: #f11;
  height: 50dvh;
}
</style>
