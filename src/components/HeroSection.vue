<script setup>
import SearchForm from './SearchForm.vue'
</script>

<template>
  <section
    class="relative py-36 table w-full bg-gradient-to-b from-emerald-600/20 dark:from-emerald-600/40 via-emerald-600/10 dark:via-emerald-600/20 to-transparent"
  >
    <div class="container">
      <div class="grid md:grid-cols-2 grid-cols-1 items-center mt-10 gap-[30px]">
        <div class="md:order-1 order-2">
          <SearchForm />
        </div>

        <div class="md:order-2 order-1">
          <img
            src="https://jobstack-shreethemes.vercel.app/static/media/woman_working_2.26b4fe242bd386b51ed8fe80be6ff7bb.svg"
            alt="Job Search"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.form-input {
  border: 1px solid #e5e7eb;
}

.form-select {
  border: 1px solid #e5e7eb;
}

.btn {
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
</style>
