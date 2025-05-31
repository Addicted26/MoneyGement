document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const notificationArea = document.getElementById("notification-area");
  const navLinks = document.querySelectorAll(
    ".sidebar .nav-link, .view-all-btn"
  );
  const pageSections = document.querySelectorAll(".page-section");
  const tahunFooterEl = document.getElementById("tahun-footer");

  // Modals
  const confirmModal = document.getElementById("confirm-modal");
  const closeModalBtn = document.querySelector(".close-modal-btn");
  let modalConfirmBtn = document.getElementById("modal-confirm-btn");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const modalTitleEl = document.getElementById("modal-title");
  const modalMessageEl = document.getElementById("modal-message");

  const editModal = document.getElementById("edit-modal");
  const closeEditModalBtn = document.querySelector(".close-edit-modal-btn");
  const formEditTransaksi = document.getElementById("form-edit-transaksi");
  const editTransaksiIdEl = document.getElementById("edit-transaksi-id");
  const editDeskripsiEl = document.getElementById("edit-deskripsi");
  const editNominalEl = document.getElementById("edit-nominal");
  const editJenisTransaksiEl = document.getElementById("edit-jenis-transaksi");
  const editKategoriSelectEl = document.getElementById("edit-kategori-select");
  const editKategoriBaruEl = document.getElementById("edit-kategori-baru");
  const editTanggalTransaksiEl = document.getElementById(
    "edit-tanggal-transaksi"
  );

  // Dashboard Elements
  const sisaSaldoEl = document.getElementById("sisa-saldo");
  const limitPengeluaranInfoEl = document.getElementById(
    "limit-pengeluaran-info"
  );
  const pengeluaranBulanIniEl = document.getElementById(
    "pengeluaran-bulan-ini"
  );
  const limitProgressBarEl = document.getElementById("limit-progress-bar");
  const limitProgressBarTextEl = limitProgressBarEl
    ? limitProgressBarEl.querySelector(".progress-text")
    : null;
  const limitWarningEl = document.getElementById("limit-warning");

  const judulTargetNabungDashboardEl = document.getElementById(
    "judul-target-nabung-dashboard"
  ); // Untuk judul di dashboard
  const targetNabungInfoEl = document.getElementById("target-nabung-info");
  const nabungTerkumpulEl = document.getElementById("nabung-terkumpul");
  const nabungProgressBarEl = document.getElementById("nabung-progress-bar");
  const nabungProgressBarTextEl = nabungProgressBarEl
    ? nabungProgressBarEl.querySelector(".progress-text")
    : null;
  const rekomendasiNabungEl = document.getElementById("rekomendasi-nabung");
  const manualSavingAmountEl = document.getElementById("manual-saving-amount");
  const addToSavingsBtn = document.getElementById("add-to-savings-btn");
  const subtractFromSavingsBtn = document.getElementById(
    "subtract-from-savings-btn"
  );

  const listTransaksiDashboardEl = document.getElementById(
    "list-transaksi-dashboard"
  );
  const listAnggaranDashboardEl = document.getElementById(
    "list-anggaran-dashboard"
  );

  // Transaksi Elements
  const formTransaksi = document.getElementById("form-transaksi");
  const inputDeskripsi = document.getElementById("deskripsi");
  const inputNominal = document.getElementById("nominal");
  const inputJenisTransaksi = document.getElementById("jenis-transaksi");
  const kategoriSelectEl = document.getElementById("kategori-select");
  const inputKategoriBaruEl = document.getElementById("input-kategori-baru");
  const inputTanggalTransaksi = document.getElementById("tanggal-transaksi");
  const listItemTransaksiEl = document.getElementById("list-item-transaksi");
  const filterBulanEl = document.getElementById("filter-bulan");
  const filterTahunEl = document.getElementById("filter-tahun");
  const resetFilterBtn = document.getElementById("reset-filter");
  const exportCsvBtn = document.getElementById("export-csv-btn");

  // Anggaran Elements
  const formAnggaran = document.getElementById("form-anggaran");
  const anggaranKategoriSelectEl = document.getElementById(
    "anggaran-kategori-select"
  );
  const inputAnggaranKategoriBaruEl = document.getElementById(
    "input-anggaran-kategori-baru"
  );
  const inputAnggaranNominal = document.getElementById("anggaran-nominal");
  const listItemAnggaranEl = document.getElementById("list-item-anggaran");
  const progresAnggaranContainerEl = document.getElementById(
    "progres-anggaran-container"
  );

  // Pengaturan Elements
  const formLimit = document.getElementById("form-limit");
  const inputLimitNominal = document.getElementById("limit-nominal");
  const formTargetNabung = document.getElementById("form-target-nabung");
  const inputTargetNabungJudulEl = document.getElementById(
    "target-nabung-judul"
  ); // Input judul target
  const inputTargetNabungNominal = document.getElementById(
    "target-nabung-nominal"
  );
  const inputTargetNabungTanggal = document.getElementById(
    "target-nabung-tanggal"
  );
  const formGaji = document.getElementById("form-gaji");
  const inputGajiDeskripsi = document.getElementById("gaji-deskripsi");
  const inputGajiNominal = document.getElementById("gaji-nominal");
  const btnCatatGaji = document.getElementById("catat-gaji-otomatis");

  // Statistik Elements
  const kategoriChartCtx = document
    .getElementById("kategoriChart")
    .getContext("2d");
  const trenChartCtx = document.getElementById("trenChart").getContext("2d");
  let kategoriChartInstance, trenChartInstance;
  const statsKategoriBulanEl = document.getElementById("stats-kategori-bulan");
  const statsKategoriTahunEl = document.getElementById("stats-kategori-tahun");
  const statsTrenTahunEl = document.getElementById("stats-tren-tahun");

  // --- Data Storage & State ---
  let transactions = JSON.parse(localStorage.getItem("transactions_v8")) || [];
  let limitData = JSON.parse(localStorage.getItem("limitData_v8")) || {
    nominal: 0,
  };
  let targetNabungData = JSON.parse(
    localStorage.getItem("targetNabungData_v8")
  ) || {
    judul: "Target Menabung",
    targetNominal: 0,
    terkumpul: 0,
    targetTanggal: null,
  };
  let gajiData = JSON.parse(localStorage.getItem("gajiData_v8")) || {
    deskripsi: "Gaji Pokok",
    nominal: 0,
  };
  let budgetsData = JSON.parse(localStorage.getItem("budgetsData_v8")) || {};
  let categories = JSON.parse(localStorage.getItem("categories_v8")) || [
    "Makanan",
    "Transportasi",
    "Gaji",
    "Hiburan",
    "Tagihan",
    "Pendidikan",
    "Kesehatan",
    "Lainnya",
  ];
  let currentTransactionToEditId = null;

  // --- Utility Functions ---
  const formatRupiah = (angka) => {
    if (isNaN(parseFloat(angka))) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };
  const generateID = () =>
    `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const today = new Date();
  const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD

  if (inputTanggalTransaksi) inputTanggalTransaksi.value = todayString;
  if (tahunFooterEl) tahunFooterEl.textContent = today.getFullYear();

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;
    notificationArea.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "fadeOutNotification 0.5s forwards";
      setTimeout(() => notification.remove(), 500);
    }, 4500);
  }

  // --- Modal Confirmation Logic ---
  function openConfirmModal(title, message, onConfirmCallback) {
    if (!confirmModal || !modalTitleEl || !modalMessageEl || !modalConfirmBtn)
      return;
    modalTitleEl.textContent = title;
    modalMessageEl.textContent = message;
    confirmModal.style.display = "block";

    const newConfirmBtn = modalConfirmBtn.cloneNode(true);
    modalConfirmBtn.parentNode.replaceChild(newConfirmBtn, modalConfirmBtn);
    modalConfirmBtn = newConfirmBtn;

    modalConfirmBtn.onclick = () => {
      onConfirmCallback();
      closeConfirmModal();
    };
  }
  function closeConfirmModal() {
    if (!confirmModal) return;
    confirmModal.style.animation = "fadeOutModal 0.3s forwards";
    setTimeout(() => {
      confirmModal.style.display = "none";
      confirmModal.style.animation = "";
    }, 300);
  }
  if (closeModalBtn) closeModalBtn.onclick = closeConfirmModal;
  if (modalCancelBtn) modalCancelBtn.onclick = closeConfirmModal;

  // --- Edit Modal Logic ---
  function openEditModal(transaction) {
    if (
      !editModal ||
      !editTransaksiIdEl ||
      !editDeskripsiEl ||
      !editNominalEl ||
      !editJenisTransaksiEl ||
      !editKategoriSelectEl ||
      !editKategoriBaruEl ||
      !editTanggalTransaksiEl
    )
      return;
    currentTransactionToEditId = transaction.id;
    editTransaksiIdEl.value = transaction.id;
    editDeskripsiEl.value = transaction.deskripsi;
    editNominalEl.value = Math.abs(transaction.nominal);
    editJenisTransaksiEl.value = transaction.jenis;

    populateCategoryDropdown(editKategoriSelectEl, transaction.kategori);
    editKategoriBaruEl.style.display = "none";
    editKategoriBaruEl.value = "";

    editTanggalTransaksiEl.value = transaction.tanggal;
    editModal.style.display = "block";
  }
  function closeEditModal() {
    if (!editModal) return;
    editModal.style.animation = "fadeOutModal 0.3s forwards";
    setTimeout(() => {
      editModal.style.display = "none";
      editModal.style.animation = "";
      if (formEditTransaksi) formEditTransaksi.reset();
      currentTransactionToEditId = null;
    }, 300);
  }
  if (closeEditModalBtn) closeEditModalBtn.onclick = closeEditModal;

  window.onclick = (event) => {
    if (confirmModal && event.target == confirmModal) closeConfirmModal();
    if (editModal && event.target == editModal) closeEditModal();
  };

  // --- Navigation ---
  function switchPage(targetId) {
    pageSections.forEach((section) => section.classList.remove("active"));
    const targetPage = document.getElementById(targetId);
    if (targetPage) targetPage.classList.add("active");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.dataset.target === targetId &&
        !link.classList.contains("view-all-btn")
      ) {
        link.classList.add("active");
      }
    });
    if (targetId === "statistik") {
      populateStatistikFilters();
      renderKategoriChart();
      renderTrenChart();
    }
    if (targetId === "anggaran") {
      renderBudgetList();
      renderBudgetProgress();
      populateCategoryDropdown(anggaranKategoriSelectEl);
    }
    if (
      targetId === "transaksi" ||
      (targetId === "dashboard" && formTransaksi)
    ) {
      // Pastikan formTransaksi ada jika dashboard aktif
      populateCategoryDropdown(kategoriSelectEl);
      if (inputTanggalTransaksi) inputTanggalTransaksi.value = todayString;
    }
  }
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage(e.currentTarget.dataset.target);
    });
  });

  // --- Category Management ---
  function saveCategories() {
    localStorage.setItem("categories_v8", JSON.stringify(categories));
  }
  function addCategory(newCategoryName) {
    const trimmedCategory = newCategoryName.trim();
    const normalizedCategory =
      trimmedCategory.charAt(0).toUpperCase() +
      trimmedCategory.slice(1).toLowerCase();
    if (
      normalizedCategory &&
      !categories
        .map((c) => c.toLowerCase())
        .includes(normalizedCategory.toLowerCase())
    ) {
      categories.push(normalizedCategory);
      categories.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      saveCategories();
      populateAllCategoryDropdowns(normalizedCategory);
      showNotification(
        `Kategori "${normalizedCategory}" berhasil ditambahkan.`,
        "success"
      );
      return normalizedCategory;
    } else if (!trimmedCategory) {
      showNotification("Nama kategori tidak boleh kosong.", "error");
    } else {
      showNotification(`Kategori "${trimmedCategory}" sudah ada.`, "info");
    }
    return null;
  }
  function populateCategoryDropdown(selectElement, selectedValue = null) {
    if (!selectElement) return;
    const currentValue = selectedValue || selectElement.value;
    selectElement.innerHTML = '<option value="">-- Pilih Kategori --</option>';
    categories.forEach((cat) => {
      const option = new Option(cat, cat);
      selectElement.add(option);
    });
    selectElement.add(
      new Option("Tambah Kategori Baru...", "add_new_category")
    );
    if (
      currentValue &&
      selectElement.querySelector(`option[value="${currentValue}"]`)
    ) {
      selectElement.value = currentValue;
    } else if (
      !currentValue &&
      selectElement.options.length > 1 &&
      selectElement.options[0].value === ""
    ) {
      selectElement.value = "";
    }
  }
  function populateAllCategoryDropdowns(selectedValueToSet = null) {
    populateCategoryDropdown(kategoriSelectEl, selectedValueToSet);
    populateCategoryDropdown(anggaranKategoriSelectEl, selectedValueToSet);
    populateCategoryDropdown(editKategoriSelectEl, selectedValueToSet);
  }
  function handleCategorySelection(selectEl, inputNewCatEl) {
    if (!selectEl || !inputNewCatEl) return;
    if (selectEl.value === "add_new_category") {
      inputNewCatEl.style.display = "block";
      inputNewCatEl.focus();
    } else {
      inputNewCatEl.style.display = "none";
      inputNewCatEl.value = "";
    }
  }

  // --- Core Logic Functions ---
  function saveData() {
    localStorage.setItem("transactions_v8", JSON.stringify(transactions));
    localStorage.setItem("limitData_v8", JSON.stringify(limitData));
    localStorage.setItem(
      "targetNabungData_v8",
      JSON.stringify(targetNabungData)
    );
    localStorage.setItem("gajiData_v8", JSON.stringify(gajiData));
    localStorage.setItem("budgetsData_v8", JSON.stringify(budgetsData));
    saveCategories();
  }
  function addTransaction(deskripsi, nominal, jenis, kategoriValue, tanggal) {
    const newTransaction = {
      id: generateID(),
      deskripsi,
      nominal:
        jenis === "pemasukan" ? parseFloat(nominal) : -parseFloat(nominal),
      jenis,
      kategori:
        kategoriValue.trim() || (jenis === "pemasukan" ? "Lainnya" : "Lainnya"),
      tanggal,
    };
    transactions.push(newTransaction);
    // Logika tabungan dipisah, tidak lagi terhubung ke kategori transaksi 'Tabungan'
    sortTransactionsByDate();
    updateUI();
    showNotification(
      `Transaksi "${deskripsi}" berhasil ditambahkan.`,
      "success"
    );
  }
  function sortTransactionsByDate() {
    transactions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }
  function updateTransaction(id, updatedData) {
    const transactionIndex = transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) return;
    transactions[transactionIndex] = {
      id: transactions[transactionIndex].id,
      ...updatedData,
    };
    sortTransactionsByDate();
    updateUI();
    showNotification(
      `Transaksi "${updatedData.deskripsi}" berhasil diperbarui.`,
      "success"
    );
  }
  function removeTransaction(id) {
    const transactionToRemove = transactions.find((t) => t.id === id);
    if (!transactionToRemove) return;
    transactions = transactions.filter((t) => t.id !== id);
    updateUI();
    showNotification(
      `Transaksi "${transactionToRemove.deskripsi}" dihapus.`,
      "info"
    );
  }

  // --- Saving Progress Manual Functions ---
  function addManualSaving(amount) {
    if (isNaN(amount) || amount <= 0) {
      showNotification(
        "Masukkan jumlah yang valid untuk ditambahkan ke tabungan.",
        "error"
      );
      return;
    }
    targetNabungData.terkumpul += amount;
    if (
      targetNabungData.targetNominal > 0 &&
      targetNabungData.terkumpul > targetNabungData.targetNominal
    ) {
      targetNabungData.terkumpul = targetNabungData.targetNominal;
    }
    updateUI();
    showNotification(
      `${formatRupiah(amount)} berhasil ditambahkan ke tabungan.`,
      "success"
    );
  }
  function subtractManualSaving(amount) {
    if (isNaN(amount) || amount <= 0) {
      showNotification(
        "Masukkan jumlah yang valid untuk dikurangi dari tabungan.",
        "error"
      );
      return;
    }
    if (targetNabungData.terkumpul < amount) {
      showNotification(
        "Jumlah yang dikurangi melebihi tabungan terkumpul.",
        "error"
      );
      return;
    }
    targetNabungData.terkumpul -= amount;
    updateUI();
    showNotification(
      `${formatRupiah(amount)} berhasil dikurangi dari tabungan.`,
      "success"
    );
  }

  // --- Budget Functions ---
  function addOrUpdateBudget(kategoriValue, nominalInput) {
    const kategori = kategoriValue.trim();
    const nominal = parseFloat(nominalInput);
    if (!kategori || isNaN(nominal) || nominal < 0) {
      showNotification("Kategori dan nominal valid harus diisi.", "error");
      return;
    }
    budgetsData[kategori] = nominal;
    updateUI();
    showNotification(`Anggaran untuk "${kategori}" disimpan.`, "success");
  }
  function removeBudget(kategori) {
    if (budgetsData.hasOwnProperty(kategori)) {
      delete budgetsData[kategori];
      updateUI();
      showNotification(`Anggaran untuk "${kategori}" dihapus.`, "info");
    }
  }
  function renderBudgetList() {
    if (!listItemAnggaranEl) return;
    listItemAnggaranEl.innerHTML = "";
    const budgetKeys = Object.keys(budgetsData);
    if (budgetKeys.length === 0) {
      listItemAnggaranEl.innerHTML = "<li>Belum ada anggaran.</li>";
      return;
    }
    budgetKeys.sort().forEach((kategori) => {
      const nominal = budgetsData[kategori];
      const li = document.createElement("li");
      li.innerHTML = `<div class="anggaran-info"><span class="category">${kategori}</span><span class="amount">${formatRupiah(
        nominal
      )} / bln</span></div><button class="delete-anggaran-btn" data-kategori="${kategori}" title="Hapus"><i class="fas fa-trash-alt"></i></button>`;
      listItemAnggaranEl.appendChild(li);
    });
  }
  function getSpentForCategoryThisMonth(kategori) {
    const now = new Date();
    const currentMonthStr =
      now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    return transactions
      .filter(
        (t) =>
          t.jenis === "pengeluaran" &&
          t.kategori.toLowerCase() === kategori.toLowerCase() &&
          t.tanggal.startsWith(currentMonthStr)
      )
      .reduce((acc, t) => acc + Math.abs(t.nominal), 0);
  }
  function renderBudgetProgress(targetElement = progresAnggaranContainerEl) {
    if (!targetElement) return;
    targetElement.innerHTML = "";
    const budgetKeys = Object.keys(budgetsData);
    if (
      budgetKeys.length === 0 &&
      targetElement.id === "progres-anggaran-container"
    ) {
      targetElement.innerHTML =
        '<p class="info-text">Atur anggaran untuk lihat progres.</p>';
      return;
    } else if (
      budgetKeys.length === 0 &&
      targetElement.id === "list-anggaran-dashboard"
    ) {
      targetElement.innerHTML = "<li>Belum ada anggaran.</li>";
      return;
    }
    budgetKeys.sort().forEach((kategori) => {
      const budgetNominal = budgetsData[kategori];
      const spentNominal = getSpentForCategoryThisMonth(kategori);
      let percentage =
        budgetNominal > 0
          ? (spentNominal / budgetNominal) * 100
          : spentNominal > 0
          ? 100
          : 0; // Jika budget 0 tapi ada pengeluaran, anggap 100%
      const percentageDisplay = Math.min(percentage, 100);
      let progressBarClass = "";
      if (percentage >= 100) progressBarClass = "danger";
      else if (percentage >= 80) progressBarClass = "warning";
      const progressBarHtml = `<div class="progress-bar-container"><div class="progress-bar ${progressBarClass}" style="width: ${percentageDisplay}%;"><span class="progress-text">${Math.round(
        percentage
      )}%</span></div></div>`;
      if (targetElement.id === "list-anggaran-dashboard") {
        const li = document.createElement("li");
        li.innerHTML = `<div class="anggaran-item-info"><span class="anggaran-category">${kategori}</span><span class="anggaran-amounts">${formatRupiah(
          spentNominal
        )} / ${formatRupiah(budgetNominal)}</span></div>${progressBarHtml}`;
        targetElement.appendChild(li);
      } else {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("anggaran-progress-item");
        itemDiv.innerHTML = `<div class="anggaran-progress-info"><span class="category-name">${kategori}</span><span class="amounts-spent">${formatRupiah(
          spentNominal
        )} / ${formatRupiah(budgetNominal)}</span></div>${progressBarHtml}`;
        targetElement.appendChild(itemDiv);
      }
    });
  }

  // --- CSV Export Function ---
  function exportTransactionsToCSV() {
    if (transactions.length === 0) {
      showNotification("Tidak ada transaksi untuk diekspor.", "info");
      return;
    }
    let csvContent = "Tanggal,Deskripsi,Kategori,Jenis,Nominal (Rp)\n";
    transactions.forEach((t) => {
      const date = new Date(t.tanggal).toLocaleDateString("id-ID");
      const deskripsi = `"${(t.deskripsi || "").replace(/"/g, '""')}"`;
      const kategori = `"${(t.kategori || "").replace(/"/g, '""')}"`;
      csvContent += `${date},${deskripsi},${kategori},${t.jenis},${t.nominal}\n`;
    });
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "laporan_moneygement.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification("Data transaksi berhasil diekspor ke CSV.", "success");
    } else {
      showNotification("Ekspor CSV tidak didukung di browser ini.", "error");
    }
  }

  // --- UI Update Functions ---
  function updateSaldoDisplay() {
    if (!sisaSaldoEl) return;
    const totalSaldo = transactions.reduce((acc, t) => acc + t.nominal, 0);
    sisaSaldoEl.textContent = formatRupiah(totalSaldo);
    sisaSaldoEl.style.color = totalSaldo < 0 ? "var(--danger-color)" : "white";
  }
  function updateLimitDisplay() {
    if (
      !limitPengeluaranInfoEl ||
      !pengeluaranBulanIniEl ||
      !limitProgressBarEl ||
      !limitProgressBarTextEl ||
      !limitWarningEl
    )
      return;
    if (limitData.nominal <= 0) {
      limitPengeluaranInfoEl.textContent = "Belum diatur";
      pengeluaranBulanIniEl.textContent = formatRupiah(0);
      limitProgressBarEl.style.width = "0%";
      limitProgressBarTextEl.textContent = "0%";
      limitWarningEl.textContent = "";
      limitProgressBarEl.classList.remove("danger", "warning");
      return;
    }
    limitPengeluaranInfoEl.textContent = formatRupiah(limitData.nominal);
    const now = new Date();
    const currentMonthStr =
      now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const pengeluaranBulanIni = transactions
      .filter(
        (t) =>
          t.jenis === "pengeluaran" && t.tanggal.startsWith(currentMonthStr)
      )
      .reduce((acc, t) => acc + Math.abs(t.nominal), 0);
    pengeluaranBulanIniEl.textContent = formatRupiah(pengeluaranBulanIni);
    const percentage =
      limitData.nominal > 0
        ? (pengeluaranBulanIni / limitData.nominal) * 100
        : 0;
    limitProgressBarEl.style.width = `${Math.min(percentage, 100)}%`;
    limitProgressBarTextEl.textContent = `${Math.round(percentage)}%`;
    limitWarningEl.textContent = "";
    limitProgressBarEl.classList.remove("danger", "warning");
    if (percentage >= 100) {
      limitWarningEl.textContent = "Limit terlampaui!";
      limitProgressBarEl.classList.add("danger");
    } else if (percentage >= 80) {
      limitWarningEl.textContent = "Mendekati limit!";
      limitProgressBarEl.classList.add("warning");
    }
  }
  function updateNabungDisplay() {
    if (
      !targetNabungInfoEl ||
      !nabungTerkumpulEl ||
      !nabungProgressBarEl ||
      !nabungProgressBarTextEl ||
      !rekomendasiNabungEl ||
      !judulTargetNabungDashboardEl
    )
      return;
    judulTargetNabungDashboardEl.textContent =
      targetNabungData.judul || "Progres Menabung";
    if (targetNabungData.targetNominal <= 0) {
      targetNabungInfoEl.textContent = "Belum diatur";
      nabungTerkumpulEl.textContent = formatRupiah(0);
      nabungProgressBarEl.style.width = "0%";
      nabungProgressBarTextEl.textContent = "0%";
      rekomendasiNabungEl.textContent = formatRupiah(0);
      return;
    }
    targetNabungInfoEl.textContent = formatRupiah(
      targetNabungData.targetNominal
    );
    nabungTerkumpulEl.textContent = formatRupiah(targetNabungData.terkumpul);
    const percentage =
      targetNabungData.targetNominal > 0
        ? (targetNabungData.terkumpul / targetNabungData.targetNominal) * 100
        : 0;
    nabungProgressBarEl.style.width = `${Math.min(percentage, 100)}%`;
    nabungProgressBarTextEl.textContent = `${Math.round(percentage)}%`;
    if (
      targetNabungData.targetTanggal &&
      targetNabungData.terkumpul < targetNabungData.targetNominal
    ) {
      const tglTarget = new Date(targetNabungData.targetTanggal);
      const tglSekarang = new Date();
      tglSekarang.setHours(0, 0, 0, 0);
      if (tglTarget > tglSekarang) {
        const diffTime = Math.abs(tglTarget - tglSekarang);
        const diffMonths = Math.ceil(
          diffTime / (1000 * 60 * 60 * 24 * 30.4375)
        );
        if (diffMonths > 0) {
          const sisaTarget =
            targetNabungData.targetNominal - targetNabungData.terkumpul;
          const rekomendasi = sisaTarget / diffMonths;
          rekomendasiNabungEl.textContent = formatRupiah(
            rekomendasi > 0 ? rekomendasi : 0
          );
        } else {
          rekomendasiNabungEl.textContent = "Target dekat";
        }
      } else {
        rekomendasiNabungEl.textContent = "Target lewat";
      }
    } else if (
      targetNabungData.targetNominal > 0 &&
      targetNabungData.terkumpul >= targetNabungData.targetNominal
    ) {
      rekomendasiNabungEl.textContent = "Target Tercapai!";
    } else {
      rekomendasiNabungEl.textContent = "Atur tanggal";
    }
  }
  function renderDashboardTransactions() {
    if (!listTransaksiDashboardEl) return;
    listTransaksiDashboardEl.innerHTML = "";
    const recentTransactions = transactions.slice(0, 5);
    if (recentTransactions.length === 0) {
      listTransaksiDashboardEl.innerHTML =
        "<li>Tidak ada transaksi terbaru.</li>";
      return;
    }
    recentTransactions.forEach((t) => {
      const li = document.createElement("li");
      const sign = t.jenis === "pemasukan" ? "+" : "-";
      li.innerHTML = `<span class="desc">${
        t.deskripsi
      }</span> <span class="amount ${t.jenis}">${sign} ${formatRupiah(
        Math.abs(t.nominal)
      )}</span>`;
      listTransaksiDashboardEl.appendChild(li);
    });
  }
  function populateFilterOptions(selectEl, type) {
    if (!selectEl) return;
    const currentVal = selectEl.value;
    selectEl.innerHTML = `<option value="">${
      type === "year" ? "Semua Tahun" : "Semua Bulan"
    }</option>`;
    if (type === "year") {
      const uniqueYears = [
        ...new Set(transactions.map((t) => new Date(t.tanggal).getFullYear())),
      ].sort((a, b) => b - a);
      uniqueYears.forEach((year) => selectEl.add(new Option(year, year)));
    } else if (type === "month") {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      months.forEach((month, index) =>
        selectEl.add(new Option(month, String(index + 1).padStart(2, "0")))
      );
    }
    if (selectEl.querySelector(`option[value="${currentVal}"]`)) {
      selectEl.value = currentVal;
    } else {
      selectEl.value = "";
    }
  }
  function filterAndRenderTransactions() {
    if (!listItemTransaksiEl || !filterBulanEl || !filterTahunEl) return;
    const selectedMonth = filterBulanEl.value;
    const selectedYear = filterTahunEl.value;
    let filtered = transactions;
    if (selectedYear)
      filtered = filtered.filter(
        (t) => new Date(t.tanggal).getFullYear() == selectedYear
      );
    if (selectedMonth)
      filtered = filtered.filter(
        (t) => new Date(t.tanggal).getMonth() + 1 == parseInt(selectedMonth)
      );
    renderTransactionsList(filtered);
  }
  function renderTransactionsList(filteredTransactions = transactions) {
    if (!listItemTransaksiEl) return;
    listItemTransaksiEl.innerHTML = "";
    if (filteredTransactions.length === 0) {
      listItemTransaksiEl.innerHTML =
        '<li style="text-align:center; color: var(--light-text-color);">Tidak ada transaksi untuk filter ini.</li>';
      return;
    }
    filteredTransactions.forEach((t) => {
      const item = document.createElement("li");
      item.classList.add(t.jenis);
      const sign = t.jenis === "pemasukan" ? "+" : "-";
      const formattedDate = new Date(t.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      item.innerHTML = `<span class="deskripsi-item">${t.deskripsi}</span>${
        t.kategori ? `<span class="kategori-item">${t.kategori}</span>` : ""
      }<span class="tanggal-item">${formattedDate}</span><span class="jumlah-item">${sign} ${formatRupiah(
        Math.abs(t.nominal)
      )}</span><div class="aksi-item"><button class="edit-btn-item" data-id="${
        t.id
      }" title="Edit"><i class="fas fa-edit"></i></button><button class="hapus-btn-item" data-id="${
        t.id
      }" title="Hapus"><i class="fas fa-trash-alt"></i></button></div>`;
      listItemTransaksiEl.appendChild(item);
    });
  }
  function populateStatistikFilters() {
    if (!statsKategoriTahunEl || !statsKategoriBulanEl || !statsTrenTahunEl)
      return;
    const uniqueYears = [
      ...new Set(transactions.map((t) => new Date(t.tanggal).getFullYear())),
    ].sort((a, b) => b - a);
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const prevKatTahunVal = statsKategoriTahunEl.value;
    statsKategoriTahunEl.innerHTML = '<option value="">Tahun Ini</option>';
    uniqueYears.forEach((year) =>
      statsKategoriTahunEl.add(new Option(year, year))
    );
    statsKategoriTahunEl.value =
      prevKatTahunVal && uniqueYears.includes(parseInt(prevKatTahunVal))
        ? prevKatTahunVal
        : uniqueYears.includes(currentYear)
        ? currentYear.toString()
        : uniqueYears[0]
        ? uniqueYears[0].toString()
        : "";
    const prevKatBulanVal = statsKategoriBulanEl.value;
    statsKategoriBulanEl.innerHTML = '<option value="">Semua Bulan</option>';
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    months.forEach((month, index) =>
      statsKategoriBulanEl.add(
        new Option(month, String(index + 1).padStart(2, "0"))
      )
    );
    if (
      prevKatBulanVal &&
      statsKategoriBulanEl.querySelector(`option[value="${prevKatBulanVal}"]`)
    ) {
      statsKategoriBulanEl.value = prevKatBulanVal;
    } else if (parseInt(statsKategoriTahunEl.value) === currentYear) {
      statsKategoriBulanEl.value = currentMonth;
    } else {
      statsKategoriBulanEl.value = "";
    }
    const prevTrenTahunVal = statsTrenTahunEl.value;
    statsTrenTahunEl.innerHTML = '<option value="">Tahun Ini</option>';
    uniqueYears.forEach((year) => statsTrenTahunEl.add(new Option(year, year)));
    statsTrenTahunEl.value =
      prevTrenTahunVal && uniqueYears.includes(parseInt(prevTrenTahunVal))
        ? prevTrenTahunVal
        : uniqueYears.includes(currentYear)
        ? currentYear.toString()
        : uniqueYears[0]
        ? uniqueYears[0].toString()
        : "";
  }
  function getCategorySpendingData() {
    if (!statsKategoriBulanEl || !statsKategoriTahunEl)
      return { labels: [], data: [] };
    let selectedMonth = statsKategoriBulanEl.value;
    let selectedYear =
      parseInt(statsKategoriTahunEl.value) || new Date().getFullYear();
    const categorySpending = {};
    transactions
      .filter((t) => {
        const tDate = new Date(t.tanggal);
        return (
          t.jenis === "pengeluaran" &&
          tDate.getFullYear() === selectedYear &&
          (selectedMonth === "" ||
            tDate.getMonth() + 1 == parseInt(selectedMonth))
        );
      })
      .forEach((t) => {
        const kategori = t.kategori || "Lainnya";
        categorySpending[kategori] =
          (categorySpending[kategori] || 0) + Math.abs(t.nominal);
      });
    return {
      labels: Object.keys(categorySpending).sort(),
      data: Object.keys(categorySpending)
        .sort()
        .map((key) => categorySpending[key]),
    };
  }
  function renderKategoriChart() {
    const { labels, data } = getCategorySpendingData();
    const totalSpendingForPeriod = data.reduce((sum, value) => sum + value, 0);
    if (kategoriChartInstance) kategoriChartInstance.destroy();
    kategoriChartInstance = new Chart(kategoriChartCtx, {
      type: "doughnut",
      data: {
        labels: labels.length > 0 ? labels : ["Tidak Ada Pengeluaran"],
        datasets: [
          {
            label: "Pengeluaran per Kategori",
            data: data.length > 0 ? data : [1],
            backgroundColor:
              labels.length > 0
                ? [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#E7E9ED",
                    "#83D47E",
                    "#FFD700",
                    "#B0E0E6",
                    "#FFA07A",
                    "#20B2AA",
                  ].slice(0, labels.length)
                : ["#E0E0E0"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) label += ": ";
                const value = context.raw;
                if (value !== null && totalSpendingForPeriod > 0) {
                  const percentage = (
                    (value / totalSpendingForPeriod) *
                    100
                  ).toFixed(1);
                  label += formatRupiah(value) + ` (${percentage}%)`;
                } else if (value !== null) label += formatRupiah(value);
                return label;
              },
            },
          },
        },
      },
    });
  }
  function getMonthlyTrendData() {
    if (!statsTrenTahunEl)
      return { labels: [], pemasukan: [], pengeluaran: [] };
    const selectedYear =
      parseInt(statsTrenTahunEl.value) || new Date().getFullYear();
    const trendData = { labels: [], pemasukan: [], pengeluaran: [] };
    const monthlyAggregates = {};
    for (let i = 0; i < 12; i++) {
      const monthStr = String(i + 1).padStart(2, "0");
      const monthYearKey = `${selectedYear}-${monthStr}`;
      monthlyAggregates[monthYearKey] = { pemasukan: 0, pengeluaran: 0 };
      const dateForLabel = new Date(selectedYear, i, 1);
      trendData.labels.push(
        dateForLabel.toLocaleDateString("id-ID", { month: "short" })
      );
    }
    transactions
      .filter((t) => new Date(t.tanggal).getFullYear() === selectedYear)
      .forEach((t) => {
        const monthYear = t.tanggal.substring(0, 7);
        if (monthlyAggregates[monthYear]) {
          if (t.jenis === "pemasukan")
            monthlyAggregates[monthYear].pemasukan += t.nominal;
          else monthlyAggregates[monthYear].pengeluaran += Math.abs(t.nominal);
        }
      });
    for (let i = 0; i < 12; i++) {
      const monthStr = String(i + 1).padStart(2, "0");
      const monthYearKey = `${selectedYear}-${monthStr}`;
      trendData.pemasukan.push(monthlyAggregates[monthYearKey].pemasukan);
      trendData.pengeluaran.push(monthlyAggregates[monthYearKey].pengeluaran);
    }
    return trendData;
  }
  function renderTrenChart() {
    const { labels, pemasukan, pengeluaran } = getMonthlyTrendData();
    if (trenChartInstance) trenChartInstance.destroy();
    trenChartInstance = new Chart(trenChartCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pemasukan",
            data: pemasukan,
            borderColor: "var(--success-color)",
            backgroundColor: "rgba(40, 167, 69, 0.1)",
            fill: true,
            tension: 0.1,
          },
          {
            label: "Pengeluaran",
            data: pengeluaran,
            borderColor: "var(--danger-color)",
            backgroundColor: "rgba(220, 53, 69, 0.1)",
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: "top" } },
      },
    });
  }

  function updateUI() {
    saveData();
    updateSaldoDisplay();
    updateLimitDisplay();
    updateNabungDisplay();
    renderDashboardTransactions();
    renderBudgetProgress(listAnggaranDashboardEl);

    populateAllCategoryDropdowns();

    if (filterBulanEl && filterTahunEl) {
      populateFilterOptions(filterBulanEl, "month");
      populateFilterOptions(filterTahunEl, "year");
      filterAndRenderTransactions();
    }
    const activePage = document.querySelector(".page-section.active");
    if (activePage) {
      if (activePage.id === "statistik") {
        populateStatistikFilters();
        renderKategoriChart();
        renderTrenChart();
      }
      if (activePage.id === "anggaran") {
        renderBudgetList();
        renderBudgetProgress();
      }
    }
  }

  // --- Event Listeners ---
  if (formTransaksi)
    formTransaksi.addEventListener("submit", (e) => {
      e.preventDefault();
      let kategoriFinal = kategoriSelectEl.value;
      if (kategoriFinal === "add_new_category") {
        const newCatName = inputKategoriBaruEl.value.trim();
        if (!newCatName) {
          showNotification("Nama kategori baru tidak boleh kosong.", "error");
          return;
        }
        const addedCat = addCategory(newCatName);
        if (addedCat) {
          kategoriFinal = addedCat;
          kategoriSelectEl.value = addedCat;
        } else return;
      } else if (!kategoriFinal) {
        showNotification(
          "Mohon pilih kategori atau tambahkan yang baru.",
          "error"
        );
        return;
      }
      if (
        !inputDeskripsi.value ||
        !inputNominal.value ||
        !inputTanggalTransaksi.value
      ) {
        showNotification(
          "Deskripsi, Nominal, dan Tanggal wajib diisi!",
          "error"
        );
        return;
      }
      addTransaction(
        inputDeskripsi.value,
        inputNominal.value,
        inputJenisTransaksi.value,
        kategoriFinal,
        inputTanggalTransaksi.value
      );
      formTransaksi.reset();
      if (inputTanggalTransaksi) inputTanggalTransaksi.value = todayString;
      if (inputDeskripsi) inputDeskripsi.focus();
      populateCategoryDropdown(kategoriSelectEl);
      if (inputKategoriBaruEl) {
        inputKategoriBaruEl.style.display = "none";
        inputKategoriBaruEl.value = "";
      }
    });

  if (listItemTransaksiEl)
    listItemTransaksiEl.addEventListener("click", (e) => {
      const targetButton = e.target.closest("button");
      if (!targetButton) return;
      const id = targetButton.dataset.id;
      if (targetButton.classList.contains("hapus-btn-item")) {
        const transaction = transactions.find((t) => t.id === id);
        if (transaction)
          openConfirmModal(
            "Konfirmasi Hapus",
            `Yakin hapus "${transaction.deskripsi}"?`,
            () => removeTransaction(id)
          );
      } else if (targetButton.classList.contains("edit-btn-item")) {
        const transactionToEdit = transactions.find((t) => t.id === id);
        if (transactionToEdit) openEditModal(transactionToEdit);
      }
    });

  if (formEditTransaksi)
    formEditTransaksi.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = editTransaksiIdEl.value;
      let kategoriFinal = editKategoriSelectEl.value;
      if (kategoriFinal === "add_new_category") {
        const newCatName = editKategoriBaruEl.value.trim();
        if (!newCatName) {
          showNotification("Nama kategori baru tidak boleh kosong.", "error");
          return;
        }
        const addedCat = addCategory(newCatName);
        if (addedCat) {
          kategoriFinal = addedCat;
          editKategoriSelectEl.value = addedCat;
        } else return;
      } else if (!kategoriFinal) {
        showNotification(
          "Mohon pilih kategori atau tambahkan yang baru.",
          "error"
        );
        return;
      }
      if (
        !editDeskripsiEl.value ||
        !editNominalEl.value ||
        !editTanggalTransaksiEl.value
      ) {
        showNotification("Semua field pada form edit wajib diisi!", "error");
        return;
      }
      const updatedData = {
        deskripsi: editDeskripsiEl.value,
        nominal:
          editJenisTransaksiEl.value === "pemasukan"
            ? parseFloat(editNominalEl.value)
            : -parseFloat(editNominalEl.value),
        jenis: editJenisTransaksiEl.value,
        kategori: kategoriFinal,
        tanggal: editTanggalTransaksiEl.value,
      };
      updateTransaction(id, updatedData);
      closeEditModal();
    });

  if (formLimit)
    formLimit.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!inputLimitNominal) {
        showNotification("Error: Elemen input limit tidak ditemukan.", "error");
        return;
      }
      const nominal = parseFloat(inputLimitNominal.value);
      if (isNaN(nominal) || nominal < 0) {
        showNotification("Masukkan nominal limit yang valid.", "error");
        return;
      }
      limitData.nominal = nominal;
      updateUI();
      showNotification("Limit pengeluaran bulanan berhasil diatur.", "success");
    });
  if (formTargetNabung)
    formTargetNabung.addEventListener("submit", (e) => {
      e.preventDefault();
      if (
        !inputTargetNabungJudulEl ||
        !inputTargetNabungNominal ||
        !inputTargetNabungTanggal
      ) {
        showNotification(
          "Error: Elemen input target nabung tidak ditemukan.",
          "error"
        );
        return;
      }
      const judul = inputTargetNabungJudulEl.value.trim() || "Target Menabung";
      const target = parseFloat(inputTargetNabungNominal.value);
      const tanggal = inputTargetNabungTanggal.value;
      if (isNaN(target) || target <= 0) {
        showNotification("Nominal target menabung valid harus diisi.", "error");
        return;
      }
      targetNabungData.judul = judul;
      targetNabungData.targetNominal = target;
      targetNabungData.targetTanggal = tanggal;
      updateUI();
      showNotification("Target menabung berhasil diatur.", "success");
    });
  if (btnCatatGaji)
    btnCatatGaji.addEventListener("click", () => {
      if (!inputGajiDeskripsi || !inputGajiNominal) {
        showNotification("Error: Elemen input gaji tidak ditemukan.", "error");
        return;
      }
      const deskripsi = inputGajiDeskripsi.value.trim();
      const nominal = parseFloat(inputGajiNominal.value);
      if (!deskripsi || isNaN(nominal) || nominal <= 0) {
        showNotification(
          "Deskripsi dan nominal gaji valid harus diisi.",
          "error"
        );
        return;
      }
      gajiData.deskripsi = deskripsi;
      gajiData.nominal = nominal;
      const today = new Date();
      const tanggalGaji = today.toISOString().split("T")[0];
      const currentMonthYear = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}`;
      const sudahDicatat = transactions.some(
        (t) =>
          t.deskripsi.toLowerCase() === deskripsi.toLowerCase() &&
          t.kategori.toLowerCase() === "gaji" &&
          t.tanggal.startsWith(currentMonthYear) &&
          t.nominal === nominal
      );
      if (sudahDicatat) {
        openConfirmModal(
          "Konfirmasi Catat Gaji",
          `Gaji "${deskripsi}" (${formatRupiah(
            nominal
          )}) sepertinya sudah dicatat bulan ini. Tetap catat lagi?`,
          () =>
            addTransaction(deskripsi, nominal, "pemasukan", "Gaji", tanggalGaji)
        );
      } else {
        addTransaction(deskripsi, nominal, "pemasukan", "Gaji", tanggalGaji);
      }
    });

  if (filterBulanEl)
    filterBulanEl.addEventListener("change", filterAndRenderTransactions);
  if (filterTahunEl)
    filterTahunEl.addEventListener("change", filterAndRenderTransactions);
  if (resetFilterBtn)
    resetFilterBtn.addEventListener("click", () => {
      if (filterBulanEl) filterBulanEl.value = "";
      if (filterTahunEl) filterTahunEl.value = "";
      renderTransactionsList(transactions);
    });
  if (statsKategoriBulanEl)
    statsKategoriBulanEl.addEventListener("change", renderKategoriChart);
  if (statsKategoriTahunEl)
    statsKategoriTahunEl.addEventListener("change", () => {
      const currentYear = new Date().getFullYear();
      const selectedKatTahun = parseInt(statsKategoriTahunEl.value);
      if (selectedKatTahun === currentYear)
        statsKategoriBulanEl.value = String(new Date().getMonth() + 1).padStart(
          2,
          "0"
        );
      else statsKategoriBulanEl.value = "";
      renderKategoriChart();
    });
  if (statsTrenTahunEl)
    statsTrenTahunEl.addEventListener("change", renderTrenChart);
  if (exportCsvBtn)
    exportCsvBtn.addEventListener("click", exportTransactionsToCSV);

  if (formAnggaran) {
    formAnggaran.addEventListener("submit", (e) => {
      e.preventDefault();
      let kategoriFinal = anggaranKategoriSelectEl.value;
      if (kategoriFinal === "add_new_category") {
        const newCatName = inputAnggaranKategoriBaruEl.value.trim();
        if (!newCatName) {
          showNotification("Nama kategori baru tidak boleh kosong.", "error");
          return;
        }
        const addedCat = addCategory(newCatName);
        if (addedCat) {
          kategoriFinal = addedCat;
          anggaranKategoriSelectEl.value = addedCat;
        } else return;
      } else if (!kategoriFinal) {
        showNotification(
          "Mohon pilih kategori atau tambahkan yang baru.",
          "error"
        );
        return;
      }
      addOrUpdateBudget(kategoriFinal, inputAnggaranNominal.value);
      formAnggaran.reset();
      if (inputAnggaranKategoriBaruEl) {
        inputAnggaranKategoriBaruEl.style.display = "none";
        inputAnggaranKategoriBaruEl.value = "";
      }
      populateCategoryDropdown(anggaranKategoriSelectEl);
    });
  }
  if (listItemAnggaranEl) {
    listItemAnggaranEl.addEventListener("click", (e) => {
      if (e.target.closest(".delete-anggaran-btn")) {
        const kategori = e.target.closest(".delete-anggaran-btn").dataset
          .kategori;
        openConfirmModal(
          "Konfirmasi Hapus Anggaran",
          `Yakin hapus anggaran untuk "${kategori}"?`,
          () => removeBudget(kategori)
        );
      }
    });
  }

  if (kategoriSelectEl)
    kategoriSelectEl.addEventListener("change", () =>
      handleCategorySelection(kategoriSelectEl, inputKategoriBaruEl)
    );
  if (anggaranKategoriSelectEl)
    anggaranKategoriSelectEl.addEventListener("change", () =>
      handleCategorySelection(
        anggaranKategoriSelectEl,
        inputAnggaranKategoriBaruEl
      )
    );
  if (editKategoriSelectEl)
    editKategoriSelectEl.addEventListener("change", () =>
      handleCategorySelection(editKategoriSelectEl, editKategoriBaruEl)
    );

  if (addToSavingsBtn) {
    addToSavingsBtn.addEventListener("click", () => {
      if (!manualSavingAmountEl) return;
      const amount = parseFloat(manualSavingAmountEl.value);
      addManualSaving(amount);
      manualSavingAmountEl.value = "";
    });
  }
  if (subtractFromSavingsBtn) {
    subtractFromSavingsBtn.addEventListener("click", () => {
      if (!manualSavingAmountEl) return;
      const amount = parseFloat(manualSavingAmountEl.value);
      subtractManualSaving(amount);
      manualSavingAmountEl.value = "";
    });
  }

  // --- Initial Load ---
  function loadInitialData() {
    if (inputLimitNominal)
      inputLimitNominal.value = limitData.nominal > 0 ? limitData.nominal : "";
    if (inputTargetNabungJudulEl)
      inputTargetNabungJudulEl.value =
        targetNabungData.judul || "Target Menabung";
    if (inputTargetNabungNominal)
      inputTargetNabungNominal.value =
        targetNabungData.targetNominal > 0
          ? targetNabungData.targetNominal
          : "";
    if (inputTargetNabungTanggal && targetNabungData.targetTanggal)
      inputTargetNabungTanggal.value = targetNabungData.targetTanggal;
    if (inputGajiDeskripsi)
      inputGajiDeskripsi.value = gajiData.deskripsi || "Gaji Pokok";
    if (inputGajiNominal)
      inputGajiNominal.value = gajiData.nominal > 0 ? gajiData.nominal : "";

    sortTransactionsByDate();
    populateAllCategoryDropdowns();
    updateUI();
    switchPage("dashboard");
  }
  loadInitialData();
});
