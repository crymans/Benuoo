<template>
  <div class="form-field">
    <slot v-bind="{ componentField: field }" />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

interface Props {
  name: string
}

const props = defineProps<Props>()

const field = useField(props.name)
</script>