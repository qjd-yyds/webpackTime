<template>
  <div class="app">
    <Tab />
    <canvas ref="canvas" class="draw-canvas" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue';
import Tab from './Tab';
export default defineComponent({
  name: 'app',
  setup: () => {
    const canvas = ref<HTMLCanvasElement>(null);
    onMounted(() => {
      const ctx = canvas.value.getContext('2d');
      ctx.fillStyle = 'yellow';
      ctx.arc(200, 200, 50, 0, Math.PI * 2);
      ctx.fill();
    });
    return {
      canvas
    };
  },
  components: {
    Tab
  }
});
</script>
<style lang="css">
.draw-canvas {
  background-color: #000;
}
</style>
