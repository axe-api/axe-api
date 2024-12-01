<script setup>
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info>
      <div class="container">
        <img src="/viking.png" class="viking" />
        <h2 class="main-brand yellow">Axe API</h2>
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
        <a
          href="https://www.producthunt.com/posts/axe-api?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-axe&#0045;api"
          target="_blank"
          ><img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=404818&theme=light"
            alt="Axe&#0032;API - The&#0032;next&#0045;generation&#0032;Rest&#0032;API&#0032;framework | Product Hunt"
            style="width: 250px; height: 54px"
            width="250"
            height="54"
        /></a>
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
