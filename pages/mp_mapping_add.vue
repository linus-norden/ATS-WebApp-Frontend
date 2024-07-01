<template>
  <div>
    <h1>Mapping hinzufügen</h1>
    <form @submit.prevent="add_mapping">
      <label for="mp_typ_1">MP Typ 1:</label>
      <select v-model="selectedMPType1" required>
        <option v-for="typ in mpTypes" :key="typ.mp_typ_id_1" :value="typ.mp_typ_id_1">{{ typ.mp_typ_name_1 }}</option>
      </select>
      <br>
      <label for="mp_typ_2">MP Typ 2:</label>
      <select v-model="selectedMPType2" required>
        <option v-for="typ in mpTypes" :key="typ.mp_typ_id_2" :value="typ.mp_typ_id_2">{{ typ.mp_typ_name_2 }}</option>
      </select>
      <br>
      <button type="submit">Mapping hinzufügen</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mpTypes: [],
      selectedMPType1: '',
      selectedMPType2: ''
    };
  },
  mounted() {
    this.fetch_mp_typen();
  },
  methods: {
    fetch_mp_typen() {
      fetch('http://localhost:3000/api/mp_mapping')
        .then(response => response.json())
        .then(data => {
          this.mpTypes = data;
        })
        .catch(error => {
          console.error('Error fetching MP types:', error);
        });
    },
    add_mapping() {
      const newMapping = {
        mp_typ_id_1: this.selectedMPType1,
        mp_typ_id_2: this.selectedMPType2
      };
      fetch('http://localhost:3000/api/mp_mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMapping)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.$router.push('/mp_mapping');
        })
        .catch(error => {
          console.error('Error adding mapping:', error);
        });
    }
  }
}
</script>
