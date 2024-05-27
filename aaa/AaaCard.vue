<template>
  <div class='a-card' :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
    <div class='a-card__header' v-if='$slots.header || header'>
      <slot name='header'>{{ header }}</slot>
    </div>
    <div class='a-card__body' :style='bodyStyle'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AaaCard',
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String
    }
  }
}
</script>
