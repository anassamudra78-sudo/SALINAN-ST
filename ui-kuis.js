// ==========================================================
// FILE: ui-kuis.js 
// FUNGSI: Mengelola Arena Kuis, Game Show, Duel & Bank Soal
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
    AppState.kuis.siswaUndiUlangPending = AppState.kuis.siswaUndiUlangPending || [];
    
    // 1. Cari siswa yang belum pernah main sama sekali
    let siswaBelumMain = listSiswa.filter(s => 
        !AppState.kuis.siswaTelahMainSingle.includes(s.id) && 
        !AppState.kuis.siswaUndiUlangPending.includes(s.id)
    );
    
    // 2. JIKA SEMUA SISWA BERSIH SUDAH KEBAGIAN, baru masukkan antrean "Undi Ulang" (yang tadi ke kamar mandi)
    if (siswaBelumMain.length === 0 && AppState.kuis.siswaUndiUlangPending.length > 0) {
        showAlert('Info', 'Siswa yang belum main sudah habis. Sekarang giliran siswa yang sempat di-skip (undi ulang) sebelumnya!', 'info');
        // Pindahkan antrean undi ulang kembali menjadi prioritas untuk dimainkan sekarang
        siswaBelumMain = listSiswa.filter(s => AppState.kuis.siswaUndiUlangPending.includes(s.id));
        AppState.kuis.siswaUndiUlangPending = []; // Kosongkan penampungan pending
    }

    // 3. JIKA BENAR-BENAR SEMUA (termasuk yang pending) SUDAH SELESAI:
    if (siswaBelumMain.length === 0) {
        showAlert('Info Sesi', 'Semua siswa (termasuk yang di-skip) sudah mendapat giliran! Tabung undian di-reset ulang dari awal.', 'info');
        AppState.kuis.siswaTelahMainSingle = []; 
        AppState.kuis.siswaUndiUlangPending = [];
        siswaBelumMain = listSiswa; 
    }

    const daftarSemuaNama = listSiswa.map(s => s.nama);
    let acakSiswa = [...siswaBelumMain].sort(() => 0.5 - Math.random());
    let pemenang = acakSiswa[0];

    // Masukkan ke riwayat main
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

// ======================================================================
// FUNGSI UTILITIES KHUSUS KUIS (HARUS DITARUH DI SINI AGAR TERPANGGIL)
// ======================================================================
function acakArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function acakPilihanJawaban(soal) {
    let opsisDenganIndex = soal.opsi.map((opsiText, idx) => {
        return { teks: opsiText, isCorrect: (idx === soal.jawaban_benar_index) };
    });
    
    opsisDenganIndex = acakArray(opsisDenganIndex);
    
    let newSoal = JSON.parse(JSON.stringify(soal));
    newSoal.opsi = opsisDenganIndex.map(o => o.teks);
    newSoal.jawaban_benar_index = opsisDenganIndex.findIndex(o => o.isCorrect === true);
    
    return newSoal;
}

function clearQuizTimeouts() {
    if (AppState.kuis.activeQuizTimeout) {
        clearTimeout(AppState.kuis.activeQuizTimeout);
        AppState.kuis.activeQuizTimeout = null;
    }
}
// ==========================================
// KENDALI MODAL BANK SOAL (RECOVERY)
// ==========================================
function bukaModalBankSoal() {
    const modal = document.getElementById('modal-bank-soal'); // Pastikan ID ini ada di file HTML
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } else {
        console.error("Elemen modal bank soal tidak ditemukan! Pastikan modalnya sudah ditaruh di index.html");
        alert("Terjadi kesalahan: Modal Bank Soal tidak ditemukan di tampilan.");
    }
}

function tutupModalBankSoal() {
    const modal = document.getElementById('modal-bank-soal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}
// ==========================================
// BAGIAN 1: MESIN UNDIAN MEWAH & COUNTDOWN
// ==========================================

function aturSkalaNama(element, teks) {
    const panjang = teks.length;
    const isDuel = (element.id === 'nama-kiri' || element.id === 'nama-kanan');

    if (isDuel) {
        if (panjang > 22) element.style.fontSize = '1.2rem';   
        else if (panjang > 14) element.style.fontSize = '1.7rem';   
        else element.style.fontSize = '2.4rem';   
    } else {
        if (panjang > 24) element.style.fontSize = '1.8rem';   
        else if (panjang > 15) element.style.fontSize = '2.6rem';   
        else element.style.fontSize = '3.6rem';   
    }
}

function putarNamaAcak(element, daftarNama, durasi, namaPemenang, callback) {
    let waktu = 0;
    let interval = 60; 
    const ctx = getAudioCtx();

    let timer = setInterval(() => {
        waktu += interval;
        if (ctx.state === 'running') {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(450, ctx.currentTime);
                gain.gain.setValueAtTime(0.03, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
            } catch(e) {}
        }
        
        let acak = daftarNama[Math.floor(Math.random() * daftarNama.length)];
        aturSkalaNama(element, acak);
        element.innerText = acak;
        
        if (waktu >= durasi) {
            clearInterval(timer);
            aturSkalaNama(element, namaPemenang);
            element.innerText = namaPemenang;
            element.style.color = '#fbbf24'; 
            element.style.transform = 'scale(1.05)';
            element.style.transition = 'all 0.3s ease';
            if (callback) callback();
        }
    }, interval);
}

function eksekusiUndianMewah(mode, pemenang1, pemenang2 = null, daftarSemuaSiswa = []) {
    if (!daftarSemuaSiswa || daftarSemuaSiswa.length === 0) {
        daftarSemuaSiswa = ["AGUS", "BUDI", "CITRA", "DEWI", "EKO", "FAJAR", "GITA", "HADI", "INTAN"];
    }

    const overlay = document.createElement('div');
    overlay.id = 'layar-undian-v2';
    overlay.className = 'fixed inset-0 z-[9999] bg-slate-950/95 flex items-center justify-center backdrop-blur-md transition-opacity';
    
    if (mode === 'single') {
        overlay.innerHTML = `
            <div class="text-center relative px-6 w-full max-w-4xl mx-auto">
                <h2 class="text-amber-400 font-black text-xl lg:text-2xl mb-8 tracking-widest uppercase animate-pulse">Mencari Pemain...</h2>
                <div class="w-full bg-gradient-to-br from-indigo-600 to-purple-900 border-4 border-indigo-400 px-8 py-8 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center justify-center min-h-[160px]">
                    <div id="nama-slot" class="font-black text-white w-full uppercase tracking-wider text-center break-words leading-tight" style="text-shadow: 2px 2px 10px rgba(0,0,0,0.5);">
                        ???
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const elNama = document.getElementById('nama-slot');
        aturSkalaNama(elNama, "???");
        
        putarNamaAcak(elNama, daftarSemuaSiswa, 3000, pemenang1, () => {
            playSoundEffect('terpilih'); 
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } }); 
            setTimeout(() => tampilkanTombolKonfirmasiUndian(overlay, 'single'), 1000); 
        });

    } else if (mode === 'duel') {
        overlay.innerHTML = `
            <div id="arena-clash" class="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-12 relative overflow-hidden">
                <div class="flex-1 flex justify-end">
                    <div id="kartu-kiri" class="w-full max-w-md bg-gradient-to-br from-blue-700 to-cyan-900 border-4 border-blue-400 rounded-3xl p-6 lg:p-8 text-center shadow-[0_0_50px_rgba(37,99,235,0.6)] opacity-0 flex flex-col justify-center min-h-[190px]" style="animation: clashLeft 0.8s ease-out forwards;">
                        <h3 class="text-blue-300 font-black text-lg lg:text-xl mb-4 tracking-widest">SUDUT BIRU</h3>
                        <div id="nama-kiri" class="font-black text-white uppercase tracking-wider break-words leading-tight">???</div>
                    </div>
                </div>
                
                <div class="flex-shrink-0 flex items-center justify-center z-50 mx-4 lg:mx-8">
                    <div id="logo-vs" class="pr-4 text-7xl lg:text-8xl font-black text-red-500 italic ... drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] opacity-0" style="text-shadow: 4px 4px 0px #fff; animation: pulseVs 0.5s ease-out 0.8s forwards;">
                        VS
                    </div>
                </div>

                <div class="flex-1 flex justify-start">
                    <div id="kartu-kanan" class="w-full max-w-md bg-gradient-to-br from-red-700 to-rose-900 border-4 border-red-400 rounded-3xl p-6 lg:p-8 text-center shadow-[0_0_50px_rgba(225,29,72,0.6)] opacity-0 flex flex-col justify-center min-h-[190px]" style="animation: clashRight 0.8s ease-out forwards;">
                        <h3 class="text-red-300 font-black text-lg lg:text-xl mb-4 tracking-widest">SUDUT MERAH</h3>
                        <div id="nama-kanan" class="font-black text-white uppercase tracking-wider break-words leading-tight">???</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const arena = document.getElementById('arena-clash');
        
        setTimeout(() => {
            arena.style.animation = 'clashShake 0.5s ease-in-out';
        }, 800);

        setTimeout(() => {
            const elKiri = document.getElementById('nama-kiri');
            const elKanan = document.getElementById('nama-kanan');
            
            putarNamaAcak(elKiri, daftarSemuaSiswa, 3500, pemenang1);
            putarNamaAcak(elKanan, daftarSemuaSiswa, 3500, pemenang2, () => {
                playSoundEffect('terpilih'); 
                confetti({ particleCount: 200, spread: 150, origin: { y: 0.5 } }); 
                setTimeout(() => tampilkanTombolKonfirmasiUndian(overlay, 'duel'), 1000); 
            });
        }, 1000);
    }
}

function tampilkanTombolKonfirmasiUndian(overlay, mode) {
    const btnBox = document.createElement('div');
    btnBox.className = 'absolute bottom-10 lg:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-4 z-[99999] fade-in';
    btnBox.innerHTML = `
        <button onclick="aksiUndianSelesai('${mode}', 'ulang')" class="bg-slate-900/80 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/50 font-black py-3.5 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center">
            <i class="fa-solid fa-rotate-right mr-2 text-lg"></i> Undi Ulang
        </button>
        <button onclick="aksiUndianSelesai('${mode}', 'lanjut')" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black py-3.5 px-10 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-400/50 transition-all hover:scale-105 flex items-center justify-center">
            <i class="fa-solid fa-play mr-2 text-lg"></i> Lanjut Kuis
        </button>
    `;
    overlay.appendChild(btnBox);
}

function aksiUndianSelesai(mode, aksi) {
    const overlay = document.getElementById('layar-undian-v2');
    if (overlay) overlay.remove();

    if (aksi === 'lanjut') {
        // Jika guru klik "Lanjut Kuis", jalankan hitung mundur
        mulaiHitungMundur(mode === 'single' ? 3 : 5);
    } else {
        // Jika guru klik "Undi Ulang" karena anak ke kamar mandi/tidak siap:
        if (mode === 'single') {
            if (AppState.kuis.siswaTelahMainSingle.length > 0) {
                // Ambil ID siswa yang baru saja terundi (ada di posisi paling belakang array riwayat)
                let idSiswaBatal = AppState.kuis.siswaTelahMainSingle.pop();
                
                // Simpan sementara ID ini ke dalam daftar tunda/pending khusus undi ulang
                AppState.kuis.siswaUndiUlangPending = AppState.kuis.siswaUndiUlangPending || [];
                AppState.kuis.siswaUndiUlangPending.push(idSiswaBatal);
            }
            // Langsung putar undian lagi untuk mencari penggantinya dari yang belum main
            undiPemainSpin(); 

        } else if (mode === 'duel') {
            // Untuk mode duel jika di-undi ulang
            if (AppState.kuis.siswaTelahMainDuel.length > 1) {
                AppState.kuis.siswaTelahMainDuel.pop();
                AppState.kuis.siswaTelahMainDuel.pop();
            }
            undiPemainDuelSpin(); 
        }
    }
}

function mulaiHitungMundur(detikTunggu) {
    const overlayCount = document.createElement('div');
    overlayCount.id = 'layar-hitung-mundur';
    overlayCount.className = 'fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center transition-all duration-300';
    
    overlayCount.innerHTML = `
        <h2 class="text-slate-400 font-bold text-xl uppercase tracking-[0.3em] mb-8">Persiapan Kuis</h2>
        <div id="angka-mundur" class="text-[12rem] lg:text-[18rem] font-black text-amber-500 leading-none" style="text-shadow: 0 0 25px rgba(245,158,11,0.4);">
            ${detikTunggu}
        </div>
    `;
    document.body.appendChild(overlayCount);

    const angkaEl = document.getElementById('angka-mundur');
    let sisaDetik = detikTunggu;
    const ctx = getAudioCtx(); 

    function playBeepShort() {
        if (ctx.state === 'running') {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square'; 
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                gain.gain.setValueAtTime(0.5, ctx.currentTime); 
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch(e) {}
        }
    }

    function playBeepLong() {
        if (ctx.state === 'running') {
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square'; 
                osc.frequency.setValueAtTime(800, ctx.currentTime); 
                gain.gain.setValueAtTime(0.8, ctx.currentTime); 
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8); 
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.8);
            } catch(e) {}
        }
    }

    playBeepShort(); 

    let timerMundur = setInterval(() => {
        sisaDetik--;
        
        if (sisaDetik > 0) {
            angkaEl.innerText = sisaDetik;
            angkaEl.style.transform = 'scale(1.2)';
            setTimeout(() => angkaEl.style.transform = 'scale(1)', 150);
            playBeepShort();
            
        } else {
            clearInterval(timerMundur);
            
            overlayCount.style.background = "#020617"; 
            
            angkaEl.innerText = "MULAI!";
            angkaEl.className = "text-[6rem] lg:text-[10rem] font-black text-emerald-500 tracking-widest";
            
            angkaEl.style.textShadow = "0 0 35px rgba(16,185,129,0.5)"; 
            
            playBeepLong();

            setTimeout(() => {
                overlayCount.remove();
                mulaiKuisSebenarnya(); 
            }, 800);
        }
    }, 1000);
}
// ==========================================
// BAGIAN 2: PODIUM, PAPAN SKOR & KENDALI BANK SOAL
// ==========================================

function resetPodiumSesiIni() {
    if(confirm("Kosongkan Papan Podium & 10 Besar untuk Sesi ini? (Data nilai tetap aman di menu Rekap Nilai)")) {
        AppState.kuis.waktuResetSesi = Date.now(); 
        bukaPapanSkorPodium(); 
    }
}

function bukaPapanSkorPodium() {
    playSoundEffect('podium');
    const container = document.getElementById('main-content');
    
    let sumberData = AppState.db.penilaian || [];
    const awalHariIni = new Date().setHours(0, 0, 0, 0); 
    
    sumberData = sumberData.filter(p => {
        const waktuMain = p.timestamp || 0;
        const validWaktu = waktuMain >= awalHariIni && waktuMain >= AppState.kuis.waktuResetSesi;
        const validKelas = AppState.kuis.kelasAktif ? p.kelasId === AppState.kuis.kelasAktif : true;
        const validMapel = AppState.kuis.mapelAktif ? p.mapelId === AppState.kuis.mapelAktif : true;
        return validWaktu && validKelas && validMapel;
    });

    let listNilai = sumberData.map(p => {
        let refSiswa = AppState.db.siswa.find(s => s.id === p.siswaId);
        let refKelas = AppState.db.kelas.find(k => k.id === p.kelasId);
        return {
            nama: refSiswa ? refSiswa.nama : 'Pemain',
            kelas: refKelas ? refKelas.kode : '-',
            nilai: p.nilai || 0
        };
    }).sort((a,b) => b.nilai - a.nilai);

    let j1 = listNilai[0] || { nama: 'Menunggu Pemain...', kelas: '-', nilai: 0 };
    let j2 = listNilai[1] || { nama: '-', kelas: '-', nilai: 0 };
    let j3 = listNilai[2] || { nama: '-', kelas: '-', nilai: 0 };

    let top10Rows = listNilai.slice(3, 13).map((item, i) => `
        <tr class="border-b border-slate-100 dark:border-slate-800 opacity-0" style="animation: fadeIn 0.4s forwards; animation-delay: ${3.5 + (i * 0.15)}s;">
            <td class="py-2.5 px-4 font-bold text-slate-500">${i + 4}</td>
            <td class="py-2.5 px-4 font-bold text-slate-800 dark:text-white">${item.nama}</td>
            <td class="py-2.5 px-4 text-center font-bold text-slate-500">${item.kelas}</td>
            <td class="py-2.5 px-4 text-right font-black text-emerald-500">${item.nilai}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 fade-in">
            <div class="flex justify-between items-center flex-wrap gap-3">
                <button onclick="switchTab('kuis')" class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-5 rounded-xl text-xs">
                    <i class="fa-solid fa-arrow-left mr-2"></i> Kembali
                </button>
                <h3 class="text-lg sm:text-xl font-black text-slate-800 dark:text-white opacity-0" style="animation: fadeIn 0.5s forwards; animation-delay: 0.2s;">
                    <i class="fa-solid fa-trophy text-amber-400 mr-2"></i>PODIUM HARIAN & KELAS
                </h3>
                <button onclick="resetPodiumSesiIni()" class="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm">
                    <i class="fa-solid fa-rotate-left mr-1.5"></i> Reset Podium Sesi Ini
                </button>
            </div>

            <div class="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-8 text-white shadow-2xl border border-amber-500/30 text-center relative overflow-hidden">
                <div class="grid grid-cols-3 gap-3 items-end max-w-xl mx-auto pt-8 pb-4">
                    <div class="flex flex-col items-center opacity-0" style="animation: popBadge 0.6s forwards; animation-delay: 1.5s;">
                        <div class="w-12 h-12 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-black text-lg shadow-lg mb-2 ring-4 ring-slate-400">2</div>
                        <p class="text-xs font-bold text-white truncate max-w-[90px]">${j2.nama}</p>
                        <p class="text-[10px] text-slate-300">${j2.kelas}</p>
                        <div class="w-full bg-gradient-to-t from-slate-600 to-slate-400 h-28 rounded-t-2xl mt-2 flex items-center justify-center font-black text-2xl shadow-inner">${j2.nilai > 0 ? j2.nilai : '-'}</div>
                    </div>

                    <div class="flex flex-col items-center opacity-0" style="animation: popBadge 0.8s forwards; animation-delay: 2.5s;">
                        <i class="fa-solid fa-crown text-3xl text-yellow-300 mb-1 animate-bounce"></i>
                        <div class="w-16 h-16 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-2xl mb-2 ring-4 ring-yellow-300">1</div>
                        <p class="text-sm font-black text-yellow-300 truncate max-w-[110px]">${j1.nama}</p>
                        <p class="text-xs text-amber-200 font-bold">${j1.kelas}</p>
                        <div class="w-full bg-gradient-to-t from-amber-600 via-yellow-500 to-amber-400 h-40 rounded-t-2xl mt-2 flex items-center justify-center font-black text-3xl shadow-2xl text-slate-950">${j1.nilai > 0 ? j1.nilai : '-'}</div>
                    </div>

                    <div class="flex flex-col items-center opacity-0" style="animation: popBadge 0.6s forwards; animation-delay: 0.5s;">
                        <div class="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-lg shadow-lg mb-2 ring-4 ring-amber-600">3</div>
                        <p class="text-xs font-bold text-white truncate max-w-[90px]">${j3.nama}</p>
                        <p class="text-[10px] text-slate-300">${j3.kelas}</p>
                        <div class="w-full bg-gradient-to-t from-amber-900 to-amber-700 h-20 rounded-t-2xl mt-2 flex items-center justify-center font-black text-xl shadow-inner">${j3.nilai > 0 ? j3.nilai : '-'}</div>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm opacity-0" style="animation: fadeIn 0.6s forwards; animation-delay: 3.5s;">
                <h4 class="font-bold text-slate-800 dark:text-white text-sm mb-4"><i class="fa-solid fa-list-ol mr-2 text-indigo-500"></i>Peringkat Top 10 Lainnya (Sesi Ini)</h4>
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                        <tr><th class="py-2.5 px-4 w-12">Rank</th><th class="py-2.5 px-4">Nama Siswa</th><th class="py-2.5 px-4 text-center">Kelas</th><th class="py-2.5 px-4 text-right">Skor Kuis</th></tr>
                    </thead>
                    <tbody>${top10Rows || '<tr><td colspan="4" class="text-center py-6 text-slate-400">Belum ada peringkat untuk sesi ini.</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
    setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }), 2500);
}

function bukaModalBankSoal() {
    renderDaftarSoalModal();
    const modal = document.getElementById('bank-soal-modal');
    if(modal) modal.classList.remove('hidden');
}

function tutupModalBankSoal() {
    const modal = document.getElementById('bank-soal-modal');
    if(modal) modal.classList.add('hidden');
}

function renderDaftarSoalModal() {
    const listContainer = document.getElementById('modal-bank-list');
    if(!listContainer) return;
    const counterBadge = document.getElementById('modal-bank-counter');
    const headerBadge = document.getElementById('header-bank-badge');
    const searchVal = (document.getElementById('search-soal-input')?.value || '').toLowerCase();

    const totalSoal = AppState.kuis.bankSoalManual.length;
    if (counterBadge) counterBadge.innerText = `${totalSoal} Soal`;
    if (headerBadge) headerBadge.innerText = totalSoal;

    if (totalSoal === 0) {
        listContainer.innerHTML = `<div class="text-center py-12 text-slate-400 text-xs font-bold">Bank soal masih kosong</div>`;
        return;
    }

    let filtered = AppState.kuis.bankSoalManual.map((item, idx) => ({ ...item, originalIndex: idx }));
    if (searchVal) {
        filtered = filtered.filter(item => 
            item.soal.toLowerCase().includes(searchVal) || 
            item.opsi.some(o => o.toLowerCase().includes(searchVal))
        );
    }

    listContainer.innerHTML = filtered.map(item => {
        const idx = item.originalIndex;
        return `
            <div id="card-soal-${idx}" class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 transition-all">
                <div id="view-soal-${idx}">
                    <div class="flex justify-between items-start gap-3 mb-2">
                        <div class="flex items-start gap-2.5">
                            <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black px-2.5 py-1 rounded-xl shrink-0">#${idx + 1}</span>
                            <p class="text-xs font-bold text-slate-100 leading-relaxed">${item.soal}</p>
                        </div>
                        <div class="flex items-center space-x-1 shrink-0">
                            <button onclick="toggleInlineEditSoal(${idx})" class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors"><i class="fa-solid fa-pen-to-square text-xs"></i></button>
                            <button onclick="hapusSoalDenganUndo(${idx})" class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"><i class="fa-solid fa-trash-can text-xs"></i></button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/5 text-xs">
                        ${item.opsi.map((op, oIdx) => `
                            <div class="px-3 py-1.5 rounded-xl border flex items-center justify-between ${oIdx === item.jawaban_benar_index ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-400'}">
                                <span>${String.fromCharCode(65 + oIdx)}. ${op}</span>${oIdx === item.jawaban_benar_index ? '<i class="fa-solid fa-check text-emerald-400 text-xs"></i>' : ''}
                            </div>`).join('')}
                    </div>
                </div>

                <div id="edit-soal-${idx}" class="hidden space-y-3 pt-1">
                    <div class="flex items-center justify-between border-b border-white/10 pb-2">
                        <span class="text-xs font-black text-amber-400"><i class="fa-solid fa-pen-to-square mr-1"></i> Edit Soal #${idx + 1}</span>
                        <button onclick="toggleInlineEditSoal(${idx})" class="text-xs text-slate-400">Batal</button>
                    </div>
                    <textarea id="edit-input-soal-${idx}" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white">${item.soal}</textarea>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="edit-input-a-${idx}" value="${item.opsi[0] || ''}" class="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">
                        <input type="text" id="edit-input-b-${idx}" value="${item.opsi[1] || ''}" class="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">
                        <input type="text" id="edit-input-c-${idx}" value="${item.opsi[2] || ''}" class="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">
                        <input type="text" id="edit-input-d-${idx}" value="${item.opsi[3] || ''}" class="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">
                    </div>
                    <div class="flex items-center gap-2 pt-1">
                        <select id="edit-input-kunci-${idx}" class="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-bold text-white">
                            <option value="0" ${item.jawaban_benar_index === 0 ? 'selected' : ''}>Kunci: Opsi A</option>
                            <option value="1" ${item.jawaban_benar_index === 1 ? 'selected' : ''}>Kunci: Opsi B</option>
                            <option value="2" ${item.jawaban_benar_index === 2 ? 'selected' : ''}>Kunci: Opsi C</option>
                            <option value="3" ${item.jawaban_benar_index === 3 ? 'selected' : ''}>Kunci: Opsi D</option>
                        </select>
                        <button onclick="simpanInlineEditSoal(${idx})" class="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs">Simpan</button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function toggleInlineEditSoal(index) {
    const viewDiv = document.getElementById(`view-soal-${index}`);
    const editDiv = document.getElementById(`edit-soal-${index}`);
    if (viewDiv && editDiv) {
        viewDiv.classList.toggle('hidden');
        editDiv.classList.toggle('hidden');
    }
}

function simpanInlineEditSoal(index) {
    const soal = document.getElementById(`edit-input-soal-${index}`).value.trim();
    const a = document.getElementById(`edit-input-a-${index}`).value.trim();
    const b = document.getElementById(`edit-input-b-${index}`).value.trim();
    const c = document.getElementById(`edit-input-c-${index}`).value.trim();
    const d = document.getElementById(`edit-input-d-${index}`).value.trim();
    const kunci = parseInt(document.getElementById(`edit-input-kunci-${index}`).value);

    if (!soal || !a || !b || !c || !d) return alert("Soal dan Opsi harus diisi lengkap!");

    AppState.kuis.bankSoalManual[index] = { ...AppState.kuis.bankSoalManual[index], soal, opsi: [a, b, c, d], jawaban_benar_index: kunci };
    if (typeof simpanKeLocalStorage === 'function') simpanKeLocalStorage();
    renderDaftarSoalModal();
}
// ==========================================
// BAGIAN 3: RADAR MISPERSEPSI & FITUR PELENGKAP KUIS
// ==========================================

function cekRadarSoalTersulit() {
    const radarCard = document.getElementById('radar-tersulit-card');
    const radarMsg = document.getElementById('radar-tersulit-msg');
    if (!radarCard || !radarMsg) return;

    let entries = Object.entries(AppState.db.mispersepsiSoal || {}).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
        radarCard.classList.add('hidden');
        return;
    }

    let topSalah = entries[0];
    if (topSalah[1] >= 2) { // Muncul jika ada minimal 2 kali salah di kelas
        let soalObj = AppState.kuis.bankSoalManual.find(s => s.id === topSalah[0]);
        if (soalObj) {
            radarMsg.innerText = `Soal "${soalObj.soal.substring(0, 45)}..." dijawab salah oleh ${topSalah[1]} siswa! Perlu dibahas ulang.`;
            radarCard.classList.remove('hidden');
        } else {
            radarCard.classList.add('hidden');
        }
    } else {
        radarCard.classList.add('hidden');
    }
}

function bukaBedahSoalTersulit() {
    let entries = Object.entries(AppState.db.mispersepsiSoal || {}).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return;

    let topSalah = entries[0];
    let soalObj = AppState.kuis.bankSoalManual.find(s => s.id === topSalah[0]);
    if (!soalObj) return;

    // Pastikan elemen modal bedah soal ada, atau buat alert ringkas jika modal belum terpampang di HTML
    const statsText = document.getElementById('bedah-stats-text');
    const contentBox = document.getElementById('bedah-soal-content');
    const modal = document.getElementById('bedah-soal-modal');

    if (statsText && contentBox && modal) {
        statsText.innerText = `Dijawab salah oleh ${topSalah[1]} siswa`;
        
        let opsiList = soalObj.opsi.map((o, idx) => {
            let isKunci = idx === soalObj.jawaban_benar_index;
            return `
                <div class="p-3 rounded-xl border text-xs font-bold flex justify-between items-center ${isKunci ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'}">
                    <span>${String.fromCharCode(65+idx)}. ${o}</span>
                    ${isKunci ? '<span class="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">KUNCI BENAR</span>' : ''}
                </div>
            `;
        }).join('');

        contentBox.innerHTML = `
            <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-3">
                <p class="text-xs text-slate-400 font-bold mb-1">Pertanyaan Soal:</p>
                <p class="text-sm font-bold text-white">${soalObj.soal}</p>
            </div>
            <div class="space-y-2">${opsiList}</div>
        `;
        modal.classList.remove('hidden');
    } else {
        alert(`Analisis Soal Tersulit:\n\n"${soalObj.soal}"\nTercatat salah sebanyak ${topSalah[1]} kali oleh siswa.`);
    }
}

function closeBedahSoalModal() {
    const modal = document.getElementById('bedah-soal-modal');
    if (modal) modal.classList.add('hidden');
}

let undoBufferSoal = null;
let undoTimeoutId = null;

function hapusSoalDenganUndo(index) {
    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    undoBufferSoal = { index: index, data: AppState.kuis.bankSoalManual[index] };
    AppState.kuis.bankSoalManual.splice(index, 1);
    simpanKeLocalStorage();
    renderDaftarSoalModal();

    const toast = document.getElementById('undo-toast');
    if (toast) toast.classList.remove('hidden');

    undoTimeoutId = setTimeout(() => {
        undoBufferSoal = null;
        if (toast) toast.classList.add('hidden');
    }, 5000);
}

function batalHapusSoalUndo() {
    if (undoBufferSoal) {
        AppState.kuis.bankSoalManual.splice(undoBufferSoal.index, 0, undoBufferSoal.data);
        undoBufferSoal = null;
        if (undoTimeoutId) clearTimeout(undoTimeoutId);
        simpanKeLocalStorage();
        renderDaftarSoalModal();

        const toast = document.getElementById('undo-toast');
        if (toast) toast.classList.add('hidden');
    }
}

function simpanKeLocalStorage() {
    localStorage.setItem('smartTeacher_bankSoal', JSON.stringify(AppState.kuis.bankSoalManual));
    if (typeof saveDatabase === 'function') {
        saveDatabase();
    }
}
