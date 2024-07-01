<template>
  <div>
    <h1>Mapping bearbeiten</h1>
    <form @submit.prevent="update_mapping">
      <label for="mp_typ_1">MP Typ 1:</label>
      <select v-model="aktueller_mp_typ1" required>
        <option v-for="typ in mpTypen" :key="typ.mp_typ_id_1" :value="typ.mp_typ_id_1">{{ typ.mp_typ_name_1 }}</option>
      </select>
      <br>
      <label for="mp_typ_2">MP Typ 2:</label>
      <select v-model="aktueller_mp_typ2" required>
        <option v-for="typ in mpTypen" :key="typ.mp_typ_id_2" :value="typ.mp_typ_id_2">{{ typ.mp_typ_name_2 }}</option>
      </select>
      <br>
      <button type="submit">Mapping aktualisieren</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const mpTypen = ref([]);
    const aktueller_mp_typ1 = ref('');
    const aktueller_mp_typ2 = ref('');
    const mappingID = ref(route.query.id);

    const fetch_mp_typen = () => {
      fetch('http://localhost:3000/api/mp_mapping')
        .then(response => response.json())
        .then(data => {
          mpTypen.value = data;
        })
        .catch(error => {
          console.error('Error fetching MP Typen:', error);
        });
    };

    const fetch_mapping = () => {
      fetch(`http://localhost:3000/api/mp_mapping/${mappingID.value}`)
        .then(response => response.json())
        .then(data => {
          aktueller_mp_typ1.value = data.mp_typ_id_1;
          aktueller_mp_typ2.value = data.mp_typ_id_2;
        })
        .catch(error => {
          console.error('Error fetching mapping:', error);
        });
    };

    const update_mapping = () => {
      const updatedMapping = {
        mp_typ_id_1: aktueller_mp_typ1.value,
        mp_typ_id_2: aktueller_mp_typ2.value
      };
      fetch(`http://localhost:3000/api/mp_mapping/${mappingID.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMapping)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          router.push('/mp_mapping');
        })
        .catch(error => {
          console.error('Error updating mapping:', error);
        });
    };

    onMounted(() => {
      fetch_mp_typen();
      fetch_mapping();
    });

    return {
      mpTypen,
      aktueller_mp_typ1,
      aktueller_mp_typ2,
      update_mapping
    };
  }
}
</script>
