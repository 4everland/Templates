<style lang="scss">
.page-config {
  .set-item {
    border: 1px solid #eee;
    padding: 15px;
    h3 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    input {
      outline: none;
      border: 1px solid #999;
      padding: 8px;
      border-radius: 6px;
    }
  }
}
</style>

<template>
  <div class="page-config">
    <div class="header-1 al-c">
      <div>
        <h2 class="fz-16">Config</h2>
        <!-- <p class="fz-12 gray">Chat Settings</p> -->
      </div>
    </div>

    <div class="pa-5">
      <div class="set-item">
        <h3>API Key</h3>
        <div class="al-c">
          <input
            class="flex-1"
            type="text"
            placeholder="OpenAI API Key"
            v-model.trim="newKey"
          />
          <div
            class="btn-2 ml-3 pa-2"
            :class="
              !!newKey && newKey != apiKey ? 'color-1 hover-1' : 'gray ev-n'
            "
            @click="onSaveApiKey"
          >
            {{ newKey && newKey == apiKey ? "Saved" : "Save" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      apiKey: (s) => s.apiKey,
    }),
  },
  data() {
    return {
      newKey: this.apiKey,
    };
  },
  mounted() {
    this.newKey = this.apiKey;
  },
  methods: {
    onSaveApiKey() {
      if (!/^sk-\w{48}$/.test(this.newKey)) {
        window.alert("malformed API Key");
        return;
      }
      this.$setStore({
        apiKey: this.newKey,
      });
    },
  },
};
</script>