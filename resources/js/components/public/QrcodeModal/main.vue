<template>
  <Transition name="qrcode-modal">
    <div v-if="show" class="qrcode-modal" @click="hide">
      <div class="qrcode-modal-box">
        <div class="qrcode-modal-content">
          <p class="title">{{ title }}</p>
          <p class="content">{{ content }}</p>
          <img :src="img" :alt="title" class="qrcode" />
          <p class="qrcode-tip">微信扫一扫获取更多资讯</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import mixins from "~/js/utils/Mixins";

export default {
  props: ["title", "content", "img"],
  mixins: [mixins],
  data() {
    return {
      show: false,
      cb: null,
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    hide(cb) {
      this.show = false;
      this.$nextTick(() => {
        this.$destroy();
      });
    },
  },
  mounted() {
    this.open();
  },
};
</script>

<style lang="stylus">
@import '~@/css/vars.styl';

.qrcode-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: $zIndexModal;
  background: $modalBgColor;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  .qrcode-modal-box {
    width: 420px;
    height: 368px;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;

    .qrcode-modal-content {
      overflow: hidden;
      text-align: center;

      .title {
        font-size: 18px;
        color: $fontColor;
        margin: 50px auto 10px;
        font-weight: $fontBold;
      }

      .content {
        font-size: 14px;
        color: rgba(38, 38, 38, 0.6);
        line-height: 20px;
        margin: 0 auto 16px;
      }

      .qrcode {
        display: block;
        width: 160px;
        height: 160px;
        margin: 0 auto;
      }

      .qrcode-tip {
        font-size: 14px;
        height: 20px;
        line-height: 21px;
        color: #a7a7a7;
        margin: 16px 0 0;
      }
    }
  }
}

.qrcode-modal-enter-from, .qrcode-modal-leave-to {
  opacity: 0;

  .qrcode-modal-box {
    transform: scale(1.1);
  }
}
</style>
