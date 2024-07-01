<template>
  <div v-if="isDataFetched">
    <h1>MP bearbeiten</h1>
    <form @submit.prevent="update_mp">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Seriennummer</th>
            <th>Aktiv seit</th>
            <th>Typ</th>
            <th>Beacon ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="mp_name" v-model="aktuelles_MP.mp_name" required></td>
            <td><input type="text" id="mp_SN" v-model="aktuelles_MP.mp_SN" required></td>
            <td>
              <template v-if="aktuelles_MP.mp_aktiv_seit">{{ formatDate(aktuelles_MP.mp_aktiv_seit) }}</template>
              <template v-else><input type="date" id="mp_aktiv_seit" v-model="aktuelles_MP.mp_aktiv_seit"></template>
            </td>
            <td>
              <select v-model="aktuelles_MP.mp_mp_typ_id" required>
                <option v-for="typ in mpTypen" :value="typ.mp_typ_id" :key="typ.mp_typ_id">{{ typ.mp_typ_name }}</option>
              </select>
            </td>
            <td>
              <input type="number" id="mp_beacon_id" v-model="aktuelles_MP.mp_beacon_id" @blur="validateBeaconID">
              <span v-if="!isBeaconValid" class="error">Ungültige oder bereits verwendete Beacon ID</span>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit" :disabled="!isBeaconValid">Änderungen speichern</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const aktuelles_MP = ref({
  mp_name: '',
  mp_SN: '',
  mp_aktiv_seit: null,
  mp_inaktiv_seit: null,
  mp_mp_typ_id: '',
  mp_beacon_id: null,
  mp_aktiv: true
})
const aktuelles_MP_tmp = ref({
  mp_beacon_id: null
})

const mpTypen = ref([]) // Array  MP typen
const beacons = ref([]) // Array valide Beacon IDs
const beacons_mp = ref([]) // Array mit allen zu MP zugeordneten Baecon IDs
const isDataFetched = ref(false)
const isBeaconValid = ref(true) // beacon ID valide?

function formatDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(date);
  } else {
    return '';
  }
}

async function fetch_mp() {
  const mpID = route.query.id
  if (!mpID) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/mp/${mpID}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    aktuelles_MP.value = data
    aktuelles_MP_tmp.value.mp_beacon_id = aktuelles_MP.value.mp_beacon_id // tmp Wert um IF Abfrage nach Beacons zu vereinfachen


    isDataFetched.value = true 
  } catch (error) {
    console.error('Error fetching MP:', error)
  }
}

const fetch_mp_typen = () => {

    fetch(`http://localhost:3000/api/mp_typ`)
      .then(response => response.json())
      .then(data => {
        mpTypen.value = data
        })
        .catch(error => {
          console.error('Error fetching mapping:', error);
        });
    
};

async function fetch_beacons() {
  try {
    const response = await fetch(`http://localhost:3000/api/beacons`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    beacons.value = data.map(beacon => beacon.beacon_id)
  } catch (error) {
    console.error('Error fetching beacons:', error)
  }
}

async function fetch_beacons_mp() {
  try {
    const response = await fetch(`http://localhost:3000/api/beacon_mp`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    beacons_mp.value = data.map(beacon_mp => beacon_mp.beacon_id)
  } catch (error) {
    console.error('Error fetching beacons:', error)
  }
}

function validateBeaconID() {
  if (aktuelles_MP.value.mp_beacon_id && !beacons.value.includes(aktuelles_MP.value.mp_beacon_id)) {
    isBeaconValid.value = false
  } else if (beacons_mp.value.includes(aktuelles_MP.value.mp_beacon_id) && aktuelles_MP.value.mp_beacon_id != aktuelles_MP_tmp.value.mp_beacon_id) {
    isBeaconValid.value = false
  } else {
    isBeaconValid.value = true
  }
}

async function update_mp() {
  const mpID = route.query.id
  try {
    const response = await fetch(`http://localhost:3000/api/mp/${mpID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(aktuelles_MP.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    router.push('/mp')
  } catch (error) {
    console.error('Error editing MP:', error)
  }
}

onMounted(() => {
  fetch_mp()
  fetch_mp_typen()
  fetch_beacons()
  fetch_beacons_mp()
})
</script>

<style scoped>
.error {
  color: red;
}
.error-message {
  color: red;
  margin-top: 20px;
}

</style>