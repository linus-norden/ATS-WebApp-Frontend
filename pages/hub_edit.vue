<template>
  <div v-if="isDataFetched">
    <h1>Hub bearbeiten</h1>
    <form @submit.prevent="update_hub">
      <table class="table">
        <thead>
          <tr>
            <th>MAC</th>
            <th>Aktiv seit</th>
            <th>Inaktiv seit</th>
            <th>Bereich</th>
            <th>Raum-Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="hub_MAC" v-model="aktueller_Hub.hub_MAC" required></td>
            <td>
              <template v-if="aktueller_Hub.hub_aktiv_seit">{{ formatDate(aktueller_Hub.hub_aktiv_seit) }}</template>
              <template v-else><input type="date" id="hub_aktiv_seit" v-model="aktueller_Hub.hub_aktiv_seit"></template>
            </td>
            <td>
              <template v-if="aktueller_Hub.hub_inaktiv_seit">xx{{ formatDate(aktueller_Hub.hub_inaktiv_seit) }}</template>
              <template v-else><input type="date" id="hub_inaktiv_seit" v-model="aktueller_Hub.hub_inaktiv_seit"></template>
            </td>
            <td>
              <select id="hub_bereich_id" v-model="aktueller_Hub.bereich_id" @change="fetch_raeume(aktueller_Hub.bereich_id)"> // @change="fetch_raeume"
                <option v-for="bereich in bereiche" :key="bereich.bereich_id" :value="bereich.bereich_id">{{ bereich.bereich_name }}</option>
              </select>
            </td>
            <td>
              <select id="hub_raum_id" v-model="aktueller_Hub.raum_id" >
                <option v-for="raum in raeume" :key="raum.raum_id" :value="raum.raum_id">{{ raum.raum_name }}</option>
              </select>
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

const aktueller_Hub = ref({
  hub_MAC: '',
  hub_aktiv: false,
  hub_aktiv_seit: null,
  hub_inaktiv_seit: null,
  bereich_id: null,
  raum_id: null
})

// Beim ersten Laden sollte das Befüllen des Bereiches KEIN Neuladen der Räume mit Löschen des aktuellen Raumes auslösen
// Daher hier einmal beim Einstieg merken, dass es der erste Aufruf ist.
var first_load = true

const isDataFetched = ref(false)
const bereiche = ref([]) // Bereiche ist erforderlich für die Bereichsauswahl
const raeume = ref([]) // Räume sind erforderlich für die Auswahl der Räume eines Bereiches

function formatDate(dateString) {
        if (dateString) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        } else {
          return '-';
        }
}

async function fetch_hub() {
  const hubID = route.query.id
  if (!hubID) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/hub/${hubID}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    aktueller_Hub.value = { ...aktueller_Hub.value, ...data }
    isDataFetched.value = true 
  } catch (error) {
    console.error('Error fetching area:', error)
  }
  console.log('Hub geholt. Aktuelle BereichsID ist ', aktueller_Hub.value.bereich_id)
  if (aktueller_Hub.value.bereich_id > 0)  
      fetch_raeume(aktueller_Hub.value.bereich_id)

}


// Holen aller Bereiche aus der Datenbank
// 'zuruecksetzen' wird benutzt, um zwischem erstem Laden und Änderung im Formular zu unterscheiden
async function fetch_bereiche() {
  try {
    const response = await fetch('http://localhost:3000/api/bereich')
    if (!response.ok) {
      throw new Error('Failed to fetch areas')
    }
    bereiche.value = await response.json()
    console.log('Bereiche geholt. Bereiche: ', bereiche.value, "Aktuelle BereichsID ist ", aktueller_Hub.value.bereich_id)
   
    
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

// Holen aller Räume eines Bereiches aus der Datenbank
async function fetch_raeume(bereich) {
  // first_load
  console.log('Räume holen für den Bereich mit der ID :', bereich, " und first_load = ", first_load)
  try {
    // Holen der Räume des selektierten Bereiches! Also nur genau dieser Räume
    // `` zur Interpretation der Variablen ...
    const response = await fetch(`http://localhost:3000/api/raum_bereich/${bereich}`)
    if (!response.ok) {
      throw new Error('Fehler beim Lesen der Räume')
    }
    raeume.value = await response.json()
    console.log('Räume des Bereiches mit der ID :', bereich, " geladen mit ", raeume.value ," Räumen")
  } catch (error) {
    console.error('Error Fehler beim Holen der Räume:', error)
  }
  // Wenn ein neuer Bereich gewählt wurde, muss das Feld im Formular geleert werden
  if (first_load == true) {
    console.log('Erstes Laden: Nichts weiter tun, Dropdown wurde befüllt.')
    // Nur oben die Auswahl des Dropdowns im Formular befüllen. Wert aus dieser Liste muss bereits über den Hub gekommen sein
    // Nächster Durchgang muss dann ein Bereichswechsel sein
    //first_load = false
  } else aktueller_Hub.raum_id = null // Bereichswechsel
}



async function update_hub() {
  const hubID = route.query.id
  const router = useRouter()
  try {
    const response = await fetch(`http://localhost:3000/api/hub/${hubID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aktueller_Hub.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    // Weiterleiten zu "hub" Seite
    showAlert("Hub  aktualisiert")
    router.push('/hub')
  } catch (error) {
    console.error('Error editing hub:', error)
  }
}

// 1. Der Datensatz für den zu ändernden Hub wird aus der Datenbank geladen 
onMounted(fetch_hub)
// 2. Für die Auswahl des Bereiches, dem der Hub zugewiesen werden kann, werden die Bereiche geladen
// Auch die inaktiven, falls der Hub einem solchen vielleicht zugewiesen ist.
// false wird gesetzt, damit die Raum-ID nicht auf Null gesetzt wird (wie bei einem Bereichswechsel)
onMounted(fetch_bereiche)

// 3. Holen der Räume des Bereiches dieses Hubs
//onMounted(fetch_raeume(aktueller_Hub.bereich_id))

// Workaround für das Checkbox Timing. Ohne wird das Aktiv-Flag nicht richtig gesetzt!
onMounted(() => {
  console.log('Initial value :', aktueller_Hub.value.hub_aktiv)
})
</script>
