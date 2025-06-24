const mobilList = [
    { nama: "Toyota Avanza", harga: 500000, gambar: "Aset/toyota-avanza-13l.png.jpeg" },
    { nama: "Toyota Kijang Innova", harga: 700000, gambar: "Aset/Cover..jpeg" },
    { nama: "Honda HRV", harga: 600000, gambar: "Aset/Honda-HR-V-Touring-1.5-Turbo-2025-jpg.webp" },
    { nama: "Daihatsu Sigra", harga: 450000, gambar: "Aset/Dark_grey_metallic.png" }
  ];

  const listContainer = document.getElementById("mobil-list");
  const previewList = document.getElementById("preview-list");
  const previewTotal = document.getElementById("preview-total");
  const strukOutput = document.getElementById("struk-output");
  const riwayatList = document.getElementById("riwayat-list");

  mobilList.forEach((mobil, index) => {
    const div = document.createElement("div");
    div.className = "mobil";
    div.innerHTML = `
      <input type="checkbox" id="check-${index}" data-index="${index}" style="margin-right:10px">
      <img src="${mobil.gambar}" alt="${mobil.nama}">
      <div>
        <strong>${mobil.nama}</strong><br>
        Rp ${mobil.harga.toLocaleString()} / hari<br>
        <label>Mulai:
          <input type="date" id="tanggal-${index}">
        </label>
        <label>Durasi (hari):
          <input type="number" min="1" id="durasi-${index}" placeholder="Hari">
        </label>
      </div>
    `;
    listContainer.appendChild(div);
  });

  function updatePreviewRingkasan() {
    previewList.innerHTML = "";
    let total = 0;
    mobilList.forEach((mobil, index) => {
      const cek = document.getElementById(`check-${index}`);
      if (cek && cek.checked) {
        const durasiEl = document.getElementById(`durasi-${index}`);
        const tanggalEl = document.getElementById(`tanggal-${index}`);
        if (!durasiEl || !tanggalEl) return;
        const durasi = parseInt(durasiEl.value);
        const tanggal = tanggalEl.value;
        if (!tanggal || !durasi) return;
        const subtotal = mobil.harga * durasi;
        total += subtotal;
        previewList.innerHTML += `<p>${mobil.nama} (${tanggal}, ${durasi} hari) - Rp ${subtotal.toLocaleString()}</p>`;
      }
    });
    previewTotal.innerHTML = `Total: Rp ${total.toLocaleString()}`;
  }

  function lanjutKeForm() {
    const dipilih = mobilList.some((_, i) => {
      const checkEl = document.getElementById(`check-${i}`);
      return checkEl && checkEl.checked;
    });
    if (!dipilih) return alert("Pilih minimal satu mobil terlebih dahulu.");
    document.getElementById("page-mobil").style.display = "none";
    document.getElementById("page-form").style.display = "block";
    updatePreviewRingkasan();
  }

  function kembaliKeMobil() {
    document.getElementById("page-mobil").style.display = "block";
    document.getElementById("page-form").style.display = "none";
  }

  document.getElementById("hitung-total").addEventListener("click", () => {
    const nama = document.getElementById("nama-pelanggan").value.trim();
    if (!nama) return alert("Nama pelanggan wajib diisi!");
    updatePreviewRingkasan();
    if (previewList.innerHTML.trim() === "") {
      alert("Harap isi tanggal dan durasi sewa untuk setiap mobil yang dipilih.");
    } else {
      alert("Ringkasan berhasil dibuat. Silakan simpan pemesanan.");
    }
  });

  document.getElementById("simpan-pemesanan").addEventListener("click", () => {
    const nama = document.getElementById("nama-pelanggan").value.trim();
    if (!nama) return alert("Nama pelanggan wajib diisi!");
    if (previewList.innerHTML.trim() === "") return alert("Belum ada pemesanan valid.");
    const waktu = new Date().toLocaleString();
    const total = previewTotal.textContent;
    const detail = previewList.innerHTML;
    const struk = `======= STRUK PEMESANAN =======\nNama: ${nama}\nWaktu: ${waktu}\n\n${previewList.textContent}\n${total}`;
    strukOutput.style.display = "block";
    strukOutput.textContent = struk;
    const data = JSON.parse(localStorage.getItem("pemesanan") || "[]");
    data.push({ nama, waktu, detail, total });
    localStorage.setItem("pemesanan", JSON.stringify(data));
    tampilkanRiwayat();
  });

  function tampilkanRiwayat() {
    const data = JSON.parse(localStorage.getItem("pemesanan") || "[]");
    riwayatList.innerHTML = "";
    data.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "riwayat-item";
      div.innerHTML = `
        <strong>${item.nama}</strong> (${item.waktu})<br>
        ${item.detail}<br>
        <strong>${item.total}</strong><br>
        <button onclick="hapusPemesanan(${index})">Hapus</button>
      `;
      riwayatList.appendChild(div);
    });
  }

  function hapusPemesanan(index) {
    const data = JSON.parse(localStorage.getItem("pemesanan") || "[]");
    data.splice(index, 1);
    localStorage.setItem("pemesanan", JSON.stringify(data));
    tampilkanRiwayat();
  }

  tampilkanRiwayat();