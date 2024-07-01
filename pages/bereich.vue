<template>
  <div class="container">
      <router-link to="/bereich_add" custom v-slot="{ navigate }">
        <button @click="navigate" role="link">Neuen Bereich anlegen</button>
      </router-link>
      <p><br></p>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Aktiv</th>
            <th>Aktiv seit</th>
            <th>Inaktiv seit</th>
            <th>Bearbeiten</th>
            <th>Löschen</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="bereich in bereiche" :key="bereich.bereich_id">
            <td>{{ bereich.bereich_id }}</td>
            <td>{{ bereich.bereich_name }}</td>
            <td><template v-if="bereich.bereich_aktiv == true">&check;</template></td>
            <td>{{ formatDate(bereich.bereich_aktiv_seit) }}</td>
            <td>{{ formatDate(bereich.bereich_inaktiv_seit) }}</td>
            <td><router-link :to="'/bereich_edit?id=' + bereich.bereich_id">Bearbeiten</router-link></td>
            <td><button @click="deletebereich(bereich.bereich_id)">Löschen</button></td>
          </tr>
        </tbody>
      </table>
      <br>
      <br>
    </div>
  </template>
  
<script>
  
  import { ref } from 'vue'
  
  export default {
    setup() {
      
      const formattedDate = (dateString) => {
        const date = new Date(dateString)
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }
        if (date.isN) return date.toLocaleDateString('de-DE', options)
        else return ''
      }
      const bereiche = ref([])
      return { bereiche, formattedDate }
    },

    name: 'bereiche',
    
    mounted() {
        Error('Network response was not ok');
        console.log('Fetching bereiche...');
        this.fetchbereiche();

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
    
      fetchbereiche() {
            fetch('http://localhost:3000/api/bereich')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.bereiche = data;
            })
            .catch(error => {
                console.error('Error fetching bereiche:', error);
                // Optionally, you can handle errors here (e.g., show an error message)
            });
        },
        
        deletebereich(bereichId) {
          console.error('Try to delete bereich with ID :', bereichId);
          fetch(`http://localhost:3000/api/bereich/${bereichId}`, { method: 'DELETE'})
            .then(response => {
              console.log('Response 1', response); // Logs 'Promise'
              
            })
            .catch(error => {
              console.error('Error:', error);
            })
          location.reload()
        }
      }
    }
  </script>

