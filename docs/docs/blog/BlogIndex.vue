<script setup lang="ts">
const posts = [
  {
    time: "21 April, 2024",
    title: "Axe API v1.4 is out!",
    url: "/blog/2024-04-21-axe-api-v1-4-is-out",
  },
  {
    time: "08 April, 2024",
    title: "Axe API v1.3 is out!",
    url: "/blog/2024-04-08-axe-api-v1-3-is-out",
  },
  {
    time: "16 March, 2024",
    title: "Axe API v1.2 is out!",
    url: "/blog/2024-03-16-axe-api-v1-2-is-out",
  },
  {
    time: "18 February, 2024",
    title: "Axe API v1.1 is out!",
    url: "/blog/2024-02-18-axe-api-v1-is-out",
  },
  {
    time: "24 December, 2023",
    title: "Axe API v1.0 is out!",
    url: "/blog/2023-12-24-axe-api-v1-is-out",
  },
  {
    time: "21 September, 2021",
    title: "How to create an Axe API from scratch?",
    url: "/blog/2021-09-21-how-to-create-an-axe-api-from-scratch",
  },
  {
    time: "27 July, 2021",
    title: "A new approach to create APIs",
    url: "/blog/2021-07-27-a-new-approach-to-create-apis",
  },
];
</script>

<template>
  <ul class="blog-list">
    <li class="blog-entry" v-for="post of posts" :key="post.time">
      <article>
        <time>{{ post.time }}</time>
        <h2 class="title">
          <a :href="post.url">{{ post.title }}</a>
        </h2>
      </article>
    </li>
  </ul>
</template>

<style scoped>
.blog-list {
  list-style-type: none;
  padding: 0;
}
.blog-entry {
  margin-top: 3em;
  border-bottom: 1px solid var(--vp-c-divider);
}
.blog-entry time {
  font-size: 14px;
}
.title {
  border: none;
  margin-top: 0;
  padding-top: 0;
  font-size: 22px;
}
.title a {
  font-weight: 600;
  text-decoration: none;
}
</style>
