<template>
  <div v-if="isDataFetched">
    <h1>MP Typ bearbeiten</h1>
    <form @submit.prevent="updateMpTyp">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Aktiv</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="aktuellerMpTyp.mp_typ_name" required></td>
            <td><input type="checkbox" v-model="aktuellerMpTyp.mp_typ_aktiv"></td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit">Änderungen speichern</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const aktuellerMpTyp = ref({
  mp_typ_name: '',
  mp_typ_aktiv: false,
})

const isDataFetched = ref(false)

async function fetchMpTyp() {
  const mpTypID = route.query.id
  if (!mpTypID) {
    console.error('Missing id parameter in the route')
    return
  }
  try {
    const response = await fetch(`http://localhost:3000/api/mp_typ/${mpTypID}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    aktuellerMpTyp.value = data
    isDataFetched.value = true // Mark data fetching as complete
  } catch (error) {
    console.error('Error fetching MP Typ:', error)
  }
}

async function updateMpTyp() {
  const mpTypID = route.query.id
  try {
    const response = await fetch(`http://localhost:3000/api/mp_typ/${mpTypID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(aktuellerMpTyp.value)
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    router.push('/mp_typ')
  } catch (error) {
    console.error('Error editing MP Typ:', error)
  }
}

onMounted(fetchMpTyp)
</script>
