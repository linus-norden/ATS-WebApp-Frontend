<template>
  <div class="container">
    <router-link to="/raum_add" custom v-slot="{ navigate }">
      <button @click="navigate" role="link">Neuen Raum hinzufügen</button>
    </router-link>
      <p><br></p>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bereich</th>
            <th>Raum</th>
            <th>Aktiv</th>
            <th>Aktiv seit</th>
            <th>Deaktiviert am</th>
            <th>Bearbeiten</th>
            <th>Löschen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="raum in raeume" :key="raum.raum_id">
            <td>{{ raum.raum_id }}</td>
            <td>{{ raum.bereich_name }}</td>
            <td>{{ raum.raum_name }}</td>
            <td><template v-if="raum.raum_aktiv == true">&check;</template></td>
            <td>{{ formatDate(raum.raum_aktiv_seit) }}</td>
            <td>{{ formatDate(raum.raum_inaktiv_seit) }}</td>
            <td><router-link :to="'/raum_edit?id=' + raum.raum_id">Bearbeiten</router-link></td>
            <td><button @click="deleteraum(raum.raum_id)">Löschen</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    
    name: 'raeume',
    data() {
      return {
        raeume: []
      };
    },
    mounted() {
        Error('Network response was not ok');
        console.log('Fetching raeume...');
        this.fetchraeume();
    },
    methods: {
      formatDate(dateString) {
        if (dateString) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        } else {
          return '';
        }
      },
        fetchraeume() {
            fetch('http://localhost:3000/api/raum')
            .then(response => {
                console.log('response: ',response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.raeume = data;
            })
            .catch(error => {
                console.error('Error fetching areas:', error);
            });
        },
        
        deleteraum(raumId) {
          console.error('Try to delete raum with ID :', raumId);
          fetch(`http://localhost:3000/api/raum/${raumId}`, { method: 'DELETE'})
            .then(response => {
              console.log('Response 1', response); // Logs 'Promise'
              
            })
            .catch(error => {
              console.error('Error:', error);
            })
          this.fetchraeume()
        }
      }
    }
  </script>
s


