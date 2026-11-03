// ==========================================================
// 1. STATE MANAGEMENT (PUSAT DATA TERPADU)
// ==========================================================
const AppState = {
    config: {
        storageKey: 'SmartTeacher_DB',
        apiKeyStorage: 'ST_GEMINI_API_KEY',
        gasUrl: localStorage.getItem('ST_GAS_URL') || '',
        gatewayUrl: localStorage.getItem('ST_GATEWAY_URL') || '',
        kunciApiPermanen: ""
    },
    ui: {
        activeTab: 'dashboard',
        editingId: null,
        dashboardClockInterval: null,
        aiTab: 'kuis_ai',
        isDarkMode: localStorage.getItem('ST_DARK_MODE') === 'true',
        importMode: 'file',
        selectedExcelData: null
    },
    db: {
        sekolah: { nama: 'SDN Nusantara 01', npsn: '12345678', alamat: 'Jl. Merdeka No.1', kepsek: 'Ahmad Dahlan, S.Pd', nip: '19800101', tahunAjaran: '2026/2027', semester: 'Ganjil' },
        guru: [], siswa: [], kelas: [], mapel: [], jadwal: [], jurnal: [], penilaian: [], absensi: [], pengaturan: { apiKey: '' },
        mispersepsiSoal: {} 
    },
    kuis: {
        bankSoalManual: JSON.parse(localStorage.getItem('smartTeacher_bankSoal') || '[]'),
        masterQuizSession: null,
        currentQuizData: null,
        timerInterval: null,
        activeQuizTimeout: null,
        spinInterval: null,
        sisaWaktu: 15,
        siswaAktif: null,
        kelasAktif: null,
        mapelAktif: null,
        namaPemainManual: "",
        
        // GAME SHOW FEATURES STATE
        modeKuis: 'single', 
        streak: 0,
        scorePemainA: 0,
        scorePemainB: 0,
        pemainA_Id: null,
        pemainB_Id: null,
        namaPemainA: "Pemain 1",
        namaPemainB: "Pemain 2",
        rekapSalahSesi: {} 
    },
    audio: {
        isBgmOn: false,
        elements: {},
        customUrls: {
            bgm: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/Sound%20kuis%20berjalan.mp3",
            correct: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/Sound%20effect%20kuis%20Benar%20.mp3",
            wrong: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/Sound%20Kuis%20Salah.mp3",
            habis: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/habis.mp3",
            selebrasi: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/selebrasi.mp3",
            tangan: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/tangan.mp3",
            biasa: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/biasa.mp3",
            motivasi: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/motivasi.mp3",
            terpilih: "https://raw.githubusercontent.com/anassamudra78-sudo/audio-smart-teacher/main/terpilih.mp3",
            podium: "https://cdn.jsdelivr.net/gh/anassamudra78-sudo/audio-smart-teacher@main/SEKOR3TERBAIK.mp3"
        }
    }
};

// Inisialisasi Objek Audio MP3
AppState.audio.elements.bgm = new Audio(AppState.audio.customUrls.bgm);    
AppState.audio.elements.bgm.loop = true;
AppState.audio.elements.correct = new Audio(AppState.audio.customUrls.correct);
AppState.audio.elements.wrong = new Audio(AppState.audio.customUrls.wrong);
AppState.audio.elements.habis = new Audio(AppState.audio.customUrls.habis);
AppState.audio.elements.selebrasi = new Audio(AppState.audio.customUrls.selebrasi);
AppState.audio.elements.tangan = new Audio(AppState.audio.customUrls.tangan);
AppState.audio.elements.biasa = new Audio(AppState.audio.customUrls.biasa);
AppState.audio.elements.motivasi = new Audio(AppState.audio.customUrls.motivasi);
AppState.audio.elements.terpilih = new Audio(AppState.audio.customUrls.terpilih);
AppState.audio.elements.podium = new Audio(AppState.audio.customUrls.podium);

// ==========================================================
// UTILITY FUNGSI SHUFFLE FISHER-YATES & PARSER
// ==========================================================
function acakArray(array) {
    let hasil = JSON.parse(JSON.stringify(array));
    for (let i = hasil.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }
    return hasil;
}

function acakPilihanJawaban(soalObj) {
    if (!soalObj || !soalObj.opsi || !Array.isArray(soalObj.opsi)) return soalObj;
    
    let opsiPeta = soalObj.opsi.map((teks, index) => ({
        teks: teks,
        isBenar: index === soalObj.jawaban_benar_index
    }));

    opsiPeta = acakArray(opsiPeta);
    let indeksKunciBaru = opsiPeta.findIndex(item => item.isBenar);

    return {
        id: soalObj.id || generateId(),
        soal: soalObj.soal,
        opsi: opsiPeta.map(item => item.teks),
        jawaban_benar_index: indeksKunciBaru >= 0 ? indeksKunciBaru : 0
    };
}

function clearQuizTimeouts() {
    if (AppState.kuis.activeQuizTimeout) {
        clearTimeout(AppState.kuis.activeQuizTimeout);
        AppState.kuis.activeQuizTimeout = null;
    }
}

// Unlocking Audio Policy Browser (Versi Senyap Anti-Bocor)
document.addEventListener('click', function unlockAudioMode() {
    Object.values(AppState.audio.elements).forEach(audio => {
        audio.load(); 
    });
    document.removeEventListener('click', unlockAudioMode);
}, { once: true });

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2); }

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function loadDatabase() {
    // --- 1. TEMBOK ISOLASI MEMORI LOKAL ---
    const listWs = JSON.parse(localStorage.getItem('ST_WORKSPACES')) || [];
    const aktifId = localStorage.getItem('ST_ACTIVE_WS_ID');
    
    if (listWs.length > 0) {
        if (aktifId === listWs[0].id) {
            AppState.config.storageKey = 'SmartTeacher_DB';
        } else {
            AppState.config.storageKey = 'SmartTeacher_DB_' + aktifId;
        }
    }

    const localData = localStorage.getItem(AppState.config.storageKey);
    
    if (!localData && aktifId !== listWs[0].id) {
        const dataSekolahAktif = listWs.find(w => w.id === aktifId) || {};
        AppState.db = {
            sekolah: { nama: dataSekolahAktif.nama || '', npsn: dataSekolahAktif.npsn || '', alamat: '', kepsek: '', nip: '', tahunAjaran: '2026/2027', semester: 'Ganjil' },
            guru: [], siswa: [], kelas: [], mapel: [], jadwal: [], jurnal: [], penilaian: [], absensi: [], pengaturan: { apiKey: '' },
            mispersepsiSoal: {},
            bankSoal: [] 
        };
    }

    // --- 2. BACA DATA NORMAL (DARI HP) ---
    if (localData) {
        try { 
            AppState.db = { ...AppState.db, ...JSON.parse(localData) }; 
            if (!AppState.db.jadwal) AppState.db.jadwal = [];
            if (!AppState.db.mispersepsiSoal) AppState.db.mispersepsiSoal = {};
            if (!AppState.db.bankSoal) AppState.db.bankSoal = []; 
        } 
        catch(e) { console.error("Error parsing local data", e); }
    }

    // --- 3. SINKRONISASI DARI CLOUD GOOGLE SHEETS ---
    if (AppState.config.gasUrl && AppState.config.gasUrl.startsWith("http")) {
        try {
            const response = await fetch(AppState.config.gasUrl);
            const text = await response.text(); 
            if (!text.trim().startsWith('<')) {
                const cloudData = JSON.parse(text); 
                if (cloudData && cloudData.sekolah) {
                    AppState.db = { ...AppState.db, ...cloudData };
                    if (!AppState.db.jadwal) AppState.db.jadwal = [];
                    if (!AppState.db.bankSoal) AppState.db.bankSoal = [];
                    localStorage.setItem(AppState.config.storageKey, JSON.stringify(AppState.db));
                }
            }
        } catch (e) { console.error("Gagal sinkronisasi dari Cloud.", e); }
    }

    // --- 4. PENYELAMATAN BANK SOAL LAMA ---
    let legacySoal = JSON.parse(localStorage.getItem('smartTeacher_bankSoal') || '[]');
    if (legacySoal.length > 0 && (!AppState.db.bankSoal || AppState.db.bankSoal.length === 0)) {
        AppState.db.bankSoal = legacySoal;
        localStorage.removeItem('smartTeacher_bankSoal'); 
        localStorage.setItem(AppState.config.storageKey, JSON.stringify(AppState.db));
    }
    
    if (!AppState.db.bankSoal) AppState.db.bankSoal = [];
    AppState.kuis.bankSoalManual = AppState.db.bankSoal;
    
    if (typeof updateUI === "function") updateUI();
}

async function saveDatabase() {
    localStorage.setItem(AppState.config.storageKey, JSON.stringify(AppState.db));
    if (typeof updateUI === "function") updateUI();

    if (AppState.config.gasUrl && AppState.config.gasUrl.startsWith("http")) {
        try {
            const response = await fetch(AppState.config.gasUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(AppState.db)
            });

            const result = await response.json();
            if (result.status !== "success") {
                if(typeof showAlert === "function") showAlert("Gagal Sinkron Cloud", "Ada masalah di kode Google Sheets: " + result.message, "error");
            }
        } catch (err) { 
            if(typeof showAlert === "function") showAlert("Koneksi Terputus", "Data tersimpan aman di HP, tapi gagal dikirim ke Google Sheets. Pastikan internet lancar.", "error");
        }
    }
}

function forceSaveNotification() {
    saveDatabase();
    if(typeof showAlert === "function") showAlert("Berhasil", "Data berhasil disimpan.", "success");
}

function simpanKeLocalStorage() {
    saveDatabase();
    const countEl = document.getElementById('man-count');
    const infoTotal = document.getElementById('total-bank-info');
    if (countEl) countEl.innerText = AppState.kuis.bankSoalManual.length;
    if (infoTotal) infoTotal.innerText = AppState.kuis.bankSoalManual.length;
}
