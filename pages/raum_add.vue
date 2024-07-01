<template>
  <div>
    <h1>Raum hinzufügen</h1>
      <form @submit.prevent="hinzufuegenRaum">
            <table class="table">
              <thead>
                <tr>
                  <th>Bereich</th>
                  <th>Name</th>
                  <th>Aktiv seit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select id="raum_bereich_id" v-model="neuerRaum.raum_bereich_id" required>
                      <option v-for="bereich in bereiche" :key="bereich.bereich_id" :value="bereich.bereich_id">{{ bereich.bereich_name }}</option>
                    </select>
                  </td>
                  <td><input type="text" id="raum_name" v-model="neuerRaum.raum_name" required></td>
                  <td><input type="date" id="raum_aktiv_seit" v-model="formattedActiveSince"></td>
                </tr>
              </tbody>
            </table>
            <br>
            <button type="submit">Raum hinzufügen</button>
      </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const neuerRaum = ref({
  raum_name: '',
  raum_aktiv: false,
  raum_aktiv_seit: null,
  raum_bereich_id: null,
})

const bereiche = ref([])

const formattedActiveSince = computed({
  get: () => neuerRaum.value.raum_aktiv_seit ? neuerRaum.value.raun_aktiv_seit.toISOString().substr(0, 10) : '',
  set: (value) => neuerRaum.value.raum_aktiv_seit = new Date(value)
})

async function fetchBereiche() {
  try {
    const response = await fetch('http://localhost:3000/api/bereich')
    if (!response.ok) {
      throw new Error('Failed to fetch areas')
    }
    bereiche.value = await response.json()
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

onMounted(fetchBereiche)

async function hinzufuegenRaum() {
  console.log('data zum post', neuerRaum.value)
  try {
    if (neuerRaum.value.raum_aktiv_seit) {
      neuerRaum.value.raum_aktiv = 1
     console.log("aktiv datum gesetzt, setze aktiv flag")
    }
    const response = await fetch('http://localhost:3000/api/raum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neuerRaum.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    router.push('/raum')
  } catch (error) {
    console.error('Error adding room:', error)
  }
}
</script>
