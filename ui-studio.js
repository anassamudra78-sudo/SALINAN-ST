// ==========================================================
// FILE: ui-studio.js
// FUNGSI: Asisten AI Gemini & Presentation Studio
// ==========================================================

if (!AppState.ui.psTab) AppState.ui.psTab = 'create';
if (!AppState.db.prompts) AppState.db.prompts = [];

function gantiTabPS(tabName) {
    AppState.ui.psTab = tabName;
    renderPresentationStudio(document.getElementById('main-content'));
}

function renderPresentationStudio(container) {
    const activeTab = AppState.ui.psTab || 'create';
    
    let content = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8 max-w-5xl mx-auto fade-in">
            <div class="flex justify-between items-center mb-1">
                <h3 class="text-xl lg:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    <i class="fa-solid fa-person-chalkboard text-emerald-500 mr-2.5"></i>SMART TEACHER — PRESENTATION STUDIO
                </h3>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                Buat prompt presentasi pembelajaran yang menarik, menyenangkan, interaktif, dan sesuai kebutuhan siswa.
            </p>

            <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 mb-6 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                <button onclick="gantiTabPS('create')" class="flex-1 py-2.5 px-3 rounded-xl font-bold transition-all text-xs ${activeTab==='create'?'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm':'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}">
                    <i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i> Buat Prompt Baru
                </button>
                <button onclick="gantiTabPS('collection')" class="flex-1 py-2.5 px-3 rounded-xl font-bold transition-all text-xs ${activeTab==='collection'?'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm':'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}">
                    <i class="fa-solid fa-book-bookmark mr-1.5"></i> Koleksi Tersimpan (${AppState.db.prompts?.length || 0})
                </button>
            </div>
    `;

    if (activeTab === 'create') {
        content += `
            <div class="space-y-6">
                <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h4 class="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4 flex items-center">
                        <i class="fa-solid fa-school text-emerald-500 mr-2"></i>1. Identitas Pembelajaran
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Jenjang Pendidikan *</label>
                            <select id="ps-jenjang" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="SD">SD</option><option value="MI">MI</option><option value="SMP">SMP</option><option value="MTs">MTs</option>
                                <option value="SMA">SMA</option><option value="SMK">SMK</option><option value="MA">MA</option><option value="PAUD/TK">PAUD/TK</option>
                                <option value="Lainnya">Lainnya (Kustom)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Kelas *</label>
                            <input type="text" id="ps-kelas" placeholder="Contoh: Kelas 6 / Fase C" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Mata Pelajaran *</label>
                            <input type="text" id="ps-mapel" placeholder="Contoh: Ilmu Pengetahuan Alam (IPA)" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Kurikulum</label>
                            <select id="ps-kurikulum" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option><option value="Kurikulum 2013">Kurikulum 2013</option><option value="Umum">Umum / Lainnya</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-500 mb-1">Bahasa Presentasi</label>
                            <select id="ps-bahasa" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="Indonesia Ramah & Menyenangkan">Indonesia Ramah & Menyenangkan</option>
                                <option value="Indonesia Formal">Indonesia Formal (Baku)</option>
                                <option value="Inggris (Bilingual)">Inggris (Bilingual)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h4 class="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4 flex items-center">
                        <i class="fa-solid fa-book-open text-emerald-500 mr-2"></i>2. Substansi Materi
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Materi Utama *</label>
                            <input type="text" id="ps-materi" placeholder="Contoh: Tata Surya" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white font-bold text-emerald-600">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Submateri</label>
                            <input type="text" id="ps-submateri" placeholder="Contoh: Karakteristik Planet Dalam & Luar" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-xs font-bold text-slate-500 mb-1">Tujuan Pembelajaran *</label>
                        <textarea id="ps-tujuan" rows="2" placeholder="Siswa dapat mengidentifikasi nama planet dan karakteristiknya..." class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white custom-scrollbar"></textarea>
                    </div>
                </div>

                <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h4 class="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4 flex items-center">
                        <i class="fa-solid fa-palette text-emerald-500 mr-2"></i>3. Konsep Visual & Pembelajaran
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Gaya Visual Desain *</label>
                            <select id="ps-visual" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none dark:text-white cursor-pointer">
                                <option value="3D Clay Animation (Lucu, bertekstur plastisin lembut, warna cerah)">3D Clay Animation (Plastisin Lembut)</option>
                                <option value="Pop-Up Book (Elemen 3D muncul dari lipatan kertas)">Pop-Up Book (Kertas Lipat 3D)</option>
                                <option value="Game Adventure (Desain level permainan, elemen RPG)">Game Adventure (Tema RPG/Petualangan)</option>
                                <option value="Detective Learning (Misteri, monokrom/kaca pembesar)">Detective Learning (Tema Misteri)</option>
                                <option value="Storytelling (Ilustrasi buku cerita tangan/watercolor)">Storytelling (Buku Cerita)</option>
                                <option value="Virtual Field Trip (Latar realistis/fotografi lapangan)">Virtual Field Trip (Tur Virtual)</option>
                                <option value="Cinematic Presentation (Gelap dramatis, elegan)">Cinematic Presentation (Dramatis)</option>
                                <option value="Infografis Modern (Clean, flat design, diagram data)">Infografis Modern (Data Visual)</option>
                                <option value="Kartun Edukasi (Vektor 2D cerah, outline tegas)">Kartun Edukasi (Vektor 2D)</option>
                                <option value="Minimalis Profesional (Bersih, elegan, font tebal)">Minimalis Profesional</option>
                                <option value="Gaya Kustom Bebas (Sesuaikan dengan AI)">Gaya Kustom</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Model Pembelajaran</label>
                            <select id="ps-model" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none dark:text-white cursor-pointer">
                                <option value="Discovery Learning (Mencari dan Menemukan)">Discovery Learning</option>
                                <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                                <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                                <option value="Game-Based Learning (Bermain Sambil Belajar)">Game-Based Learning</option>
                                <option value="Kontekstual (CTL)">Kontekstual (CTL)</option>
                            </select>
                        </div>
                    </div>

                    <label class="block text-xs font-bold text-slate-500 mb-2">Jenis Aktivitas Interaktif (Bisa pilih lebih dari satu):</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                        ${['Tebak gambar', 'Mencocokkan pasangan', 'Permainan edukatif', 'Diskusi kelompok', 'Studi kasus', 'Eksperimen sederhana', 'Latihan soal', 'Refleksi pembelajaran'].map(act => `
                            <label class="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors">
                                <input type="checkbox" name="ps-aktivitas" value="${act}" class="w-4 h-4 accent-emerald-600 rounded">
                                <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">${act}</span>
                            </label>
                        `).join('')}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Bentuk Evaluasi</label>
                            <select id="ps-evaluasi" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="Kuis pilihan ganda">Kuis Pilihan Ganda</option>
                                <option value="Benar atau salah">Benar atau Salah</option>
                                <option value="Isian singkat">Isian Singkat</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Target Jumlah Slide</label>
                            <select id="ps-slide" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="Otomatis (Dinamis menyesuaikan materi)">Otomatis (Dinamis)</option>
                                <option value="Tepat 7 Slide">7 Slide</option>
                                <option value="Tepat 10 Slide">10 Slide</option>
                                <option value="Tepat 15 Slide">15 Slide</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Platform Tujuan</label>
                            <select id="ps-platform" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white">
                                <option value="Canva AI (Magic Design)">Canva AI (Magic Design)</option>
                                <option value="Gamma App (gamma.app - AI Generator)">Gamma App (AI Otomatis - Gratis & Banyak Kuota)</option>
                                <option value="Microsoft PowerPoint / Copilot (Akun belajar.id)">Microsoft PowerPoint / Copilot (Resmi Belajar.id)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onclick="generatePSPrompt()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-transform hover:scale-[1.01] flex items-center justify-center text-base">
                    <i class="fa-solid fa-wand-magic-sparkles mr-2.5 text-lg"></i> BUAT PROMPT
                </button>

                <div id="ps-result-area" class="hidden mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 fade-in">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-black text-slate-800 dark:text-white flex items-center text-sm uppercase">
                            <i class="fa-solid fa-code text-emerald-500 mr-2"></i>Hasil Prompt Tersusun
                        </h4>
                    </div>
                    
                    <textarea id="ps-output-text" class="w-full h-80 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500 custom-scrollbar mb-4 whitespace-pre-wrap"></textarea>
                    
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <button onclick="salinPSPrompt()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-sm col-span-2 md:col-span-1">
                            <i class="fa-regular fa-copy mr-1.5"></i> SALIN PROMPT
                        </button>
                        <button onclick="editPSPrompt()" class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs shadow-sm">
                            <i class="fa-solid fa-pen-to-square mr-1.5"></i> EDIT PROMPT
                        </button>
                        <button onclick="generatePSPrompt()" class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs shadow-sm">
                            <i class="fa-solid fa-rotate mr-1.5"></i> BUAT ULANG
                        </button>
                        <button onclick="simpanPSPrompt()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-sm">
                            <i class="fa-solid fa-bookmark mr-1.5"></i> SIMPAN KOLEKSI
                        </button>
                        <button id="ps-btn-buka" onclick="bukaPlatformTujuan()" class="font-bold py-3 rounded-xl text-xs shadow-sm text-white transition-all col-span-2 md:col-span-1 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600">
                            <i class="fa-solid fa-arrow-up-right-from-square mr-1.5"></i> <span id="ps-btn-buka-text">BUKA PLATFORM TUJUAN</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        const listPrompts = AppState.db.prompts || [];
        let searchVal = (document.getElementById('ps-search')?.value || '').toLowerCase();
        let filtered = listPrompts.filter(p => p.judul.toLowerCase().includes(searchVal) || p.mapel.toLowerCase().includes(searchVal));

        let rowHtml = '';
        if (filtered.length === 0) {
            rowHtml = `<div class="text-center py-12 text-slate-400 text-xs font-bold border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Belum ada prompt tersimpan yang sesuai.</div>`;
        } else {
            rowHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">` + filtered.map(p => `
                <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 relative group transition-all hover:border-emerald-400">
                    <button onclick="hapusPSPrompt('${p.id}')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash-can"></i></button>
                    <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">${p.mapel}</span>
                    <h4 class="font-bold text-slate-800 dark:text-white mt-3 text-sm leading-tight">${p.judul}</h4>
                    <p class="text-[11px] text-slate-400 mt-1 mb-4 truncate">${p.kelas} • ${p.tanggal}</p>
                    <div class="flex gap-2">
                        <button onclick="lihatPSPrompt('${p.id}')" class="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold py-2 rounded-xl text-xs transition-colors"><i class="fa-solid fa-folder-open mr-1"></i> Buka</button>
                        <button onclick="salinTeksCepat('${p.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"><i class="fa-regular fa-copy mr-1"></i> Salin</button>
                    </div>
                    <textarea id="hidden-prompt-${p.id}" class="hidden">${escapeHTML(p.promptTeks)}</textarea>
                </div>
            `).join('') + `</div>`;
        }

        content += `
            <div class="space-y-4 fade-in">
                <div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
                    <h4 class="font-bold text-slate-700 dark:text-slate-300 text-sm"><i class="fa-solid fa-box-archive mr-2"></i>Daftar Koleksi Anda</h4>
                    <div class="relative w-full sm:w-72">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input type="text" id="ps-search" placeholder="Cari Mapel / Materi..." oninput="renderPresentationStudio(document.getElementById('main-content'))" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:border-emerald-500 dark:text-white" value="${searchVal}">
                    </div>
                </div>
                ${rowHtml}
            </div>
        `;
    }
    content += `</div>`;
    container.innerHTML = content;
}

function generatePSPrompt() {
    const jenjang = document.getElementById('ps-jenjang').value;
    const kelas = document.getElementById('ps-kelas').value.trim();
    const mapel = document.getElementById('ps-mapel').value.trim();
    const materi = document.getElementById('ps-materi').value.trim();
    const submateri = document.getElementById('ps-submateri').value.trim();
    const tujuan = document.getElementById('ps-tujuan').value.trim();
    
    if (!kelas || !mapel || !materi || !tujuan) {
        return showAlert('Peringatan', 'Harap lengkapi kolom wajib: Kelas, Mata Pelajaran, Materi Utama, dan Tujuan Pembelajaran!', 'error');
    }

    const cbs = document.querySelectorAll('input[name="ps-aktivitas"]:checked');
    const aktivitasStr = cbs.length > 0 ? Array.from(cbs).map(cb => cb.value).join(', ') : 'Tanpa aktivitas khusus';

    const megaPrompt = `Buatkan desain presentasi pembelajaran secara utuh dan terstruktur yang ditujukan untuk Canva AI (Magic Design) dengan spesifikasi detail berikut:

A. IDENTITAS PEMBELAJARAN
- Jenjang Pendidikan: ${jenjang}
- Kelas / Fase: ${kelas}
- Mata Pelajaran: ${mapel}
- Materi Utama: ${materi}
${submateri ? '- Submateri: ' + submateri : ''}
- Kurikulum: ${document.getElementById('ps-kurikulum').value}
- Bahasa Presentasi: ${document.getElementById('ps-bahasa').value}

B. TUJUAN PEMBELAJARAN & PROFIL SISWA
- Tujuan Pembelajaran: ${tujuan}
- Profil Siswa: Sesuaikan tingkat kedalaman materi, bahasa, logika, dan contoh konkret agar mudah dicerna, menarik, dan relevan dengan dunia siswa jenjang ${jenjang} kelas ${kelas}.

C. ARAHAN KONSEP VISUAL & DESAIN (${document.getElementById('ps-platform').value})
- Gaya Visual Dominan: ${document.getElementById('ps-visual').value}
- Instruksi Desain: Jaga konsistensi palet warna, karakter, dan elemen ilustrasi antar slide. Hindari penggunaan teks yang terlalu padat (bullet points). Maksimalkan ruang kosong (white space) dan visualisasi.

D. STRUKTUR PRESENTASI (${document.getElementById('ps-slide').value})
Susun urutan presentasi menggunakan Model Pembelajaran "${document.getElementById('ps-model').value}" secara sistematis:
1. Halaman Sampul (Judul besar, identitas, dan deskripsi ilustrasi utama).
2. Sapaan Awal & Tujuan Pembelajaran (Ramah, jelas, poin-poin ringkas).
3. Apersepsi / Pertanyaan Pemantik (Mengaitkan materi dengan pengalaman nyata siswa sehari-hari).
4. Materi Inti (Bagi menjadi beberapa slide yang berkesinambungan, fokus pada poin gagasan pokok).
5. Contoh Konkret / Studi Kasus Nyata.
6. Aktivitas Siswa: ${aktivitasStr}.
7. Rangkuman & Refleksi Pembelajaran.
8. Evaluasi Formatif: ${document.getElementById('ps-evaluasi').value}. (Sediakan soal tanpa kunci jawaban di slide siswa).
9. Penutup & Kalimat Motivasi.
10. Kunci Jawaban Terpisah (Sediakan khusus di slide terakhir sebagai pegangan Guru).

E. KETENTUAN MUTLAK KONTEN (PENTING)
- JANGAN pernah mengarang fakta, rumus, definisi pakem, hukum sains, dalil, kutipan sejarah, atau aturan kurikulum. 
- Jika ada informasi atau data spesifik yang di-generate AI dan membutuhkan validasi, berikan penanda teks "[VERIFIKASI GURU]" di akhir kalimat tersebut.
- Fokuskan output Anda untuk menjadi teks kerangka presentasi (Outline) yang langsung rapi ketika disalin ke Canva.`;

    const outputEl = document.getElementById('ps-output-text');
    const areaEl = document.getElementById('ps-result-area');
    
    outputEl.value = megaPrompt;
    outputEl.readOnly = true;
    areaEl.classList.remove('hidden');
    setTimeout(() => areaEl.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    updateTombolPlatformUI();
}

function salinPSPrompt() { salinTeksAsli(document.getElementById('ps-output-text').value); }
function salinTeksCepat(id) { salinTeksAsli(document.getElementById(`hidden-prompt-${id}`).value); }
function salinTeksAsli(teks) {
    if (!teks) return;
    try {
        const ta = document.createElement("textarea");
        ta.value = teks;
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showAlert("Disalin!", "Teks prompt berhasil disalin. Silakan paste ke Canva AI.", "success");
    } catch (err) { prompt("Sistem memblokir copy otomatis. Silakan salin manual teks di bawah ini:", teks); }
}

function editPSPrompt() {
    const outputEl = document.getElementById('ps-output-text');
    outputEl.readOnly = false;
    outputEl.focus();
    showAlert("Mode Edit Aktif", "Silakan ubah teks prompt langsung di kotak hasil. Jangan lupa salin atau simpan setelah selesai mengedit.", "info");
}

function simpanPSPrompt() {
    const mapel = document.getElementById('ps-mapel')?.value.trim() || 'Umum';
    const materi = document.getElementById('ps-materi')?.value.trim() || 'Materi Presentasi';
    const kelas = document.getElementById('ps-kelas')?.value.trim() || '-';
    const teks = document.getElementById('ps-output-text').value.trim();
    if(!teks) return showAlert("Gagal", "Prompt masih kosong, tidak ada yang bisa disimpan.", "error");
    if(!AppState.db.prompts) AppState.db.prompts = [];
    AppState.db.prompts.unshift({ id: generateId(), judul: materi, mapel: mapel, kelas: kelas, promptTeks: teks, tanggal: new Date().toLocaleDateString('id-ID') });
    saveDatabase();
    showAlert("Tersimpan!", "Prompt telah berhasil disimpan ke Koleksi Presentation Studio.", "success");
}

function hapusPSPrompt(id) {
    if(confirm('Yakin ingin menghapus prompt ini dari koleksi?')) {
        AppState.db.prompts = AppState.db.prompts.filter(p => p.id !== id);
        saveDatabase();
        gantiTabPS('collection');
    }
}

function lihatPSPrompt(id) {
    const p = AppState.db.prompts.find(x => x.id === id);
    if(p) {
        gantiTabPS('create');
        setTimeout(() => {
            const area = document.getElementById('ps-result-area');
            const ta = document.getElementById('ps-output-text');
            if(area && ta) { area.classList.remove('hidden'); ta.value = p.promptTeks; }
        }, 100);
    }
}

function bukaPlatformTujuan() {
    const platform = document.getElementById('ps-platform').value;
    if (platform.includes('Gamma')) window.open('https://gamma.app/', '_blank');
    else if (platform.includes('Microsoft') || platform.includes('belajar.id')) window.open('https://www.office.com/', '_blank');
    else window.open('https://www.canva.com/magic', '_blank');
}

function updateTombolPlatformUI() {
    const platform = document.getElementById('ps-platform').value;
    const btnEl = document.getElementById('ps-btn-buka');
    const textEl = document.getElementById('ps-btn-buka-text');
    if (!btnEl || !textEl) return;
    btnEl.className = "font-bold py-3 rounded-xl text-xs shadow-sm text-white transition-all col-span-2 md:col-span-1 flex items-center justify-center";
    if (platform.includes('Gamma')) {
        textEl.innerText = "BUKA GAMMA APP";
        btnEl.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-indigo-600', 'hover:from-purple-500', 'hover:to-indigo-500');
    } else if (platform.includes('Microsoft') || platform.includes('belajar.id')) {
        textEl.innerText = "BUKA MICROSOFT";
        btnEl.classList.add('bg-gradient-to-r', 'from-blue-700', 'to-sky-600', 'hover:from-blue-600', 'hover:to-sky-500');
    } else {
        textEl.innerText = "BUKA CANVA AI";
        btnEl.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'hover:from-cyan-400', 'hover:to-blue-500');
    }
}

function changeAITab(tab) {
    AppState.ui.aiTab = tab;
    renderAI(document.getElementById('main-content'));
}

function getActiveApiKey() { return localStorage.getItem(AppState.config.apiKeyStorage) || (AppState.db.pengaturan ? AppState.db.pengaturan.apiKey : '') || AppState.config.kunciApiPermanen; }

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
                    <button onclick="saveApiKey()" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-purple-500/20 transition-all">Kunci API Key & Mulai</button>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold py-3 px-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm transition-all inline-flex items-center">Dapatkan API Key Gratis</a>
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
            const valid = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")).map(m => m.name.replace(/^models\//, ''));
            const flashModels = valid.filter(name => name.includes("flash") && !name.includes("pro"));
            const otherModels = valid.filter(name => !name.includes("flash") && !name.includes("pro"));
            const urutanModel = [...flashModels, ...otherModels];
            if (urutanModel.length > 0) return urutanModel;
        }
    } catch (e) { console.warn("Fallback ListModels", e); }
    return ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b"];
}

async function panggilGeminiAntiGagal(prompt, systemInstruction = "", jsonSchema = null) {
    const apiKey = getActiveApiKey();
    if (!apiKey) throw new Error("API Key Gemini belum diisi. Masukkan API Key terlebih dahulu.");

    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };

    if (jsonSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        };
    }

    const daftarModel = await dapatkanModelAktif(apiKey);
    let pesanErrorTerakhir = "";

    for (const namaModel of daftarModel) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${namaModel}:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
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
        } catch (err) {
            pesanErrorTerakhir = err.message;
        }
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
    const headerHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${judul}</title><style>body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; } h1, h2, h3, h4 { color: #111; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; } h3 { font-size: 14pt; } h4 { font-size: 12pt; } table { border-collapse: collapse; width: 100%; margin-top: 10pt; margin-bottom: 10pt; } table, th, td { border: 1px solid #000; padding: 6pt 8pt; font-size: 11pt; } th { background-color: #f2f2f2; font-weight: bold; } ul, ol { margin-left: 20pt; padding-left: 0; } li { margin-bottom: 4pt; } p { margin-bottom: 6pt; }</style></head><body>`;
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

    const prompt = `Buatkan soal ujian tertulis untuk materi: "${materi}".\n${formatBebas ? 'PENTING: Anda WAJIB mengikuti format pembagian soal ini 100%: ' + formatBebas : 'Gunakan format: 10 Pilihan Ganda dan 5 Esai.'}\nATURAN TATA LETAK SANGAT KETAT: 1. Angka nomor soal dan teks pertanyaan WAJIB berada di baris yang sama. 2. Pilihan Ganda (A, B, C, D, E) WAJIB disusun ke bawah berurutan. 3. Sertakan Kunci Jawaban di akhir. 4. Output HTML rapi tanpa markdown.`;

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
    // Teks tombol diubah jadi "Cepat" untuk penanda bahwa kode baru sudah jalan
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Meracik Soal Cepat...`;
    btn.disabled = true;

    const resDiv = document.getElementById('ai-result');

    try {
        const promptKuis = `Buatkan kuis pilihan ganda edukatif tentang: "${topik}" sebanyak ${jumlah} soal.`;
        
        // Cetakan JSON untuk Mode Turbo
        const skemaJsonTurbo = {
            type: "ARRAY",
            description: "Daftar soal kuis",
            items: {
                type: "OBJECT",
                properties: {
                    soal: { type: "STRING", description: "Teks pertanyaan" },
                    opsi: { type: "ARRAY", items: { type: "STRING" }, description: "4 pilihan jawaban" },
                    jawaban_benar_index: { type: "INTEGER", description: "Index kunci jawaban dari 0 sampai 3" }
                },
                required: ["soal", "opsi", "jawaban_benar_index"]
            }
        };

        // Memanggil Gemini Anti Gagal + Jalur Turbo
        const rawText = await panggilGeminiAntiGagal(promptKuis, "", skemaJsonTurbo);

        btn.innerHTML = `<i class="fa-solid fa-bolt mr-2"></i>Generate & Luncurkan Arena Kuis!`;
        btn.disabled = false;

        const generatedQuestions = JSON.parse(rawText);
        
        const finalQuestions = generatedQuestions.map(q => ({
            id: generateId(),
            soal: q.soal,
            opsi: q.opsi,
            jawaban_benar_index: q.jawaban_benar_index
        }));

        AppState.kuis.bankSoalManual.push(...finalQuestions);
        if (typeof simpanKeLocalStorage === 'function') simpanKeLocalStorage();

        resDiv.classList.add('hidden');
        bukaArenaKuis(finalQuestions, true);

    } catch (e) {
        btn.innerHTML = `<i class="fa-solid fa-bolt mr-2"></i>Generate & Luncurkan Arena Kuis!`;
        btn.disabled = false;
        resDiv.innerHTML = `<div class="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800"><p class="font-bold">Gagal Generate:</p><p class="text-xs mt-1 font-mono">${e.message}</p></div>`;
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
        promptDasar = `Buatkan Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) untuk:\nMapel: ${mapel}\nFase:${fase}\nTopik: ${topik}\nAlokasi:${jp} JP.`;
    } else {
        const cp = document.getElementById('ai-cp-resmi').value;
        const topik = document.getElementById('ai-topik-resmi').value;
        const jp = document.getElementById('ai-jp-resmi').value;
        
        if(!cp || !topik || !jp) return showAlert('Peringatan', 'Isi teks CP, Topik, dan Alokasi JP.', 'error');
        promptDasar = `Berdasarkan teks CP:\n"${cp}"\n\nBedah menjadi TP dan ATP khusus untuk Topik: ${topik}, Alokasi:${jp} JP.`;
    }

    // Perintah disederhanakan karena format sudah diikat mutlak oleh JSON
    const prompt = `${promptDasar}\nBagi materi menjadi 4 hingga 6 tahapan logis. Jawab dengan padat, berbobot, dan esensial.`;

    // SKEMA JALUR TURBO KHUSUS ATP (Memaksa AI merespon dengan data mentah super kilat)
    const skemaAtpTurbo = {
        type: "OBJECT",
        properties: {
            baris_tabel: {
                type: "ARRAY",
                description: "Daftar baris untuk tabel ATP",
                items: {
                    type: "OBJECT",
                    properties: {
                        tujuan_dan_jp: { type: "STRING", description: "Tujuan pembelajaran dan alokasi JP" },
                        alur_pentahapan: { type: "STRING", description: "Aktivitas alur pembelajaran" },
                        skenario_pid: { type: "STRING", description: "Ide penggunaan Papan Interaktif Digital (Kosongkan jika tidak diminta)" }
                    },
                    required: ["tujuan_dan_jp", "alur_pentahapan", "skenario_pid"]
                }
            }
        }
    };

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Merumuskan ATP Kilat...`;
    btn.disabled = true;
    resDiv.classList.add('hidden');
    if(actDiv) actDiv.classList.add('hidden');

    try {
        // Tembak menggunakan mesin Anti Gagal + Skema Turbo
        const rawText = await panggilGeminiAntiGagal(prompt, "", skemaAtpTurbo);
        
        // Ekstrak data mentah JSON
        const data = JSON.parse(rawText);

        // JavaScript yang merakit tabel HTML seketika!
        // Menggunakan gaya inline agar sangat mulus saat di-download ke Microsoft Word
        let tableHtml = `<table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; margin-top: 10px; margin-bottom: 10px; text-align: left; font-size: 14px;">
            <thead style="background-color: #f1f5f9;">
                <tr>
                    <th style="border: 1px solid #cbd5e1; padding: 12px;">Tujuan Pembelajaran & JP</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px;">Alur Pentahapan</th>
                    ${cekPID ? '<th style="border: 1px solid #cbd5e1; padding: 12px;">Skenario PID</th>' : ''}
                </tr>
            </thead>
            <tbody>`;
            
        data.baris_tabel.forEach(item => {
            tableHtml += `<tr>
                <td style="border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">${item.tujuan_dan_jp}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">${item.alur_pentahapan}</td>
                ${cekPID ? `<td style="border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">${item.skenario_pid}</td>` : ''}
            </tr>`;
        });
        tableHtml += `</tbody></table>`;

        // Tampilkan hasil secara instan
        resDiv.innerHTML = tableHtml;
        resDiv.classList.remove('hidden');

        // Tampilkan tombol lanjutan (Super App)
        if(actDiv) {
            document.getElementById('super-app-buttons').innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onclick="generateSuperApp('promes')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1">
                        <i class="fa-solid fa-calendar-week mr-2"></i> Sulap jadi PROMES
                    </button>
                    <button onclick="generateSuperApp('rpp')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1">
                        <i class="fa-solid fa-book-open mr-2"></i> Sulap Modul Ajar/RPP
                    </button>
                    <button onclick="generateSuperApp('lkpd')" class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all hover:-translate-y-1">
                        <i class="fa-solid fa-file-pen mr-2"></i> Sulap jadi LKPD
                    </button>
                </div>
            `;
            actDiv.classList.remove('hidden');
        }

    } catch (e) {
        resDiv.innerHTML = `<div class="p-4 bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-300">Gagal: ${e.message}</div>`;
        resDiv.classList.remove('hidden');
    } finally {
        btn.innerHTML = `<i class="fa-solid fa-layer-group mr-2"></i> Generate ATP (Deep Learning)`;
        btn.disabled = false;
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
