<template>
  <div>
    <NuxtLayout>
      <nav class="navbar">
        <ul class="nav-list">
          <li class="nav-item"><nuxt-link to="/" exact-active-class="active-link">Home</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/bereich" exact-active-class="active-link">Bereiche</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/raum" exact-active-class="active-link">Räume</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/hub" exact-active-class="active-link">Hubs</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/beacon" exact-active-class="active-link">Beacons</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/mp" exact-active-class="active-link">Medizinprodukte</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/mp_typ" exact-active-class="active-link">Medizinprodukt Typen</nuxt-link></li>
          <li class="nav-item"><nuxt-link to="/mp_mapping" exact-active-class="active-link">Medizinprodukt Mapping</nuxt-link></li>
      </ul>
    </nav>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

