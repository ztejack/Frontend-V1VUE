<template>
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead class="bg-gray-50 dark:bg-gray-700">
      <tr class="border-b border-gray-500">
        <th
          v-for="column in columns"
          :key="column.key"
          scope="col"
          class="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
        >
          {{ column.label }}
        </th>
        <th
          v-if="$slots.actions"
          scope="col"
          class="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td
          v-for="col in columns"
          :key="col.key"
          class="px-6 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
        >
          <slot :name="`cell-${col.key}`" :item="item">
            {{ getNestedValue(item, col.key) }}
          </slot>
        </td>
        <td v-if="$slots.actions" class="px-6 py-2 whitespace-nowrap text-sm">
          <slot name="actions" :item="item" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  columns: Array,
  data: Array,
})

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : '-'), obj)
}
</script>
