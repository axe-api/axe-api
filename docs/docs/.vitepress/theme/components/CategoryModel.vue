<template>
  <div class="code">
    <div>
      <span class="red">import</span> { <span class="purple">Model</span> }
      <span class="red">from</span> <span class="purple">"axe-api"</span>;
    </div>
    <div>&nbsp;</div>
    <div>
      <span class="red">class</span> <span class="purple">Category</span>
      <span class="red"> extends</span>
      <span class="purple">Model</span> {
    </div>
    <div class="indent-1 gray">// a basic model...</div>
    <div>}</div>
    <div>&nbsp;</div>
    <div>
      <span class="red">export</span> <span class="red">default</span>
      <span class="purple"> Category</span>;
    </div>
  </div>
</template>

<style scoped lang="scss">
.code {
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
  background-color: goldenrod;
  width: 100%;
  /* display: flex;
  flex-direction: column;
  gap: 4px; */
}
</style>
