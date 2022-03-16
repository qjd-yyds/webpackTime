<template>
  <div class="app">
    <div class="progress"></div>
    <button @click="randomName">点击生成随机名字</button>
    <span>{{ nameText }}</span>
    <canvas ref="canvas" class="draw-canvas" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue';
import chinaName from 'chinese-random-name';
export default defineComponent({
  name: 'app',
  setup: () => {
    const canvas = ref<HTMLCanvasElement>(null!);
    let nameText = ref('');
    function randomName() {
      nameText.value = chinaName.names.get2('金木');
    }
    onMounted(() => {
      const ctx = canvas.value.getContext('2d')!;
      ctx.fillStyle = 'yellow';
      ctx.arc(200, 200, 50, 0, Math.PI * 2);
      ctx.fill();
    });
    return {
      canvas,
      randomName,
      nameText
    };
  },
  components: {}
});
</script>
<style lang="css">
.draw-canvas {
  background-color: #000;
}
.progress {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(#ffcdb2 0, #c16f42 27%, #b5838d 27%, #b5838d);
  mask: radial-gradient(transparent, transparent 50%, #000 50%, #000 0);
}
</style>
