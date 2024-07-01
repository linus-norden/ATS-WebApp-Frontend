<template>
    <div>
      <h1>Hub hinzufügen</h1>
        <form @submit.prevent="hinzufuegen_Hub">
              <table class="table">
                <thead>
                    <tr>
            <th>MAC</th>
            <th>Aktiv seit</th>
            <th>Bereich</th>
            <th>Raum-Name</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" id="hub_MAC" v-model="neuer_Hub.hub_MAC" required></td>
                        
                        <td><input type="date" id="hub_aktiv_seit" v-model="formattedActiveSince"></td>
                        
                        <td>
                            <select id="hub_bereich_id" v-model="neuer_Hub.bereich_id" @change="fetch_raeume(neuer_Hub.bereich_id)">
                                <option v-for="bereich in bereiche" :key="bereich.bereich_id" :value="bereich.bereich_id">{{ bereich.bereich_name }}</option>
                            </select>
                        </td>
                        <td>
                            <select id="hub_raum_id" v-model="neuer_Hub.raum_id" >
                                <option v-for="raum in raeume" :key="raum.raum_id" :value="raum.raum_id">{{ raum.raum_name }}</option>
                            </select>
                    </td>
                </tr>
                </tbody>
              </table>
              <br>
              <button type="submit">Hub hinzufügen</button>
        </form>
      </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const neuer_Hub = ref({
    hub_MAC: '',
    hub_aktiv: false,
    hub_aktiv_seit: null,
    hub_bereich_id: null,
    hub_raum_id: null
  })
  
  const bereiche = ref([])
  const raeume = ref([])
  
  const formattedActiveSince = computed({
    get: () => neuer_Hub.value.hub_aktiv_seit ? neuer_Hub.value.hub_aktiv_seit.toISOString().substr(0, 10) : '',
    set: (value) => neuer_Hub.value.hub_aktiv_seit = new Date(value)
  })
  
// Holen aller Bereiche aus der Datenbank
// 'zuruecksetzen' wird benutzt, um zwischem erstem Laden und Änderung im Formular zu unterscheiden
async function fetch_bereiche() {
  try {
    const response = await fetch('http://localhost:3000/api/bereich')
    if (!response.ok) {
      throw new Error('Failed to fetch areas')
    }
    bereiche.value = await response.json()
    console.log('Bereiche geholt. Bereiche: ', bereiche.value, "Aktuelle BereichsID ist ", neuer_Hub.value.bereich_id)
   
    
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

// Holen aller Räume eines Bereiches aus der Datenbank
async function fetch_raeume(bereich) {
    try {
        // Holen der Räume des selektierten Bereiches! Also nur genau dieser Räume
        // `` zur Interpretation der Variablen ...
        const response = await fetch(`http://localhost:3000/api/raum_bereich/${bereich}`)
        if (!response.ok) {
        throw new Error('Fehler beim Lesen der Räume')
        }
        raeume.value = await response.json()
    } catch (error) {
        console.error('Error Fehler beim Holen der Räume:', error)
    }
    console.log('Räume geholt: ', raeume.value)
    // Wenn ein neuer Bereich gewählt wurde, muss das Feld im Formular geleert werden
    neuer_Hub.raum_id = null // Bereichswechsel
}

// Holen der Bereiche beim Laden
onMounted(fetch_bereiche)
  
async function hinzufuegen_Hub() {
    try {
      if (neuer_Hub.value.hub_aktiv_seit) {
        neuer_Hub.value.hub_aktiv = 1
       console.log("aktiv datum gesetzt, setze aktiv flag")
      }
      const response = await fetch('http://localhost:3000/api/hub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(neuer_Hub.value)
      })
      console.log('Response', response)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // zu "hub" weiterleiten
      router.push('/hub')
    } catch (error) {
      console.error('Error adding room:', error)
    }
  }
  </script>