<template>
  <div>
    <h2>Form Penyewaan</h2>
    <form @submit.prevent="sewa">
      <label>Pelanggan:</label>
      <select v-model="form.id_pelanggan">
        <option v-for="p in pelanggan" :key="p.id_pelanggan" :value="p.id_pelanggan">
          {{ p.nama }}
        </option>
      </select>

      <label>Barang:</label>
      <select v-model="form.id_inventori">
        <option v-for="b in barang" :key="b.id_inventori" :value="b.id_inventori">
          {{ b.nama }}
        </option>
      </select>

      <label>Tanggal Sewa:</label>
      <input type="date" v-model="form.tanggalSewa" />

      <button type="submit">Sewa Sekarang</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      pelanggan: [],
      barang: [],
      form: { id_pelanggan: '', id_inventori: '', tanggalSewa: '' }
    };
  },
  async mounted() {
    this.pelanggan = (await axios.get('http://localhost:8080/api/pelanggan')).data;
    this.barang = (await axios.get('http://localhost:8080/api/inventori')).data;
  },
  methods: {
    async sewa() {
      await axios.post('http://localhost:8080/api/penyewaan', this.form);
      alert('Penyewaan berhasil!');
      this.form = { id_pelanggan: '', id_inventori: '', tanggalSewa: '' };
    }
  }
};
</script>
