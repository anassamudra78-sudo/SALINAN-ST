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
