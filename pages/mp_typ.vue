<template>
  <div class="container">
    <router-link to="/mp_typ_add" custom v-slot="{ navigate }">
      <button @click="navigate" role="link">Neuen MP-Typ hinzufügen</button>
    </router-link>
    <p><br></p>    
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Aktiv</th>
          <th>Bearbeiten</th>
          <th>Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="typ in mpTypen" :key="typ.mp_typ_id">
          <td>{{ typ.mp_typ_id }}</td>
          <td>{{ typ.mp_typ_name }}</td>
          <td><template v-if="typ.mp_typ_aktiv == true">&check;</template></td>
          <td><router-link :to="'/mp_typ_edit?id=' + typ.mp_typ_id">Bearbeiten</router-link></td>
          <td><button @click="deleteMpTyp(typ.mp_typ_id)">Löschen</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mpTypen: []
    };
  },
  mounted() {
    this.fetchMpTypen();
  },
  methods: {
    fetchMpTypen() {
      fetch('http://localhost:3000/api/mp_typ')
        .then(response => response.json())
        .then(data => {
          this.mpTypen = data;
        })
        .catch(error => {
          console.error('Error fetching MP Typen:', error);
        });
    },
    deleteMpTyp(mpTypID) {
      fetch(`http://localhost:3000/api/mp_typ/${mpTypID}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.fetchMpTypen();
        })
        .catch(error => {
          console.error('Error deleting MP Typ:', error);
        });
    }
  }
}
</script>

