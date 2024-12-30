export default {
  methods: {
    $destroy() {
      this.$el.parentNode.remove();
    },
  },
};
