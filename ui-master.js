// ==========================================================
// FILE: ui-master.js
// FUNGSI: Data Akademik (CRUD), Penilaian, Rapor & Absen
// ==========================================================

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
        if (currentFilter) data = data.filter(item => item.kelasId === currentFilter);
    }
    
    const dataAsliUtuh = AppState.db[type] || [];
    const kamusRelasi = {};
    config.fields.forEach(f => {
        if (f.type === 'dynamicSelect') {
            kamusRelasi[f.source] = {};
            (AppState.db[f.source] || []).forEach(r => { kamusRelasi[f.source][r.id] = r; });
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
        if (idx >= 0) AppState.db[type][idx] = { ...AppState.db[type][idx], ...itemData };
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
    if (btn) btn.classList.toggle('hidden', checkedCbs.length === 0);
    if (selectAllCb && allCbs.length > 0) selectAllCb.checked = checkedCbs.length === allCbs.length;
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
    if (type === 'siswa' && AppState.ui.filterKelasSiswa) data = data.filter(item => item.kelasId === AppState.ui.filterKelasSiswa);
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
            if (typeof val === 'string') val = val.replace(/<[^>]*>?/gm, '');
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

    if (!hasTugas && !hasUTS && !hasUAS) return { akhir: 0, predikat: '-', nTugas: '-', nUTS: '-', nUAS: '-' };

    let weightedSum = ((nTugas || 0) * 0.3) + ((nUTS || 0) * 0.3) + ((nUAS || 0) * 0.4);
    let totalWeight = (hasTugas ? 0.3 : 0) + (hasUTS ? 0.3 : 0) + (hasUAS ? 0.4 : 0);
    
    let akhir = Math.round(weightedSum / totalWeight);
    let predikat = akhir >= 90 ? 'A' : (akhir >= 80 ? 'B' : (akhir >= 70 ? 'C' : 'D'));

    return { akhir, predikat, nTugas: hasTugas ? nTugas : '-', nUTS: hasUTS ? nUTS : '-', nUAS: hasUAS ? nUAS : '-' };
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
        if (elemenBulan && elemenBulan.value) currentMonthPrefix = elemenBulan.value + '-';

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
                        <tbody>${rowsWali}</tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

let html5QrcodeScanner = null;
function bukaScannerQR(tanggal, kelasId) {
    if (typeof Html5QrcodeScanner === 'undefined') return showAlert("Tunggu", "Sedang mengunduh modul Kamera AI... Coba klik lagi dalam 3 detik.", "info");

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
    html5QrcodeScanner.render((decodedText, decodedResult) => { prosesHasilScan(decodedText, tanggal, kelasId); }, (errorMessage) => { });
}

function tutupScannerQR() {
    if (html5QrcodeScanner) html5QrcodeScanner.clear().catch(e => console.log(e));
    document.getElementById('qr-modal-scanner').classList.add('hidden');
    loadAbsensi(); 
}

function prosesHasilScan(nisAtauId, tanggal, kelasId) {
    html5QrcodeScanner.pause();
    const siswa = AppState.db.siswa.find(s => s.kelasId === kelasId && (s.nis === nisAtauId || s.id === nisAtauId));
    const toast = document.getElementById('scan-result-toast');
    
    if (siswa) {
        let existingIndex = AppState.db.absensi.findIndex(a => a.siswaId === siswa.id && a.tanggal === tanggal && a.kelasId === kelasId);
        if (existingIndex >= 0) AppState.db.absensi[existingIndex].status = 'H';
        else AppState.db.absensi.push({ id: generateId(), siswaId: siswa.id, kelasId, tanggal, status: 'H' });
        
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
         if (existingIndex >= 0) AppState.db.absensi[existingIndex].status = nextStatus;
         else AppState.db.absensi.push({ id: generateId(), siswaId, kelasId, tanggal, status: nextStatus });
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
            const existingIndex = AppState.db.absensi.findIndex(a => a.siswaId === siswa.id && a.tanggal === tanggal && a.kelasId === kelasId);
            if (existingIndex >= 0) AppState.db.absensi[existingIndex].status = status;
            else AppState.db.absensi.push({ id: generateId(), siswaId: siswa.id, kelasId: kelasId, tanggal: tanggal, status: status });
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
            <div class="w-64 border-2 border-black mb-10"><div class="bg-slate-100 font-bold py-1.5 px-3 border-b-2 border-black text-center">Ketidakhadiran</div><table class="w-full text-xs"><tr class="border-b border-black"><td class="py-1.5 px-3">Sakit</td><td class="py-1.5 px-3 text-right font-bold">${jmlSakit} hari</td></tr><tr class="border-b border-black"><td class="py-1.5 px-3">Izin</td><td class="py-1.5 px-3 text-right font-bold">${jmlIzin} hari</td></tr><tr><td class="py-1.5 px-3">Tanpa Keterangan</td><td class="py-1.5 px-3 text-right font-bold">${jmlAlpa} hari</td></tr></table></div>
            <div class="flex justify-between mt-12 px-10"><div class="text-center"><p class="mb-20">Mengetahui,<br>Kepala Sekolah</p><p class="font-bold border-b border-black inline-block px-4">${AppState.db.sekolah.kepsek}</p><p class="text-xs mt-1">NIP. ${AppState.db.sekolah.nip || '-'}</p></div><div class="text-center"><p class="mb-20"><br>Wali Kelas</p><p class="font-bold border-b border-black inline-block px-4">${kelas ? kelas.wali : '_____________________'}</p></div></div>
            <div class="text-center mt-12 no-print border-t border-slate-200 pt-8"><button onclick="window.print()" class="bg-slate-900 text-white font-bold py-3.5 px-10 rounded-xl shadow-2xl"><i class="fa-solid fa-print mr-2"></i> Cetak Rapor (PDF)</button></div>
        </div>
    `;
    container.classList.remove('hidden');
}

function lihatQRSiswa(id) {
    const siswa = AppState.db.siswa.find(s => s.id === id);
    if(!siswa) return;
    const kelasSiswa = AppState.db.kelas.find(k => k.id === siswa.kelasId || k.kode === siswa.kelasId);
    const namaKelas = kelasSiswa ? kelasSiswa.kode : (siswa.kelasId || "-");
    const targetData = `${siswa.nis || siswa.id}|${siswa.nama}|${namaKelas}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetData)}&margin=10`;

    const modalHtml = `
    <div id="qr-modal-tampil" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all fade-in">
        <style>@media print { body * { visibility: hidden; } #qr-modal-tampil, #qr-modal-tampil * { visibility: visible; } #qr-modal-tampil { position: absolute; left: 0; top: 0; width: 100%; height: 100%; align-items: flex-start; justify-content: center; padding-top: 2rem; background: white !important; } .qr-no-print { display: none !important; } }</style>
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm text-center relative border border-slate-200 dark:border-slate-800">
            <button onclick="document.getElementById('qr-modal-tampil').remove()" class="qr-no-print absolute top-4 right-4 w-9 h-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-xl flex items-center justify-center font-bold transition-all"><i class="fa-solid fa-xmark text-lg"></i></button>
            <div class="qr-no-print w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner"><i class="fa-solid fa-id-badge"></i></div>
            <h3 class="text-xl font-black text-slate-800 dark:text-white mb-1">Kartu Pelajar Digital</h3>
            <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-6">${siswa.nama} <br><span class="text-xs text-slate-500 dark:text-slate-400">NIS: ${siswa.nis || 'Belum diatur'}</span></p>
            <div class="bg-white p-3 rounded-2xl shadow-sm border-2 border-dashed border-slate-300 inline-block mb-6 relative group"><img src="${qrUrl}" alt="QR Code ${siswa.nama}" class="w-48 h-48 object-contain"></div>
            <p class="qr-no-print text-[11px] text-slate-500 mb-5 leading-relaxed">QR Code ini langsung terhubung dengan NIS siswa. Bisa digunakan untuk scan di <b>Smart Gateway</b>.</p>
            <button onclick="window.print()" class="qr-no-print w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center"><i class="fa-solid fa-print mr-2"></i> Cetak Kartu QR</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function tarikDataGateway(kelasId) {
    const activeWs = getActiveWorkspace();
    const npsn = activeWs.npsn;
    if (!npsn) return showAlert("NPSN Kosong", "Kode Sekolah / NPSN untuk ruang kerja '" + activeWs.nama + "' belum diatur. Silakan buat/edit ruang kerjanya.", "error");

    const tgl = new Date();
    const tglStr = tgl.getFullYear() + "-" + String(tgl.getMonth() + 1).padStart(2, '0') + "-" + String(tgl.getDate()).padStart(2, '0');
    const btn = document.getElementById('btn-tarik-gateway');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sedang Menarik Data...';
    btn.disabled = true;

    try {
        const urlTarik = `${URL_GATEWAY_PUSAT}?action=getLogs&npsn=${encodeURIComponent(npsn)}&tanggal=${encodeURIComponent(tglStr)}`;
        const response = await fetch(urlTarik);
        const textResponse = await response.text(); 
        
        let jsonResponse;
        try { jsonResponse = JSON.parse(textResponse); } catch (err) { throw new Error("Server membalas format salah."); }
        if (jsonResponse.status !== "sukses") throw new Error(jsonResponse.pesan || "Gagal mengambil data dari server pusat.");

        const dataGateway = jsonResponse.data || []; 
        let hitungBerhasil = 0;
        const siswaKelas = AppState.db.siswa.filter(s => s.kelasId === kelasId);
            
        dataGateway.forEach(absenGerbang => {
            if (absenGerbang.nis && absenGerbang.tanggal) {
                let nisBersih = String(absenGerbang.nis);
                    if (nisBersih.includes('|')) nisBersih = nisBersih.split('|')[0];
                    if (nisBersih.includes(' ')) nisBersih = nisBersih.split(' ')[0];
                    const siswaMatch = siswaKelas.find(s => Number(s.nis) === Number(nisBersih) || String(s.id) === nisBersih);
                if (siswaMatch) {
                    const idx = AppState.db.absensi.findIndex(a => a.siswaId === siswaMatch.id && a.tanggal === absenGerbang.tanggal && a.kelasId === kelasId);
                    if (idx >= 0) {
                        if (AppState.db.absensi[idx].status !== 'H') { AppState.db.absensi[idx].status = 'H'; hitungBerhasil++; }
                    } else {
                        AppState.db.absensi.push({ id: generateId(), siswaId: siswaMatch.id, kelasId: kelasId, tanggal: absenGerbang.tanggal, status: 'H' });
                        hitungBerhasil++;
                    }
                }
            }
        });
            
        if (hitungBerhasil > 0) {
            saveDatabase(); 
            showAlert("Sinkronisasi Sukses!", `Berhasil menarik Hadir (H) untuk ${hitungBerhasil} siswa dari Gateway!`, "success");
        } else {
            showAlert("Selesai", "Semua data sudah sinkron. Tidak ada kehadiran baru.", "info");
        }
    } catch (err) { showAlert("Koneksi Gagal", err.message, "error");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        loadAbsensi(); 
    }
}

// --- SISTEM GESTUR KEMBALI MUTLAK (ANTI-TERLEMPAR) ---

let hitungSwipeKeluar = 0;
let timerSwipe = null;

// 1. PERTAHANAN GANDA SAAT LOAD: Dorong 2 riwayat sekaligus agar browser tidak bisa langsung bablas
window.addEventListener('load', function() {
    history.pushState('penahan-awal', null, location.href);
    history.pushState('penahan-aktif', null, location.href);
});

window.addEventListener('popstate', function(event) {
    // 2. SUNTIKAN INSTAN: Detik pertama di-swipe, langsung isi kembali riwayatnya agar tumpukan tidak pernah habis!
    history.pushState('penahan-aktif', null, location.href);

    // 3. Tutup peringatan (SweetAlert) jika ada
    if (typeof Swal !== 'undefined' && Swal.isVisible()) {
        Swal.close();
        return;
    }

    // 4. Tutup Sidebar di HP (Tablet aman)
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
        return;
    }

    // 5. Tutup Modal Pop-up (seperti form tambah siswa/kamera)
    const modals = Array.from(document.querySelectorAll('.fixed.inset-0')).filter(m => !m.classList.contains('hidden') && m.style.display !== 'none');
    if (modals.length > 0) {
        modals[modals.length - 1].classList.add('hidden');
        return;
    }

    // 6. KUNCI PROFESIONAL: Cari dan klik tombol Keluar/Kembali (Khusus Arena Kuis & Layar Interaktif)
    const tombolKembaliLayar = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.offsetParent !== null && 
        (btn.innerText.toLowerCase().includes('keluar') || 
         btn.innerText.toLowerCase().includes('kembali') || 
         btn.innerText.toLowerCase().includes('tutup'))
    );

    if (tombolKembaliLayar) {
        tombolKembaliLayar.click(); // Eksekusi kembali ke menu sebelumnya secara natural
        return; 
    }

    // 7. Kembali ke Dashboard jika sedang di menu lain (Data Siswa, Data Guru, dll)
    const menuAktif = document.querySelector('#sidebar .bg-emerald-600') || document.querySelector('#sidebar .active'); 
    const teksMenu = menuAktif ? menuAktif.innerText.toLowerCase() : '';
    
    if (!teksMenu.includes('dashboard')) {
        const tombolDashboard = document.querySelector('[onclick*="ashboard"]') || document.querySelector('[onclick*="home"]');
        if (tombolDashboard) {
            tombolDashboard.click();
            return;
        }
    }

    // 8. LOGIKA EXIT 3X (Hanya berjalan jika Bapak sudah berada di Dashboard Utama)
    hitungSwipeKeluar++;
    
    if (hitungSwipeKeluar === 1) {
        if (typeof showAlert === 'function') showAlert("Tahan", "Swipe 2x lagi untuk keluar.", "info");
        resetHitungan();
    } else if (hitungSwipeKeluar === 2) {
        if (typeof showAlert === 'function') showAlert("Peringatan", "Swipe 1x lagi untuk keluar.", "warning");
        resetHitungan();
    } else if (hitungSwipeKeluar >= 3) {
        clearTimeout(timerSwipe);
        hitungSwipeKeluar = 0; 
        
        if (confirm("Yakin Anda mau keluar dari aplikasi Smart Teacher?")) {
            // Izinkan browser menghancurkan semua penahan dan keluar
            window.history.go(-3);
        }
    }

    function resetHitungan() {
        clearTimeout(timerSwipe);
        timerSwipe = setTimeout(() => { hitungSwipeKeluar = 0; }, 4000);
    }
});
