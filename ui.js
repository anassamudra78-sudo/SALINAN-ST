// ==========================================================
// BAGIAN 1: NAVIGASI, UI DASAR, DASHBOARD & MASTER DATA (CRUD)
// ==========================================================

function updateUI() {
    const elTa = document.getElementById('sidebar-tahun-ajaran');
    if(elTa) elTa.innerText = `TA: ${AppState.db.sekolah.tahunAjaran || '-'} ${AppState.db.sekolah.semester || '-'}`;
    renderNavigation();
    renderContent(AppState.ui.activeTab);
}

function switchTab(tabId) {
    AppState.ui.activeTab = tabId;
    AppState.ui.editingId = null;
    if (AppState.ui.dashboardClockInterval) clearInterval(AppState.ui.dashboardClockInterval);
    const tabInfo = menuItems.find(m => m.id === tabId);
    if(tabInfo) {
        document.getElementById('page-title').innerText = tabInfo.title;
        document.getElementById('page-subtitle').innerText = tabInfo.sub;
    }

    // Collapsible Sidebar khusus Kuis
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar && menuBtn) {
        if (tabId === 'kuis') {
            sidebar.classList.remove('md:flex');
            menuBtn.classList.remove('md:hidden');
        } else {
            sidebar.classList.add('md:flex');
            menuBtn.classList.add('md:hidden');
        }
    }

    toggleMobileMenu(true);
    updateUI();
}

function renderNavigation() {
    let htmlContent = '';
    menuGroups.forEach((groupObj, idx) => {
        htmlContent += `
            <div class="${idx > 0 ? 'mt-4 pt-3 border-t border-slate-800/60' : ''}">
                <p class="px-3 pb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">${groupObj.group}</p>
                <div class="space-y-1">
        `;

        groupObj.items.forEach(item => {
            const isActive = AppState.ui.activeTab === item.id;
            const activeClass = isActive 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 font-bold' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white';
            
            let extraColor = '';
            if (!isActive) {
                if (item.id === 'ai') extraColor = 'text-purple-400';
                if (item.id === 'kuis') extraColor = 'text-amber-400';
                if (item.id === 'jadwal') extraColor = 'text-cyan-400';
                if (item.id === 'presentation_studio') extraColor = 'text-emerald-500';
            }
            htmlContent += `
                <button onclick="switchTab('${item.id}')" class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${activeClass}">
                    <div class="w-5 flex justify-center ${extraColor}"><i class="fa-solid ${item.icon}"></i></div>
                    <span class="text-xs lg:text-sm font-semibold">${item.title}</span>
                </button>
            `;
        });

        htmlContent += `
                </div>
            </div>
        `;
    });

    const menuEl = document.getElementById('sidebar-menu');
    const mobileEl = document.getElementById('mobile-menu-list');
    if(menuEl) menuEl.innerHTML = htmlContent;
    if(mobileEl) mobileEl.innerHTML = htmlContent;
}

function toggleMobileMenu(forceClose = false) {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (forceClose || !drawer.classList.contains('-translate-x-full')) {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    } else {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    }
}

function showAlert(title, message, type = "info") {
    const modal = document.getElementById('notification-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    
    const icon = document.getElementById('modal-icon');
    if (type === "success") {
        icon.className = "w-16 h-16 rounded-2xl bg-brand-50 dark:bg-emerald-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-5 text-3xl";
        icon.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
    } else {
        icon.className = "w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 text-3xl";
        icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    }
    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('notification-modal').classList.add('hidden'); }

function closeImportModal() { 
    document.getElementById('import-modal').classList.add('hidden'); 
    document.getElementById('import-textarea').value = '';
    document.getElementById('import-excel-file').value = '';
    document.getElementById('import-file-name').classList.add('hidden');
    AppState.ui.selectedExcelData = null;
}

function switchImportTab(mode) {
    AppState.ui.importMode = mode;
    const btnFile = document.getElementById('tab-btn-file');
    const btnPaste = document.getElementById('tab-btn-paste');
    const areaFile = document.getElementById('import-area-file');
    const areaPaste = document.getElementById('import-area-paste');

    if (mode === 'file') {
        btnFile.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm";
        btnPaste.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white";
        areaFile.classList.remove('hidden');
        areaPaste.classList.add('hidden');
    } else {
        btnPaste.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm";
        btnFile.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white";
        areaPaste.classList.remove('hidden');
        areaFile.classList.add('hidden');
    }
}

function openImportModal(type) {
    document.getElementById('import-type-hidden').value = type;
    const config = crudConfig[type];
    document.getElementById('import-modal-title').innerText = `Impor Data ${config.title}`;
    
    const formatStr = config.fields.map(f => `[${f.label}]`).join(' | ');
    document.getElementById('import-format-info').innerText = `Format Kolom: ${formatStr}`;
    
    switchImportTab('file');
    document.getElementById('import-modal').classList.remove('hidden');
}

function downloadImportTemplate() {
    const type = document.getElementById('import-type-hidden').value;
    const config = crudConfig[type];
    if (!config) return;

    const headers = config.fields.map(f => f.label);
    let sampleRow = [];

    if (type === 'siswa') {
        sampleRow = ['1001', 'Ahmad Fauzi', 'L', 'X-A'];
    } else if (type === 'guru') {
        sampleRow = ['198501012010011001', 'Budi Santoso, S.Pd.', 'Matematika'];
    } else if (type === 'kelas') {
        sampleRow = ['X-A', '10', 'Dra. Siti Aminah'];
    } else if (type === 'mapel') {
        sampleRow = ['MTK', 'Matematika'];
    } else if (type === 'jadwal') {
        sampleRow = ['Senin', '2026-10-20', '07:00', '08:30', 'X-A', 'Matematika', 'Ruang Lab 1'];
    } else if (type === 'jurnal') {
        sampleRow = ['2026-10-20', 'X-A', 'Matematika', 'Persamaan Kuadrat'];
    } else {
        sampleRow = config.fields.map((_, i) => `Contoh_${i+1}`);
    }

    const dataToExport = [headers, sampleRow];
    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Template_${config.title}`);

    XLSX.writeFile(workbook, `Template_Impor_${config.title}_SmartTeacher.xlsx`);
}

function handleExcelFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const nameDiv = document.getElementById('import-file-name');
    nameDiv.innerText = `File Terpilih: ${file.name}`;
    nameDiv.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            AppState.ui.selectedExcelData = jsonRows;
        } catch (err) {
            showAlert("Error", "Gagal membaca file Excel: " + err.message, "error");
            AppState.ui.selectedExcelData = null;
        }
    };
    reader.readAsArrayBuffer(file);
}

function processImport() {
    const type = document.getElementById('import-type-hidden').value;
    const config = crudConfig[type];
    if (!AppState.db[type]) AppState.db[type] = [];

    let successCount = 0;

    if (AppState.ui.importMode === 'file') {
        const rows = AppState.ui.selectedExcelData;
        if (!rows || rows.length <= 1) {
            return showAlert("Peringatan", "Harap pilih file Excel yang berisi data!", "error");
        }

        for (let i = 1; i < rows.length; i++) {
            let cols = rows[i];
            if (!cols || cols.length === 0) continue;

            let newItem = { id: generateId() };
            let isValid = false;

            config.fields.forEach((f, index) => {
                // PERBAIKAN: Gunakan index langsung, meluruskan data NIS tanpa digeser
                let val = cols[index] !== undefined && cols[index] !== null ? String(cols[index]).trim() : '';
                if (val !== '') isValid = true;

                if (f.type === 'dynamicSelect' && val !== '') {
                    let ref = (AppState.db[f.source] || []).find(r => 
                        String(r[f.displayField]).trim().toLowerCase() === val.toLowerCase()
                    );
                    newItem[f.id] = ref ? ref.id : val;
                } else {
                    newItem[f.id] = val;
                }
            });

            if (isValid) {
                AppState.db[type].push(newItem);
                successCount++;
            }
        }

    } else {
        const text = document.getElementById('import-textarea').value.trim();
        if (!text) return showAlert("Error", "Teks data masih kosong!", "error");

        let lines = text.split('\n');
        lines.forEach(line => {
            let cols = line.includes('\t') ? line.split('\t') : line.split(',');

            if (cols.length >= 1 && cols[0].trim() !== '') {
                let newItem = { id: generateId() };
                let isValid = false;

                config.fields.forEach((f, index) => {
                    // PERBAIKAN: Gunakan index langsung untuk mode paste text
                    let val = cols[index] ? cols[index].trim().replace(/^"|"$/g, '') : '';
                    if (val !== '') isValid = true;
                    if (f.type === 'dynamicSelect' && val !== '') {
                        let ref = (AppState.db[f.source] || []).find(r => 
                            String(r[f.displayField]).trim().toLowerCase() === val.toLowerCase()
                        );
                        newItem[f.id] = ref ? ref.id : val;
                    } else {
                        newItem[f.id] = val;
                    }
                });

                if (isValid) {
                    AppState.db[type].push(newItem);
                    successCount++;
                }
            }
        });
    }

    if (successCount > 0) {
        saveDatabase();
        closeImportModal();
        showAlert("Berhasil", `${successCount} baris data berhasil diimpor!`, "success");
        renderContent(type);
    } else {
        showAlert("Gagal", "Tidak ada baris data valid yang dapat diimpor.", "error");
    }
}

function renderContent(tabId) {
    const container = document.getElementById('main-content');
    container.innerHTML = ''; 
    container.classList.remove('fade-in');
    void container.offsetWidth; 
    container.classList.add('fade-in');

    if (tabId === 'dashboard') renderDashboard(container);
    else if (tabId === 'sekolah') renderSekolah(container);
    else if (['guru', 'kelas', 'siswa', 'mapel', 'jadwal', 'jurnal'].includes(tabId)) renderCRUD(container, tabId);
    else if (tabId === 'penilaian') renderPenilaian(container);
    else if (tabId === 'rekap_nilai') renderRekapNilai(container);
    else if (tabId === 'absensi') renderAbsensi(container);
    else if (tabId === 'rapor') renderRapor(container);
    else if (tabId === 'kuis') renderKuisPage(container);
    else if (tabId === 'ai') renderAI(container);
    else if (tabId === 'presentation_studio') renderPresentationStudio(container);
    else if (tabId === 'pengaturan') renderPengaturan(container);
}

function renderDashboard(container) {
    const statCard = (title, count, icon, bgBoxClass, textIconClass, targetTab) => `
        <div onclick="switchTab('${targetTab}')" class="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none hover:-translate-y-1 hover:border-brand-500/40 transition-all flex items-center justify-between group">
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-brand-500 transition-colors">${title}</p>
                <h4 class="text-3xl font-black text-slate-800 dark:text-white mt-0.5">${count}</h4>
            </div>
            <div class="w-11 h-11 rounded-2xl ${bgBoxClass} ${textIconClass} flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                <i class="fa-solid ${icon}"></i>
            </div>
        </div>`;

    const namaHariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const hariIni = namaHariList[now.getDay()];
    const tanggalISO = now.toISOString().split('T')[0];
    const tanggalIndo = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    const jamSekarang = now.toTimeString().slice(0, 5);

    const jadwalHariIni = (AppState.db.jadwal || []).filter(j => {
        const cocokHari = j.hari && j.hari.toLowerCase() === hariIni.toLowerCase();
        const cocokTanggal = !j.tanggal || j.tanggal === '' || j.tanggal === tanggalISO;
        const khususTanggalHariIni = j.tanggal === tanggalISO;
        return (cocokHari && cocokTanggal) || khususTanggalHariIni;
    }).sort((a, b) => (a.jamMulai || '').localeCompare(b.jamMulai || ''));

    let jadwalCompactContent = '';
    if (jadwalHariIni.length === 0) {
        jadwalCompactContent = `
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 italic">
                <i class="fa-regular fa-calendar-check mr-2 text-slate-400"></i>
                <span>Belum ada jadwal mengajar hari ${hariIni} ini.</span>
            </div>
        `;
    } else {
        jadwalCompactContent = `<div class="flex items-center space-x-2.5 overflow-x-auto py-0.5 custom-scrollbar">` + jadwalHariIni.map(j => {
            const refKelas = AppState.db.kelas.find(k => k.id === j.kelasId);
            const namaKelas = refKelas ? refKelas.kode : (j.kelasId || '-');
            const refMapel = AppState.db.mapel.find(m => m.id === j.mapelId);
            const namaMapel = refMapel ? refMapel.nama : (j.mapelId || '-');

            const mulai = j.jamMulai || '00:00';
            const selesai = j.jamSelesai || '23:59';

            let pillStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
            let dotHtml = `<span class="w-2 h-2 rounded-full bg-amber-400 mr-2 shrink-0"></span>`;

            if (jamSekarang >= mulai && jamSekarang <= selesai) {
                pillStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30';
                dotHtml = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2 shrink-0"></span>`;
            } else if (jamSekarang > selesai) {
                pillStyle = 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 opacity-70';
                dotHtml = `<i class="fa-solid fa-check text-[10px] text-slate-400 mr-1.5"></i>`;
            }

            return `
                <div onclick="bukaPintasanKelas('absensi', '${j.kelasId}')" title="Klik untuk Absensi Kelas ${namaKelas}" class="cursor-pointer shrink-0 flex items-center px-3.5 py-2 rounded-xl border text-xs transition-all hover:scale-[1.02] ${pillStyle}">
                    ${dotHtml}
                    <span class="font-mono font-black mr-2">${mulai}-${selesai}</span>
                    <span class="font-bold mr-1.5">${namaMapel}</span>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10">${namaKelas}</span>
                </div>
            `;
        }).join('') + `</div>`;
    }

    container.innerHTML = `
        <div class="space-y-5">
            <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 lg:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
                <div class="z-10 text-center md:text-left">
                    <span class="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Integrated Workspace v3.0</span>
                    <h3 class="text-2xl lg:text-3xl font-black mt-2 mb-1.5">Selamat Datang di Smart Teacher</h3>
                    <p class="text-slate-300 text-xs lg:text-sm max-w-md">Kelola administrasi akademik, jadwal mengajar harian, dan mainkan kuis interaktif dengan Panggung Podium Top 3!</p>
                </div>
                <div class="mt-4 md:mt-0 z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center border border-white/10 shadow-xl shrink-0">
                    <p class="text-[10px] text-brand-300 uppercase tracking-widest font-bold mb-0.5">Tahun Ajaran Aktif</p>
                    <p class="text-xl lg:text-2xl font-black text-white">${AppState.db.sekolah.tahunAjaran}</p>
                    <p class="text-[11px] bg-brand-500/80 text-white font-semibold rounded-lg mt-1 py-0.5 px-3 inline-block">${AppState.db.sekolah.semester}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${statCard('Total Siswa', AppState.db.siswa.length, 'fa-users', 'bg-emerald-50 dark:bg-emerald-950/80', 'text-emerald-500', 'siswa')}
                ${statCard('Total Kelas', AppState.db.kelas.length, 'fa-door-open', 'bg-amber-50 dark:bg-amber-950/80', 'text-amber-500', 'kelas')}
                ${statCard('Mata Pelajaran', AppState.db.mapel.length, 'fa-book', 'bg-blue-50 dark:bg-blue-950/80', 'text-blue-500', 'mapel')}
                ${statCard('Bank Soal Kuis', AppState.kuis.bankSoalManual.length, 'fa-gamepad', 'bg-purple-50 dark:bg-purple-950/80', 'text-purple-500', 'kuis')}
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-2xl px-5 py-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div class="flex items-center space-x-3 shrink-0">
                    <div class="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
                        <i class="fa-solid fa-bell text-sm animate-bounce"></i>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Jadwal Hari Ini</h4>
                            <span class="text-[11px] text-cyan-500 font-semibold">• ${tanggalIndo}</span>
                        </div>
                        <p class="text-[11px] text-slate-400">Pengingat jam mengajar otomatis</p>
                    </div>
                </div>

                <div class="flex-1 lg:mx-4 overflow-hidden">
                    ${jadwalCompactContent}
                </div>

                <div class="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                    <div class="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
                        <i class="fa-regular fa-clock text-cyan-500 text-[11px]"></i>
                        <span id="live-dashboard-clock" class="text-xs font-mono font-black text-slate-700 dark:text-slate-200">${now.toTimeString().slice(0,8)}</span>
                    </div>
                    <button onclick="switchTab('jadwal')" class="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center">
                        <i class="fa-solid fa-plus mr-1.5"></i> Atur Jadwal
                    </button>
                </div>
            </div>

            <div class="bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl shrink-0">
                        <i class="fa-solid fa-network-wired"></i>
                    </div>
                    <div>
                        <h4 class="text-base font-bold text-white">Smart Gateway Station</h4>
                        <p class="text-xs text-slate-400">Pusat absensi modern berbasis Face Recognition & QR Code terintegrasi</p>
                    </div>
                </div>
                <a href="https://anassamudra78-sudo.github.io/Gateway-Station/" target="_blank" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shrink-0">
                    <span>Buka Gateway</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
            </div>

            <div onclick="openGuideModal()" class="cursor-pointer bg-white dark:bg-slate-900 hover:border-amber-500/40 rounded-2xl px-5 py-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-lightbulb text-sm"></i>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider group-hover:text-amber-500 transition-colors">Panduan Cepat Penggunaan</h4>
                        <p class="text-[11px] text-slate-400">Klik untuk melihat 5 langkah praktis mengelola administrasi, jadwal, kuis, & AI</p>
                    </div>
                </div>
                <button class="bg-amber-500/10 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-white text-xs font-bold py-1.5 px-4 rounded-xl border border-amber-500/20 transition-all flex items-center self-end sm:self-center shrink-0">
                    <i class="fa-solid fa-book-open mr-1.5"></i> Buka Panduan
                </button>
            </div>
        </div>
    `;

    if (AppState.ui.dashboardClockInterval) clearInterval(AppState.ui.dashboardClockInterval);
    AppState.ui.dashboardClockInterval = setInterval(() => {
        const clockEl = document.getElementById('live-dashboard-clock');
        if (clockEl) {
            const current = new Date();
            clockEl.innerText = current.toTimeString().slice(0, 8);
        }
    }, 1000);
}

function bukaPintasanKelas(targetTab, kelasId) {
    switchTab(targetTab);
    setTimeout(() => {
        if (targetTab === 'absensi') {
            const sel = document.getElementById('abs-kelas');
            if (sel && kelasId) { sel.value = kelasId; loadAbsensi(); }
        }
    }, 50);
}

function renderSekolah(container) {
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8 max-w-3xl">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-800 pb-4">Identitas Institusi</h3>
            <div class="space-y-4">
                <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Sekolah</label>
                     <input type="text" id="sch-nama" value="${AppState.db.sekolah.nama}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"></div>
                <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">NPSN</label>
                     <input type="text" id="sch-npsn" value="${AppState.db.sekolah.npsn || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"></div>
                <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Alamat Lengkap</label>
                     <input type="text" id="sch-alamat" value="${AppState.db.sekolah.alamat || ''}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Tahun Ajaran</label>
                         <input type="text" id="sch-ta" value="${AppState.db.sekolah.tahunAjaran}" placeholder="2026/2027" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 outline-none dark:text-white"></div>
                    <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                         <select id="sch-smt" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 outline-none dark:text-white">
                             <option value="Ganjil" ${AppState.db.sekolah.semester==='Ganjil'?'selected':''}>Ganjil</option>
                             <option value="Genap" ${AppState.db.sekolah.semester==='Genap'?'selected':''}>Genap</option>
                         </select></div>
                </div>
                <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Kepala Sekolah</label>
                     <input type="text" id="sch-kepsek" value="${AppState.db.sekolah.kepsek}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 outline-none dark:text-white"></div>
                <div><label class="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">NIP Kepala Sekolah</label>
                     <input type="text" id="sch-nip" value="${AppState.db.sekolah.nip}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 outline-none dark:text-white"></div>
                <button onclick="simpanSekolah()" class="mt-6 w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-lg">Simpan Identitas</button>
            </div>
        </div>
    `;
}

function simpanSekolah() {
    AppState.db.sekolah.nama = document.getElementById('sch-nama').value;
    AppState.db.sekolah.npsn = document.getElementById('sch-npsn').value;
    AppState.db.sekolah.alamat = document.getElementById('sch-alamat').value;
    AppState.db.sekolah.tahunAjaran = document.getElementById('sch-ta').value;
    AppState.db.sekolah.semester = document.getElementById('sch-smt').value;
    AppState.db.sekolah.kepsek = document.getElementById('sch-kepsek').value;
    AppState.db.sekolah.nip = document.getElementById('sch-nip').value;
    forceSaveNotification();
}

function renderCRUD(container, type) {
    const config = crudConfig[type];
    let data = AppState.db[type] || [];
    let filterDropdownHtml = '';

    if (type === 'siswa') {
        const currentFilter = AppState.ui.filterKelasSiswa || '';
        const opsiKelas = AppState.db.kelas.map(k => `<option value="${k.id}" ${currentFilter === k.id ? 'selected' : ''}>${k.kode}</option>`).join('');
        
       filterDropdownHtml = `
            <select onchange="AppState.ui.filterKelasSiswa = this.value; renderCRUD(document.getElementById('main-content'), '${type}')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-3 rounded-xl text-xs shadow-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 max-w-[130px] truncate shrink-0">
                <option value="">-- Semua Kelas --</option>
                ${opsiKelas}
            </select>
        `;
        
        if (currentFilter) {
            data = data.filter(item => item.kelasId === currentFilter);
        }
    }
    
    const dataAsliUtuh = AppState.db[type] || [];
    const kamusRelasi = {};
    config.fields.forEach(f => {
        if (f.type === 'dynamicSelect') {
            kamusRelasi[f.source] = {};
            (AppState.db[f.source] || []).forEach(r => {
                kamusRelasi[f.source][r.id] = r;
            });
        }
    });

    let tableRows = data.length === 0 
        ? `<tr><td colspan="${config.fields.length+3}" class="text-center py-12 text-slate-400 font-medium text-sm">Belum ada data ${config.title}.</td></tr>`
        : data.map((item, idx) => {
            let tdFields = config.fields.map(f => {
                let val = item[f.id] || '-';
                if(f.type === 'dynamicSelect') {
                    const ref = kamusRelasi[f.source] ? kamusRelasi[f.source][item[f.id]] : null;
                    val = ref ? ref[f.displayField] : (item[f.id] || '<span class="text-rose-400 font-semibold italic">Belum diatur</span>');
                }
                let amanVal = String(val).includes('<span class="text-rose-400') ? val : escapeHTML(val);
                return `<td class="py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[180px] truncate">${amanVal}</td>`;
            }).join('');
            
            return `
            <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-brand-50/40 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-4 px-4 text-center"><input type="checkbox" value="${item.id}" onchange="updateBatchDeleteUI('${type}')" class="crud-cb-${type} w-4 h-4 accent-brand-600 rounded cursor-pointer"></td>
                <td class="py-4 px-4 text-sm font-bold text-slate-500">${idx+1}</td>
                ${tdFields}
                <td class="py-4 px-4 text-right whitespace-nowrap">
                    ${type === 'siswa' ? `<button onclick="lihatQRSiswa('${item.id}')" title="Lihat QR Code" class="text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 py-2.5 px-3.5 rounded-xl transition-all mr-1"><i class="fa-solid fa-qrcode text-base"></i></button>` : ''}
                    <button onclick="editCRUD('${type}', '${item.id}')" title="Edit Data" class="text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/50 py-2.5 px-3.5 rounded-xl transition-all mr-1"><i class="fa-solid fa-pen-to-square text-base"></i></button>
                    <button onclick="deleteCRUD('${type}', '${item.id}')" title="Hapus Data" class="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 py-2.5 px-3.5 rounded-xl transition-all"><i class="fa-solid fa-trash-can text-base"></i></button>
                </td>
            </tr>`;
        }).join('');
    
    const editingItem = AppState.ui.editingId ? dataAsliUtuh.find(i => i.id === AppState.ui.editingId) : null;

    let formFields = config.fields.map(f => {
        let currentVal = editingItem ? (editingItem[f.id] || '') : '';
        let inputHtml = '';
        if(f.type === 'select') {
            let opts = f.opts.map(o => `<option value="${o}" ${currentVal === o ? 'selected' : ''}>${o}</option>`).join('');
            inputHtml = `<select id="form-${f.id}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-sm shadow-sm">${opts}</select>`;
        } else if(f.type === 'dynamicSelect') {
            let opts = (AppState.db[f.source] || []).map(o => `<option value="${o.id}" ${currentVal === o.id ? 'selected' : ''}>${o[f.displayField]}</option>`).join('');
            inputHtml = `<select id="form-${f.id}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-sm shadow-sm"><option value="">-- Pilih --</option>${opts}</select>`;
        } else if(f.type === 'date' || f.type === 'time') {
            inputHtml = `<input type="${f.type}" id="form-${f.id}" value="${currentVal}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-sm shadow-sm">`;
        } else {
            inputHtml = `<input type="text" id="form-${f.id}" value="${currentVal}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-sm shadow-sm">`;
        }
        return `<div><label class="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">${f.label}</label>${inputHtml}</div>`;
    }).join('');

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div class="w-full lg:w-1/3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-md border border-slate-100 dark:border-slate-800 p-6 sm:p-8 h-fit shrink-0 lg:sticky lg:top-4 z-20 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <h4 class="font-black text-lg text-slate-800 dark:text-white mb-6 border-b dark:border-slate-800 pb-4">
                    ${editingItem ? `<i class="fa-solid fa-pen-to-square text-amber-500 mr-2"></i>Edit ${config.title}` : `<i class="fa-solid fa-plus-circle text-brand-500 mr-2"></i>Tambah ${config.title}`}
                </h4>
                <div class="space-y-5" id="crud-form">${formFields}</div>
                <div class="flex space-x-3 mt-8">
                    ${editingItem ? `<button onclick="batalEdit('${type}')" class="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl transition-all shadow-sm">Batal</button>` : ''}
                    <button onclick="saveCRUD('${type}')" class="flex-1 ${editingItem ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/30'} text-white font-black py-3.5 rounded-xl shadow-lg transition-transform active:scale-95">
                        ${editingItem ? 'Simpan Edit' : 'Simpan Data'}
                    </button>
                </div>
            </div>
            
            <div class="w-full lg:w-2/3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-4">
                    <h4 class="font-black text-lg text-slate-800 dark:text-white"><i class="fa-solid fa-table-list mr-2 text-indigo-500"></i>Daftar ${config.title}</h4>
                    <div class="flex flex-wrap gap-2 w-full xl:w-auto">
                        ${filterDropdownHtml}
                        <button id="btn-batch-delete-${type}" onclick="deleteBatchCRUD('${type}')" class="hidden bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md transition-all flex items-center shrink-0">
                            <i class="fa-solid fa-trash-can mr-2"></i> Hapus (<span id="batch-count-${type}">0</span>)
                        </button>
                       <button onclick="exportExcel('${type}')" class="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 font-bold py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all"><i class="fa-solid fa-file-excel mr-1.5 text-emerald-500"></i> Ekspor Excel</button>
                        <button onclick="openImportModal('${type}')" class="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md shadow-purple-500/30 transition-all"><i class="fa-solid fa-file-excel mr-1.5"></i> Impor Excel</button>
                    </div>
                </div>
                <div class="overflow-x-auto p-2 custom-scrollbar max-h-[75vh] overflow-y-auto relative">
                    <table class="w-full text-left border-collapse min-w-max">
                        <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold sticky top-0 z-10 shadow-sm">
                            <tr class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold">                                        
                                <th class="py-4 px-4 w-12 text-center rounded-l-xl"><input type="checkbox" id="select-all-${type}" onchange="toggleSelectAllCRUD('${type}', this.checked)" class="w-4 h-4 accent-brand-600 rounded cursor-pointer" title="Pilih Semua"></th>
                                <th class="py-4 px-4 w-14 text-center">No</th>
                                ${config.fields.map(f => `<th class="py-4 px-4">${f.label}</th>`).join('')}
                                <th class="py-4 px-4 text-right rounded-r-xl">Aksi Opsi</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function editCRUD(type, id) {
    AppState.ui.editingId = id;
    renderCRUD(document.getElementById('main-content'), type);
}

function batalEdit(type) {
    AppState.ui.editingId = null;
    renderCRUD(document.getElementById('main-content'), type);
}

function saveCRUD(type) {
    const config = crudConfig[type];
    if (!AppState.db[type]) AppState.db[type] = [];

    let itemData = {};
    let hasData = false;
    
    config.fields.forEach(f => {
        const val = document.getElementById(`form-${f.id}`).value;
        itemData[f.id] = val;
        if(val.trim() !== '') hasData = true;
    });

    if(!hasData) return showAlert("Gagal", "Harap isi minimal satu kolom data.", "error");

    if (AppState.ui.editingId) {
        const idx = AppState.db[type].findIndex(i => i.id === AppState.ui.editingId);
        if (idx >= 0) {
            AppState.db[type][idx] = { ...AppState.db[type][idx], ...itemData };
        }
        AppState.ui.editingId = null;
    } else {
        AppState.db[type].push({ id: generateId(), ...itemData });
    }
    forceSaveNotification();
}

function deleteCRUD(type, id) {
    if(confirm('Yakin ingin menghapus data ini? Semua data terkait (jadwal/nilai/absensi) juga akan dibersihkan.')) {
        AppState.db[type] = AppState.db[type].filter(item => item.id !== id);

        if (type === 'kelas') {
            AppState.db.siswa = AppState.db.siswa.filter(s => s.kelasId !== id);
            AppState.db.jadwal = AppState.db.jadwal.filter(j => j.kelasId !== id);
            AppState.db.penilaian = AppState.db.penilaian.filter(p => p.kelasId !== id);
            AppState.db.absensi = AppState.db.absensi.filter(a => a.kelasId !== id);
            AppState.db.jurnal = AppState.db.jurnal.filter(j => j.kelasId !== id);
        } else if (type === 'mapel') {
            AppState.db.jadwal = AppState.db.jadwal.filter(j => j.mapelId !== id);
            AppState.db.penilaian = AppState.db.penilaian.filter(p => p.mapelId !== id);
            AppState.db.jurnal = AppState.db.jurnal.filter(j => j.mapelId !== id);
        } else if (type === 'siswa') {
            AppState.db.penilaian = AppState.db.penilaian.filter(p => p.siswaId !== id);
            AppState.db.absensi = AppState.db.absensi.filter(a => a.siswaId !== id);
        }

        if (AppState.ui.editingId === id) AppState.ui.editingId = null;
        forceSaveNotification();
    }
}

function toggleSelectAllCRUD(type, isChecked) {
    const checkboxes = document.querySelectorAll(`.crud-cb-${type}`);
    checkboxes.forEach(cb => cb.checked = isChecked);
    updateBatchDeleteUI(type);
}

function updateBatchDeleteUI(type) {
    const checkedCbs = document.querySelectorAll(`.crud-cb-${type}:checked`);
    const btn = document.getElementById(`btn-batch-delete-${type}`);
    const countSpan = document.getElementById(`batch-count-${type}`);
    const allCbs = document.querySelectorAll(`.crud-cb-${type}`);
    const selectAllCb = document.getElementById(`select-all-${type}`);

    if (countSpan) countSpan.innerText = checkedCbs.length;
    if (btn) {
        if (checkedCbs.length > 0) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
    if (selectAllCb && allCbs.length > 0) {
        selectAllCb.checked = checkedCbs.length === allCbs.length;
    }
}

function deleteBatchCRUD(type) {
    const checkedCbs = document.querySelectorAll(`.crud-cb-${type}:checked`);
    const idsToDelete = Array.from(checkedCbs).map(cb => cb.value);

    if (idsToDelete.length === 0) return;

    const config = crudConfig[type];
    if (confirm(`Yakin ingin menghapus ${idsToDelete.length} data ${config ? config.title : ''} terpilih? Data terkait juga akan dibersihkan.`)) {
        AppState.db[type] = AppState.db[type].filter(item => !idsToDelete.includes(item.id));

        idsToDelete.forEach(id => {
            if (type === 'kelas') {
                AppState.db.siswa = AppState.db.siswa.filter(s => s.kelasId !== id);
                AppState.db.jadwal = AppState.db.jadwal.filter(j => j.kelasId !== id);
                AppState.db.penilaian = AppState.db.penilaian.filter(p => p.kelasId !== id);
                AppState.db.absensi = AppState.db.absensi.filter(a => a.kelasId !== id);
                AppState.db.jurnal = AppState.db.jurnal.filter(j => j.kelasId !== id);
            } else if (type === 'mapel') {
                AppState.db.jadwal = AppState.db.jadwal.filter(j => j.mapelId !== id);
                AppState.db.penilaian = AppState.db.penilaian.filter(p => p.mapelId !== id);
                AppState.db.jurnal = AppState.db.jurnal.filter(j => j.mapelId !== id);
            } else if (type === 'siswa') {
                AppState.db.penilaian = AppState.db.penilaian.filter(p => p.siswaId !== id);
                AppState.db.absensi = AppState.db.absensi.filter(a => a.siswaId !== id);
            }
            if (AppState.ui.editingId === id) AppState.ui.editingId = null;
        });

        forceSaveNotification();
    }
}

function exportExcel(type) {
    const config = crudConfig[type];
    let data = AppState.db[type] || [];

    if (type === 'siswa' && AppState.ui.filterKelasSiswa) {
        data = data.filter(item => item.kelasId === AppState.ui.filterKelasSiswa);
    }

    if(data.length === 0) return showAlert("Info", "Tidak ada data untuk diekspor pada filter ini.", "info");

    let headers = ['No', ...config.fields.map(f => f.label)];
    
    let rows = data.map((item, idx) => {
        let row = [idx + 1];
        config.fields.forEach(f => {
            let val = item[f.id] || '';
            if(f.type === 'dynamicSelect' && val) {
                let ref = AppState.db[f.source].find(r => r.id === val);
                val = ref ? ref[f.displayField] : val;
            }
            if (typeof val === 'string') {
                val = val.replace(/<[^>]*>?/gm, '');
            }
            row.push(val);
        });
        return row;
    });

    let dataToExport = [headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    
    const wscols = [{wch: 5}]; 
    config.fields.forEach(() => wscols.push({wch: 25})); 
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    
    let namaSheet = `Data_${config.title}`;
    let namaFile = `Data_${config.title}_SmartTeacher.xlsx`;
    
    if (type === 'siswa' && AppState.ui.filterKelasSiswa) {
        const refKelas = AppState.db.kelas.find(k => k.id === AppState.ui.filterKelasSiswa);
        if (refKelas) {
            namaSheet = `Siswa_Kelas_${refKelas.kode}`.substring(0, 31);
            namaFile = `Data_Siswa_Kelas_${refKelas.kode}_SmartTeacher.xlsx`;
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, namaSheet);
    XLSX.writeFile(workbook, namaFile);
    
    showAlert("Berhasil", `File Excel ${namaSheet} berhasil diunduh!`, "success");
}
