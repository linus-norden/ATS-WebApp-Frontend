<template>
  <div class="container">
    <router-link to="/mp_mapping_add" custom v-slot="{ navigate }">
      <button @click="navigate" role="link">Neues Medizinprodukte-Mapping hinzufügen</button>
    </router-link>
    <p><br></p>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>MP Typ 1</th>
          <th>MP Typ 2</th>
          <th>Bearbeiten</th>
          <th>Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mapping in mappings" :key="mapping.mp_mapping_id">
          <td>{{ mapping.mp_mapping_id }}</td>
          <td>{{ mapping.mp_typ_name_1 }}</td>
          <td>{{ mapping.mp_typ_name_2 }}</td>
          <td><router-link :to="'/mp_mapping_edit?id=' + mapping.mp_mapping_id">Bearbeiten</router-link></td>
          <td><button @click="deleteMapping(mapping.mp_mapping_id)">Löschen</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mappings: []
    };
  },
  mounted() {
    this.fetchMappings();
  },
  methods: {
    fetchMappings() {
      fetch('http://localhost:3000/api/mp_mapping')
        .then(response => response.json())
        .then(data => {
          this.mappings = data;
        })
        .catch(error => {
          console.error('Error fetching mappings:', error);
        });
    },
    deleteMapping(mappingID) {
      fetch(`http://localhost:3000/api/mp_mapping/${mappingID}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.fetchMappings();
        })
        .catch(error => {
          console.error('Error deleting mapping:', error);
        });
    }
  }
}
</script>

