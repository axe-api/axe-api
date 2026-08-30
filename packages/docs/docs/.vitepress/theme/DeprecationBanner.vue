<template>
  <div class="deprecation-banner">
    ⚠️ <strong>This package is deprecated.</strong>
    v2 is the final release. No future versions will be published.
  </div>
</template>

<style scoped>
.deprecation-banner {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: #a32d2d;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fcebeb;
  font-size: 14px;
  z-index: 1000;
}

.deprecation-banner i {
  font-size: 16px;
  color: #f7c1c1;
  flex-shrink: 0;
}
</style>
