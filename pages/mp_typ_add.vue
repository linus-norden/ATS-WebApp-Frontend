<template>
  <div>
    <h1>MP Typ hinzufügen</h1>
    <form @submit.prevent="addMpTyp">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Aktiv</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="newMpTyp.mp_typ_name" required></td>
            <td><input type="checkbox" v-model="newMpTyp.mp_typ_aktiv"></td>
          </tr>
        </tbody>
      </table>
      <br>
      <button type="submit">MP Typ hinzufügen</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const newMpTyp = ref({
      mp_typ_name: '',
      mp_typ_aktiv: false,
    })

    const addMpTyp = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/mp_typ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMpTyp.value)
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        router.push('/mp_typ')
      } catch (error) {
        console.error('Error adding MP Typ:', error)
      }
    }

    return { newMpTyp, addMpTyp }
  }
}
</script>
