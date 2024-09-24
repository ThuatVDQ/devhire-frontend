<template>
  <section
    class="h-screen flex items-center justify-center relative overflow-hidden bg-[url('../assets/bg.jpg')] bg-no-repeat bg-center bg-cover"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <div
          class="relative overflow-hidden bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md"
        >
          <div class="p-6">
            <a href="/login" class="flex items-center justify-center">
              <img src="../assets/logo.svg" alt="logo" class="w-8 h-8" />
              <h1 class="ml-2 text-2xl font-bold text-blue-600">DevHire</h1>
            </a>
            <h5 class="my-6 text-xl font-semibold">Sign up</h5>
            <form action="" class="text-left">
              <div class="grid grid-cols-1">
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="" class="font-semibold">Your name:</label>
                  <input type="text" class="form-input rounded-md" placeholder="Nguyen Van A" />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="" class="font-semibold">Phone number:</label>
                  <input type="text" class="form-input rounded-md" placeholder="0912345678" />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="" class="font-semibold">Email:</label>
                  <input
                    type="text"
                    class="form-input rounded-md"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="" class="font-semibold">Password:</label>
                  <input type="password" class="form-input rounded-md" placeholder="Password" />
                </div>
                <div class="mb-4 ltr:text-left rtl:text-right">
                  <label for="" class="font-semibold">Confirm password:</label>
                  <input
                    type="password"
                    class="form-input rounded-md"
                    placeholder="Confirm password"
                  />
                </div>
                <div class="mb-4">
                  <div class="inline-flex items-center mb-0">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
                    />
                    <label for="" class="form-checkbox-label text-slate-400"
                      >I Accept <a href="" class="text-emerald-600">Terms And Condition</a></label
                    >
                  </div>
                </div>
                <div class="mb-4">
                  <input
                    type="submit"
                    value="Register"
                    class="p-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md w-full"
                  />
                </div>
                <div class="text-center">
                  <span class="text-slate-400 me-2">Already have an account ?</span>
                  <a href="" class="text-black dark:text-white font-bold">Sign in</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
