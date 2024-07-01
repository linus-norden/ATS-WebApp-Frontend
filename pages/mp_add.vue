<template>
  <div>
    <h1>MP hinzufügen</h1>
    <form @submit.prevent="hinzufuegenMP">
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
            <td><input type="text" id="mp_name" v-model="neues_MP.mp_name" required></td>
            <td><input type="text" id="mp_SN" v-model="neues_MP.mp_SN" required></td>
            <td><input type="date" id="mp_aktiv_seit" v-model="formattedActiveSince"></td>
            <td>
              <select v-model="neues_MP.mp_mp_typ_id" required>
                <option v-for="typ in mpTypen" :key="typ.mp_typ_id" :value="typ.mp_typ_id">
                  {{ typ.mp_typ_name }}
                </option>
              </select>
            </td>
            <td>
              <input type="number" id="mp_beacon_id" v-model="neues_MP.mp_beacon_id" @blur="validateBeaconID">
              <span v-if="!isBeaconValid" class="error">Ungültige Beacon ID</span>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit" :disabled="!isBeaconValid">MP hinzufügen</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const neues_MP = ref({
  mp_name: '',
  mp_SN: '',
  mp_aktiv_seit: null,
  mp_inaktiv_seit: null,
  mp_mp_typ_id: '',
  mp_beacon_id: null,
  mp_aktiv: true
})

const mpTypen = ref([])
const beacons = ref([]) 
const errorMessage = ref('')
const isBeaconValid = ref(true) 

const formattedActiveSince = computed({
  get: () => neues_MP.value.mp_aktiv_seit ? neues_MP.value.mp_aktiv_seit.toISOString().substr(0, 10) : '',
  set: (value) => neues_MP.value.mp_aktiv_seit = new Date(value)
})

async function fetchMpTypen() {
  try {
    const response = await fetch('http://localhost:3000/api/mp_typ')
    const data = await response.json()
    mpTypen.value = data
  } catch (error) {
    console.error('Error fetching MP Typen:', error)
  }
}

async function fetch_beacons() {
  try {
    const response = await fetch('http://localhost:3000/api/beacon')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    beacons.value = data.map(beacon => beacon.beacon_id)
  } catch (error) {
    console.error('Error fetching beacons:', error)
  }
}

function validateBeaconID() {
  if (neues_MP.value.mp_beacon_id && !beacons.value.includes(neues_MP.value.mp_beacon_id)) {
    isBeaconValid.value = false
  } else {
    isBeaconValid.value = true
  }
}

async function hinzufuegenMP() {
  try {
    // Überprüfen, ob die Beacon-ID vorhanden ist
    if (neues_MP.value.mp_beacon_id) {
      const beaconResponse = await fetch(`http://localhost:3000/api/beacon/${neues_MP.value.mp_beacon_id}`)
      if (!beaconResponse.ok) {
        throw new Error('Beacon ID exists check failed')
      }
    }

    const response = await fetch('http://localhost:3000/api/mp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neues_MP.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    router.push('/mp')
  } catch (error) {
    console.error('Error adding MP:', error)
    errorMessage.value = 'Fehler beim Hinzufügen des MPs. Bitte überprüfen Sie die Eingaben.'
  }
}

onMounted(() => {
  fetchMpTypen()
  fetch_beacons()
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
