<template>
  <!-- 1. CHART SKELETON (BAR / AREA) -->
  <div
    v-if="type === 'chart'"
    :style="{ height: `${height}px` }"
    class="w-full flex flex-col justify-end gap-3 p-4 bg-slate-50/60 rounded-xl animate-pulse"
  >
    <div class="flex-1 flex items-end justify-between gap-2.5 px-2 pb-2 border-b border-slate-200">
      <div
        v-for="(h, idx) in [40, 65, 30, 85, 55, 70, 45, 90, 60, 75, 50, 80]"
        :key="idx"
        class="flex-1 bg-slate-200 rounded-t transition-all"
        :style="{ height: `${h}%` }"
      />
    </div>
    <div class="flex items-center justify-between gap-2 px-2">
      <div v-for="i in 6" :key="i" class="h-2.5 w-10 bg-slate-200 rounded" />
    </div>
  </div>

  <!-- 2. DONUT SKELETON -->
  <div
    v-else-if="type === 'donut'"
    :style="{ height: `${height}px` }"
    class="w-full flex flex-col items-center justify-center gap-6 p-4 bg-slate-50/60 rounded-xl animate-pulse"
  >
    <div class="relative flex items-center justify-center">
      <div class="w-40 h-40 rounded-full border-12 border-slate-200 border-t-slate-300" />
      <div class="absolute flex flex-col items-center gap-1.5">
        <div class="h-3 w-12 bg-slate-200 rounded" />
        <div class="h-5 w-16 bg-slate-300 rounded" />
      </div>
    </div>
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <div v-for="i in 3" :key="i" class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <div class="h-3 w-16 bg-slate-200 rounded" />
      </div>
    </div>
  </div>

  <!-- 3. TABLE SKELETON -->
  <div v-else-if="type === 'table'" class="w-full divide-y divide-slate-100 animate-pulse">
    <div v-for="r in rows" :key="r" class="py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="h-3.5 bg-slate-200 rounded w-1/3" />
        <div class="h-3 bg-slate-100 rounded w-1/4" />
      </div>
      <div class="h-3 bg-slate-200 rounded w-16 shrink-0" />
      <div class="h-2 bg-slate-100 rounded w-24 shrink-0" />
    </div>
  </div>

  <!-- 4. LIST SKELETON -->
  <div v-else-if="type === 'list'" class="w-full divide-y divide-slate-100 animate-pulse">
    <div v-for="r in rows" :key="r" class="py-3 px-1 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0 flex-1">
        <div class="w-16 h-5 rounded bg-slate-200 shrink-0 mt-0.5" />
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="h-3.5 bg-slate-200 rounded w-3/4" />
          <div class="h-2.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div class="h-2.5 bg-slate-200 rounded w-12 shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'chart' | 'donut' | 'table' | 'list';
    height?: number;
    rows?: number;
  }>(),
  {
    type: 'chart',
    height: 320,
    rows: 4,
  }
);
</script>
