<template>
  <div class="big-box">
    <div class="container">
      <div class="code">
        <div>
          <span class="red">import</span> { <span class="purple">Model</span> }
          <span class="red">from</span> <span class="purple">"axe-api"</span>;
        </div>
        <div>&nbsp;</div>
        <div>
          <span class="red">class</span> <span class="purple">Category</span>
          <span class="red"> extends</span> <span class="purple">Model</span> {
        </div>
        <div class="indent-1 gray">// a basic model...</div>
        <div>}</div>
        <div>&nbsp;</div>
        <div>
          <span class="red">export</span> <span class="red">default</span>
          <span class="purple"> Category</span>;
        </div>
      </div>
      <div class="description">
        <p>
          It reads models files and creates API endpoints by well-known CRUD
          endpoints.
        </p>
        <p>No need import or route definition!</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* var(--vp-c-white);
var(--vp-c-indigo-1);
var(--vp-c-indigo-3);
var(--vp-c-gray-3);
var(--vp-c-gray-3);
var(--vp-c-bg-elv);
var(--vp-c-neutral);
var(--vp-c-red-1);
var(--vp-c-brand);
var(--vp-c-white); */

.big-box {
  display: flex;
  justify-content: center;
  padding: 100px 0px;
}

.container {
  display: flex;
  max-width: 800px;
}

.code {
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all;
  transition-duration: 500ms;
  width: 50%;
  min-width: 50%;

  &:hover {
    transform: scale(1.05);
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
  font-size: 18px;
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
