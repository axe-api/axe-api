<script setup>
import DefaultTheme from "vitepress/theme";
import ModelFeature from "./components/ModelFeature.vue";
import TestAnimation from "./components/TestAnimation.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="container">
        <h1 class="text title">
          A <span class="indigo">framework</span> to build
          <span class="indigo">Rest API</span>
        </h1>
        <div class="button-container">
          <a class="button primary" href="/learn/quick-start">
            Getting started
          </a>
          <a class="button secondary" href="/reference/api-configs">
            API References
          </a>
        </div>
      </div>
      <div class="description-section">
        <div class="description-box">
          "This is the framework that is missing to build Rest API with best
          practices. It's build on <span class="important">TypeScript</span>.
          Supports all major RDBMS such as
          <span class="important">PostgreSQL</span>,
          <span class="important">MSSQL</span>,
          <span class="important">MySQL</span>,
          <span class="important">MariaDB</span>,
          <span class="important">Oracle</span> and
          <span class="important">Amazon Redshift</span>."
        </div>
      </div>

      <div class="box-sections">
        <div class="box">
          <p>Frontend developers are going crazy!</p>
          <p>
            Many APIs are out there with a lack of documentation and
            inconsistent design. Yet you can find millions of blog posts
            discussing the Best Practices of APIs! Backend developers claim they
            know how to design a high-quality API, but finding a good example is
            not easy.
          </p>

          <p>It is a total mess!</p>

          <p>
            Think about how many times you've seen stale API documentation.
            Nobody has time to maintain it! What about inconsistency in routes?
            Or, <b>over-fetching</b> and <b>under-fetching</b> issues?
          </p>

          <p class="oversize">It should NOT be that hard!</p>
          <p>
            Instead, building a Rest API should be easy. We know how to build
            very well. But the missing part is a framework that is designed to
            build API.
          </p>

          <p>That’s where <span class="brand">Axe API</span> comes in.</p>
        </div>
      </div>

      <h2 class="h2">It's design is based on <br />best-practices</h2>

      <div>
        <TestAnimation />
      </div>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.container {
  padding-bottom: 160px;
}

.title {
  line-height: 90px;
  font-size: 74px;
  font-weight: bold;
  text-align: center;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-white);
  padding: 100px 0px 20px 0px;
}

.indigo {
  color: var(--vp-c-indigo-1);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.button {
  padding: 8px 20px;
  border-radius: 24px;
  font-weight: 500;
  font-size: 16px;
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
  padding: 40px 0px 40px 0px;
}
</style>
