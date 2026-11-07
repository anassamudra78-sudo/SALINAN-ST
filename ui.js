// ==========================================================
// FILE: ui.js (CORE INTI)
// FUNGSI: Navigasi, UI Dasar, Dashboard, Pengaturan & Import
// ==========================================================

const menuGroups = [
    {
        group: 'Operasional Harian',
        items: [
            { id: 'dashboard', title: 'Dashboard Utama', icon: 'fa-chart-pie', sub: 'Ringkasan & Jadwal Hari Ini' },
            { id: 'jadwal', title: 'Jadwal Mengajar', icon: 'fa-calendar-days', sub: 'Pengaturan Jam Mengajar' },
            { id: 'absensi', title: 'Daftar Hadir', icon: 'fa-clipboard-user', sub: 'Presensi Harian' },
            { id: 'jurnal', title: 'Jurnal Mengajar', icon: 'fa-book-open-reader', sub: 'Catatan KBM' }
        ]
    },
    {
        group: 'Data Akademik',
        items: [
            { id: 'sekolah', title: 'Data Sekolah', icon: 'fa-school', sub: 'Identitas Institusi' },
            { id: 'guru', title: 'Data Guru', icon: 'fa-chalkboard-user', sub: 'Kepegawaian' },
            { id: 'kelas', title: 'Data Kelas', icon: 'fa-door-open', sub: 'Rombongan Belajar' },
            { id: 'siswa', title: 'Data Siswa', icon: 'fa-users', sub: 'Peserta Didik' },
            { id: 'mapel', title: 'Mata Pelajaran', icon: 'fa-book', sub: 'Kurikulum' }
        ]
    },
    {
        group: 'Evaluasi & Dokumen',
        items: [
            { id: 'penilaian', title: 'Input Nilai', icon: 'fa-pen-to-square', sub: 'Asesmen Akademik' },
            { id: 'rekap_nilai', title: 'Rekap Nilai', icon: 'fa-table-cells', sub: 'Legger Nilai' },
            { id: 'rapor', title: 'Cetak Rapor', icon: 'fa-file-pdf', sub: 'Dokumen Laporan' }
        ]
    },
    {
        group: 'Smart Studio & Sistem',
        items: [
            { id: 'kuis', title: 'Kuis & Bank Soal', icon: 'fa-gamepad', sub: 'Game Show, Podium & Duel' },
            { id: 'ai', title: 'Asisten AI Guru', icon: 'fa-robot', sub: 'Generator Soal, Kuis & ATP' },
            { id: 'presentation_studio', title: 'Presentation Studio', icon: 'fa-person-chalkboard', sub: 'Generator Prompt Presentasi' },
            { id: 'pengaturan', title: 'Pengaturan & Backup', icon: 'fa-gear', sub: 'Sistem & Database' }
        ]
    }
];
const menuItems = menuGroups.flatMap(g => g.items);

const crudConfig = {
    jadwal: { title: 'Jadwal Mengajar', fields: [{id:'hari', label:'Hari', type:'select', opts:['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']}, {id:'tanggal', label:'Tanggal Khusus (Opsional)', type:'date'}, {id:'jamMulai', label:'Jam Mulai', type:'time'}, {id:'jamSelesai', label:'Jam Selesai', type:'time'}, {id:'kelasId', label:'Kelas', type:'dynamicSelect', source:'kelas', displayField:'kode'}, {id:'mapelId', label:'Mata Pelajaran', type:'dynamicSelect', source:'mapel', displayField:'nama'}, {id:'catatan', label:'Catatan / Ruangan'}] },
    guru: { title: 'Guru', fields: [{id:'nip', label:'NIP/NUPTK'}, {id:'nama', label:'Nama Lengkap'}, {id:'mapel', label:'Guru Mapel'}] },
    kelas: { title: 'Kelas', fields: [{id:'kode', label:'Kode Kelas (ex: X-A)'}, {id:'tingkat', label:'Tingkat (ex: 10)'}, {id:'wali', label:'Wali Kelas'}] },
    siswa: { title: 'Siswa', fields: [{id:'nis', label:'NIS'}, {id:'nama', label:'Nama Lengkap'}, {id:'jk', label:'L/P', type:'select', opts:['L','P']}, {id:'kelasId', label:'Kelas (Kode)', type:'dynamicSelect', source:'kelas', displayField:'kode'}] },
    mapel: { title: 'Mata Pelajaran', fields: [{id:'kode', label:'Kode Mapel'}, {id:'nama', label:'Nama Pelajaran'}] },
    jurnal: { title: 'Jurnal Harian', fields: [{id:'tanggal', label:'Tanggal', type:'date'}, {id:'kelasId', label:'Kelas', type:'dynamicSelect', source:'kelas', displayField:'kode'}, {id:'mapelId', label:'Mapel', type:'dynamicSelect', source:'mapel', displayField:'nama'}, {id:'materi', label:'Materi Pokok'}] }
};

function toggleFullScreenApp() { const docEl = document.documentElement; const req = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen; if(!document.fullscreenElement) { if(req) req.call(docEl).catch(e=>{}); document.getElementById('fullscreen-icon').className="fa-solid fa-compress"; } else { const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen; if(exit) exit.call(document).catch(e=>{}); document.getElementById('fullscreen-icon').className="fa-solid fa-expand"; } }
function syncDarkModeIcons() { const isDark = AppState.ui.isDarkMode; const d1 = document.getElementById('dark-mode-icon'); const d2 = document.getElementById('dark-mode-icon-mobile'); if(d1) d1.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; if(d2) d2.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; }
function toggleDarkMode() { document.documentElement.classList.toggle('dark'); AppState.ui.isDarkMode = document.documentElement.classList.contains('dark'); localStorage.setItem('ST_DARK_MODE', AppState.ui.isDarkMode); syncDarkModeIcons(); }
if (AppState.ui.isDarkMode) document.documentElement.classList.add('dark');
syncDarkModeIcons();

function openGuideModal() { document.getElementById('guide-modal').classList.remove('hidden'); }
function closeGuideModal() { document.getElementById('guide-modal').classList.add('hidden'); }
function openAudioSettingsModal() { document.getElementById('audio-settings-modal').classList.remove('hidden'); }
function closeAudioSettingsModal() { document.getElementById('audio-settings-modal').classList.add('hidden'); }

function updateUI() {
    const elTa = document.getElementById('sidebar-tahun-ajaran');
    if(elTa) elTa.innerText = `TA: ${AppState.db.sekolah.tahunAjaran || '-'} ${AppState.db.sekolah.semester || '-'}`;
    renderNavigation();
    renderContent(AppState.ui.activeTab);
}

// ui.js - Modifikasi fungsi switchTab
function switchTab(tabId, dariHistory = false) {
    AppState.ui.activeTab = tabId;
    AppState.ui.editingId = null;
    if (AppState.ui.dashboardClockInterval) clearInterval(AppState.ui.dashboardClockInterval);
    
    // SUNTIKAN PROFESIONAL: Catat riwayat ke browser jika ini bukan dari tombol back
    if (!dariHistory) {
        history.pushState({ tab: tabId, type: 'halaman' }, "", "#" + tabId);
    }

    const tabInfo = menuItems.find(m => m.id === tabId);
    if(tabInfo) {
        document.getElementById('page-title').innerText = tabInfo.title;
        document.getElementById('page-subtitle').innerText = tabInfo.sub;
    }

    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (sidebar && menuBtn) {
        if (tabId === 'kuis') { sidebar.classList.remove('md:flex'); menuBtn.classList.remove('md:hidden'); }
        else { sidebar.classList.add('md:flex'); menuBtn.classList.add('md:hidden'); }
    }
    toggleMobileMenu(true);
    updateUI();
}
function renderNavigation() {
    let htmlContent = '';
    menuGroups.forEach((groupObj, idx) => {
        htmlContent += `<div class="${idx > 0 ? 'mt-4 pt-3 border-t border-slate-800/60' : ''}"><p class="px-3 pb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">${groupObj.group}</p><div class="space-y-1">`;
        groupObj.items.forEach(item => {
            const isActive = AppState.ui.activeTab === item.id;
            const activeClass = isActive ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white';
            let extraColor = '';
            if (!isActive) {
                if (item.id === 'ai') extraColor = 'text-purple-400';
                if (item.id === 'kuis') extraColor = 'text-amber-400';
                if (item.id === 'jadwal') extraColor = 'text-cyan-400';
                if (item.id === 'presentation_studio') extraColor = 'text-emerald-500';
            }
            htmlContent += `<button onclick="switchTab('${item.id}')" class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${activeClass}"><div class="w-5 flex justify-center ${extraColor}"><i class="fa-solid ${item.icon}"></i></div><span class="text-xs lg:text-sm font-semibold">${item.title}</span></button>`;
        });
        htmlContent += `</div></div>`;
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
        drawer.classList.add('-translate-x-full'); overlay.classList.add('hidden');
    } else {
        drawer.classList.remove('-translate-x-full'); overlay.classList.remove('hidden');
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
        areaFile.classList.remove('hidden'); areaPaste.classList.add('hidden');
    } else {
        btnPaste.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm";
        btnFile.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white";
        areaPaste.classList.remove('hidden'); areaFile.classList.add('hidden');
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

    if (type === 'siswa') sampleRow = ['1001', 'Ahmad Fauzi', 'L', 'X-A'];
    else if (type === 'guru') sampleRow = ['198501012010011001', 'Budi Santoso, S.Pd.', 'Matematika'];
    else if (type === 'kelas') sampleRow = ['X-A', '10', 'Dra. Siti Aminah'];
    else if (type === 'mapel') sampleRow = ['MTK', 'Matematika'];
    else if (type === 'jadwal') sampleRow = ['Senin', '2026-10-20', '07:00', '08:30', 'X-A', 'Matematika', 'Ruang Lab 1'];
    else if (type === 'jurnal') sampleRow = ['2026-10-20', 'X-A', 'Matematika', 'Persamaan Kuadrat'];
    else sampleRow = config.fields.map((_, i) => `Contoh_${i+1}`);

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
        if (!rows || rows.length <= 1) return showAlert("Peringatan", "Harap pilih file Excel yang berisi data!", "error");
        for (let i = 1; i < rows.length; i++) {
            let cols = rows[i];
            if (!cols || cols.length === 0) continue;
            let newItem = { id: generateId() };
            let isValid = false;
            config.fields.forEach((f, index) => {
                let val = cols[index] !== undefined && cols[index] !== null ? String(cols[index]).trim() : '';
                if (val !== '') isValid = true;
                if (f.type === 'dynamicSelect' && val !== '') {
                    let ref = (AppState.db[f.source] || []).find(r => String(r[f.displayField]).trim().toLowerCase() === val.toLowerCase());
                    newItem[f.id] = ref ? ref.id : val;
                } else { newItem[f.id] = val; }
            });
            if (isValid) { AppState.db[type].push(newItem); successCount++; }
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
                    let val = cols[index] ? cols[index].trim().replace(/^"|"$/g, '') : '';
                    if (val !== '') isValid = true;
                    if (f.type === 'dynamicSelect' && val !== '') {
                        let ref = (AppState.db[f.source] || []).find(r => String(r[f.displayField]).trim().toLowerCase() === val.toLowerCase());
                        newItem[f.id] = ref ? ref.id : val;
                    } else { newItem[f.id] = val; }
                });
                if (isValid) { AppState.db[type].push(newItem); successCount++; }
            }
        });
    }

    if (successCount > 0) {
        saveDatabase(); closeImportModal();
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
            <div class="w-11 h-11 rounded-2xl ${bgBoxClass} ${textIconClass} flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid ${icon}"></i></div>
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
        return (cocokHari && cocokTanggal) || (j.tanggal === tanggalISO);
    }).sort((a, b) => (a.jamMulai || '').localeCompare(b.jamMulai || ''));

    let jadwalCompactContent = '';
    if (jadwalHariIni.length === 0) {
        jadwalCompactContent = `<div class="flex items-center text-xs text-slate-500 dark:text-slate-400 italic"><i class="fa-regular fa-calendar-check mr-2 text-slate-400"></i><span>Belum ada jadwal mengajar hari ${hariIni} ini.</span></div>`;
    } else {
        jadwalCompactContent = `<div class="flex items-center space-x-2.5 overflow-x-auto py-0.5 custom-scrollbar">` + jadwalHariIni.map(j => {
            const refKelas = AppState.db.kelas.find(k => k.id === j.kelasId);
            const namaKelas = refKelas ? refKelas.kode : (j.kelasId || '-');
            const refMapel = AppState.db.mapel.find(m => m.id === j.mapelId);
            const namaMapel = refMapel ? refMapel.nama : (j.mapelId || '-');
            const mulai = j.jamMulai || '00:00'; const selesai = j.jamSelesai || '23:59';
            
            let pillStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
            let dotHtml = `<span class="w-2 h-2 rounded-full bg-amber-400 mr-2 shrink-0"></span>`;
            if (jamSekarang >= mulai && jamSekarang <= selesai) {
                pillStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30';
                dotHtml = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2 shrink-0"></span>`;
            } else if (jamSekarang > selesai) {
                pillStyle = 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 opacity-70';
                dotHtml = `<i class="fa-solid fa-check text-[10px] text-slate-400 mr-1.5"></i>`;
            }

            return `<div onclick="bukaPintasanKelas('absensi', '${j.kelasId}')" title="Klik untuk Absensi Kelas ${namaKelas}" class="cursor-pointer shrink-0 flex items-center px-3.5 py-2 rounded-xl border text-xs transition-all hover:scale-[1.02] ${pillStyle}">
                    ${dotHtml}<span class="font-mono font-black mr-2">${mulai}-${selesai}</span><span class="font-bold mr-1.5">${namaMapel}</span>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10">${namaKelas}</span></div>`;
        }).join('') + `</div>`;
    }

    const activeWs = getActiveWorkspace();
    const linkGateway = `https://anassamudra78-sudo.github.io/Gateway-Station/?npsn=${encodeURIComponent(activeWs.npsn || 'KOSONG')}&nama=${encodeURIComponent(activeWs.nama || 'Ruang_Kerja')}`;

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
                    <div class="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center"><i class="fa-solid fa-bell text-sm animate-bounce"></i></div>
                    <div>
                        <div class="flex items-center space-x-2"><h4 class="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Jadwal Hari Ini</h4><span class="text-[11px] text-cyan-500 font-semibold">• ${tanggalIndo}</span></div>
                        <p class="text-[11px] text-slate-400">Pengingat jam mengajar otomatis</p>
                    </div>
                </div>
                <div class="flex-1 lg:mx-4 overflow-hidden">${jadwalCompactContent}</div>
                <div class="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                    <div class="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
                        <i class="fa-regular fa-clock text-cyan-500 text-[11px]"></i><span id="live-dashboard-clock" class="text-xs font-mono font-black text-slate-700 dark:text-slate-200">${now.toTimeString().slice(0,8)}</span>
                    </div>
                    <button onclick="switchTab('jadwal')" class="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center"><i class="fa-solid fa-plus mr-1.5"></i> Atur Jadwal</button>
                </div>
            </div>

            <div class="bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl shrink-0"><i class="fa-solid fa-network-wired"></i></div>
                    <div>
                        <h4 class="text-base font-bold text-white">Smart Gateway Station</h4>
                        <p class="text-xs text-slate-400">Pusat absensi modern berbasis Face Recognition & QR Code terintegrasi</p>
                    </div>
                </div>
                <a href="${linkGateway}" target="_blank" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shrink-0"><span>Buka Gateway</span><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>
            </div>

            <div onclick="openGuideModal()" class="cursor-pointer bg-white dark:bg-slate-900 hover:border-amber-500/40 rounded-2xl px-5 py-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><i class="fa-solid fa-lightbulb text-sm"></i></div>
                    <div>
                        <h4 class="font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider group-hover:text-amber-500 transition-colors">Panduan Cepat Penggunaan</h4>
                        <p class="text-[11px] text-slate-400">Klik untuk melihat 5 langkah praktis mengelola administrasi, jadwal, kuis, & AI</p>
                    </div>
                </div>
                <button class="bg-amber-500/10 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-white text-xs font-bold py-1.5 px-4 rounded-xl border border-amber-500/20 transition-all flex items-center self-end sm:self-center shrink-0"><i class="fa-solid fa-book-open mr-1.5"></i> Buka Panduan</button>
            </div>
        </div>
    `;

    if (AppState.ui.dashboardClockInterval) clearInterval(AppState.ui.dashboardClockInterval);
    AppState.ui.dashboardClockInterval = setInterval(() => {
        const clockEl = document.getElementById('live-dashboard-clock');
        if (clockEl) clockEl.innerText = new Date().toTimeString().slice(0, 8);
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
    const fullBackup = { version: "2.0", db: AppState.db, bankSoal: AppState.kuis.bankSoalManual, config: { gasUrl: AppState.config.gasUrl } };
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup));
    let link = document.createElement('a'); link.href = dataStr; link.download = `Backup_SmartTeacher_Lengkap.json`;
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
                if (parsed.bankSoal) { AppState.kuis.bankSoalManual = parsed.bankSoal; localStorage.setItem('smartTeacher_bankSoal', JSON.stringify(parsed.bankSoal)); }
                if (parsed.config && parsed.config.gasUrl) { AppState.config.gasUrl = parsed.config.gasUrl; localStorage.setItem('ST_GAS_URL', parsed.config.gasUrl); }
            } else if (parsed && parsed.sekolah) { AppState.db = parsed; } else { throw new Error("Struktur data JSON tidak dikenali."); }
            forceSaveNotification();
            showAlert("Berhasil", "Database dan Bank Soal sukses dipulihkan! Memuat ulang sistem...", "success");
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) { showAlert("Error", "Gagal memproses file JSON: " + err.message, "error"); }
    };
    reader.readAsText(fileInput.files[0]);
}

function toggleForm(mode) {
    document.getElementById('auth-error-msg').classList.add('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    if (mode === 'daftar') {
        document.getElementById('form-masuk').classList.add('hidden');
        document.getElementById('form-daftar').classList.remove('hidden');
    } else {
        document.getElementById('form-daftar').classList.add('hidden');
        document.getElementById('form-masuk').classList.remove('hidden');
    }
}

function cekDanValidasiGasUrl() {
    const savedUrl = localStorage.getItem('ST_GAS_URL') || "";
    const loginScreen = document.getElementById('login-screen');
    const setupModal = document.getElementById('setup-db-modal');
    if (!savedUrl || !savedUrl.startsWith("http")) {
        localStorage.removeItem('smart_teacher_user');
        if (setupModal) setupModal.classList.remove('hidden');
        if (loginScreen) { loginScreen.classList.remove('hidden'); loginScreen.style.display = 'flex'; }
    } else {
        if (setupModal) setupModal.classList.add('hidden');
    }
}

function simpanSetupGasUrl() {
    const inputUrl = document.getElementById('modal-gas-url-input').value.trim();
    if (!inputUrl || !inputUrl.startsWith("http")) return alert("Harap masukkan tautan Web App Apps Script yang valid berakhiran /exec!");
    localStorage.setItem('ST_GAS_URL', inputUrl);
    AppState.config.gasUrl = inputUrl;
    alert("Tautan database berhasil disimpan! Memuat ulang aplikasi...");
    window.location.reload();
}

function tutupModalSetup() { document.getElementById('setup-db-modal').classList.add('hidden'); }

function salinKodeBackend() {
    var copyText = document.getElementById("kode-backend-gas");
    copyText.select(); copyText.setSelectionRange(0, 99999); 
    try { navigator.clipboard.writeText(copyText.value).then(() => alert("Kode berhasil disalin!"));
    } catch (err) { document.execCommand('copy'); alert("Kode berhasil disalin!"); }
}

async function prosesLogin() {
    var user = document.getElementById('login-username').value.trim();
    var pass = document.getElementById('login-password').value.trim();
    var errorMsg = document.getElementById('auth-error-msg');
    var gasAuthUrl = localStorage.getItem('ST_GAS_URL') || "";
    if (!gasAuthUrl) { cekDanValidasiGasUrl(); return; }
    if (user === "" || pass === "") { errorMsg.innerText = "Username dan sandi wajib diisi!"; errorMsg.classList.remove('hidden'); return; }
    errorMsg.innerText = "Menghubungkan ke database Anda..."; errorMsg.classList.remove('hidden');

    try {
        let url = gasAuthUrl + "?action=login&username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(pass);
        let response = await fetch(url);
        let text = await response.text();
        if (text.trim().startsWith("<")) throw new Error("Akses diblokir Google. Pastikan izin Web App diatur ke 'Siapa saja'.");
        let result = JSON.parse(text);
        if (result.status === "success") {
            localStorage.setItem('smart_teacher_user', user);
            document.getElementById('login-screen').style.display = 'none';
        } else { errorMsg.innerText = result.message || "Username atau sandi salah!"; }
    } catch (err) { errorMsg.innerText = "Gagal: " + err.message; }
}

async function prosesDaftar() {
    var user = document.getElementById('reg-username').value.trim();
    var pass = document.getElementById('reg-password').value.trim();
    var errorMsg = document.getElementById('auth-error-msg');
    var gasAuthUrl = localStorage.getItem('ST_GAS_URL') || "";
    if (!gasAuthUrl) { cekDanValidasiGasUrl(); return; }
    if (user === "" || pass === "") { errorMsg.innerText = "Username dan sandi wajib diisi!"; errorMsg.classList.remove('hidden'); return; }
    errorMsg.innerText = "Mendaftarkan akun baru..."; errorMsg.classList.remove('hidden');

    try {
        let url = gasAuthUrl + "?action=register&username=" + encodeURIComponent(user) + "&password=" + encodeURIComponent(pass);
        let response = await fetch(url);
        let text = await response.text();
        if (text.trim().startsWith("<")) throw new Error("Akses diblokir Google. Pastikan izin Web App diatur ke 'Siapa saja'.");
        let result = JSON.parse(text);
        if (result.status === "success") {
            localStorage.setItem('smart_teacher_user', user);
            document.getElementById('login-screen').style.display = 'none';
        } else { errorMsg.innerText = result.message || "Username sudah dipakai!"; }
    } catch (err) { errorMsg.innerText = "Gagal: " + err.message; }
}

let workspaces = JSON.parse(localStorage.getItem('ST_WORKSPACES')) || [];
let activeWsId = localStorage.getItem('ST_ACTIVE_WS_ID');

if (workspaces.length === 0) {
    let defaultWs = { id: 'ws_' + Date.now(), nama: 'Ruang Kerja Utama', url: '', npsn: '' };
    workspaces.push(defaultWs);
    activeWsId = defaultWs.id;
    simpanWsKeStorage();
}

function simpanWsKeStorage() {
    localStorage.setItem('ST_WORKSPACES', JSON.stringify(workspaces));
    localStorage.setItem('ST_ACTIVE_WS_ID', activeWsId);
    let idGuru = localStorage.getItem('ST_ID_GURU');
    if (!idGuru || idGuru === "") {
        idGuru = prompt("Masukkan Nama Anda untuk pencadangan Ruang Kerja (Contoh: Pak Anas / Kelas 8A):", "Pak Anas");
        if (!idGuru) idGuru = "Guru_Anonim"; 
        localStorage.setItem('ST_ID_GURU', idGuru);
    }
    let dataBackup = JSON.stringify(workspaces);
    fetch(URL_GATEWAY_PUSAT + "?action=simpanWorkspace&id=" + encodeURIComponent(idGuru) + "&link=" + encodeURIComponent(dataBackup)).catch(e=>{});
}

function getActiveWorkspace() { return workspaces.find(w => w.id === activeWsId) || workspaces[0]; }
function renderLabelWorkspace() { const active = getActiveWorkspace(); const labelEl = document.getElementById('label-ruang-kerja'); if(labelEl) labelEl.innerText = active.nama; }
document.addEventListener('DOMContentLoaded', renderLabelWorkspace);

function bukaModalWorkspace() {
    const modal = document.getElementById('modal-workspace');
    const content = document.getElementById('modal-workspace-content');
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
    renderListWorkspace();
}

function tutupModalWorkspace() {
    const modal = document.getElementById('modal-workspace');
    const content = document.getElementById('modal-workspace-content');
    modal.classList.add('opacity-0'); content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
    document.getElementById('form-tambah-ws').classList.add('hidden');
}

let editWsIdTerpilih = null;
function toggleFormTambahWs() {
    document.getElementById('form-tambah-ws').classList.toggle('hidden');
    document.getElementById('ws-nama').value = ''; document.getElementById('ws-url').value = ''; document.getElementById('ws-npsn').value = '';
    editWsIdTerpilih = null; 
}

function renderListWorkspace() {
    const listContainer = document.getElementById('list-workspace');
    listContainer.innerHTML = '';
    workspaces.forEach(ws => {
        const isActive = ws.id === activeWsId;
        const div = document.createElement('div');
        div.className = `p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${isActive ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}`;
        div.onclick = () => pindahWorkspace(ws.id);
        let tombolAksi = '';
        if (ws.id !== 'utama') {
            tombolAksi = `<button onclick="editRuangKerja('${ws.id}', event)" class="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"><i class="fa-solid fa-pen text-xs"></i></button>
                          <button onclick="hapusRuangKerja('${ws.id}', event)" class="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"><i class="fa-solid fa-trash-can text-sm"></i></button>`;
        }
        div.innerHTML = `<div><h4 class="text-sm font-bold text-white">${ws.nama}</h4><p class="text-[10px] text-slate-400 font-mono mt-0.5">NPSN: ${ws.npsn || '-'} | URL: ${ws.url ? 'Tersimpan' : 'Kosong'}</p></div><div class="flex items-center gap-2">${isActive ? '<i class="fa-solid fa-circle-check text-indigo-400 text-lg mr-1"></i>' : ''}${tombolAksi}</div>`;
        listContainer.appendChild(div);
    });
}

function hapusRuangKerja(idHapus, event) {
    event.stopPropagation(); 
    if (confirm("Yakin ingin menghapus ruang kerja ini?")) {
        const index = workspaces.findIndex(ws => ws.id === idHapus);
        if (index !== -1) { workspaces.splice(index, 1); localStorage.setItem('ST_WORKSPACES', JSON.stringify(workspaces)); renderListWorkspace(); alert("Ruang kerja dihapus!"); }
    }
}

function editRuangKerja(idEdit, event) {
    event.stopPropagation(); 
    const index = workspaces.findIndex(ws => ws.id === idEdit);
    if (index !== -1) {
        const dataLama = workspaces[index];
        document.getElementById('form-tambah-ws').classList.remove('hidden');
        document.getElementById('ws-nama').value = dataLama.nama || ''; document.getElementById('ws-url').value = dataLama.url || ''; document.getElementById('ws-npsn').value = dataLama.npsn || '';
        editWsIdTerpilih = idEdit;
        document.getElementById('form-tambah-ws').scrollIntoView({ behavior: 'smooth' });
    }
}

function pindahWorkspace(id) {
    if (activeWsId === id) return; 
    const targetWs = workspaces.find(w => w.id === id);
    if (targetWs) localStorage.setItem('ST_GAS_URL', targetWs.url || "");
    activeWsId = id;
    simpanWsKeStorage();
    window.location.reload(); 
}

function simpanWorkspaceBaru() {
    const nama = document.getElementById('ws-nama').value.trim(); const url = document.getElementById('ws-url').value.trim(); const npsn = document.getElementById('ws-npsn').value.trim();
    if (!nama) return alert("Nama instansi wajib diisi!");
    if (editWsIdTerpilih) {
        const index = workspaces.findIndex(ws => ws.id === editWsIdTerpilih);
        if (index !== -1) {
            workspaces[index].nama = nama; workspaces[index].url = url; workspaces[index].npsn = npsn;
            if (editWsIdTerpilih === activeWsId) localStorage.setItem('ST_GAS_URL', url || "");
        }
        editWsIdTerpilih = null; alert("Data Ruang Kerja berhasil diperbarui!");
    } else {
        const newWs = { id: 'ws_' + Date.now(), nama: nama, url: url, npsn: npsn };
        workspaces.push(newWs);
        activeWsId = newWs.id; localStorage.setItem('ST_GAS_URL', url || "");
        alert("Ruang Kerja baru ditambahkan!");
    }
    simpanWsKeStorage(); window.location.reload();
}

const URL_GATEWAY_PUSAT = "https://script.google.com/macros/s/AKfycbzcHLMR_oS83RcSUucJ5PWEkD7MxIAkNf_vQ-tDOHaUeJ-AelGf0KmPZTCW9EGyEHxJ/exec";
let savedUrl = localStorage.getItem('ST_GAS_URL');
if (!savedUrl || savedUrl === "") { savedUrl = URL_GATEWAY_PUSAT; localStorage.setItem('ST_GAS_URL', savedUrl); }

const fabContainer = document.getElementById('fab-container');
const dragHandle = document.getElementById('fab-drag-handle');
let isDraggingFab = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

function dragStartFab(e) {
    if (e.type === "touchstart") { initialX = e.touches[0].clientX - xOffset; initialY = e.touches[0].clientY - yOffset; }
    else { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; }
    if (e.target === dragHandle || (dragHandle && dragHandle.contains(e.target))) isDraggingFab = true;
}
function dragEndFab(e) { initialX = currentX; initialY = currentY; isDraggingFab = false; }
function dragFab(e) {
    if (isDraggingFab && fabContainer) {
        e.preventDefault(); 
        if (e.type === "touchmove") { currentX = e.touches[0].clientX - initialX; currentY = e.touches[0].clientY - initialY; }
        else { currentX = e.clientX - initialX; currentY = e.clientY - initialY; }
        xOffset = currentX; yOffset = currentY;
        fabContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
}

if (fabContainer && dragHandle) {
    fabContainer.addEventListener("touchstart", dragStartFab, { passive: false }); fabContainer.addEventListener("touchend", dragEndFab, { passive: false });
    fabContainer.addEventListener("touchmove", dragFab, { passive: false }); fabContainer.addEventListener("mousedown", dragStartFab);
    document.addEventListener("mouseup", dragEndFab); document.addEventListener("mousemove", dragFab);
}

function toggleEdgePanel() {
    const panel = document.getElementById('edge-panel'); const icon = document.getElementById('edge-icon');
    if (panel.classList.contains('translate-x-full')) { panel.classList.remove('translate-x-full'); panel.classList.add('translate-x-0'); icon.style.transform = 'rotate(180deg)'; } 
    else { panel.classList.remove('translate-x-0'); panel.classList.add('translate-x-full'); icon.style.transform = 'rotate(0deg)'; }
}

window.addEventListener('DOMContentLoaded', async () => { 
    // 1. Biarkan layar loading (app-preloader) tampil secara bawaan HTML
    // Kita biarkan CSS bawaan Bapak bekerja memposisikannya di tengah layar.

    // 2. TUNGGU DATABASE SELESAI DIMUAT DULU
    try {
        await loadDatabase(); // loadDatabase sudah otomatis memanggil updateUI() di dalamnya
    } catch(e) {
        console.error("Gagal load database awal:", e);
    }

    // 3. CEK LOGIN (Singkirkan kotak login jika sudah masuk)
    const savedUser = localStorage.getItem('smart_teacher_user');
    const savedUrl = localStorage.getItem('ST_GAS_URL') || "";
    const loginScreen = document.getElementById('login-screen');

    if (savedUser && savedUrl.startsWith("http")) {
        // MATIKAN KOTAK LOGIN
        if (loginScreen) {
            loginScreen.style.display = 'none';
            loginScreen.classList.add('hidden');
        }
    } else {
        cekDanValidasiGasUrl();
    }

    // 4. TUTUP LAYAR LOADING DENGAN HALUS
    // Bagian ini HANYA dieksekusi setelah data Dashboard 100% tergambar
    const loader = document.getElementById('app-preloader');
    if (loader) {
        loader.style.opacity = '0'; // Pudar perlahan (efek transisi)
        setTimeout(() => {
            loader.style.display = 'none'; // Hilangkan sepenuhnya setelah pudar
        }, 600); // Tunggu 0.6 detik agar pudar sempurna
    }
});

// ui.js - Taruh di baris paling bawah

// 1. Catat Dashboard saat aplikasi pertama kali dimuat
window.addEventListener('load', () => {
    history.replaceState({ tab: 'dashboard', type: 'halaman' }, "", "#dashboard");
});

// 2. Mesin Pencegat Swipe Back / Tombol Kembali Android (VERSI FINAL HASH)
window.addEventListener('popstate', (event) => {
    
    // A. DAFTAR SUB-MODAL (Pop-up yang menumpuk di atas layar)
    const subModals = [
        'bank-soal-modal', 'audio-settings-modal', 'bedah-soal-modal', 
        'import-modal', 'notification-modal', 'setup-db-modal', 
        'modal-workspace', 'qr-modal-scanner', 'qr-modal-tampil', 'guide-modal'
    ];
    
    let subModalTertutup = false;
    
    // Cek dan tutup HANYA SATU sub-modal yang sedang terbuka
    for (let i = 0; i < subModals.length; i++) {
        const el = document.getElementById(subModals[i]);
        if (el && !el.classList.contains('hidden') && el.style.display !== 'none') {
            el.classList.add('hidden');
            subModalTertutup = true;
            break; 
        }
    }

    // B. KENDALI SWIPE BACK KHUSUS ARENA KUIS (LAYAR PENUH)
    const arenaKuis = document.getElementById('quiz-arena-modal');
    let arenaKuisTertutup = false;
    
    if (!subModalTertutup && arenaKuis && !arenaKuis.classList.contains('hidden')) {
        if (confirm('Yakin ingin menghentikan dan keluar dari Arena Kuis?')) {
            if (typeof stopBGM === 'function') stopBGM();
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
            if(exit && document.fullscreenElement) exit.call(document).catch(e => {});
            
            arenaKuis.classList.add('hidden');
            arenaKuisTertutup = true;
        } else {
            // BATAL KELUAR: Suntik ulang riwayat kuis agar tidak jebol keluar
            history.pushState(null, "", "#arena-kuis");
            return;
        }
    }

    // C. TUTUP LACI (SIDEBAR MOBILE / EDGE PANEL)
    const sidebar = document.getElementById('mobile-drawer');
    const edgePanel = document.getElementById('edge-panel');
    let menutupLaci = false;

    if (!subModalTertutup && !arenaKuisTertutup) {
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
            if (typeof toggleMobileMenu === 'function') toggleMobileMenu(true);
            menutupLaci = true;
        }
        if (edgePanel && edgePanel.classList.contains('translate-x-0')) {
            if (typeof toggleEdgePanel === 'function') toggleEdgePanel();
            menutupLaci = true;
        }
    }

    // --- KUNCI PENAHAN MULTI-LAPIS ---
    // Jika barusan menutup Sub-Modal atau Laci, TAHAN layar di halaman saat ini
    if (subModalTertutup || arenaKuisTertutup || menutupLaci) {
        history.pushState(null, "", "#" + AppState.ui.activeTab);
        return; 
    }

    // D. NAVIGASI HALAMAN MENGGUNAKAN HASH URL (ANTI-GAGAL)
    const hash = window.location.hash.replace('#', '');
    
    if (hash === 'dashboard' || !hash) {
        switchTab('dashboard', true); // Kembali ke dashboard dengan aman
    } else if (hash && typeof menuItems !== 'undefined' && menuItems.some(m => m.id === hash)) {
        switchTab(hash, true); // Kembali ke menu riwayat sebelumnya
    } else {
        switchTab('dashboard', true); // Fallback mutlak
    }
});
