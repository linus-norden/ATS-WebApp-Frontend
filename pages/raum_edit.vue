<template>
  <div v-if="isDataFetched">
    <h1>Raum bearbeiten</h1>
    <form @submit.prevent="updateRaum">
      <table class="table">
        <thead>
          <tr>
            <th>Bereich</th>
            <th>Raum-Name</th>
            <th>Aktiv seit</th>
            <th>Inaktiv seit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select id="raum_bereich_id" v-model="aktuellerRaum.raum_bereich_id" required>
                <option v-for="bereich in bereiche" :key="bereich.bereich_id" :value="bereich.bereich_id">{{ bereich.bereich_name }}</option>
              </select>
            </td>
            <td><input type="text" id="bereich_name" v-model="aktuellerRaum.raum_name" required></td>
            <td>
              <template v-if="aktuellerRaum.raum_aktiv_seit">{{ formatDate(aktuellerRaum.raum_aktiv_seit) }}</template>
              <template v-else><input type="date" id="raum_aktiv_seit" v-model="aktuellerRaum.raum_aktiv_seit"></template>
            </td>
            <td>
              <template v-if="aktuellerRaum.raum_inaktiv_seit">xx{{ formatDate(aktuellerRaum.raum_inaktiv_seit) }}</template>
              <template v-else><input type="date" id="raum_inaktiv_seit" v-model="aktuellerRaum.raum_inaktiv_seit"></template>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit">Änderungen speichern</button>
    </form>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router'
import showAlert from '/plugins/vue-notifications.js'
const route = useRoute()

const aktuellerRaum = ref({
  raum_name: '',
  raum_aktiv: false,
  raum_aktiv_seit: null,
  raum_inaktiv_seit: null,
  raum_bereich_id: null,
})

const isDataFetched = ref(false)
const bereiche = ref([])
function formatDate(dateString) {
        if (dateString) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        } else {
          return '-';
        }
}

async function fetchRaum() {
  
  const raumID = route.query.id
  if (!raumID) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/raum/${raumID}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    aktuellerRaum.value = { ...aktuellerRaum.value, ...data }
    isDataFetched.value = true // Mark data fetching as complete
  } catch (error) {
    console.error('Error fetching area:', error)
  }
}


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


async function updateRaum() {
  const raumID = route.query.id
  const router = useRouter() 
  try {
    const response = await fetch(`http://localhost:3000/api/raum/${raumID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aktuellerRaum.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    showAlert("Raum  aktualisiert")
    router.push('/raum')
  } catch (error) {
    console.error('Error editing Raum:', error)
  }
}
onMounted(fetchRaum)
onMounted(fetchBereiche)
// workaround für checkbox timing
onMounted(() => {
  console.log('Initial value :', aktuellerRaum.value.raum_aktiv)
})
</script>
