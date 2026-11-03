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

// ==========================================================
// BAGIAN 2: PENGATURAN, PENILAIAN, ABSENSI (QR) & RAPOR
// ==========================================================

function renderPengaturan(container) {
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8 max-w-3xl mx-auto">
            <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-800 pb-4"><i class="fa-solid fa-shield-halved text-brand-500 mr-2"></i>Pengaturan Sistem</h3>
            

            <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 mb-6 flex items-start space-x-4">
                <div class="text-3xl text-emerald-500"><i class="fa-solid fa-cloud"></i></div>
                <div class="w-full">
                    <h4 class="font-bold text-emerald-800 dark:text-emerald-300 text-lg">Sinkronisasi Cloud (Google Sheets)</h4>
                    <p class="text-sm text-emerald-700 dark:text-emerald-400 mb-3 mt-1">Masukkan Web App URL agar data tersimpan secara online.</p>
                   <input type="text" id="setting-gas-url" readonly value="${getActiveWorkspace().url || ''}" placeholder="Belum ada URL Database di Ruang Kerja ini" class="w-full bg-slate-100 dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl px-4 py-2.5 text-sm outline-none mb-3 text-slate-500 cursor-not-allowed">
<p class="text-xs text-slate-500 dark:text-slate-400 italic">*Tautan ini diambil secara otomatis dari pengaturan Ruang Kerja. Untuk mengubahnya, silakan buat/edit Ruang Kerja di menu samping.</p>
                </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6 flex items-start space-x-4">
                <div class="text-3xl text-blue-500"><i class="fa-solid fa-cloud-arrow-down"></i></div>
                <div>
                    <h4 class="font-bold text-slate-800 dark:text-white text-lg">Backup Database Lengkap</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 mt-1">Unduh seluruh data menjadi satu file JSON.</p>
                    <button onclick="backupJSON()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md">Download Backup JSON</button>
                </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start space-x-4">
                <div class="text-3xl text-amber-500"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                <div class="w-full">
                    <h4 class="font-bold text-slate-800 dark:text-white text-lg">Restore Database (Pemulihan)</h4>
                    <div class="flex items-center space-x-3 w-full mt-4">
                        <input type="file" id="restore-file" accept=".json" class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm cursor-pointer dark:text-white">
                        <button onclick="restoreJSON()" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md">Restore Data</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function saveGasUrlConfig() {
    const url = document.getElementById('setting-gas-url').value.trim();
    AppState.config.gasUrl = url;
    localStorage.setItem('ST_GAS_URL', url);
    showAlert("Berhasil", "URL Cloud Database berhasil disimpan!", "success");
    renderPengaturan(document.getElementById('main-content'));
    if(url) saveDatabase(); 
}

function saveGatewayUrlConfig() {
    const url = document.getElementById('setting-gateway-url').value.trim();
    AppState.config.gatewayUrl = url;
    localStorage.setItem('ST_GATEWAY_URL', url);
    showAlert("Berhasil", "Tautan Smart Gateway berhasil disimpan!", "success");
    renderPengaturan(document.getElementById('main-content'));
}

function backupJSON() {
    const fullBackup = {
        version: "2.0",
        db: AppState.db,
        bankSoal: AppState.kuis.bankSoalManual,
        config: { gasUrl: AppState.config.gasUrl }
    };
    
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup));
    let link = document.createElement('a');
    link.href = dataStr;
    link.download = `Backup_SmartTeacher_Lengkap.json`;
    link.click();
}

function restoreJSON() {
    const fileInput = document.getElementById('restore-file');
    if(!fileInput.files || fileInput.files.length === 0) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            
            if (parsed.version && parsed.db && parsed.db.sekolah) {
                AppState.db = parsed.db;
                
                if (parsed.bankSoal) {
                    AppState.kuis.bankSoalManual = parsed.bankSoal;
                    localStorage.setItem('smartTeacher_bankSoal', JSON.stringify(parsed.bankSoal));
                }
                
                if (parsed.config && parsed.config.gasUrl) {
                    AppState.config.gasUrl = parsed.config.gasUrl;
                    localStorage.setItem('ST_GAS_URL', parsed.config.gasUrl);
                }
            } else if (parsed && parsed.sekolah) {
                AppState.db = parsed;
            } else {
                throw new Error("Struktur data JSON tidak dikenali.");
            }

            forceSaveNotification();
            showAlert("Berhasil", "Database dan Bank Soal sukses dipulihkan! Memuat ulang sistem...", "success");
            setTimeout(() => window.location.reload(), 2000);
            
        } catch (err) { 
            showAlert("Error", "Gagal memproses file JSON: " + err.message, "error"); 
        }
    };
    reader.readAsText(fileInput.files[0]);
}

function renderPenilaian(container) {
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}">${k.kode}</option>`).join('');
    let mapelOpts = AppState.db.mapel.map(m => `<option value="${m.id}">${m.nama}</option>`).join('');

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Kelas</label>
                 <select id="penilaian-kelas" onchange="loadFormPenilaian()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 dark:text-white"><option value="">-- Pilih --</option>${kelasOpts}</select></div>
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Mata Pelajaran</label>
                 <select id="penilaian-mapel" onchange="loadFormPenilaian()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 dark:text-white"><option value="">-- Pilih --</option>${mapelOpts}</select></div>
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Jenis Penilaian</label>
                 <select id="penilaian-jenis" onchange="loadFormPenilaian()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 dark:text-white">
                     <option value="Tugas">Tugas</option><option value="UTS">UTS</option><option value="UAS">UAS</option>
                 </select></div>
        </div>
        <div id="penilaian-form-container"></div>
    `;
    loadFormPenilaian();
}

function loadFormPenilaian() {
    const kelasId = document.getElementById('penilaian-kelas').value;
    const mapelId = document.getElementById('penilaian-mapel').value;
    const jenis = document.getElementById('penilaian-jenis').value;
    const formContainer = document.getElementById('penilaian-form-container');

    if(!kelasId || !mapelId) { formContainer.innerHTML = `<p class="text-slate-500 text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800">Pilih kelas dan mapel.</p>`; return; }

    const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
    if(siswaKelas.length === 0) { formContainer.innerHTML = `<p class="text-rose-500 text-center py-10 bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-100 dark:border-rose-900">Belum ada siswa di kelas ini.</p>`; return; }

    let rows = siswaKelas.map((siswa, idx) => {
        let existing = AppState.db.penilaian.find(p => p.siswaId === siswa.id && p.mapelId === mapelId && p.jenis === jenis);
        let val = existing ? existing.nilai : '';
        return `
            <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td class="py-3 px-5 text-slate-500 text-sm w-12 text-center">${idx+1}</td>
                <td class="py-3 px-5 text-sm font-bold text-slate-800 dark:text-white">${siswa.nama}</td>
                <td class="py-3 px-5 text-center">
                    <input type="number" id="nilai-${siswa.id}" value="${val}" min="0" max="100" class="w-24 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-brand-500 text-center font-black text-brand-700 dark:text-brand-300">
                </td>
            </tr>
        `;
    }).join('');

    formContainer.innerHTML = `
       <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden fade-in relative max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table class="w-full text-left">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold sticky top-0 z-10 shadow-sm">
                    <tr><th class="py-4 px-5 text-center">No</th><th class="py-4 px-5">Nama Lengkap Siswa</th><th class="py-4 px-5 text-center w-40">Input Nilai</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <div class="p-5 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
                <button onclick="simpanPenilaian('${kelasId}', '${mapelId}', '${jenis}')" class="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg">Simpan Nilai ${jenis}</button>
            </div>
        </div>
    `;
}

function simpanPenilaian(kelasId, mapelId, jenis) {
    const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
    siswaKelas.forEach(siswa => {
        let input = document.getElementById(`nilai-${siswa.id}`);
        if(input && input.value !== '') {
            let val = parseFloat(input.value);
            let existingIndex = AppState.db.penilaian.findIndex(p => p.siswaId === siswa.id && p.mapelId === mapelId && p.jenis === jenis);
            if(existingIndex >= 0) AppState.db.penilaian[existingIndex].nilai = val;
            else AppState.db.penilaian.push({ id: generateId(), siswaId: siswa.id, mapelId: mapelId, kelasId: kelasId, jenis: jenis, nilai: val });
        }
    });
    forceSaveNotification();
}

function hitungNilaiProporsional(siswaId, mapelId) {
    let pTugas = AppState.db.penilaian.find(p => p.siswaId === siswaId && p.mapelId === mapelId && p.jenis === 'Tugas');
    let pUTS = AppState.db.penilaian.find(p => p.siswaId === siswaId && p.mapelId === mapelId && p.jenis === 'UTS');
    let pUAS = AppState.db.penilaian.find(p => p.siswaId === siswaId && p.mapelId === mapelId && p.jenis === 'UAS');

    let hasTugas = pTugas && pTugas.nilai !== "" && pTugas.nilai !== null && !isNaN(pTugas.nilai);
    let hasUTS = pUTS && pUTS.nilai !== "" && pUTS.nilai !== null && !isNaN(pUTS.nilai);
    let hasUAS = pUAS && pUAS.nilai !== "" && pUAS.nilai !== null && !isNaN(pUAS.nilai);

    let nTugas = hasTugas ? Number(pTugas.nilai) : null;
    let nUTS = hasUTS ? Number(pUTS.nilai) : null;
    let nUAS = hasUAS ? Number(pUAS.nilai) : null;

    if (!hasTugas && !hasUTS && !hasUAS) {
        return { akhir: 0, predikat: '-', nTugas: '-', nUTS: '-', nUAS: '-' };
    }

    let weightedSum = ((nTugas || 0) * 0.3) + ((nUTS || 0) * 0.3) + ((nUAS || 0) * 0.4);
    let totalWeight = (hasTugas ? 0.3 : 0) + (hasUTS ? 0.3 : 0) + (hasUAS ? 0.4 : 0);
    
    let akhir = Math.round(weightedSum / totalWeight);
    let predikat = akhir >= 90 ? 'A' : (akhir >= 80 ? 'B' : (akhir >= 70 ? 'C' : 'D'));

    return {
        akhir,
        predikat,
        nTugas: hasTugas ? nTugas : '-',
        nUTS: hasUTS ? nUTS : '-',
        nUAS: hasUAS ? nUAS : '-'
    };
}

function renderRekapNilai(container) {
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}">${k.kode}</option>`).join('');
    let mapelOpts = AppState.db.mapel.map(m => `<option value="${m.id}">${m.nama}</option>`).join('');

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Kelas</label>
                 <select id="rekap-kelas" onchange="loadRekap()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white"><option value="">-- Pilih --</option>${kelasOpts}</select></div>
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Mata Pelajaran</label>
                 <select id="rekap-mapel" onchange="loadRekap()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white"><option value="">-- Pilih --</option>${mapelOpts}</select></div>
        </div>
        <div id="rekap-container"></div>
    `;
    loadRekap();
}

function loadRekap() {
    const kelasId = document.getElementById('rekap-kelas').value;
    const mapelId = document.getElementById('rekap-mapel').value;
    const container = document.getElementById('rekap-container');

    if(!kelasId || !mapelId) { container.innerHTML = ''; return; }
    const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);

    let rows = siswaKelas.map((siswa, idx) => {
        const calc = hitungNilaiProporsional(siswa.id, mapelId);
        
        return `
            <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td class="py-3.5 px-4 text-center">${idx+1}</td>
                <td class="py-3.5 px-4 font-bold text-slate-800 dark:text-white">${siswa.nama}</td>
                <td class="py-3.5 px-4 text-center">${calc.nTugas}</td>
                <td class="py-3.5 px-4 text-center">${calc.nUTS}</td>
                <td class="py-3.5 px-4 text-center">${calc.nUAS}</td>
                <td class="py-3.5 px-4 text-center font-black">${calc.akhir || '-'}</td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-500">${calc.predikat}</td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden fade-in">
            <table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                <tr><th class="py-4 px-4 text-center">No</th><th class="py-4 px-4">Nama Siswa</th><th class="py-4 px-4 text-center">Tugas (30%)</th><th class="py-4 px-4 text-center">UTS (30%)</th><th class="py-4 px-4 text-center">UAS (40%)</th><th class="py-4 px-4 text-center">Akhir</th><th class="py-4 px-4 text-center">Predikat</th></tr>
            </thead><tbody>${rows}</tbody></table>
        </div>
    `;
}

function renderAbsensi(container) {
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}">${k.kode}</option>`).join('');
    const nowLocal = new Date();
    let today = nowLocal.getFullYear() + '-' + String(nowLocal.getMonth() + 1).padStart(2, '0') + '-' + String(nowLocal.getDate()).padStart(2, '0');

    container.innerHTML = `
        <!-- PEMILIHAN PERAN (ROLE) GURU -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 space-y-5 sticky top-0 z-30 shadow-md">
            <div class="border-b border-slate-100 dark:border-slate-800 pb-4">
                <label class="text-sm font-black text-slate-800 dark:text-white block mb-3">
                    <i class="fa-solid fa-user-tie text-brand-500 mr-2"></i> Peran Anda Saat Ini:
                </label>
                <div class="flex flex-wrap items-center gap-3">
                    <label class="inline-flex items-center cursor-pointer px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 dark:bg-emerald-900/30 dark:border-emerald-800 transition-all">
                        <input type="radio" name="mode-absen" value="mapel" onchange="loadAbsensi()" checked class="w-5 h-5 accent-brand-600">
                        <span class="ml-2 font-bold text-brand-800 dark:text-emerald-300 text-sm">Guru Mapel (Absen Harian)</span>
                    </label>
                    <label class="inline-flex items-center cursor-pointer px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800 transition-all">
                        <input type="radio" name="mode-absen" value="walikelas" onchange="loadAbsensi()" class="w-5 h-5 accent-indigo-600">
                        <span class="ml-2 font-bold text-indigo-800 dark:text-indigo-300 text-sm">Wali Kelas (Rekap 31 Hari)</span>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div id="wadah-tanggal-absen">
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Tanggal</label>
                    <input type="date" id="abs-tanggal" value="${today}" onchange="loadAbsensi()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white text-sm">
                </div>
                
                <div id="wadah-bulan-absen" style="display: none;">
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Bulan (Rekap)</label>
                    <input type="month" id="abs-bulan" value="${today.slice(0, 7)}" onchange="loadAbsensi()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white text-sm">
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Kelas</label>
                    <select id="abs-kelas" onchange="loadAbsensi()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white text-sm focus:ring-2 focus:ring-brand-500">
                        <option value="">-- Pilih Kelas --</option>
                        ${kelasOpts}
                    </select>
                </div>
            </div>
        </div>
        <div id="absensi-container"></div>
    `;
    loadAbsensi();
}

function loadAbsensi() {
    const radioMode = document.querySelector('input[name="mode-absen"]:checked');
    const mode = radioMode ? radioMode.value : 'mapel';
    
    const tanggal = document.getElementById('abs-tanggal').value;
    const kelasId = document.getElementById('abs-kelas').value;
    const container = document.getElementById('absensi-container');
    const wadahTanggal = document.getElementById('wadah-tanggal-absen');
    const wadahBulan = document.getElementById('wadah-bulan-absen');

    if (mode === 'walikelas') {
        wadahTanggal.classList.add('hidden');
        if (wadahBulan) wadahBulan.style.display = 'block';
    } else {
        wadahTanggal.classList.remove('hidden');
        if (wadahBulan) wadahBulan.style.display = 'none';
    }

    if(!kelasId) { 
        container.innerHTML = `<p class="text-slate-500 text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800">Pilih kelas untuk menampilkan daftar hadir.</p>`; 
        return; 
    }

    const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
    if(siswaKelas.length === 0) { 
        container.innerHTML = `<p class="text-rose-500 text-center py-10 bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-100 dark:border-slate-800">Belum ada siswa di kelas ini.</p>`; 
        return; 
    }

    if (mode === 'mapel') {
        if(!tanggal) return;
        let rows = siswaKelas.map((siswa, idx) => {
            let existing = AppState.db.absensi.find(a => a.siswaId === siswa.id && a.tanggal === tanggal && a.kelasId === kelasId);
            let status = existing ? existing.status : 'H'; 
            
            const radio = (val, label, color) => `<label class="inline-flex items-center mr-4 cursor-pointer p-2 rounded-lg hover:bg-${color}-50 dark:hover:bg-slate-800"><input type="radio" name="abs-${siswa.id}" value="${val}" ${status === val ? 'checked' : ''} class="w-4 h-4 accent-brand-600"><span class="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">${label}</span></label>`;

            return `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-3 px-5 text-center">${idx+1}</td><td class="py-3 px-5 font-bold dark:text-white">${siswa.nama}</td><td class="py-3 px-5 bg-slate-50/30 dark:bg-slate-800/30">${radio('H','Hadir','emerald')}${radio('I','Izin','blue')}${radio('S','Sakit','amber')}${radio('A','Alpa','rose')}</td></tr>`;
        }).join('');

        container.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden fade-in">
                <!-- HEADER TABEL + TOMBOL SCAN -->
                <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h4 class="font-bold text-slate-800 dark:text-white text-sm"><i class="fa-solid fa-clipboard-user text-brand-500 mr-2"></i> Daftar Hadir</h4>
                    
                </div>
                <table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold"><tr><th class="py-4 px-5 text-center w-16">No</th><th class="py-4 px-5">Siswa</th><th class="py-4 px-5">Status Kehadiran</th></tr></thead><tbody>${rows}</tbody></table>
                <div class="p-5 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
                    <button onclick="simpanAbsensi('${tanggal}', '${kelasId}')" class="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">Simpan Kehadiran Harian</button>
                </div>
            </div>
        `;
    } else {
        let headerTanggal = "";
        for (let i = 1; i <= 31; i++) {
            headerTanggal += `<th class="border border-slate-200 dark:border-slate-700 p-1 min-w-[28px] text-center">${i}</th>`;
        }

        let currentMonthPrefix = new Date().toISOString().slice(0, 8);
        const elemenBulan = document.getElementById('abs-bulan');
        if (elemenBulan && elemenBulan.value) {
            currentMonthPrefix = elemenBulan.value + '-';
        }

        let rowsWali = siswaKelas.map((siswa, idx) => {
            let tdAbsen = "";
            let totH = 0, totS = 0, totI = 0, totA = 0;

            for(let i=1; i<=31; i++) {
                let tglStr = currentMonthPrefix + i.toString().padStart(2, '0');
                let existing = AppState.db.absensi.find(a => a.siswaId === siswa.id && a.tanggal === tglStr && a.kelasId === kelasId);
                
                let stat = existing ? existing.status : '';
                
                if(stat==='H') totH++;
                if(stat==='S') totS++;
                if(stat==='I') totI++;
                if(stat==='A') totA++;

                let txtColor = 'text-slate-300';
                let bgCell = '';
                if(stat==='S') { txtColor = 'text-amber-500 font-black'; bgCell = 'bg-amber-50 dark:bg-amber-900/20'; }
                if(stat==='I') { txtColor = 'text-blue-500 font-black'; bgCell = 'bg-blue-50 dark:bg-blue-900/20'; }
                if(stat==='A') { txtColor = 'text-rose-500 font-black'; bgCell = 'bg-rose-50 dark:bg-rose-900/20'; }
                if(stat==='H') { stat = 'H'; txtColor = 'text-emerald-500 font-bold'; bgCell = 'bg-emerald-50 dark:bg-emerald-900/20'; } 

                tdAbsen += `<td onclick="ubahAbsenWali('${siswa.id}', '${tglStr}', '${kelasId}')" class="border border-slate-200 dark:border-slate-700 p-1 text-center text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${txtColor} ${bgCell}">${stat || '-'}</td>`;
            }

            return `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-bold text-slate-500">${idx+1}</td>
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-xs font-bold whitespace-nowrap dark:text-white">${siswa.nama}</td>
                    ${tdAbsen}
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40">${totH}</td>
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-900/40">${totS}</td>
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-black text-blue-500 bg-blue-50 dark:bg-blue-900/40">${totI}</td>
                    <td class="border border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-black text-rose-500 bg-rose-50 dark:bg-rose-900/40">${totA}</td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white"><i class="fa-solid fa-calendar-days text-indigo-500 mr-2"></i> Rekap Kehadiran (31 Hari)</h4>
                        <p class="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg mt-1.5">Klik kotak untuk ubah manual, atau tekan tombol Tarik Data.</p>
                    </div>
                    <!-- TOMBOL TARIK DATA GATEWAY -->
                    <button onclick="tarikDataGateway('${kelasId}')" id="btn-tarik-gateway" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-cyan-500/30 transition-all flex items-center shrink-0">
                        <i class="fa-solid fa-satellite-dish mr-2 animate-pulse"></i> Tarik Data Smart Gateway
                    </button>
                </div>
                <div class="overflow-x-auto custom-scrollbar pb-3">
                    <table class="w-max min-w-full text-left border-collapse border border-slate-200 dark:border-slate-700">
                        <thead class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-[10px] uppercase font-black">
                            <tr>
                                <th rowspan="2" class="border border-slate-200 dark:border-slate-700 p-2 text-center w-10">No</th>
                                <th rowspan="2" class="border border-slate-200 dark:border-slate-700 p-2 w-48">Nama Lengkap Siswa</th>
                                <th colspan="31" class="border border-slate-200 dark:border-slate-700 p-1 text-center">Tanggal</th>
                                <th colspan="4" class="border border-slate-200 dark:border-slate-700 p-1 text-center">Total</th>
                            </tr>
                            <tr>
                                ${headerTanggal}
                                <th class="border border-slate-200 dark:border-slate-700 p-1 text-center text-emerald-600 w-8">H</th>
                                <th class="border border-slate-200 dark:border-slate-700 p-1 text-center text-amber-600 w-8">S</th>
                                <th class="border border-slate-200 dark:border-slate-700 p-1 text-center text-blue-600 w-8">I</th>
                                <th class="border border-slate-200 dark:border-slate-700 p-1 text-center text-rose-600 w-8">A</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsWali}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

let html5QrcodeScanner = null;

function bukaScannerQR(tanggal, kelasId) {
    if (typeof Html5QrcodeScanner === 'undefined') {
        return showAlert("Tunggu", "Sedang mengunduh modul Kamera AI... Coba klik lagi dalam 3 detik.", "info");
    }

    if (!document.getElementById('qr-modal-scanner')) {
        const modalHtml = `
        <div id="qr-modal-scanner" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] hidden flex flex-col items-center justify-center p-4 transition-all">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl w-full max-w-sm text-center relative border border-slate-200 dark:border-slate-800">
                <button onclick="tutupScannerQR()" class="absolute top-4 right-4 w-9 h-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-xl flex items-center justify-center font-bold transition-all"><i class="fa-solid fa-xmark text-lg"></i></button>
                <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner border border-emerald-200"><i class="fa-solid fa-qrcode"></i></div>
                <h3 class="text-lg font-black text-slate-800 dark:text-white mb-1">Scanner Kartu Pelajar</h3>
                <p class="text-xs text-slate-500 mb-5">Arahkan kamera HP ke QR Code/Barcode Nomor Induk Siswa (NIS) di kartu pelajar.</p>
                
                <div id="reader" class="w-full bg-black rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-800 aspect-square object-cover mb-2"></div>
                
                <div id="scan-result-toast" class="mt-4 p-3 bg-emerald-500 text-white font-black rounded-xl text-sm hidden transform scale-90 transition-all shadow-lg items-center justify-center h-12">
                    <i class="fa-solid fa-circle-check mr-2 text-lg"></i> <span id="scan-name">Hadir!</span>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    document.getElementById('qr-modal-scanner').classList.remove('hidden');

    html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 }, false);
    
    html5QrcodeScanner.render((decodedText, decodedResult) => {
        prosesHasilScan(decodedText, tanggal, kelasId);
    }, (errorMessage) => { });
}

function tutupScannerQR() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(e => console.log(e));
    }
    document.getElementById('qr-modal-scanner').classList.add('hidden');
    loadAbsensi(); 
}

function prosesHasilScan(nisAtauId, tanggal, kelasId) {
    html5QrcodeScanner.pause();

    const siswa = AppState.db.siswa.find(s => s.kelasId === kelasId && (s.nis === nisAtauId || s.id === nisAtauId));
    
    const toast = document.getElementById('scan-result-toast');
    
    if (siswa) {
        let existingIndex = AppState.db.absensi.findIndex(a => a.siswaId === siswa.id && a.tanggal === tanggal && a.kelasId === kelasId);
        if (existingIndex >= 0) {
            AppState.db.absensi[existingIndex].status = 'H';
        } else {
            AppState.db.absensi.push({ id: generateId(), siswaId: siswa.id, kelasId, tanggal, status: 'H' });
        }
        
        localStorage.setItem(AppState.config.storageKey, JSON.stringify(AppState.db));

        if (typeof playTick === 'function') playTick(800); 

        toast.className = "mt-4 p-3 bg-emerald-500 text-white font-black rounded-xl text-sm flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] transform scale-100 transition-all h-12";
        toast.innerHTML = `<i class="fa-solid fa-circle-check mr-2 text-lg"></i> ${siswa.nama} (HADIR)`;
        
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.replace('scale-100', 'scale-90');
            html5QrcodeScanner.resume(); 
        }, 1500);

    } else {
        if (typeof playTick === 'function') playTick(200); 
        
        toast.className = "mt-4 p-3 bg-rose-500 text-white font-black rounded-xl text-sm flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.5)] transform scale-100 transition-all h-12";
        toast.innerHTML = `<i class="fa-solid fa-circle-xmark mr-2 text-lg"></i> NIS tidak terdaftar!`;
        
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.replace('scale-100', 'scale-90');
            html5QrcodeScanner.resume();
        }, 2000);
    }
}

function ubahAbsenWali(siswaId, tanggal, kelasId) {
    let existingIndex = AppState.db.absensi.findIndex(a => a.siswaId === siswaId && a.tanggal === tanggal && a.kelasId === kelasId);
    let currentStatus = existingIndex >= 0 ? AppState.db.absensi[existingIndex].status : '';
    let nextStatus = '';
    
    if (!currentStatus) nextStatus = 'H';
    else if (currentStatus === 'H') nextStatus = 'S';
    else if (currentStatus === 'S') nextStatus = 'I';
    else if (currentStatus === 'I') nextStatus = 'A';
    else if (currentStatus === 'A') nextStatus = ''; 
    
    if (nextStatus === '') {
         if(existingIndex >= 0) AppState.db.absensi.splice(existingIndex, 1);
    } else {
         if (existingIndex >= 0) {
             AppState.db.absensi[existingIndex].status = nextStatus;
         } else {
             AppState.db.absensi.push({ id: generateId(), siswaId, kelasId, tanggal, status: nextStatus });
         }
    }
    
    localStorage.setItem(AppState.config.storageKey, JSON.stringify(AppState.db));
    if (AppState.config.gasUrl && AppState.config.gasUrl.startsWith("http")) {
        fetch(AppState.config.gasUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(AppState.db) }).catch(()=>{});
    }
    
    loadAbsensi();
}

function simpanAbsensi(tanggal, kelasId) {
    const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
    siswaKelas.forEach(siswa => {
        const selectedRadio = document.querySelector(`input[name="abs-${siswa.id}"]:checked`);
        if (selectedRadio) {
            const status = selectedRadio.value;
            const existingIndex = AppState.db.absensi.findIndex(
                a => a.siswaId === siswa.id && a.tanggal === tanggal && a.kelasId === kelasId
            );
            if (existingIndex >= 0) {
                AppState.db.absensi[existingIndex].status = status;
            } else {
                AppState.db.absensi.push({
                    id: generateId(),
                    siswaId: siswa.id,
                    kelasId: kelasId,
                    tanggal: tanggal,
                    status: status
                });
            }
        }
    });
    forceSaveNotification();
}

function renderRapor(container) {
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}">${k.kode}</option>`).join('');

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 grid grid-cols-1 md:grid-cols-2 gap-5 no-print">
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Kelas</label>
                 <select id="rapor-kelas" onchange="loadSiswaRapor()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white"><option value="">-- Pilih --</option>${kelasOpts}</select></div>
            <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Siswa</label>
                 <select id="rapor-siswa" onchange="generateRapor()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none dark:text-white"><option value="">-- Menunggu Kelas --</option></select></div>
        </div>
        <div id="rapor-cetak-container" class="bg-white p-10 rounded-xl shadow-xl border border-slate-200 hidden mx-auto max-w-4xl"></div>
    `;
}

function loadSiswaRapor() {
    const kelasId = document.getElementById('rapor-kelas').value;
    const selectSiswa = document.getElementById('rapor-siswa');
    if(!kelasId) { selectSiswa.innerHTML = '<option value="">-- Pilih --</option>'; return; }
    let opts = AppState.db.siswa.filter(s => s.kelasId === kelasId).map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
    selectSiswa.innerHTML = `<option value="">-- Pilih Siswa --</option>${opts}`;
}

function generateRapor() {
    const siswaId = document.getElementById('rapor-siswa').value;
    const container = document.getElementById('rapor-cetak-container');
    if(!siswaId) { container.classList.add('hidden'); return; }

    const siswa = AppState.db.siswa.find(s => s.id === siswaId);
    const kelas = AppState.db.kelas.find(k => k.id === siswa.kelasId);
    
    let barisMapel = AppState.db.mapel.map((mapel, idx) => {
        const calc = hitungNilaiProporsional(siswa.id, mapel.id);
        let deskripsi = calc.akhir >= 90 ? `Sangat mahir dalam memahami seluruh kompetensi ${mapel.nama}.` : (calc.akhir >= 80 ? `Baik dalam menguasai kompetensi dasar ${mapel.nama}.` : (calc.akhir > 0 ? `Perlu bimbingan lebih lanjut pada beberapa materi ${mapel.nama}.` : '-'));
        
        return `<tr class="border-b border-black"><td class="py-2 px-3 text-center border-r border-black">${idx+1}</td><td class="py-2 px-3 border-r border-black font-semibold">${mapel.nama}</td><td class="py-2 px-3 text-center border-r border-black font-bold">${calc.akhir || '-'}</td><td class="py-2 px-3 text-center border-r border-black font-bold">${calc.akhir ? calc.predikat : '-'}</td><td class="py-2 px-3 text-xs">${deskripsi}</td></tr>`;
    }).join('');

    const absenSiswa = AppState.db.absensi.filter(a => a.siswaId === siswa.id);
    const jmlSakit = absenSiswa.filter(a => a.status === 'S').length;
    const jmlIzin = absenSiswa.filter(a => a.status === 'I').length;
    const jmlAlpa = absenSiswa.filter(a => a.status === 'A').length;

    container.innerHTML = `
        <div class="text-black font-serif text-sm">
            <div class="text-center mb-8 border-b-4 border-black pb-4"><h2 class="text-2xl font-black uppercase tracking-widest">LAPORAN HASIL BELAJAR (RAPOR)</h2><h3 class="text-xl font-bold uppercase mt-1">${AppState.db.sekolah.nama}</h3><p class="text-xs font-normal mt-1">${AppState.db.sekolah.alamat || ''}</p></div>
            <div class="flex justify-between mb-6 font-semibold"><table class="w-1/2"><tr><td class="w-32 py-1">Nama Siswa</td><td>: <span class="font-bold">${siswa.nama}</span></td></tr><tr><td class="py-1">NIS</td><td>: ${siswa.nis || '-'}</td></tr></table><table class="w-1/2"><tr><td class="w-40 py-1">Kelas</td><td>: ${kelas ? kelas.kode : '-'}</td></tr><tr><td class="py-1">Tahun Ajaran</td><td>: ${AppState.db.sekolah.tahunAjaran} (${AppState.db.sekolah.semester})</td></tr></table></div>
            <table class="w-full border-collapse border-2 border-black mb-6"><thead class="bg-slate-100 font-bold text-center"><tr class="border-b-2 border-black"><th class="py-3 px-3 w-10 border-r border-black">No</th><th class="py-3 px-3 border-r border-black">Mata Pelajaran</th><th class="py-3 px-3 w-20 border-r border-black">Nilai Akhir</th><th class="py-3 px-3 w-20 border-r border-black">Predikat</th><th class="py-3 px-3">Capaian Kompetensi</th></tr></thead><tbody>${barisMapel}</tbody></table>
            
            <div class="w-64 border-2 border-black mb-10">
                <div class="bg-slate-100 font-bold py-1.5 px-3 border-b-2 border-black text-center">Ketidakhadiran</div>
                <table class="w-full text-xs">
                    <tr class="border-b border-black"><td class="py-1.5 px-3">Sakit</td><td class="py-1.5 px-3 text-right font-bold">${jmlSakit} hari</td></tr>
                    <tr class="border-b border-black"><td class="py-1.5 px-3">Izin</td><td class="py-1.5 px-3 text-right font-bold">${jmlIzin} hari</td></tr>
                    <tr><td class="py-1.5 px-3">Tanpa Keterangan</td><td class="py-1.5 px-3 text-right font-bold">${jmlAlpa} hari</td></tr>
                </table>
            </div>

            <div class="flex justify-between mt-12 px-10"><div class="text-center"><p class="mb-20">Mengetahui,<br>Kepala Sekolah</p><p class="font-bold border-b border-black inline-block px-4">${AppState.db.sekolah.kepsek}</p><p class="text-xs mt-1">NIP. ${AppState.db.sekolah.nip || '-'}</p></div><div class="text-center"><p class="mb-20"><br>Wali Kelas</p><p class="font-bold border-b border-black inline-block px-4">${kelas ? kelas.wali : '_____________________'}</p></div></div>
            <div class="text-center mt-12 no-print border-t border-slate-200 pt-8"><button onclick="window.print()" class="bg-slate-900 text-white font-bold py-3.5 px-10 rounded-xl shadow-2xl"><i class="fa-solid fa-print mr-2"></i> Cetak Rapor (PDF)</button></div>
        </div>
    `;
    container.classList.remove('hidden');
}

// ==========================================================
// BAGIAN 3: ENGINE KUIS, GAME SHOW, AUDIO & ASISTEN AI
// ==========================================================

function renderKuisPage(container) {
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}">${k.kode}</option>`).join('');   

    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6">
            <!-- HERO SECTION ARENA KUIS (DESAIN BARU) -->
        <div class="relative bg-slate-900 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl overflow-hidden p-8 lg:p-12 text-center mb-6">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="relative z-10">
                <span class="inline-block py-1.5 px-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase mb-4 shadow-inner">INTERACTIVE GAME SHOW</span>
                
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 mb-4 drop-shadow-lg">Arena Kuis Interaktif</h2>
                
                <p class="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                    Luncurkan kuis mode Single Player atau Duel dengan fitur Podium Top 3. Bersiaplah merasakan sensasi kompetisi kelas yang sesungguhnya!
                </p>

                <div class="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
                    <button onclick="openAudioSettingsModal()" class="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-slate-300 hover:text-white py-2.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-sm">
                        <i class="fa-solid fa-music mr-2"></i>Audio Efek
                    </button>
                    <button onclick="bukaPapanSkorPodium()" class="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 py-2.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-sm">
                        <i class="fa-solid fa-trophy mr-2"></i>Papan Skor
                    </button>
                    <button onclick="bukaModalBankSoal()" class="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 py-2.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-sm">
                        <i class="fa-solid fa-list-check mr-2"></i>Bank Soal <span id="header-bank-badge" class="ml-1.5 bg-purple-500 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-inner">${AppState.kuis.bankSoalManual.length}</span>
                    </button>
                </div>

                <div class="bg-slate-950/50 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-5 rounded-3xl w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-4 shadow-2xl ring-1 ring-white/5">
                    <div class="flex gap-4 w-full md:w-auto flex-1">
                        <div class="flex-1 text-left">
                            <label class="block text-[11px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Mulai Dari</label>
                            <input type="number" id="soal-dari" placeholder="1" min="1" class="w-full bg-slate-900 border border-slate-600 focus:border-indigo-500 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 text-center font-bold transition-all shadow-inner">
                        </div>
                        <div class="flex-1 text-left">
                            <label class="block text-[11px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Sampai Soal</label>
                            <input type="text" id="soal-sampai" placeholder="Semua" class="w-full bg-slate-900 border border-slate-600 focus:border-indigo-500 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30 text-center font-bold transition-all shadow-inner">
                        </div>
                    </div>
                    <button onclick="mulaiKuisBerdasarkanRentang()" class="w-full md:w-auto flex-none bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base sm:text-lg py-3.5 px-8 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-400/50 transition-all transform hover:scale-[1.03] active:scale-95 whitespace-nowrap group">
                        <i class="fa-solid fa-play mr-2 group-hover:animate-pulse"></i> MULAI ARENA
                    </button>
                </div>
            </div>
        </div>
            <div id="radar-tersulit-card" class="hidden bg-rose-950/80 border-2 border-rose-500/50 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex items-center space-x-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center text-2xl shrink-0 animate-pulse">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <h4 class="font-black text-sm uppercase tracking-wider text-rose-300">Radar Mispersepsi Kelas (Analisis Diagnostik)</h4>
                        <p id="radar-tersulit-msg" class="text-xs text-slate-300 mt-0.5">Ada soal yang dijawab salah oleh mayoritas siswa!</p>
                    </div>
                </div>
                <button onclick="bukaBedahSoalTersulit()" class="bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 px-5 rounded-2xl text-xs shadow-lg flex items-center shrink-0">
                    <i class="fa-solid fa-magnifying-glass-chart mr-2"></i> Bedah Soal Ini
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-white mb-2 flex items-center text-base">
                            <i class="fa-solid fa-file-excel text-emerald-500 mr-2"></i> Import Soal Cepat (EXCEL)
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Upload file <b>.xlsx, .docx, / .pdf</b>. Disarankan format Excel agar bebas error.
                        </p>
                        
                        <button onclick="downloadTemplateSoalExcel()" class="mb-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2 px-4 rounded-xl text-xs flex items-center transition-colors shadow-sm">
                            <i class="fa-solid fa-download mr-2"></i> Download Template Excel
                        </button>
                        
                        <div class="mb-4 bg-purple-50 dark:bg-purple-950/30 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                            <label class="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-1.5">Upload File Soal (.xlsx/.docx/.pdf):</label>
                            <input type="file" id="file-soal-input" accept=".xlsx, .xls, .docx, .pdf" onchange="bacaFileSoal(event)" class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer">
                        </div>

                        <div class="relative bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 p-1 hidden sm:block">
                            <textarea id="massal-input" rows="4" class="w-full p-3 bg-transparent text-xs font-mono focus:outline-none dark:text-white" placeholder="Text area untuk bacaan word/pdf/paste teks..."></textarea>
                        </div>
                    </div>
                    
                    <button onclick="prosesSoalMassal()" class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex justify-center items-center">
                        <i class="fa-solid fa-wand-magic-sparkles mr-2"></i> Masukkan Teks ke Bank Soal
                    </button>
                </div>

                <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold text-slate-800 dark:text-white flex items-center text-base">
                                <i class="fa-solid fa-pen-to-square text-blue-500 mr-2"></i> Tambah Soal Manual
                            </h3>
                            <button onclick="kosongkanBankSoal()" class="text-xs font-bold text-rose-500 hover:underline flex items-center">
                                <i class="fa-solid fa-trash-can mr-1"></i> Kosongkan Bank
                            </button>
                        </div>
                        
                        <div class="space-y-3">
                            <textarea id="man-soal" placeholder="Ketik pertanyaan soal di sini..." class="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 dark:text-white" rows="2"></textarea>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <input type="text" id="man-a" placeholder="Pilihan A" class="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 dark:text-white">
                                <input type="text" id="man-b" placeholder="Pilihan B" class="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 dark:text-white">
                                <input type="text" id="man-c" placeholder="Pilihan C" class="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 dark:text-white">
                                <input type="text" id="man-d" placeholder="Pilihan D" class="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 dark:text-white">
                            </div>

                            <select id="man-kunci" class="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800">
                                <option value="" disabled selected>-- Pilih Kunci Jawaban Benar --</option>
                                <option value="0">Kunci Jawaban: Opsi A</option>
                                <option value="1">Kunci Jawaban: Opsi B</option>
                                <option value="2">Kunci Jawaban: Opsi C</option>
                                <option value="3">Kunci Jawaban: Opsi D</option>
                            </select>
                        </div>
                    </div>

                    <button onclick="tambahKeDaftar()" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex justify-center items-center">
                        <i class="fa-solid fa-plus mr-2"></i> Simpan Soal ke Bank
                    </button>
                </div>
            </div>
        </div>
    `;
    const countEl = document.getElementById('man-count');
    const infoTotal = document.getElementById('total-bank-info');
    if (countEl) countEl.innerText = AppState.kuis.bankSoalManual.length;
    if (infoTotal) infoTotal.innerText = AppState.kuis.bankSoalManual.length;
    
    if (typeof cekRadarSoalTersulit === "function") cekRadarSoalTersulit();
}

function loadCustomAudio(type, input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const oldSrc = AppState.audio.elements[type].src;
        if (oldSrc && oldSrc.startsWith('blob:')) {
            URL.revokeObjectURL(oldSrc);
        }
        const url = URL.createObjectURL(file);
        AppState.audio.elements[type].src = url;
        showAlert("Audio Ditingkatkan", `Suara ${type.toUpperCase()} berhasil diganti.`, "success");
    }
}

function tambahKeDaftar() {
    const soal = document.getElementById('man-soal').value.trim();
    const a = document.getElementById('man-a').value.trim();
    const b = document.getElementById('man-b').value.trim();
    const c = document.getElementById('man-c').value.trim();
    const d = document.getElementById('man-d').value.trim();
    const kunci = document.getElementById('man-kunci').value;

    if(!soal || !a || !b || !c || !d || kunci === "") {
        return showAlert('Gagal', 'Harap lengkapi pertanyaan, 4 pilihan ganda, dan kunci jawaban.', 'error');
    }

    AppState.kuis.bankSoalManual.push({
        id: generateId(),
        soal: soal,
        opsi: [a, b, c, d],
        jawaban_benar_index: parseInt(kunci)
    });

    document.getElementById('man-soal').value = '';
    document.getElementById('man-a').value = '';
    document.getElementById('man-b').value = '';
    document.getElementById('man-c').value = '';
    document.getElementById('man-d').value = '';
    document.getElementById('man-kunci').value = '';

    simpanKeLocalStorage();
    showAlert('Berhasil', 'Soal berhasil ditambahkan ke Bank Soal!', 'success');
}

function prosesSoalMassal() {
    const teks = document.getElementById('massal-input').value.trim();
    if(!teks) return showAlert('Peringatan', 'Kotak input masih kosong!', 'error');

    const blokSoal = teks.split(/\n\s*\n/);
    let jumlahBerhasil = 0;

    blokSoal.forEach(blok => {
        const baris = blok.split('\n').map(b => b.trim()).filter(b => b.length > 0);
        if(baris.length < 5) return;

        const soal = baris[0].replace(/^\d+[\.\)]\s*/, '');
        let opsi = [];
        let kunciHuruf = 'A';

        for(let i = 1; i < baris.length; i++) {
            let b = baris[i];
            if(b.toUpperCase().startsWith('KUNCI')) {
                let parts = b.split(':');
                if(parts.length > 1) {
                    kunciHuruf = parts[1].trim().toUpperCase();
                }
            } else if(/^[A-D][\.\)]/i.test(b)) {
                opsi.push(b.replace(/^[A-D][\.\)]\s*/i, ''));
            }
        }

        if(opsi.length >= 4) {
            let kunciIndex = 0;
            if(kunciHuruf === 'B') kunciIndex = 1;
            else if(kunciHuruf === 'C') kunciIndex = 2;
            else if(kunciHuruf === 'D') kunciIndex = 3;

            AppState.kuis.bankSoalManual.push({
                id: generateId(),
                soal: soal,
                opsi: [opsi[0], opsi[1], opsi[2], opsi[3]],
                jawaban_benar_index: kunciIndex
            });
            jumlahBerhasil++;
        }
    });

    if(jumlahBerhasil > 0) {
        document.getElementById('massal-input').value = '';
        simpanKeLocalStorage();
        showAlert('Berhasil', `${jumlahBerhasil} soal berhasil dimasukkan ke Bank Soal.`, 'success');
    } else {
        showAlert('Format Tidak Dikenali', 'Pastikan format soal mengikuti contoh dan dipisahkan baris kosong antar soal.', 'error');
    }
}

function bacaFileSoal(event) {
    const file = event.target.files[0];
    if (!file) return;

    const namaFile = file.name.toLowerCase();
    const reader = new FileReader();

    if (namaFile.endsWith('.docx')) {
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                    document.getElementById('massal-input').value = result.value;
                    showAlert('Berhasil', 'File Word berhasil dibaca! Silakan klik tombol "Masukkan ke Bank Soal".', 'success');
                })
                .catch(function(err) {
                    showAlert('Error', 'Gagal membaca file Word: ' + err.message, 'error');
                });
        };
        reader.readAsArrayBuffer(file);
    } else if (namaFile.endsWith('.pdf')) {
        reader.onload = function(e) {
            const typedarray = new Uint8Array(e.target.result);
            pdfjsLib.getDocument(typedarray).promise.then(async function(pdf) {
                let teksPdf = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    let lastY = null;
                    let pageText = '';
                    for (let item of textContent.items) {
                        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
                            pageText += '\n';
                        }
                        pageText += item.str + ' ';
                        lastY = item.transform[5];
                    }
                    teksPdf += pageText + '\n\n';
                }
                document.getElementById('massal-input').value = teksPdf;
                showAlert('Berhasil', 'File PDF berhasil dibaca! Silakan klik tombol "Masukkan ke Bank Soal".', 'success');
            }).catch(function(err) {
                showAlert('Error', 'Gagal membaca file PDF: ' + err.message, 'error');
            });
        };
        reader.readAsArrayBuffer(file);
   } else if (namaFile.endsWith('.xlsx') || namaFile.endsWith('.xls')) {
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                let jumlahBerhasil = 0;
                for (let i = 1; i < jsonRows.length; i++) {
                    let row = jsonRows[i];
                    if (!row || row.length < 2) continue; 
                    
                    let soal = row[0] ? String(row[0]).trim() : '';
                    let a = row[1] ? String(row[1]).trim() : '';
                    let b = row[2] ? String(row[2]).trim() : '';
                    let c = row[3] ? String(row[3]).trim() : '';
                    let d = row[4] ? String(row[4]).trim() : '';
                    let kunciStr = row[5] ? String(row[5]).trim().toUpperCase() : 'A';
                    
                    if (!soal || !a) continue; 
                    
                    let kunciIndex = 0;
                    if (kunciStr === 'B') kunciIndex = 1;
                    else if (kunciStr === 'C') kunciIndex = 2;
                    else if (kunciStr === 'D') kunciIndex = 3;
                    
                    AppState.kuis.bankSoalManual.push({
                        id: generateId(),
                        soal: soal,
                        opsi: [a, b, c, d],
                        jawaban_benar_index: kunciIndex
                    });
                    jumlahBerhasil++;
                }
                
                if (jumlahBerhasil > 0) {
                    simpanKeLocalStorage();
                    document.getElementById('massal-input').value = 'Berhasil! ' + jumlahBerhasil + ' soal telah ditambahkan dari Excel.';
                    showAlert('Berhasil', `${jumlahBerhasil} soal dari Excel sukses dimasukkan ke Bank Soal!`, 'success');
                } else {
                    showAlert('Error', 'Data Excel kosong atau format tidak sesuai template.', 'error');
                }
            } catch (err) {
                showAlert('Error', 'Gagal membaca Excel: ' + err.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        showAlert('Error', 'Format file tidak didukung. Harap pilih .xlsx, .docx, atau .pdf', 'error');
    }
}

function mulaiKuisBerdasarkanRentang() {
    if (AppState.kuis.bankSoalManual.length === 0) {
        return showAlert('Peringatan', 'Bank soal masih kosong! Silakan import atau masukkan soal terlebih dahulu.', 'error');
    }

    let dariInput = document.getElementById('soal-dari');
    let sampaiInput = document.getElementById('soal-sampai');

    let dariNo = parseInt(dariInput ? dariInput.value : 1) || 1;
    let sampaiNo = parseInt(sampaiInput ? sampaiInput.value : AppState.kuis.bankSoalManual.length) || AppState.kuis.bankSoalManual.length;

    if (dariNo < 1) dariNo = 1;
    if (sampaiNo > AppState.kuis.bankSoalManual.length) sampaiNo = AppState.kuis.bankSoalManual.length;
    if (dariNo > sampaiNo) {
        return showAlert('Peringatan', 'Nomor "Dari" tidak boleh lebih besar dari "Sampai"!', 'error');
    }

    let soalPilihan = AppState.kuis.bankSoalManual.slice(dariNo - 1, sampaiNo);
    if (soalPilihan.length === 0) {
        return showAlert('Peringatan', 'Tidak ada soal pada rentang nomor tersebut.', 'error');
    }

    bukaArenaKuis(soalPilihan, true);
}

function kosongkanBankSoal() {
    if (confirm('Yakin ingin menghapus semua soal dari memori perangkat dan Cloud?')) {
        AppState.db.bankSoal = [];
        AppState.kuis.bankSoalManual = AppState.db.bankSoal;
        simpanKeLocalStorage();
        if (typeof renderDaftarSoalModal === 'function') renderDaftarSoalModal();
        showAlert('Berhasil', 'Bank soal telah dikosongkan dari HP dan Cloud!', 'success');
    }
}

function changeAITab(tab) {
    AppState.ui.aiTab = tab;
    renderAI(document.getElementById('main-content'));
}

function getActiveApiKey() {
    return localStorage.getItem(AppState.config.apiKeyStorage) || (AppState.db.pengaturan ? AppState.db.pengaturan.apiKey : '') || AppState.config.kunciApiPermanen;
}

function saveApiKey() {
    const key = document.getElementById('ai-apikey').value.trim();
    if(!key) return showAlert('Error', 'API Key tidak boleh kosong', 'error');
    localStorage.setItem(AppState.config.apiKeyStorage, key);
    if(!AppState.db.pengaturan) AppState.db.pengaturan = {};
    AppState.db.pengaturan.apiKey = key;
    saveDatabase();
    showAlert('Berhasil', 'API Key Gemini berhasil disimpan!', 'success');
    renderAI(document.getElementById('main-content'));
}

function resetApiKey() {
    if(confirm("Hapus API Key dari browser ini?")) {
        localStorage.removeItem(AppState.config.apiKeyStorage);
        if(AppState.db.pengaturan) AppState.db.pengaturan.apiKey = '';
        saveDatabase();
        renderAI(document.getElementById('main-content'));
    }
}

function renderAI(container) {
    const savedKey = getActiveApiKey();
    
    let content = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8 max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-1">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white"><i class="fa-solid fa-robot text-purple-500 mr-2"></i>Asisten AI Guru</h3>
                ${savedKey ? `<button onclick="resetApiKey()" class="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-xl hover:bg-rose-100"><i class="fa-solid fa-key mr-1"></i> Ganti API Key</button>` : ''}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">Otomatiskan penyusunan TP/ATP, Soal Ujian, dan Kuis Interaktif dengan Google Gemini.</p>
    `;

    if (!savedKey) {
        content += `
            <div class="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 mt-4">
                <h4 class="font-bold text-purple-800 dark:text-purple-300 mb-2"><i class="fa-solid fa-key mr-2"></i>Setup API Key Gemini</h4>
                <p class="text-sm text-purple-700 dark:text-purple-300 mb-4">Untuk menggunakan Asisten AI, masukkan API Key Gemini Anda. Anda dapat membuatnya secara gratis di Google AI Studio.</p>
                
                <input type="password" id="ai-apikey" placeholder="Paste API Key di sini..." class="w-full bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-xl px-4 py-3.5 mb-4 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white">
                
                <div class="flex flex-wrap items-center gap-3">
                    <button onclick="saveApiKey()" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-purple-500/20 transition-all">
                        Kunci API Key & Mulai
                    </button>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold py-3 px-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm transition-all inline-flex items-center">
                        Dapatkan API Key Gratis
                    </a>
                </div>
            </div>
        `;
    } else {
        content += `
            <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 mb-6 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                <button onclick="changeAITab('kuis_ai')" class="flex-1 py-2 px-3 rounded-xl font-bold transition-all text-xs ${AppState.ui.aiTab==='kuis_ai'?'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm':'text-slate-500 dark:text-slate-400'}"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Kuis AI</button>
                <button onclick="changeAITab('soal')" class="flex-1 py-2 px-3 rounded-xl font-bold transition-all text-xs ${AppState.ui.aiTab==='soal'?'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm':'text-slate-500 dark:text-slate-400'}"><i class="fa-solid fa-file-signature mr-1"></i>Soal Ujian</button>
                <button onclick="changeAITab('tp')" class="flex-1 py-2 px-3 rounded-xl font-bold transition-all text-xs ${AppState.ui.aiTab==='tp'?'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm':'text-slate-500 dark:text-slate-400'}"><i class="fa-solid fa-layer-group mr-1"></i>TP & ATP</button>
           </div>
           <div id="ai-workspace" class="min-h-[260px]"></div>
        `;
        setTimeout(() => renderAIWorkspace(), 10);
    }
    content += `</div>`;
    container.innerHTML = content;
}

function renderAIWorkspace() {
    const ws = document.getElementById('ai-workspace');
    if(!ws) return;

    if (AppState.ui.aiTab === 'kuis_ai') {
        ws.innerHTML = `
            <div class="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 mb-4">
                <p class="text-xs text-slate-600 dark:text-slate-300 mb-4">Ketik topik materi apa saja, AI akan meracik soal pilihan ganda dan <b>langsung membuka Arena Kuis Layar Penuh</b> (sekaligus menyimpannya ke Bank Soal Anda).</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Topik Materi Kuis</label><input type="text" id="ai-topik-kuis" placeholder="Contoh: Planet & Tata Surya" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white"></div>
                    <div><label class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">Jumlah Pertanyaan</label><select id="ai-jumlah-kuis" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white"><option value="5">5 Pertanyaan</option><option value="10">10 Pertanyaan</option></select></div>
                </div>
                <button onclick="runAIKuis()" id="btn-kuis" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg"><i class="fa-solid fa-bolt mr-2"></i>Generate & Luncurkan Arena Kuis!</button>
            </div>
            <div id="ai-result" class="hidden"></div>
        `;
    } else if (AppState.ui.aiTab === 'soal') {
        ws.innerHTML = `
            <div id="form-buat-soal" class="space-y-4 mb-4">
                <input type="text" id="ai-materi-soal" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Topik Materi Ujian (Contoh: Sistem Tata Surya)">
                <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <label class="block text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">
                        <i class="fa-solid fa-clipboard-list mr-1"></i> Format Soal Khas Sekolah (Opsional)
                    </label>
                    <textarea id="ai-format-soal" class="w-full border border-amber-300 dark:border-amber-700 rounded-lg px-4 py-3 h-24 bg-white dark:bg-slate-800 dark:text-white" placeholder="Kosongkan jika ingin format standar. Atau paste format sekolah Anda. (Contoh: I Pilihan Ganda 10 soal, II Menjodohkan 5 soal, III Esai 3 soal)"></textarea>
                </div>
            </div>
            <button onclick="runAISoalTulis()" id="btn-soal-tulis" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 px-4 rounded-xl shadow-lg transition-all mb-4">
                <i class="fa-solid fa-file-signature mr-2"></i> Rancang Soal Ujian Rapi
            </button>
            <div id="ai-actions" class="hidden mb-3 flex justify-end">
                <button onclick="unduhHasilAIKeWord('Naskah_Soal_Ujian')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md flex items-center">
                    <i class="fa-solid fa-file-word mr-2 text-sm"></i> Download File Word (.doc)
                </button>
            </div>
           <div id="ai-result" class="hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-sm text-slate-800 ai-prose dark:text-slate-200"></div>
        `;
    } else if (AppState.ui.aiTab === 'tp') {
        ws.innerHTML = `
            <div id="form-perangkat-ajar" class="space-y-4 mb-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Mode Perumusan:</label>
                    <select id="ai-mode-cp" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none dark:text-white font-bold" onchange="document.getElementById('mode-mandiri').classList.toggle('hidden'); document.getElementById('mode-resmi').classList.toggle('hidden');">
                        <option value="resmi">Mode Resmi (Berdasarkan CP Baku Kemdikbud)</option>
                        <option value="mandiri">Mode Mandiri (Fleksibel untuk Swasta/Custom)</option>
                    </select>
                </div>
                <div id="mode-resmi" class="space-y-3">
                    <textarea id="ai-cp-resmi" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 h-28 dark:text-white" placeholder="Paste teks Capaian Pembelajaran (CP) resmi dari kementerian di sini..."></textarea>
                    <input type="text" id="ai-topik-resmi" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Topik Materi Utama">
                    <input type="number" id="ai-jp-resmi" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Total Alokasi Waktu (Contoh: 12 JP)">
                </div>
                <div id="mode-mandiri" class="space-y-3 hidden">
                    <input type="text" id="ai-mapel-tp" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Mata Pelajaran (misal: IPAS)">
                    <input type="text" id="ai-fase-tp" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Fase / Kelas (misal: Fase B / Kelas 4)">
                    <input type="text" id="ai-topik-tp" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Topik Materi Utama">
                    <input type="number" id="ai-jp-tp" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 dark:text-white" placeholder="Total Alokasi Waktu (Contoh: 12 JP)">
                </div>
                <label class="flex items-center space-x-3 mt-4 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 cursor-pointer transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                    <input type="checkbox" id="ai-cek-pid" checked class="w-5 h-5 text-indigo-600 rounded">
                    <span class="font-bold text-indigo-800 dark:text-indigo-300 text-sm">Sertakan Ide Skenario Papan Interaktif Digital (PID)</span>
                </label>
            </div>
            <button onclick="runAITpAtp()" id="btn-tp" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-4 rounded-xl shadow-lg transition-all mb-4">
                <i class="fa-solid fa-layer-group mr-2"></i> Generate ATP (Deep Learning)
            </button>
            <div id="ai-actions" class="hidden mb-3 flex flex-col space-y-3">
                <div class="flex justify-end border-b border-slate-200 dark:border-slate-700 pb-3 mb-2">
                    <button onclick="unduhHasilAIKeWord('TP_ATP_Kurikulum_Merdeka')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md flex items-center">
                        <i class="fa-solid fa-file-word mr-2 text-sm"></i> Download File Word (.doc)
                    </button>
                </div>
                <div id="super-app-buttons"></div>
            </div>
            <div id="ai-result" class="hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-sm ai-prose dark:text-slate-200"></div>
        `;
   }
}

async function dapatkanModelAktif(apiKey) {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        
        if (data.models && Array.isArray(data.models)) {
            const valid = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace(/^models\//, ''));
            const flashModels = valid.filter(name => name.includes("flash") && !name.includes("pro"));
            const otherModels = valid.filter(name => !name.includes("flash") && !name.includes("pro"));
            const urutanModel = [...flashModels, ...otherModels];
            if (urutanModel.length > 0) return urutanModel;
        }
    } catch (e) { console.warn("Fallback ListModels", e); }
    return ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b"];
}

async function panggilGeminiAntiGagal(prompt, systemInstruction = "") {
    const apiKey = getActiveApiKey();
    if (!apiKey) throw new Error("API Key Gemini belum diisi. Masukkan API Key terlebih dahulu.");
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    const daftarModel = await dapatkanModelAktif(apiKey);
    let pesanErrorTerakhir = "";

    for (const namaModel of daftarModel) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${namaModel}:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.error) {
                pesanErrorTerakhir = result.error.message || "Gagal menghubungi model.";
                if (result.error.code === 400 && result.error.message.includes("API key")) {
                    throw new Error("API Key tidak valid. Periksa kembali kunci API Anda.");
                }
                continue; 
            }
            if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                return result.candidates[0].content.parts[0].text;
            }
        } catch (err) { pesanErrorTerakhir = err.message; }
    }
    throw new Error(pesanErrorTerakhir || "Seluruh model yang tersedia gagal memberikan respon.");
}

async function askGemini(prompt, systemInstruction = "") {
    try {
        return await panggilGeminiAntiGagal(prompt, systemInstruction);
    } catch (e) { return "ERROR: " + e.message; }
}

function unduhHasilAIKeWord(namaFileDefault = 'Dokumen_Smart_Teacher') {
    const resDiv = document.getElementById('ai-result');
    if (!resDiv || !resDiv.innerHTML.trim()) return showAlert('Peringatan', 'Tidak ada konten naskah untuk diunduh!', 'error');

    const kontenHtml = resDiv.innerHTML;
    let namaFile = namaFileDefault; 
    if (kontenHtml.includes("MODUL AJAR") || kontenHtml.includes("RPP")) namaFile = "Modul_Ajar_AI";
    else if (kontenHtml.includes("PROGRAM SEMESTER") || kontenHtml.includes("PROMES")) namaFile = "Promes_AI";
    else if (kontenHtml.includes("LEMBAR KERJA") || kontenHtml.includes("LKPD")) namaFile = "LKPD_AI";
    else if (kontenHtml.includes("TUJUAN PEMBELAJARAN") || kontenHtml.includes("ATP")) namaFile = "ATP_AI";
    
    const judul = namaFile.replace(/_/g, ' ');
    const headerHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${judul}</title><style>body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; } h1, h2, h3, h4 { color: #111; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; } h3 { font-size: 14pt; } h4 { font-size: 12pt; } table { border-collapse: collapse; width: 100%; margin-top: 10pt; margin-bottom: 10pt; } table, th, td { border: 1px solid #000; padding: 6pt 8pt; font-size: 11pt; } th { background-color: #f2f2f2; font-weight: bold; } ul, ol { margin-left: 20pt; padding-left: 0; } li { margin-bottom: 4pt; } p { margin-bottom: 6pt; }</style></head><body>`;
    const footerHtml = "</body></html>";
    const dokumenUtuh = headerHtml + kontenHtml + footerHtml;

    const blob = new Blob(['\ufeff', dokumenUtuh], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const linkUnduh = document.createElement('a');
    linkUnduh.href = url;
    linkUnduh.download = namaFile + '.doc';
    document.body.appendChild(linkUnduh);
    linkUnduh.click();
    document.body.removeChild(linkUnduh);
    URL.revokeObjectURL(url);
    showAlert("Berhasil", "File " + namaFile + " berhasil diunduh!", "success");
}

async function runAISoalTulis() {
    const materi = document.getElementById('ai-materi-soal').value;
    const formatBebas = document.getElementById('ai-format-soal').value;
    const btn = document.getElementById('btn-soal-tulis');
    const resDiv = document.getElementById('ai-result');
    const actDiv = document.getElementById('ai-actions');
    
    if(!materi) return showAlert('Peringatan', 'Topik materi ujian harus diisi.', 'error');

    const prompt = `Buatkan soal ujian tertulis untuk materi: "${materi}".
    ${formatBebas ? 'PENTING: Anda WAJIB mengikuti format pembagian soal ini 100%: ' + formatBebas : 'Gunakan format: 10 Pilihan Ganda dan 5 Esai.'}
    ATURAN TATA LETAK SANGAT KETAT: 1. Angka nomor soal dan teks pertanyaan WAJIB berada di baris yang sama. 2. Pilihan Ganda (A, B, C, D, E) WAJIB disusun ke bawah berurutan. 3. Sertakan Kunci Jawaban di akhir. 4. Output HTML rapi tanpa markdown.`;

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Merancang Ujian...`;
    btn.disabled = true;
    resDiv.classList.add('hidden');
    if (actDiv) actDiv.classList.add('hidden');

    const res = await askGemini(prompt);
    
    btn.innerHTML = `<i class="fa-solid fa-file-signature mr-2"></i> Rancang Soal Ujian Rapi`;
    btn.disabled = false;
    resDiv.innerHTML = res.replace(/```html/gi, '').replace(/```/g, '').trim();
    resDiv.classList.remove('hidden');
    if (actDiv) actDiv.classList.remove('hidden');
}

async function runAIKuis() {
    const topik = document.getElementById('ai-topik-kuis').value;
    const jumlah = document.getElementById('ai-jumlah-kuis').value;
    if(!topik) return showAlert('Peringatan', 'Isi topik kuis terlebih dahulu.', 'error');

    const btn = document.getElementById('btn-kuis');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Meracik Soal & Membuka Arena...`;
    btn.disabled = true;
    const resDiv = document.getElementById('ai-result');

    try {
        const promptKuis = `Buatkan kuis pilihan ganda tentang "${topik}" sebanyak ${jumlah} soal. KEMBALIKAN HANYA FORMAT ARRAY JSON MURNI! Tanpa penjelasan apapun, tanpa markdown pembungkus. Contoh format: [{"soal": "Pertanyaan?", "opsi": ["A", "B", "C", "D"], "jawaban_benar_index": 0}]`;
        const rawText = await panggilGeminiAntiGagal(promptKuis);

        btn.innerHTML = `<i class="fa-solid fa-bolt mr-2"></i>Generate & Luncurkan Arena Kuis!`;
        btn.disabled = false;

        let cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonMatch = cleanJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) cleanJson = jsonMatch[0];
        else {
            let awal = cleanJson.indexOf('[');
            let akhir = cleanJson.lastIndexOf(']') + 1;
            if(awal !== -1 && akhir !== 0) cleanJson = cleanJson.substring(awal, akhir);
        }

        const generatedQuestions = JSON.parse(cleanJson);                
        AppState.kuis.bankSoalManual.push(...generatedQuestions);
        simpanKeLocalStorage();

        resDiv.classList.add('hidden');
        bukaArenaKuis(generatedQuestions, true);

    } catch (e) {
        btn.innerHTML = `<i class="fa-solid fa-bolt mr-2"></i>Generate & Luncurkan Arena Kuis!`;
        btn.disabled = false;
        resDiv.innerHTML = `<div class="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800"><p class="font-bold">Pesan Gemini AI:</p><p class="text-xs mt-1 font-mono">${e.message}</p></div>`;
        resDiv.classList.remove('hidden');
    }
}

async function runAITpAtp() {
    const mode = document.getElementById('ai-mode-cp').value;
    const cekPID = document.getElementById('ai-cek-pid').checked;
    const btn = document.getElementById('btn-tp');
    const resDiv = document.getElementById('ai-result');
    const actDiv = document.getElementById('ai-actions');
    let promptDasar = "";
    
    if (mode === 'mandiri') {
        const mapel = document.getElementById('ai-mapel-tp').value;
        const fase = document.getElementById('ai-fase-tp').value;
        const topik = document.getElementById('ai-topik-tp').value;
        const jp = document.getElementById('ai-jp-tp').value;
        if(!mapel || !fase || !topik || !jp) return showAlert('Peringatan', 'Isi semua kolom Mode Mandiri.', 'error');
        promptDasar = `Buatkan rumusan Capaian Pembelajaran (CP) secara mandiri, lalu turunkan menjadi Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) untuk:\nMapel: ${mapel}\nFase:${fase}\nTopik: ${topik}\nAlokasi:${jp} JP.`;
    } else {
        const cp = document.getElementById('ai-cp-resmi').value;
        const topik = document.getElementById('ai-topik-resmi').value;
        const jp = document.getElementById('ai-jp-resmi').value;
        if(!cp || !topik || !jp) return showAlert('Peringatan', 'Isi teks CP, Topik, dan Alokasi JP.', 'error');
        promptDasar = `Berdasarkan teks Capaian Pembelajaran (CP) Resmi ini:\n"${cp}"\n\nBedah dan turunkan CP tersebut menjadi Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) khusus untuk Topik: ${topik}, dengan Alokasi:${jp} JP.`;
    }

    const prompt = `${promptDasar}
    INSTRUKSI WAJIB: 1. Output TABEL HTML murni. 2. Kolom 1 (Tujuan Pembelajaran & JP), Kolom 2 (Alur Pembelajaran) ${cekPID ? ', Kolom 3 (Skenario PID)' : ''}. 3. Tanpa markdown.`;

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Merumuskan ATP...`;
    btn.disabled = true;
    resDiv.classList.add('hidden');
    if(actDiv) actDiv.classList.add('hidden');

    const res = await askGemini(prompt);
    
    btn.innerHTML = `<i class="fa-solid fa-layer-group mr-2"></i> Generate ATP (Deep Learning)`;
    btn.disabled = false;
    resDiv.innerHTML = res.replace(/```html/gi, '').replace(/```/g, '').trim();
    resDiv.classList.remove('hidden');

    if(actDiv) {
        document.getElementById('super-app-buttons').innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onclick="generateSuperApp('promes')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1"><i class="fa-solid fa-calendar-week mr-2"></i> Sulap jadi PROMES</button>
                <button onclick="generateSuperApp('rpp')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1"><i class="fa-solid fa-book-open mr-2"></i> Sulap Modul Ajar/RPP</button>
                <button onclick="generateSuperApp('lkpd')" class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1"><i class="fa-solid fa-file-pen mr-2"></i> Sulap jadi LKPD</button>
            </div>
        `;
        actDiv.classList.remove('hidden');
    }
}

async function generateSuperApp(jenis) {
    const resDiv = document.getElementById('ai-result');
    const atpData = resDiv.innerText; 
    const btnIkon = document.querySelector(`button[onclick="generateSuperApp('${jenis}')"] i`);
    if(!atpData || atpData.length < 50) return showAlert("Error", "Gagal membaca konteks ATP.", "error");
    
    let promptSuper = "";
    if(jenis === 'promes') {
        const minggu = prompt("Masukkan jumlah Minggu Efektif di semester ini (Contoh: 18):", "18");
        if(!minggu) return;
        promptSuper = `Berdasarkan ATP ini:\n${atpData}\n\nBuatkan Program Semester (PROMES) lengkap dengan alokasi ${minggu} minggu efektif. Distribusikan JP ke dalam minggu-minggu tersebut. Buat dalam format tabel HTML rapi.`;
    } else if(jenis === 'rpp') {
        const formatKhusus = prompt("Punya format Modul Ajar khas sekolah? (Ketik/Paste di sini. Atau biarkan KOSONG untuk format resmi Kurikulum Merdeka terbaru)");
        promptSuper = `Berdasarkan ATP ini:\n${atpData}\n\nBuatkan satu Modul Ajar (RPP) mutakhir yang komprehensif. Wajib masukkan kegiatan "Deep Learning" dan penggunaan "Papan Interaktif Digital (PID)" di Kegiatan Inti.\n${formatKhusus ? 'PENTING: Gunakan susunan format ini 100%: ' + formatKhusus : 'Gunakan format baku Modul Ajar Kurikulum Merdeka Terbaru.'}\nOutput wajib murni HTML rapi.`;
    } else if(jenis === 'lkpd') {
        promptSuper = `Berdasarkan ATP ini:\n${atpData}\n\nBuatkan panduan dan format Lembar Kerja Peserta Didik (LKPD) yang interaktif, memicu nalar kritis (Deep Learning), dan menyenangkan. Output HTML murni.`;
    }

    const ikonAsli = btnIkon.className;
    btnIkon.className = "fa-solid fa-spinner fa-spin mr-2";
    const res = await askGemini(promptSuper);
    resDiv.innerHTML = res.replace(/```html/gi, '').replace(/```/g, '').trim();
    btnIkon.className = ikonAsli;
}

let globalAudioCtx = null;
function getAudioCtx() {
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
}

function playTick(freq = 600) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq; 
        gain.gain.value = 0.12;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.08);
        osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
}

function playSoundEffect(type) {
    let sound = AppState.audio.elements[type];
    if(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Gagal memutar efek:", e));
    }
}

function playCelebrationAudio(skor) {
    stopBGM();
    if (skor >= 80) {
        playSoundEffect('selebrasi');
        setTimeout(() => playSoundEffect('tangan'), 300);
        confetti({ particleCount: 180, spread: 120, origin: { y: 0.6 } });
    } else if (skor >= 60) {
        playSoundEffect('biasa');
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
        playSoundEffect('motivasi');
    }
}

function dapatkanPredikatKinerja(skor) {
    if (skor === 100) return { predikat: "👑 MVP CLASS", status: "Sempurna! Menyapu Bersih Seluruh Soal Tanpa Sisa", color: "from-amber-400 to-yellow-600", icon: "fa-crown" };
    else if (skor >= 80) return { predikat: "🔥 SUHU PRO PLAYER", status: "Luar Biasa! Tampil Sangat Baik dan Menguasai Materi", color: "from-rose-500 to-pink-600", icon: "fa-fire-flame-curved" };
    else if (skor >= 70) return { predikat: "⚡ BINTANG HARAPAN", status: "Bagus! Memenuhi Ketuntasan Minimal (KKM)", color: "from-cyan-400 to-blue-600", icon: "fa-bolt" };
    else if (skor >= 60) return { predikat: "🛡️ PEJUANG KKM", status: "Cukup! Tetap Tingkatkan Pemahaman Materi Pokok", color: "from-emerald-500 to-teal-600", icon: "fa-shield-halved" };
    else return { predikat: "☕ PEJUANG BELAJAR", status: "Tetap Semangat! Belajar Lagi dan Rebut Mahkota di Kuis Berikutnya", color: "from-slate-600 to-slate-800", icon: "fa-mug-hot" };
}

function startAutoBGM() {
    AppState.audio.isBgmOn = true;
    if (AppState.audio.elements.bgm) {
        AppState.audio.elements.bgm.volume = 1.0;
        AppState.audio.elements.bgm.play().catch(e => console.log(e));
    }
    const btn = document.getElementById('btn-sound-toggle');
    if(btn) {
        btn.innerHTML = '<i class="fa-solid fa-volume-high sm:mr-2"></i> <span class="hidden sm:inline">Musik Nyala</span>';
        btn.className = "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg transition-all flex items-center";
    }
}

function toggleBGMPlay() {
    AppState.audio.isBgmOn = !AppState.audio.isBgmOn;
    const btn = document.getElementById('btn-sound-toggle');
    if (AppState.audio.isBgmOn) {
        AppState.audio.elements.bgm.play().catch(e => console.log(e));
        if(btn) {
            btn.innerHTML = '<i class="fa-solid fa-volume-high sm:mr-2"></i> <span class="hidden sm:inline">Musik Nyala</span>';
            btn.className = "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg transition-all flex items-center";
        }
    } else {
        AppState.audio.elements.bgm.pause();
        if(btn) {
            btn.innerHTML = '<i class="fa-solid fa-volume-xmark sm:mr-2"></i> <span class="hidden sm:inline">Musik Mati</span>';
            btn.className = "bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg transition-all flex items-center";
        }
    }
}

function stopBGM() {
    AppState.audio.isBgmOn = false;
    clearInterval(AppState.kuis.timerInterval);
    clearQuizTimeouts();
    if (AppState.audio.elements.bgm) {
        AppState.audio.elements.bgm.pause();
        AppState.audio.elements.bgm.currentTime = 0;
    }
}

function undiPemainSpin() {
    const klsId = document.getElementById('lobby-kelas').value;
    if (!klsId) return showAlert('Peringatan', 'Pilih kelas terlebih dahulu!');

    const listSiswa = AppState.db.siswa.filter(s => s.kelasId === klsId);
    if (listSiswa.length === 0) return showAlert('Peringatan', 'Belum ada siswa!');

    AppState.kuis.siswaTelahMainSingle = AppState.kuis.siswaTelahMainSingle || [];
    let siswaBelumMain = listSiswa.filter(s => !AppState.kuis.siswaTelahMainSingle.includes(s.id));
    
    if (siswaBelumMain.length === 0) {
        showAlert('Info', 'Semua siswa sudah maju di Mode Single! Tabung undian di-reset ulang.', 'info');
        AppState.kuis.siswaTelahMainSingle = []; 
        siswaBelumMain = listSiswa; 
    }

    const daftarSemuaNama = listSiswa.map(s => s.nama);
    let acakSiswa = [...siswaBelumMain].sort(() => 0.5 - Math.random());
    let pemenang = acakSiswa[0];
    AppState.kuis.siswaTelahMainSingle.push(pemenang.id);
    document.getElementById('lobby-siswa').value = pemenang.id;
    eksekusiUndianMewah('single', pemenang.nama, null, daftarSemuaNama);
}

function undiPemainDuelSpin() {
    const klsId = document.getElementById('lobby-kelas').value;
    if (!klsId) return showAlert('Peringatan', 'Pilih kelas terlebih dahulu!');

    const listSiswa = AppState.db.siswa.filter(s => s.kelasId === klsId);
    if (listSiswa.length < 2) return showAlert('Peringatan', 'Siswa kurang dari 2!');

    AppState.kuis.siswaTelahMainDuel = AppState.kuis.siswaTelahMainDuel || [];
    let siswaBelumMain = listSiswa.filter(s => !AppState.kuis.siswaTelahMainDuel.includes(s.id));
    
    if (siswaBelumMain.length < 2) {
        showAlert('Info', 'Sisa siswa habis di Mode Duel. Tabung undian duel di-reset ulang!', 'info');
        AppState.kuis.siswaTelahMainDuel = []; 
        siswaBelumMain = listSiswa;
    }

    const daftarSemuaNama = listSiswa.map(s => s.nama);
    let acakSiswa = [...siswaBelumMain].sort(() => 0.5 - Math.random());
    let siswa1 = acakSiswa[0];
    let siswa2 = acakSiswa[1];

    AppState.kuis.siswaTelahMainDuel.push(siswa1.id);
    AppState.kuis.siswaTelahMainDuel.push(siswa2.id);
    document.getElementById('lobby-pemain-a').value = siswa1.id;
    document.getElementById('lobby-pemain-b').value = siswa2.id;
    eksekusiUndianMewah('duel', siswa1.nama, siswa2.nama, daftarSemuaNama);
}

function bukaArenaKuis(soalArray, isNewSession = true) {
    clearQuizTimeouts();
    if (isNewSession || !AppState.kuis.masterQuizSession) {
        AppState.kuis.masterQuizSession = JSON.parse(JSON.stringify(soalArray));
    }
    if (!AppState.kuis.kelasAktif && localStorage.getItem('ST_LAST_KELAS')) {
        AppState.kuis.kelasAktif = localStorage.getItem('ST_LAST_KELAS');
    }
    if (!AppState.kuis.mapelAktif && localStorage.getItem('ST_LAST_MAPEL')) {
        AppState.kuis.mapelAktif = localStorage.getItem('ST_LAST_MAPEL');
    }

    const arenaModal = document.getElementById('quiz-arena-modal');
    const arenaBody = document.getElementById('quiz-arena-body');
    arenaModal.classList.remove('hidden');
    
    let kelasOpts = AppState.db.kelas.map(k => `<option value="${k.id}" ${AppState.kuis.kelasAktif === k.id ? 'selected' : ''}>${k.kode}</option>`).join('');
    let mapelOpts = AppState.db.mapel.map(m => `<option value="${m.id}" ${AppState.kuis.mapelAktif === m.id ? 'selected' : ''}>${m.nama}</option>`).join('');

    arenaBody.innerHTML = `
        <div class="bg-slate-900/95 p-8 rounded-[2rem] border-2 border-amber-500/30 max-w-xl mx-auto w-full shadow-2xl text-center fade-in relative z-20">
            <i class="fa-solid fa-user-graduate text-5xl text-amber-400 mb-4 animate-bounce"></i>
            <h3 class="text-2xl font-black text-white mb-1">Identitas Pemain & Mode Game</h3>
            <p class="text-xs text-slate-400 mb-5">Pilih mode kuis Single Player atau Pertandingan Duel 2 Siswa!</p>
            
            <div class="grid grid-cols-2 gap-2 p-1.5 bg-slate-800 rounded-2xl mb-5 border border-slate-700">
                <button type="button" id="tab-mode-single" onclick="setModeKuisLobby('single')" class="py-2.5 text-xs font-extrabold rounded-xl transition-all ${AppState.kuis.modeKuis === 'single' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                    <i class="fa-solid fa-user mr-1.5"></i> Single Player
                </button>
                <button type="button" id="tab-mode-duel" onclick="setModeKuisLobby('duel')" class="py-2.5 text-xs font-extrabold rounded-xl transition-all ${AppState.kuis.modeKuis === 'duel' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                    <i class="fa-solid fa-bolt text-amber-400 mr-1.5"></i> Mode Duel (2 Siswa)
                </button>
            </div>
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">⏱️ Durasi Waktu Per Soal</label>
                    <select id="lobby-durasi" class="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-500 text-xs">
                        <option value="10">10 Detik</option>
                        <option value="15" selected>15 Detik (Default)</option>
                        <option value="30">30 Detik</option>
                        <option value="60">60 Detik</option>
                    </select>
                </div>
            <div class="space-y-4 text-left mt-3">
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">1. Pilih Kelas</label>
                    <select id="lobby-kelas" onchange="updateLobbySiswa()" class="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-500 text-xs">
                        <option value="">-- Pilih Kelas --</option>
                        ${kelasOpts}
                    </select>
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">2. Mata Pelajaran</label>
                    <select id="lobby-mapel" class="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-500 text-xs">
                        <option value="">-- Pilih Mapel --</option>
                        ${mapelOpts}
                    </select>
                </div>

                <!-- LOBBY SINGLE PLAYER -->
                <div id="lobby-single-container" class="${AppState.kuis.modeKuis === 'single' ? '' : 'hidden'} space-y-3">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">3. Nama Siswa</label>
                        <div class="flex space-x-2 mb-2">
                            <select id="lobby-siswa" class="flex-1 p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-500 text-xs">
                                <option value="">-- Pilih Kelas Terlebih Dahulu --</option>
                            </select>
                            <button type="button" onclick="undiPemainSpin()" id="btn-undi-spin" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black px-3.5 rounded-xl shadow-lg transition-all flex items-center shrink-0 text-xs">
                                <i class="fa-solid fa-dice text-base mr-1"></i> Undi
                            </button>
                        </div>
                        <input type="text" id="lobby-manual" placeholder="Atau ketik nama manual..." class="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-500 text-xs">
                    </div>
                </div>

                <!-- LOBBY DUEL MODE -->
                <div id="lobby-duel-container" class="${AppState.kuis.modeKuis === 'duel' ? '' : 'hidden'} space-y-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700">
                    <div class="flex justify-between items-center">
                        <p class="text-xs font-extrabold text-amber-400 uppercase tracking-wider"><i class="fa-solid fa-shield-halved mr-1.5"></i>Arena Head-to-Head 2 Siswa</p>
                        <button type="button" onclick="undiPemainDuelSpin()" id="btn-undi-duel-spin" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-3 py-1 rounded-xl shadow-md transition-all text-[11px] flex items-center">
                            <i class="fa-solid fa-dice mr-1"></i> Undi 2 Lawan
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[11px] font-bold text-cyan-400 block mb-1">Pemain 1 (Kiri - Biru)</label>
                            <select id="lobby-pemain-a" class="w-full p-2 rounded-xl bg-slate-900 text-white border border-cyan-500/50 text-xs outline-none">
                                <option value="">-- Pemain A --</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-rose-400 block mb-1">Pemain 2 (Kanan - Merah)</label>
                            <select id="lobby-pemain-b" class="w-full p-2 rounded-xl bg-slate-900 text-white border border-rose-500/50 text-xs outline-none">
                                <option value="">-- Pemain B --</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                    <label for="acak-soal-checkbox" class="text-xs font-bold text-slate-300 cursor-pointer flex items-center select-none">
                        <i class="fa-solid fa-shuffle text-amber-400 mr-2.5"></i> Acak Urutan Soal (Shuffle)
                    </label>
                    <input type="checkbox" id="acak-soal-checkbox" class="w-5 h-5 accent-amber-500 cursor-pointer" checked>
                </div>
            </div>

            <button id="btn-mulai-kuis" onclick="mulaiKuisSebenarnya()" class="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-base">MULAI MENGERJAKAN SOAL</button>
            <button onclick="keluarArenaKuis()" class="w-full mt-2.5 text-slate-400 font-bold hover:text-white py-1.5 text-xs transition-colors">Batal / Kembali</button>
        </div>
    `;
    document.getElementById('arena-progress-text').innerText = "Persiapan Kuis";

    if (AppState.kuis.kelasAktif) {
        setTimeout(() => {
            const selKelas = document.getElementById('lobby-kelas');
            if (selKelas) {
                selKelas.value = AppState.kuis.kelasAktif;
                AppState.kuis.siswaAktif = null;
                AppState.kuis.pemainA_Id = null;
                AppState.kuis.pemainB_Id = null;
                updateLobbySiswa();
            }
        }, 50);
    }
}

function setModeKuisLobby(mode) {
    AppState.kuis.modeKuis = mode;
    const btnSingle = document.getElementById('tab-mode-single');
    const btnDuel = document.getElementById('tab-mode-duel');
    const singleBox = document.getElementById('lobby-single-container');
    const duelBox = document.getElementById('lobby-duel-container');

    if (mode === 'single') {
        btnSingle.className = "py-2.5 text-xs font-extrabold rounded-xl transition-all bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md";
        btnDuel.className = "py-2.5 text-xs font-extrabold rounded-xl transition-all text-slate-400 hover:text-white";
        singleBox.classList.remove('hidden');
        duelBox.classList.add('hidden');
    } else {
        btnDuel.className = "py-2.5 text-xs font-extrabold rounded-xl transition-all bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md";
        btnSingle.className = "py-2.5 text-xs font-extrabold rounded-xl transition-all text-slate-400 hover:text-white";
        duelBox.classList.remove('hidden');
        singleBox.classList.add('hidden');
    }
}

function updateLobbySiswa() {
    const kelasId = document.getElementById('lobby-kelas').value;
    const selectSiswa = document.getElementById('lobby-siswa');
    const selectA = document.getElementById('lobby-pemain-a');
    const selectB = document.getElementById('lobby-pemain-b');

    if (kelasId) {
        AppState.kuis.kelasAktif = kelasId;
        localStorage.setItem('ST_LAST_KELAS', kelasId);
    }

    if(!kelasId) {
        if (selectSiswa) selectSiswa.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
        if (selectA) selectA.innerHTML = '<option value="">-- Pemain A --</option>';
        if (selectB) selectB.innerHTML = '<option value="">-- Pemain B --</option>';
        return;
    }

    let siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
    let opts = siswaKelas.map(s => `<option value="${s.id}">${s.nama}</option>`).join('');

    if (selectSiswa) selectSiswa.innerHTML = `<option value="">-- Pilih Siswa yang Mengerjakan --</option>${opts}`;
    if (selectA) selectA.innerHTML = `<option value="">-- Pilih Pemain 1 (Biru) --</option>${opts}`;
    if (selectB) selectB.innerHTML = `<option value="">-- Pilih Pemain 2 (Merah) --</option>${opts}`;
    
    if (AppState.kuis.siswaAktif && selectSiswa) selectSiswa.value = AppState.kuis.siswaAktif;
    if (AppState.kuis.pemainA_Id && selectA) selectA.value = AppState.kuis.pemainA_Id;
    if (AppState.kuis.pemainB_Id && selectB) selectB.value = AppState.kuis.pemainB_Id;
}

function mulaiKuisSebenarnya() {
    const mapelId = document.getElementById('lobby-mapel').value;
    const kelasId = document.getElementById('lobby-kelas').value;
    const durasiEl = document.getElementById('lobby-durasi');
    AppState.kuis.durasiPilihan = durasiEl ? parseInt(durasiEl.value) : 15;

    if (AppState.kuis.modeKuis === 'single') {
        const siswaId = document.getElementById('lobby-siswa').value;
        const manualName = document.getElementById('lobby-manual').value.trim();

        if (!manualName && (!kelasId || !mapelId || !siswaId)) {
            return showAlert("Peringatan", "Harap Pilih Kelas, Mapel, dan Siswa ATAU Ketik nama manual!", "error");
        }

        AppState.kuis.kelasAktif = kelasId;
        AppState.kuis.mapelAktif = mapelId;
        AppState.kuis.siswaAktif = siswaId;
        AppState.kuis.namaPemainManual = manualName || (siswaId ? AppState.db.siswa.find(s=>s.id === siswaId).nama : "Pemain");

    } else if (AppState.kuis.modeKuis === 'duel') {                
        const pA = document.getElementById('lobby-pemain-a').value;
        const pB = document.getElementById('lobby-pemain-b').value;

        if (!pA || !pB || pA === pB) {
            return showAlert("Peringatan", "Pilih 2 Siswa yang berbeda untuk Mode Duel!", "error");
        }

        AppState.kuis.kelasAktif = kelasId;
        AppState.kuis.mapelAktif = mapelId;
        AppState.kuis.pemainA_Id = pA;
        AppState.kuis.pemainB_Id = pB;
        AppState.kuis.namaPemainA = AppState.db.siswa.find(s=>s.id === pA).nama;
        AppState.kuis.namaPemainB = AppState.db.siswa.find(s=>s.id === pB).nama;
        AppState.kuis.scorePemainA = 0;
        AppState.kuis.scorePemainB = 0;
    }

    AppState.kuis.streak = 0;
    AppState.kuis.rekapSalahSesi = {};

    let dataProses = JSON.parse(JSON.stringify(AppState.kuis.masterQuizSession || AppState.kuis.bankSoalManual));

    const isAcak = document.getElementById('acak-soal-checkbox');
    if (isAcak && isAcak.checked) {
        dataProses = acakArray(dataProses);
    }

    dataProses = dataProses.map(soal => acakPilihanJawaban(soal));
    AppState.kuis.currentQuizData = dataProses;

    const docEl = document.documentElement;
    const req = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    if(req && !document.fullscreenElement) req.call(docEl).catch(e => console.log(e));

    startAutoBGM();
    renderKuisPlayer(0, 0);
}

function ulangiKuisLangsung() {
    clearQuizTimeouts();
    let dataProses = JSON.parse(JSON.stringify(AppState.kuis.masterQuizSession || AppState.kuis.bankSoalManual));
    dataProses = acakArray(dataProses);
    dataProses = dataProses.map(soal => acakPilihanJawaban(soal));

    AppState.kuis.currentQuizData = dataProses;
    AppState.kuis.streak = 0;
    AppState.kuis.scorePemainA = 0;
    AppState.kuis.scorePemainB = 0;
    AppState.kuis.skor = 0;
    AppState.kuis.jawabanBenar = 0;
    startAutoBGM();
    renderKuisPlayer(0, 0);
}

function keluarArenaKuis() {
    if (confirm('Yakin ingin menghentikan dan keluar dari Arena Kuis?')) {
        stopBGM();
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if(exit && document.fullscreenElement) exit.call(document).catch(e => console.log(e));
        document.getElementById('quiz-arena-modal').classList.add('hidden');
    }
}

function tutupArenaSelesai() {
    stopBGM();
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if(exit && document.fullscreenElement) exit.call(document).catch(e => console.log(e));
    document.getElementById('quiz-arena-modal').classList.add('hidden');
    if (typeof cekRadarSoalTersulit === "function") cekRadarSoalTersulit();
}

function mulaiTimerKuis(index, score) {
    clearInterval(AppState.kuis.timerInterval);
    AppState.kuis.sisaWaktu = AppState.kuis.durasiPilihan || 15;

    const timerEl = document.getElementById('timer-kuis');
    const timerContainer = document.getElementById('timer-box-container');
    const vignette = document.getElementById('arena-vignette-overlay');

    if (timerEl) timerEl.innerText = AppState.kuis.sisaWaktu;
    if (timerContainer) {
        timerContainer.className = "bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black py-2 px-4 rounded-2xl flex items-center shadow-inner transition-all duration-300";
    }
    if (vignette) vignette.className = "fixed inset-0 pointer-events-none z-10 transition-all duration-300";

    if (AppState.audio.elements.bgm) AppState.audio.elements.bgm.volume = 1.0;

    AppState.kuis.timerInterval = setInterval(() => {
        AppState.kuis.sisaWaktu--;
        if (timerEl) timerEl.innerText = AppState.kuis.sisaWaktu;

        if (AppState.kuis.sisaWaktu <= 5 && AppState.kuis.sisaWaktu > 0) {
            playTick(900); 
            
            if (AppState.audio.elements.bgm) {
                AppState.audio.elements.bgm.volume = 0.2; 
            }

            if (timerContainer) {
                timerContainer.className = "bg-rose-600 border-2 border-rose-400 text-white font-black py-2 px-4 rounded-2xl flex items-center shadow-lg animate-pulse ring-4 ring-rose-500/50 scale-105 transition-all duration-300";
            }

            if (vignette) {
                vignette.className = "fixed inset-0 pointer-events-none z-10 red-pulse-screen";
            }
        }

        if (AppState.kuis.sisaWaktu <= 0) {
            clearInterval(AppState.kuis.timerInterval);
            
            if (AppState.audio.elements.bgm) AppState.audio.elements.bgm.volume = 1.0;
            if (vignette) vignette.className = "fixed inset-0 pointer-events-none z-10 transition-all duration-300";

            prosesWaktuHabis(index, score);
        }
    }, 1000);
}

function prosesWaktuHabis(index, score) {
    clearQuizTimeouts(); 
    AppState.kuis.streak = 0;

    const soalCurrent = AppState.kuis.currentQuizData[index];
    if (soalCurrent && soalCurrent.id) {
        let sid = soalCurrent.id;
        AppState.db.mispersepsiSoal[sid] = (AppState.db.mispersepsiSoal[sid] || 0) + 1;
    }

    for (let i = 0; i < AppState.kuis.currentQuizData[index].opsi.length; i++) {
        const b = document.getElementById(`btn-opsi-${i}`);
        if (b) { 
            b.disabled = true; 
            b.classList.add('cursor-not-allowed', 'opacity-50'); 
        }
    }

    const correctIdx = AppState.kuis.currentQuizData[index].jawaban_benar_index;
    const correctBtn = document.getElementById(`btn-opsi-${correctIdx}`);
    if (correctBtn) {
        correctBtn.classList.remove('opacity-50', 'border-white/10', 'bg-slate-900/90');
        correctBtn.classList.add('border-emerald-400', 'bg-emerald-950/90', 'ring-4', 'ring-emerald-500/40');
    }
    const iconCorrect = document.getElementById(`icon-benar-${correctIdx}`);
    if (iconCorrect) iconCorrect.classList.remove('hidden');

    playSoundEffect('habis');
    AppState.kuis.activeQuizTimeout = setTimeout(() => renderKuisPlayer(index + 1, score), 2000);
}

function jawabKuis(index, jawabanIdx, score, pemainWho = 'single') {
    clearQuizTimeouts(); 
    clearInterval(AppState.kuis.timerInterval);
    if (AppState.audio.elements.bgm) AppState.audio.elements.bgm.volume = 1.0;

    for(let i=0; i < AppState.kuis.currentQuizData[index].opsi.length; i++){
        const b = document.getElementById(`btn-opsi-${i}`);
        const bA = document.getElementById(`btn-opsi-a-${i}`);
        const bB = document.getElementById(`btn-opsi-b-${i}`);
        if(b) { b.disabled = true; b.classList.add('cursor-not-allowed', 'opacity-50'); }
        if(bA) { bA.disabled = true; bA.classList.add('cursor-not-allowed', 'opacity-50'); }
        if(bB) { bB.disabled = true; bB.classList.add('cursor-not-allowed', 'opacity-50'); }
    }

    const isCorrect = (jawabanIdx === AppState.kuis.currentQuizData[index].jawaban_benar_index);

    if (isCorrect) {
        let multiplier = 1.0;

        if (AppState.kuis.modeKuis === 'duel') {
            if (pemainWho === 'A') {
                AppState.kuis.streakA = (AppState.kuis.streakA || 0) + 1;
                AppState.kuis.streakB = 0; 
                AppState.kuis.streak = AppState.kuis.streakA; 

                if (AppState.kuis.streakA >= 5) multiplier = 1.5;
                else if (AppState.kuis.streakA >= 3) multiplier = 1.25;

                AppState.kuis.scorePemainA += Math.round(10 * multiplier);
            } else if (pemainWho === 'B') {
                AppState.kuis.streakB = (AppState.kuis.streakB || 0) + 1;
                AppState.kuis.streakA = 0; 
                AppState.kuis.streak = AppState.kuis.streakB; 

                if (AppState.kuis.streakB >= 5) multiplier = 1.5;
                else if (AppState.kuis.streakB >= 3) multiplier = 1.25;

                AppState.kuis.scorePemainB += Math.round(10 * multiplier);
            }
        } else {
            AppState.kuis.streak++;
            score += 1;
        }
        playSoundEffect('correct');
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });

    } else {
        if (AppState.kuis.modeKuis === 'duel') {
            if (pemainWho === 'A') AppState.kuis.streakA = 0;
            if (pemainWho === 'B') AppState.kuis.streakB = 0;
        }
        AppState.kuis.streak = 0;
        const soalCurrent = AppState.kuis.currentQuizData[index];
        if (soalCurrent && soalCurrent.id) {
            let sid = soalCurrent.id;
            AppState.db.mispersepsiSoal[sid] = (AppState.db.mispersepsiSoal[sid] || 0) + 1;
        }
        playSoundEffect('wrong');
    }

    const scoreText = document.getElementById('arena-score-text');
    if (scoreText) scoreText.innerText = score;

    const correctIdx = AppState.kuis.currentQuizData[index].jawaban_benar_index;
    const btnCorrect = document.getElementById(`btn-opsi-${correctIdx}`);
    if(btnCorrect) {
        btnCorrect.classList.remove('opacity-50', 'border-white/10', 'bg-slate-900/90');
        btnCorrect.classList.add('border-emerald-400', 'bg-emerald-950/90', 'ring-4', 'ring-emerald-500/40');
    }
    const iconCorrect = document.getElementById(`icon-benar-${correctIdx}`);
    if (iconCorrect) iconCorrect.classList.remove('hidden'); 

    if (!isCorrect) {
        const btnWrong = document.getElementById(`btn-opsi-${jawabanIdx}`);
        if(btnWrong) {
            btnWrong.classList.remove('opacity-50', 'border-white/10', 'bg-slate-900/90');
            btnWrong.classList.add('border-rose-500', 'bg-rose-950/90', 'ring-4', 'ring-rose-500/40', 'animate-shake');
        }
        const iconWrong = document.getElementById(`icon-salah-${jawabanIdx}`);
        if (iconWrong) iconWrong.classList.remove('hidden');

        const btnWrongDuelA = document.getElementById(`btn-opsi-a-${jawabanIdx}`);
        const btnWrongDuelB = document.getElementById(`btn-opsi-b-${jawabanIdx}`);
        if (pemainWho === 'A' && btnWrongDuelA) btnWrongDuelA.classList.add('border-rose-500', 'bg-rose-950/90', 'animate-shake');
        if (pemainWho === 'B' && btnWrongDuelB) btnWrongDuelB.classList.add('border-rose-500', 'bg-rose-950/90', 'animate-shake');
    }

    AppState.kuis.activeQuizTimeout = setTimeout(() => renderKuisPlayer(index + 1, score), 2200);
}

function renderKuisPlayer(index, score) {
    clearQuizTimeouts();
    const arenaBody = document.getElementById('quiz-arena-body');
    const progressText = document.getElementById('arena-progress-text');
    const scoreText = document.getElementById('arena-score-text');
    const streakBadge = document.getElementById('streak-badge-container');
    const streakText = document.getElementById('streak-badge-text');

    if (scoreText) scoreText.innerText = score;

    if (streakBadge && streakText) {
        if (AppState.kuis.streak >= 3) {
            streakBadge.classList.remove('hidden');
            if (AppState.kuis.streak >= 5) {
                streakBadge.className = "bg-gradient-to-r from-rose-600 to-red-600 text-white font-black py-1.5 px-3 rounded-2xl flex items-center shadow-lg animate-bounce text-xs ring-2 ring-yellow-400";
                streakText.innerText = `⚡ ${AppState.kuis.streak}x UNSTOPPABLE (1.5x)`;
            } else {
                streakBadge.className = "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black py-1.5 px-3 rounded-2xl flex items-center shadow-lg animate-pulse text-xs";
                streakText.innerText = `🔥 ${AppState.kuis.streak}x FIRE STREAK (1.25x)`;
            }
        } else {
            streakBadge.classList.add('hidden');
        }
    }

    if (index >= AppState.kuis.currentQuizData.length) {
        stopBGM();
        if (progressText) progressText.innerText = "Evaluasi Selesai";

        if (AppState.kuis.modeKuis === 'duel') {
            let sA = AppState.kuis.scorePemainA;
            let sB = AppState.kuis.scorePemainB;

            if (AppState.kuis.pemainA_Id && AppState.kuis.kelasAktif) {
                AppState.db.penilaian.push({ id: generateId(), siswaId: AppState.kuis.pemainA_Id, mapelId: AppState.kuis.mapelAktif, kelasId: AppState.kuis.kelasAktif, jenis: 'Duel', nilai: sA, timestamp: Date.now() });
            }
            if (AppState.kuis.pemainB_Id && AppState.kuis.kelasAktif) {
                AppState.db.penilaian.push({ id: generateId(), siswaId: AppState.kuis.pemainB_Id, mapelId: AppState.kuis.mapelAktif, kelasId: AppState.kuis.kelasAktif, jenis: 'Duel', nilai: sB, timestamp: Date.now() });
            }
            saveDatabase();

            let pemenangText = sA > sB ? `🏆 ${AppState.kuis.namaPemainA} MENANG!` : (sB > sA ? `🏆 ${AppState.kuis.namaPemainB} MENANG!` : "🤝 HASIL SERI!");

            arenaBody.innerHTML = `
                <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-[2.5rem] p-8 text-center shadow-2xl max-w-2xl mx-auto w-full fade-in">
                    <i class="fa-solid fa-bolt text-6xl text-amber-400 mb-2 animate-bounce"></i>
                    <h3 class="text-2xl font-black text-white mb-1">HASIL PERTANDINGAN DUEL</h3>
                    <p class="text-lg font-black text-yellow-400 mb-6">${pemenangText}</p>

                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-cyan-950/80 border-2 border-cyan-500/50 p-5 rounded-3xl text-center shadow-lg">
                            <p class="text-xs font-bold text-cyan-300 uppercase">${AppState.kuis.namaPemainA}</p>
                            <h4 class="text-4xl font-black text-white mt-1">${sA}</h4>
                            <p class="text-[10px] text-cyan-400 mt-1">Poin Duel</p>
                        </div>
                        <div class="bg-rose-950/80 border-2 border-rose-500/50 p-5 rounded-3xl text-center shadow-lg">
                            <p class="text-xs font-bold text-rose-300 uppercase">${AppState.kuis.namaPemainB}</p>
                            <h4 class="text-4xl font-black text-white mt-1">${sB}</h4>
                            <p class="text-[10px] text-rose-400 mt-1">Poin Duel</p>
                        </div>
                    </div>

                   <div class="flex justify-center gap-3">
                        <button onclick="ulangiKuisLangsung()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all text-xs flex items-center justify-center">
                            <i class="fa-solid fa-rotate-right mr-2 text-sm"></i> Rematch
                        </button>
                        <button onclick="bukaArenaKuis(AppState.kuis.masterQuizSession, false)" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all text-xs flex items-center justify-center">
                            <i class="fa-solid fa-users mr-2 text-sm"></i> Ganti Pemain
                        </button>
                        <button onclick="tutupArenaSelesai()" class="bg-white/10 hover:bg-rose-600 text-white font-black py-3.5 px-4 rounded-2xl border border-white/20 transition-all text-xs flex items-center justify-center">
                            <i class="fa-solid fa-circle-xmark mr-2 text-sm"></i> Selesai
                        </button>
                    </div>
                </div>
            `;

            playSoundEffect('selebrasi');
            setTimeout(() => playSoundEffect('tangan'), 300);
            confetti({ particleCount: 180, spread: 120, origin: { y: 0.6 } });
            return;
        }

        const total = AppState.kuis.currentQuizData.length;
        let nilaiAkhir = total > 0 ? Math.round((score / total) * 100) : 0;
        if (nilaiAkhir > 100) nilaiAkhir = 100;
        
        let statusSimpan = `<p class="text-amber-300 font-bold mb-6 text-xs sm:text-sm"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Bermain tanpa akun terdaftar. Nilai tidak direkap ke leger.</p>`;
        
        if (AppState.kuis.siswaAktif && AppState.kuis.mapelAktif && AppState.kuis.kelasAktif) {
            let existingIndex = AppState.db.penilaian.findIndex(p => p.siswaId === AppState.kuis.siswaAktif && p.mapelId === AppState.kuis.mapelAktif && p.jenis === 'Tugas');
            if(existingIndex >= 0) {
                AppState.db.penilaian[existingIndex].nilai = nilaiAkhir;
                AppState.db.penilaian[existingIndex].timestamp = Date.now();
            } else {
                AppState.db.penilaian.push({ id: generateId(), siswaId: AppState.kuis.siswaAktif, mapelId: AppState.kuis.mapelAktif, kelasId: AppState.kuis.kelasAktif, jenis: 'Tugas', nilai: nilaiAkhir, timestamp: Date.now() });
            }
            saveDatabase(); 
            statusSimpan = `<p class="text-emerald-300 font-bold mb-6 text-xs sm:text-sm"><i class="fa-solid fa-cloud-arrow-up mr-1"></i> Nilai <b>${nilaiAkhir}</b> berhasil direkap otomatis ke Daftar Nilai Akademik.</p>`;
        }

        const Kinerja = dapatkanPredikatKinerja(nilaiAkhir);

        let scoreCircleStyle = "border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]";
        let scoreTextStyle = "text-white";
        let scoreSubtextStyle = "text-emerald-400";
        let kkmBadgeHtml = "";

        if (nilaiAkhir < 60) {
            scoreCircleStyle = "border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.4)] bg-rose-950/50";
            scoreTextStyle = "text-rose-400";
            scoreSubtextStyle = "text-rose-400";
            kkmBadgeHtml = `<div class="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black mb-3"><i class="fa-solid fa-circle-exclamation mr-1.5 text-rose-400"></i>🔴 Skor di Bawah KKM (Perlu Remedial)</div>`;
        }

        arenaBody.innerHTML = `
            <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-[2.5rem] p-8 lg:p-12 text-center shadow-2xl max-w-2xl mx-auto w-full fade-in relative overflow-hidden">
                <p class="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Hasil Evaluasi Kuis</p>
                <h3 class="text-2xl lg:text-3xl font-black mb-1 text-white">${AppState.kuis.namaPemainManual}</h3>
                <p class="mb-4 font-medium text-slate-300 text-xs sm:text-sm">Menjawab benar <b class="text-emerald-400 font-black">${score}</b> dari <b class="text-emerald-400 font-black">${total}</b> soal pilihan.</p>
                
                ${kkmBadgeHtml}

                <div class="w-40 h-40 sm:w-44 sm:h-44 mx-auto bg-slate-950/80 backdrop-blur-md rounded-full flex flex-col items-center justify-center border-4 ${scoreCircleStyle} mb-6">
                    <span id="final-score-display" class="text-5xl sm:text-6xl font-black tracking-tighter ${scoreTextStyle}">0</span>
                    <span class="text-[10px] ${scoreSubtextStyle} font-bold uppercase tracking-widest mt-1">Skor Akhir</span>
                </div>

                <div id="badge-rank-container" class="opacity-0 transition-all duration-500 mb-6">
                    <div class="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${Kinerja.color} text-white shadow-xl ring-2 ring-white/10">
                        <i class="fa-solid ${Kinerja.icon} text-2xl"></i>
                        <div class="text-left">
                            <p class="text-[9px] uppercase tracking-widest text-white/80 font-bold">Gelar Kebanggaan</p>
                            <h4 class="text-sm sm:text-base font-black tracking-wide">${Kinerja.predikat}</h4>
                        </div>
                    </div>
                    <p class="text-xs text-slate-400 mt-2 italic">${Kinerja.status}</p>
                </div>
                
                ${statusSimpan}
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 opacity-0 transition-opacity duration-500" id="final-buttons-container">
                    <button onclick="ulangiKuisLangsung()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all text-xs flex items-center justify-center">
                        <i class="fa-solid fa-rotate-right mr-2 text-sm"></i> Ulangi Kuis
                    </button>
                    <button onclick="bukaArenaKuis(AppState.kuis.masterQuizSession, false)" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all text-xs flex items-center justify-center">
                        <i class="fa-solid fa-users mr-2 text-sm"></i> Ganti Pemain
                    </button>
                    <button onclick="tutupArenaSelesai()" class="bg-white/10 hover:bg-rose-600 text-white font-black py-3.5 px-4 rounded-2xl border border-white/20 transition-all text-xs flex items-center justify-center">
                        <i class="fa-solid fa-circle-xmark mr-2 text-sm"></i> Selesai & Keluar
                    </button>
                </div>
            </div>
        `;

        let currentScoreAnim = 0;
        const duration = 1000; 
        const intervalTime = 30;
        const steps = duration / intervalTime;
        const increment = nilaiAkhir / steps;
        
        const scoreDisplay = document.getElementById('final-score-display');
        
        const animInterval = setInterval(() => {
            currentScoreAnim += increment;
            if (currentScoreAnim >= nilaiAkhir) {
                currentScoreAnim = nilaiAkhir;
                clearInterval(animInterval);
                if (scoreDisplay) scoreDisplay.innerText = Math.round(currentScoreAnim);
                
                const badgeContainer = document.getElementById('badge-rank-container');
                const btnContainer = document.getElementById('final-buttons-container');

                if (badgeContainer) {
                    badgeContainer.classList.remove('opacity-0');
                    badgeContainer.classList.add('badge-pop');
                }
                if (btnContainer) btnContainer.classList.remove('opacity-0');
                
                playCelebrationAudio(nilaiAkhir);
                
            } else {
                if (scoreDisplay) scoreDisplay.innerText = Math.round(currentScoreAnim);
                playTick(700); 
            }
        }, intervalTime);

        return;
    }

    if (progressText) progressText.innerText = `Soal ${index + 1} dari ${AppState.kuis.currentQuizData.length}`;

    const q = AppState.kuis.currentQuizData[index];
    const badgeColors = ['bg-pink-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'];
    let flameClass = AppState.kuis.streak >= 3 ? "flame-border" : "border-white/10";

    if (AppState.kuis.modeKuis === 'duel') {
        let opsiA_Html = q.opsi.map((opt, i) => `
            <button id="btn-opsi-a-${i}" onclick="jawabKuis(${index}, ${i}, ${score}, 'A')" class="btn-press w-full text-left bg-slate-800 hover:bg-cyan-950 border border-slate-600 hover:border-cyan-500/50 p-3.5 sm:p-4 rounded-2xl transition-all flex items-center shadow-sm">
                <span class="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-600 text-white text-sm sm:text-base rounded-xl flex items-center justify-center font-black mr-3 shrink-0 shadow-inner">${String.fromCharCode(65+i)}</span>
                <span class="text-sm md:text-base font-bold text-slate-200 flex-1 leading-snug">${opt}</span>
            </button>
        `).join('');

        let opsiB_Html = q.opsi.map((opt, i) => `
            <button id="btn-opsi-b-${i}" onclick="jawabKuis(${index}, ${i}, ${score}, 'B')" class="btn-press w-full text-left bg-slate-800 hover:bg-rose-950 border border-slate-600 hover:border-rose-500/50 p-3.5 sm:p-4 rounded-2xl transition-all flex items-center shadow-sm">
                <span class="w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 text-white text-sm sm:text-base rounded-xl flex items-center justify-center font-black mr-3 shrink-0 shadow-inner">${String.fromCharCode(65+i)}</span>
                <span class="text-sm md:text-base font-bold text-slate-200 flex-1 leading-snug">${opt}</span>
            </button>
        `).join('');

        arenaBody.innerHTML = `
            <div class="fade-in space-y-6">
                <div class="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 text-center shadow-xl">
                    <h3 class="text-lg sm:text-xl md:text-2xl font-black text-white leading-relaxed">${q.soal}</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <div class="bg-cyan-950/20 p-4 sm:p-5 rounded-3xl border-2 border-cyan-500/30 shadow-lg space-y-3">
                        <div class="flex justify-between items-center border-b border-cyan-500/30 pb-3">
                            <span class="text-sm font-black text-cyan-400 uppercase tracking-wide flex items-center"><i class="fa-solid fa-user mr-2"></i>${AppState.kuis.namaPemainA}</span>
                            <span class="text-sm font-black bg-cyan-500 text-slate-900 px-3 py-1 rounded-xl shadow-sm">${AppState.kuis.scorePemainA} Poin</span>
                        </div>
                        <div class="space-y-3">${opsiA_Html}</div>
                    </div>

                    <div class="bg-rose-950/20 p-4 sm:p-5 rounded-3xl border-2 border-rose-500/30 shadow-lg space-y-3">
                        <div class="flex justify-between items-center border-b border-rose-500/30 pb-3">
                            <span class="text-sm font-black text-rose-400 uppercase tracking-wide flex items-center"><i class="fa-solid fa-user mr-2"></i>${AppState.kuis.namaPemainB}</span>
                            <span class="text-sm font-black bg-rose-500 text-white px-3 py-1 rounded-xl shadow-sm">${AppState.kuis.scorePemainB} Poin</span>
                        </div>
                        <div class="space-y-3">${opsiB_Html}</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        let opsiHtml = q.opsi.map((opt, i) => `
            <button id="btn-opsi-${i}" onclick="jawabKuis(${index}, ${i}, ${score}, 'single')" class="btn-press w-full text-left bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 p-4 sm:p-5 lg:p-6 rounded-3xl transition-all flex items-center shadow-lg">
                <span class="inline-flex items-center justify-center min-w-[3.5rem] h-14 ${badgeColors[i]} text-white text-xl sm:text-2xl rounded-2xl mr-4 font-black shadow-inner">${String.fromCharCode(65+i)}</span>
                <span class="text-base md:text-lg lg:text-xl font-bold text-slate-200 leading-snug flex-1">${opt}</span>
                <i id="icon-benar-${i}" class="fa-solid fa-circle-check text-emerald-400 text-3xl ml-3 hidden drop-shadow-md"></i>
                <i id="icon-salah-${i}" class="fa-solid fa-circle-xmark text-rose-400 text-3xl ml-3 hidden drop-shadow-md"></i>
            </button>
        `).join('');

        arenaBody.innerHTML = `
            <div class="fade-in space-y-6 md:space-y-8 max-w-4xl mx-auto w-full">
                <div class="bg-gradient-to-b from-slate-900 to-slate-900/80 p-6 sm:p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border-2 ${flameClass} relative text-center">
                    ${AppState.kuis.streak >= 3 ? '<div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black py-1 px-4 rounded-full text-xs shadow-lg animate-pulse border border-yellow-300"><i class="fa-solid fa-fire mr-1"></i> ON FIRE</div>' : ''}
                    <h3 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed tracking-wide">${q.soal}</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">${opsiHtml}</div>
            </div>
        `;
    }
    mulaiTimerKuis(index, score);
}
