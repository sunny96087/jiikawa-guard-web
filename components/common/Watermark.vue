<template>
  <img
    src="~/assets/images/watermark.png"
    alt="浮水印_防止偷照片的小壞壞"
    class="watermark pic-auto"
  />
</template>

<style scoped>
.watermark {
  position: absolute;
  bottom: 0;
  right: 0;
  user-select: none; /* 防止被選中 */

  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>
