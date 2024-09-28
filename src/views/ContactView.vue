<template>
  <section class="relative lg:py-24 py-16">
    <div class="container">
      <div class="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
        <div class="lg:col-span-7 md:col-span-6">
          <img
            src="https://jobstack-shreethemes.vercel.app/static/media/contact.fa1dcec179ab187ef0877382779d71df.svg"
            alt=""
          />
        </div>
        <div class="lg:col-span-5 md:col-span-6">
          <div class="lg:ms-5">
            <div class="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
              <h3 class="mb-6 text-2xl leading-normal font-semibold">Get in touch !</h3>
              <form>
                <div class="grid lg:grid-cols-12 lg:gap-6">
                  <div class="lg:col-span-6 mb-5">
                    <label for="" class="font-semibold">Your Name: </label>
                    <input type="text" class="form-input mt-2" placeholder="Name: " />
                  </div>
                  <div class="lg:col-span-6 mb-5">
                    <label for="" class="font-semibold">Your Email: </label>
                    <input type="text" class="form-input mt-2" placeholder="Email: " />
                  </div>
                </div>
                <div class="grid grid-cols-1">
                  <div class="mb-5">
                    <label for="" class="font-semibold">Your Questions: </label>
                    <input type="text" class="form-input mt-2" placeholder="Subject: " />
                  </div>
                  <div class="mb-5">
                    <label for="" class="font-semibold">Your Comment: </label>
                    <textarea
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto resize-y min-h-[100px]"
                      placeholder="Message: "
                    ></textarea>
                  </div>
                </div>
                <button class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container lg:mt-24 mt-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-[30px]">
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-phone"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Phone</h5>
            <p class="text-slate-400 mt-3">
              The phrasal sequence of the is now so that many campaign and benefit
            </p>
            <div class="mt-5">
              <label
                for=""
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >+152 534-468-854</label
              >
            </div>
          </div>
        </div>
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-envelope"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Email</h5>
            <p class="text-slate-400 mt-3">
              The phrasal sequence of the is now so that many campaign and benefit
            </p>
            <div class="mt-5">
              <label
                for=""
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >contact@example.com</label
              >
            </div>
          </div>
        </div>
        <div class="text-center px-6">
          <div class="relative text-transparent">
            <div
              class="size-14 bg-emerald-600/5 text-emerald-600 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800"
            >
              <i class="pi pi-map-marker"></i>
            </div>
          </div>
          <div class="content mt-7">
            <h5 class="title h5 text-lg font-semibold">Location</h5>
            <p class="text-slate-400 mt-3">C/54 Northwest Freeway, Suite 558, Houston, USA 485</p>
            <div class="mt-5">
              <label
                for=""
                class="text-emerald-600 hover:text-emerald-600 after:bg-emerald-600 transition duration-500"
                >View on Google map</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
