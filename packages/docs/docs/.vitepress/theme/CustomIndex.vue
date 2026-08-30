<script setup>
import DefaultTheme from "vitepress/theme";
import DeprecationBanner from "./DeprecationBanner.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-top>
      <DeprecationBanner />
    </template>
    <template #home-hero-info>
      <div class="container">
        <img src="/viking.png" class="viking" />
        <h2 class="main-brand indigo">Axe API</h2>
        <h1 class="text title">
          It's <span class="yellow">deprecated!</span> <br />
          Find something else.
        </h1>
      </div>

      <h2 class="h2">Features</h2>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.container {
  padding-bottom: 160px;
  height: 100dvh;
}

.main-brand {
  font-family: var(--vp-font-family-base);
  text-align: center;
  font-size: 74px;
  font-weight: bold;
  padding-bottom: 25px;
  color: #f7e363;
}

.title {
  line-height: 70px;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-white);
  padding: 0px 0px 50px 0px;
}

.indigo {
  color: var(--vp-c-indigo-1);
}

.yellow {
  color: #f7e363;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.button {
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 18px;
}

.primary {
  background-color: var(--vp-c-indigo-3);
}

.secondary {
  background-color: var(--vp-c-gray-3);
}

.description-section {
  display: flex;
  justify-content: center;
}

.description-box {
  background: #fef9c3;
  padding: 40px;
  border-radius: 2px;
  font-size: 22px;
  line-height: 34px;
  font-weight: 500;
  color: var(--vp-c-gray-3);
  font-style: italic;
  max-width: 800px;

  & .important {
    background-color: #ffef89;
    text-decoration: underline;
    font-weight: 800;
  }
}

.box-sections {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .box {
    margin: 100px 0px;
    background-color: var(--vp-c-bg-elv);
    padding: 20px 30px;
    border-radius: 10px;
    max-width: 800px;

    & p {
      margin: 20px 0px;
      font-size: 22px;
      line-height: 34px;
      font-weight: 500;
      color: var(--vp-c-neutral);
      font-family: var(--vp-font-family-base);

      &.oversize {
        font-weight: 800;
        font-style: italic;
        color: var(--vp-c-red-1);
      }

      .brand {
        font-weight: 800;
        color: var(--vp-c-brand);
      }
    }
  }
}

.h2 {
  text-align: center;
  color: var(--vp-c-white);
  font-size: 40px;
  line-height: 50px;
  font-weight: 600;
  letter-spacing: -0.04;
  font-family: var(--vp-font-family-base);
  padding: 40px 0px 0px 0px;
}

img.viking {
  height: 300px;
}

@media only screen and (max-width: 600px) {
  img.viking {
    height: 200px;
  }

  .main-brand {
    font-size: 40px;
    padding-bottom: 10px;
  }

  .title {
    font-size: 30px;
    line-height: 38px;
    padding-bottom: 20px;
  }

  .button-container {
    flex-direction: column;

    .button {
      text-align: center;
    }
  }
}
</style>
