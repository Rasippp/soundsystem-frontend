<template>
  <div>
    <h2>Daftar Inventori</h2>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th><th>Nama Barang</th><th>Stok</th><th>Harga Sewa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in barang" :key="b.id_inventori">
          <td>{{ b.id_inventori }}</td>
          <td>{{ b.nama }}</td>
          <td>{{ b.stok }}</td>
          <td>{{ b.harga_sewa }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'InventoriList',
  data() {
    return { barang: [] }
  },
  async mounted() {
    const res = await axios.get('http://localhost:8080/api/inventori')
    this.barang = res.data
  }
}
</script>
