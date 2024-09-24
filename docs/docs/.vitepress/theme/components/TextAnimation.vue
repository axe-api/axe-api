<template>
  <p
    class="animated-text"
    :class="{ 'fade-out': isFadingOut, 'fade-in': !isFadingOut }"
    v-html="currentText"
  ></p>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

interface Props {
  isAnimating: boolean;
  list: string[];
  fading?: number;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fading: 500,
  duration: 5000,
});

const { isAnimating, list, fading, duration } = toRefs(props);

const interval = ref();
const currentIndex = ref(0);
const isFadingOut = ref(false);
const currentText = ref("No need import or route definition!");

watch(
  () => isAnimating.value,
  () => {
    if (isAnimating.value) {
      startAnimation();
    } else {
      stopAnimation;
    }
  },
);

const startAnimation = () => {
  currentIndex.value = 0;
  interval.value = setInterval(() => {
    // First, fade out the text
    isFadingOut.value = true;

    // Change the text after the fade-out duration (matching CSS duration)
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % list.value.length;
      currentText.value = list.value[currentIndex.value];

      // Switch to fade-in
      isFadingOut.value = false;
    }, fading.value); // This timeout should match the fade-out animation duration
  }, duration.value);
};

const stopAnimation = () => {
  clearInterval(interval.value);
  isFadingOut.value = false;
  currentIndex.value = 0;
  currentText.value = "No need import or route definition!";
};
</script>

<style scoped lang="scss">
.animated-text {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
}

.fade-out {
  opacity: 0;
}

.fade-in {
  opacity: 1;
}
</style>
