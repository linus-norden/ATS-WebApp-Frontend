<template>
  <div class="container">
      <router-link to="/hub_add" custom v-slot="{ navigate }">
        <button @click="navigate" role="link">Neuen Hub hinzufügen</button>
      </router-link>
      <p><br></p>
      <table class="table">
        <thead>
          <tr>
            <th @click="sort('hub_id')">ID <span v-show="sortColumn === 'hub_id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('hub_MAC')">MAC <span v-if="sortColumn === 'hub_MAC'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('hub_aktiv')">Aktiv <span v-if="sortColumn === 'hub_aktiv'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('hub_timestamp')">Zuletzt aktiv am/um <span v-if="sortColumn === 'hub_timestamp'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('hub_aktiv_seit')">Aktiv seit <span v-if="sortColumn === 'hub_aktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('hub_inaktiv_seit')">Deaktiviert am <span v-if="sortColumn === 'hub_inaktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('bereich_name')">Bereich <span v-if="sortColumn === 'bereich_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('raum_name')">Raum <span v-if="sortColumn === 'raum_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
  

            <th>Bearbeiten</th>
            <th>Löschen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hub in hubs" :key="hub.hub_id">
            <td>{{ hub.hub_id }}</td>
            <td>{{ hub.hub_MAC }}</td>
            <td><template v-if="hub.hub_aktiv == true">&check;</template></td>
            <td>{{ hub.hub_timestamp }}</td>
            <td>{{ formatDate(hub.hub_aktiv_seit) }}</td>
            <td>{{ formatDate(hub.hub_inaktiv_seit) }}</td>
            <td>{{ hub.bereich_name }}</td>
            <td>{{ hub.raum_name }}</td>
            <td><router-link :to="'/hub_edit?id=' + hub.hub_id">Bearbeiten</router-link></td>
            <td><button @click="delete_hub(hub.hub_id)">Löschen</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sortColumn: null,
        sortOrder: 'asc',  
        hubs: [] 
      };
    },
    name: 'hubs',
    data() {
      return {
        hubs: []
      };
    },
    mounted() {
        Error('Network response was not ok');
        console.log('Fetching hubs...');
        this.fetch_hubs();
    },
    methods: {
      sort(sortKey) {
        if (this.sortColumn === sortKey) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortOrder = 'asc';  
          this.sortColumn = sortKey;
        }

        this.hubs.sort((a, b) => {
          let comparison = 0;
          let valueA = typeof a[sortKey] === 'string' ? a[sortKey].toLowerCase() : a[sortKey];
          let valueB = typeof b[sortKey] === 'string' ? b[sortKey].toLowerCase() : b[sortKey];

          if (valueA > valueB) comparison = 1;
          if (valueA < valueB) comparison = -1;
          if (this.sortOrder === 'desc') comparison *= -1;
          return comparison;
        });
      },

      formatDate(dateString) {
        if (dateString) {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        } else {
          return '';
        }
      },
      fetch_hubs() {
            fetch('http://localhost:3000/api/hub')
            .then(response => {
                console.log('response: ',response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.hubs = data;
            })
            .catch(error => {
                console.error('Error fetching hubs:', error);
            });
        },
        
      delete_hub(hubID) {

        console.error('Try to delete Hub with ID :', hubID);
        fetch(`http://localhost:3000/api/hub/${hubID}`, { method: 'DELETE' })
          .then(response => {
            console.log('Response 1', response);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            this.fetch_hubs();
            })
            .catch(error => {
              console.error('Error:', error);
            });
    }
  }
}

</script>


