<style lang="scss">
a {
  text-decoration: none;
  color: #9747ff;
}
.bdr-1 {
  border-right: 1px solid #fff8;
}
</style>

<template>
  <div class="mt-4 ta-c lh-1">
    <a
      :href="it.link"
      target="_blank"
      class="mr-3 d-ib fz-13"
      :class="{
        'pr-3 bdr-1': i < links.length - 1,
      }"
      v-for="(it, i) in links"
      :key="i"
    >
      {{ it.text }}
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          text: "Source code",
          link: "https://github.com/Recommended-Templates/chatgpt-tpl",
        },
        {
          text: "Deploy with 4EVERLAND",
          link: "https://www.4everland.org",
        },
        {
          text: "Based on OpenAI",
          link: "https://openai.com/",
        },
      ],
    };
  },
};
</script>