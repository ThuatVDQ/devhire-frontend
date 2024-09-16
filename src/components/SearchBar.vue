<template>
    <section>
        <div class="absolute inset-0 bg-emerald-900/90"></div>
        <div class="container">
            <div class="grid grid-cols-1 text-center mt-10">
                <h3 class="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Job Vacancies</h3>
            </div>
        </div>
        <div class="container z-1">
            <div class="d-flex" id="reserve-form">
                <div class="md:w-5/6 mx-auto">
                    <div class="lg:col-span-10">
                        <div class="bg-white dark:bg-slate-900 border-0 shadow rounded-md p-3">
                            <form action="#">
                                <div class="registration-form text-dark text-start">
                                    <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-0 gap-6">
                                        <div class="filter-search-form relative filter-border">
                                            <i class="pi pi-briefcase"></i>
                                            <input class="form-input filter-input-box bg-gray-50 dark:bg-slate-800 border-0" placeholder="Search your Keywords" type="text">
                                        </div>
                                        <div class="filter-search-form relative filter-border">
                                            <i class="pi pi-map-marker"></i>
                                            <div class="filter-input-box bg-gray-50 dark:bg-slate-800 border-0 css-b62m3t-container">
                                                <span id="react-select-8-live-region" class=" css-7pg0cj-a11yText"></span>
                                                <span></span>
                                                <div class=" css-13cymwt-control">
                                                    <div class=" css-hlgwow">
                                                        <div class=" css-1jqq78o-placeholder" id="react-select-12-placeholder">Select....</div>
                                                        <div class=" css-19bb58m" data-value>
                                                            <input class="" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-12-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="false" aria-haspopup="true" role="combobox" aria-describedby="react-select-12-placeholder" value="" style="color: inherit; background: 0px center; opacity: 0; width: 100%; grid-area: 1 / 2; font: inherit; min-width: 2px; border: 0px; margin: 0px; outline: 0px; padding: 0px;">
                                                        </div>
                                                    </div>
                                                    <div class=" css-1wy0on6">
                                                        <span class=" css-1u9des2-indicatorSeparator"></span>
                                                        <div class=" css-1xc3v61-indicatorContainer">
                                                            <i class="pi pi-angle-down"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="filter-search-form relative filter-border">
                                            <i class="pi pi-briefcase"></i>
                                        </div>
                                        <input type="submit" name="search" id="search" value="Search" class="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white searchbtn submit-btn w-100">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>