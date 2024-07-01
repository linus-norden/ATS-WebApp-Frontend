<template>
  <div v-if="isDataFetched">
    <h1>Beacon bearbeiten</h1>
    <form @submit.prevent="update_beacon">
      <table class="table">
        <thead>
          <tr>
            <th>MAC</th>
            <th>Datum der Aktivsetzung</th>
            <th>Datum der Abschaltung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="beacon_MAC" v-model="aktueller_beacon.beacon_MAC" required></td>
            <td>
              <template v-if="aktueller_beacon.beacon_aktiv_seit">{{ formatDate(aktueller_beacon.beacon_aktiv_seit) }}</template>
              <template v-else><input type="date" id="beacon_aktiv_seit" v-model="aktueller_beacon.beacon_aktiv_seit"></template>
            </td>
            <td>
              <template v-if="aktueller_beacon.beacon_inaktiv_seit">{{ formatDate(aktueller_beacon.beacon_inaktiv_seit) }}</template>
              <template v-else><input type="date" id="beacon_inaktiv_seit" v-model="aktueller_beacon.beacon_inaktiv_seit"></template>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const aktueller_beacon = ref({
  beacon_MAC: '',
  beacon_aktiv: false,
  beacon_aktiv_seit: null,
  beacon_hub_id: null,
  beacon_RSSI: 0,
  beacon_batt: 0,
  beacon_inaktiv_seit: null
})

const isDataFetched = ref(false)

function formatDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(date);
  } else {
    return '-';
  }
}

async function fetch_beacon() {
  const beaconID = route.query.id
  if (!beaconID) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/beacon/${beaconID}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    aktueller_beacon.value = { ...aktueller_beacon.value, ...data }
    isDataFetched.value = true
  } catch (error) {
    console.error('Error fetching beacon:', error)
  }
}

async function update_beacon() {
  const beaconID = route.query.id
  try {
    const response = await fetch(`http://localhost:3000/api/beacon/${beaconID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aktueller_beacon.value)
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    router.push('/beacon')
  } catch (error) {
    console.error('Error updating beacon:', error)
  }
}

onMounted(fetch_beacon)
</script>