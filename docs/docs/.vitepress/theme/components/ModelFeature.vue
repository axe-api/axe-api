<template>
  <div
    class="big-box"
    @mouseenter="animation = true"
    @mouseleave="animation = false"
  >
    <div class="container">
      <div class="left-box">
        <div class="code">
          <div>
            <span class="red">import</span> {
            <span class="purple">Model</span> } <span class="red">from</span>
            <span class="purple"> "axe-api"</span>;
          </div>
          <div>&nbsp;</div>
          <div>
            <span class="red">class</span> <span class="purple">Category</span>
            <span class="red"> extends</span>
            <span class="purple"> Model</span> {
          </div>
          <div class="indent-1 gray">// a basic model...</div>
          <div>}</div>
          <div>&nbsp;</div>
          <div>
            <span class="red">export</span> <span class="red">default</span>
            <span class="purple"> Category</span>;
          </div>
        </div>
      </div>
      <div class="description">
        <p>
          It reads models files and creates API endpoints by well-known CRUD
          endpoints.
        </p>
        <div>
          <TextAnimation :list="textList" :isAnimating="animation" />
        </div>

        <div class="requests" v-if="false">
          <div>
            <div class="method-box"><span class="method post">POST</span></div>
            api/v1/categories
          </div>
          <div>
            <div class="method-box"><span class="method">GET</span></div>
            api/v1/categories
          </div>
          <div>
            <div class="method-box"><span class="method">GET</span></div>
            api/v1/categories/:id
          </div>
          <div>
            <div class="method-box">
              <span class="method delete">DELETE</span>
            </div>
            api/v1/categories/:id
          </div>
          <div>
            <div class="method-box"><span class="method update">PUT</span></div>
            api/v1/categories/:id
          </div>
          <div>
            <div class="method-box">
              <span class="method update">PATCH</span>
            </div>
            api/v1/categories/:id
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TextAnimation from "./TextAnimation.vue";

const animation = ref(false);
const textList = [
  "Option a",
  "Option b",
  "Option c",
  "Option c",
  "Option d",
  "Option e",
  "Option f",
  "Option g",
];
</script>

<style scoped lang="scss">
.big-box {
  display: flex;
  justify-content: center;
  margin: 100px 0px;
  background-color: var(--vp-c-bg);
  border-radius: 10px;
  transition: background-color 500ms;
  cursor: pointer;

  &:hover {
    background-color: var(--vp-c-bg-elv);

    & .code {
      transform: scale(1.05);
    }
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 100px 50px;
}

.left-box {
  width: 50%;
  min-width: 50%;
}

.code {
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all;
  transition-duration: 500ms;
}

.requests {
  width: 50%;
  min-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all;
  transition-duration: 500ms;

  & div {
    display: flex;
    align-items: center;
    color: var(--vp-c-yellow-6);
    font-weight: 600;

    & div.method-box {
      min-width: 100px;

      & span.method {
        background: var(--vp-c-green-1);
        color: var(--vp-c-black);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.5px;
      }

      & span.post {
        background-color: var(--vp-c-indigo-1);
      }

      & span.delete {
        background-color: var(--vp-c-red-1);
      }

      & span.update {
        background-color: var(--vp-c-purple-1);
      }
    }
  }
}

.red {
  color: var(--vp-c-red-1);
}

.purple {
  color: var(--vp-c-indigo-1);
}

.gray {
  color: var(--vp-c-gray-1);
}

.indent-1 {
  padding-left: 20px;
}

.indent-2 {
  padding-left: 40px;
}

.indent-3 {
  padding-left: 60px;
}

.description {
  color: var(--vp-c-white);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;

  & p {
    margin: 20px 0px;

    &:first-child {
      margin-top: 0px;
    }

    &:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>
