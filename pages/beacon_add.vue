<template>
  <div>
    <h1>Beacon hinzufügen</h1>
    <form @submit.prevent="hinzufuegen_beacon">
      <table class="table">
        <thead>
          <tr>
            <th>MAC</th>
            <th>Aktiv seit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="beacon_MAC" v-model="neuer_beacon.beacon_MAC" required></td>
            <td><input type="date" id="beacon_aktiv_seit" v-model="formattedActiveSince"></td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit">Beacon hinzufügen</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const neuer_beacon = ref({
  beacon_MAC: '',
  beacon_aktiv: false,
  beacon_aktiv_seit: null
})

const formattedActiveSince = computed({
  get: () => neuer_beacon.value.beacon_aktiv_seit ? neuer_beacon.value.beacon_aktiv_seit.toISOString().substr(0, 10) : '',
  set: (value) => neuer_beacon.value.beacon_aktiv_seit = new Date(value)
})

async function hinzufuegen_beacon() {
  try {
    if (neuer_beacon.value.beacon_aktiv_seit) {
      neuer_beacon.value.beacon_aktiv = 1
      console.log("Aktiv-Datum gesetzt, aktives Flag gesetzt")
    }
    const response = await fetch('http://localhost:3000/api/beacon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neuer_beacon.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    router.push('/beacon')
  } catch (error) {
    console.error('Error adding beacon:', error)

  }
}
</script>
