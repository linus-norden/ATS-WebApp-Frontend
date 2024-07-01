<template>
  <div class="container">
    <router-link to="/mp_add" custom v-slot="{ navigate }">
      <button @click="navigate" role="link">Neues MP hinzufügen</button>
    </router-link>
    <p><br></p>
    <input type="text" v-model="searchQuery" placeholder="Suche nach MP, SN oder MP-Typ..." @input="searchMPs" class="search-input"/>
    <table class="table">
      <thead>
        <tr>
          <th @click="sort('mp_id')">ID <span v-show="sortColumn === 'mp_id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_name')">Name <span v-show="sortColumn === 'mp_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_SN')">Seriennummer <span v-show="sortColumn === 'mp_SN'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_mp_typ_name')">Typ <span v-show="sortColumn === 'mp_mp_typ_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_aktiv')">Aktiv <span v-if="sortColumn === 'mp_aktiv'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_aktiv_seit')">Aktiv seit <span v-show="sortColumn === 'mp_aktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_inaktiv_seit')">Deaktiviert am <span v-show="sortColumn === 'mp_inaktiv_seit'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('bereich_name')">Bereich <span v-show="sortColumn === 'bereich_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('raum_name')">Raum <span v-show="sortColumn === 'raum_name'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th @click="sort('mp_beacon_id')">Beacon ID <span v-show="sortColumn === 'mp_beacon_id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
          <th>Bearbeiten</th>
          <th>Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mp in filteredMPs" :key="mp.mp_id">
          <td>{{ mp.mp_id }}</td>
          <td>{{ mp.mp_name }}</td>
          <td>{{ mp.mp_SN }}</td>
          <td>{{ mp.mp_mp_typ_name }}</td>
          <td><template v-if="mp.mp_aktiv == true">&check;</template></td>
          <td>{{ formatDate(mp.mp_aktiv_seit) }}</td>
          <td>{{ formatDate(mp.mp_inaktiv_seit) }}</td>
          <td>{{ mp.bereich_name }}</td>
          <td>{{ mp.raum_name }}</td>
          <td>{{ mp.mp_beacon_id }}</td>
          <td><router-link :to="'/mp_edit?id=' + mp.mp_id">Bearbeiten</router-link></td>
          <td><button @click="delete_mp(mp.mp_id)">Löschen</button></td>
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
      mps: [],  
      searchQuery: ''
    };
  },
  name: 'mps',
  computed: {
    filteredMPs() {
      return this.mps.filter(mp => {
        const searchLower = this.searchQuery.toLowerCase();
        return mp.mp_name.toLowerCase().includes(searchLower) ||
               mp.mp_SN.toLowerCase().includes(searchLower) ||
               mp.mp_id.toString().includes(this.searchQuery) ||
               mp.mp_mp_typ_name.toLowerCase().includes(searchLower);
      });
    }
  },
  mounted() {
    console.log('Fetching MPs...');
    this.fetch_mps();
    this.interval = setInterval(this.fetch_mps, 30000);
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

      this.mps.sort((a, b) => {
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
    fetch_mps() {
      fetch('http://localhost:3000/api/mp')
        .then(response => {
          console.log('response: ', response)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.mps = data;
        })
        .catch(error => {
          console.error('Error fetching MPs:', error);
        });
    },

    searchMPs() {
      this.fetch_mps();
    },

    delete_mp(mpID) {
      console.error('Try to delete MP with ID :', mpID);
      fetch(`http://localhost:3000/api/mp/${mpID}`, { method: 'DELETE' })
        .then(response => {
          console.log('Response 1', response);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.fetch_mps();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}
</script>

<style scoped>
.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

</style>
