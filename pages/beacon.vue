<template>
  <div class="container">
    <router-link to="/beacon_add" custom v-slot="{ navigate }">
      <button @click="navigate" role="link">Neuen Beacon hinzufügen</button>
    </router-link>
    <p><br></p>
    <table class="table">
      <thead>
        <tr>
          <th @click="sort('beacon_id')">ID <span v-show="sortColumn === 'beacon_id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_MAC')">MAC <span v-if="sortColumn === 'beacon_MAC'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_aktiv')">Aktiv <span v-if="sortColumn === 'beacon_aktiv'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_timestamp')">Zuletzt aktiv am/um <span v-if="sortColumn === 'beacon_timestamp'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_aktiv_seit')">Aktiv seit <span v-if="sortColumn === 'beacon_aktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_inaktiv_seit')">Deaktiviert am <span v-if="sortColumn === 'beacon_inaktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_hub_id')">Hub_ID <span v-if="sortColumn === 'beacon_hub_id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('beacon_hub_ts_beginn')">Mit Hub verbunden seit <span v-if="sortColumn === 'beacon_hub_ts_beginn'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('bereich_name')">Bereich <span v-if="sortColumn === 'bereich_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('raum_name')">Raum <span v-if="sortColumn === 'raum_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th>Bearbeiten</th>
          <th>Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="beacon in beacons" :key="beacon.beacon_id">
          <td>{{ beacon.beacon_id }}</td>
          <td>{{ beacon.beacon_MAC }}</td>
          <td><template v-if="beacon.beacon_aktiv == true">&check;</template></td>
          <td>{{ beacon.beacon_timestamp }}</td>
          <td>{{ formatDate(beacon.beacon_aktiv_seit) }}</td>
          <td>{{ formatDate(beacon.beacon_inaktiv_seit) }}</td>
          <td>{{ beacon.beacon_hub_id }}</td>
          <td>{{ beacon.beacon_hub_ts_beginn }}</td>
          <td>{{ beacon.bereich_name }}</td>
          <td>{{ beacon.raum_name }}</td>
          <td><router-link :to="'/beacon_edit?id=' + beacon.beacon_id">Bearbeiten</router-link></td>
          <td><button @click="delete_beacon(beacon.beacon_id)">Löschen</button></td>
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
      sortOrder: 'asc',  // 'asc' / 'desc'
      beacons: []  
    };
  },
  name: 'beacons',
  mounted() {
    console.log('Fetching beacons...');
    this.fetch_beacons();

    this.interval = setInterval(this.fetch_beacons, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    sort(sortKey) {
      if (this.sortColumn === sortKey) {

        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOrder = 'asc'; 
        this.sortColumn = sortKey;
      }

      this.beacons.sort((a, b) => {
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
        return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(date);
      } else {
        return '';
      }
    },
    fetch_beacons() {
      fetch('http://localhost:3000/api/beacon')
        .then(response => {
          console.log('response: ', response)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.beacons = data;
        })
        .catch(error => {
          console.error('Error fetching beacons:', error);
        });
    },

    delete_beacon(beaconID) {
      console.error('Try to delete beacon with ID :', beaconID);
      fetch(`http://localhost:3000/api/beacon/${beaconID}`, { method: 'DELETE' })
        .then(response => {
          console.log('Response 1', response); // Logs 'Promise'
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Aktualisieren der Anzeige
          this.fetch_beacons();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}
</script>
