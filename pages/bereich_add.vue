<template>
  <div>
    <h1>Bereich hinzufügen</h1>
    <form @submit.prevent="hinzufuegenBereich">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Aktiv seit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="bereich_name" v-model="neuerBereich.bereich_name" required></td>
            <td><input type="date" id="bereich_aktiv_seit" v-model="formattedActiveSince"></td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit">Bereich hinzufügen</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const neuerBereich = ref({
  bereich_name: '',
  bereich_aktiv: false,
  bereich_aktiv_seit: null
})

const formattedActiveSince = computed({
  get: () => neuerBereich.value.bereich_aktiv_seit ? neuerBereich.value.bereich_aktiv_seit.toISOString().substr(0, 10) : '',
  set: (value) => neuerBereich.value.bereich_aktiv_seit = new Date(value)
})


async function hinzufuegenBereich() {
  try {
    if (neuerBereich.value.bereich_aktiv_seit) {
      neuerBereich.value.bereich_aktiv = 1
     console.log("aktiv datum gesetzt, setze aktiv flag")
    }
    const response = await fetch('http://localhost:3000/api/bereich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neuerBereich.value)
    })
    console.log('Response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    router.push('/bereich')
  } catch (error) {
    console.error('Error adding area:', error)

  }
}
</script>
