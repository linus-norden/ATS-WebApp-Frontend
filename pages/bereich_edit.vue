<template>
  <div v-if="isDataFetched">
    <h1>Bereich bearbeiten</h1>
    <form @submit.prevent="updateBereich">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Aktiv seit</th>
            <th>Inaktiv seit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="bereich_name" v-model="aktuellerBereich.bereich_name" required></td>
            <td>
              <template v-if="aktuellerBereich.bereich_aktiv_seit">{{ formatDate(aktuellerBereich.bereich_aktiv_seit) }}</template>
              <template v-else><input type="date" id="bereich_aktiv_seit" v-model="aktuellerBereich.bereich_aktiv_seit"></template>
            </td>
            <td><template v-if="aktuellerBereich.bereich_inaktiv_seit">{{ formatDate(aktuellerBereich.bereich_inaktiv_seit) }}</template>
              <template v-else><input type="date" id="bereich_inaktiv_seit" v-model="aktuellerBereich.bereich_inaktiv_seit"></template>
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

const aktuellerBereich = ref({
  bereich_name: '',
  bereich_aktiv: false,
  bereich_aktiv_seit: null,
  bereich_inaktiv_seit: null
})
const isDataFetched = ref(false)


const formattedAktivSince = computed({
  get: () => aktuellerBereich.bereich_aktiv_seit ? aktuellerBereich.bereich_aktiv_seit.toISOString().substr(0, 10) : 'leer',
  set: (value) => aktuellerBereich.bereich_aktiv_seit = new Date(value)
})


const formattedInaktivSince = computed({
  get: () => aktuellerBereich.value.bereich_inaktiv_seit ? aktuellerBereich.value.bereich_inaktiv_seit.toISOString().substr(0, 10) : '',
  set: (value) => aktuellerBereich.value.bereich_inaktiv_seit = new Date(value)
})

function formatDate(dateString) {
        if (dateString) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        } else {
          return '-';
        }
}

async function fetchBereich() {
  
  const bereichId = route.query.id
  if (!bereichId) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/bereich/${bereichId}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log('fetched data: ', data)

    aktuellerBereich.value = { ...aktuellerBereich.value, ...data }
    isDataFetched.value = true 
  } catch (error) {
    console.error('Error fetching area:', error)
  }
  console.log('fetched error: none')
}

async function updateBereich() {
  const bereichId = route.query.id
  const router = useRouter() 
  if (aktuellerBereich.value.bereich_aktiv_seit) {
     aktuellerBereich.value.bereich_aktiv = 1
     console.log("aktiv datum gesetzt, setze aktiv flag")
  }
  if (aktuellerBereich.value.bereich_inaktiv_seit)  aktuellerBereich.value.bereich_aktiv = 0
   
  
  try {
    const response = await fetch(`http://localhost:3000/api/bereich/${bereichId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aktuellerBereich.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    showAlert("Bereich aktualisiert","Weiterleitung auf Bereicsübersicht")
    router.push('/bereich')
  } catch (error) {
    console.error('Error editing area:', error)
  }
}
onMounted(fetchBereich)
onMounted(() => {
  console.log('Now...')
})
</script>
