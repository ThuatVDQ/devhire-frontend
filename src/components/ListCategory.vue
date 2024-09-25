<script setup>
import CardCategory from './CardCategory.vue'
defineProps({
  category: Object
})
</script>

<template>
  <div
    class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]"
  >
    <!-- <CardCategory v-for="category in category" :key="category.id" :category="category" slots="90" /> -->
    <CardCategory category="Human Resource" slots="90" id="1" />
    <CardCategory category="It & Networking" slots="90" id="2" />
    <CardCategory category="Sales & Marketing" slots="90" id="3" />
    <CardCategory category="Accounting" slots="90" id="4" />
    <CardCategory category="Delivery Boy" slots="90" id="5" />
    <CardCategory category="Data Science" slots="90" id="6" />
    <CardCategory category="Project Manager" slots="90" id="7" />
    <CardCategory category="Engineering" slots="90" id="8" />
    <CardCategory category="Help Center" slots="90" id="9" />
    <CardCategory category="Full Stack Developer" slots="90" id="10" />
  </div>
</template>
