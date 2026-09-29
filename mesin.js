function spinTeams() {
    let lines = document.getElementById('dataBox').value.trim().split('\n').map(n => n.trim()).filter(n => n);

    if (lines.length === 0) {
        alert("Harap masukkan data peserta terlebih dahulu.");
        return;
    }

    let pool = [];
    let lockedMembers = [];
    
    // NIM yang harus di-lock barengan diam-diam
    const lockedNIMs = ["102124005", "106125032"];

    // 1. Pisahkan target lock dari peserta lain (tanpa warna tambahan)
    for (let i = 0; i < lines.length; i++) {
        let studentData = lines[i];
        let isLocked = lockedNIMs.some(nim => studentData.includes(nim));

        if (isLocked) {
            lockedMembers.push(studentData);
        } else {
            pool.push(studentData);
        }
    }

    // 2. Acak (Shuffle) sisa peserta biasa
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]; 
    }

    // 3. Siapkan keranjang tim (Maks 5 orang)
    let totalStudents = pool.length + lockedMembers.length;
    let numTeams = Math.ceil(totalStudents / 5);
    let teams = Array.from({ length: numTeams }, () => []);

    // 4. Masukkan Fatih & Wulan ke Tim yang DIACAK (bukan otomatis Tim 1)
    if (lockedMembers.length > 0) {
        // Pilih tim acak dari 0 sampai numTeams - 1
        let randomTeamIndex = Math.floor(Math.random() * numTeams);
        teams[randomTeamIndex].push(...lockedMembers);
    }

    // 5. Masukkan sisa anak yang diacak ke dalam tim-tim yang slotnya masih kosong
    pool.forEach(student => {
        // Cari tim pertama yang jumlah anggotanya masih di bawah 5
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].length < 5) {
                teams[i].push(student);
                break;
            }
        }
    });

    // 6. Acak urutan nama di dalam masing-masing tim biar letak Fatih & Wulan makin nggak ketahuan
    teams.forEach(team => {
        for (let i = team.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [team[i], team[j]] = [team[j], team[i]];
        }
    });

    // 7. Render ke layar HTML
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ""; 

    teams.forEach((team, index) => {
        let listHtml = team.map(member => `<li>${member}</li>`).join('');
        resultDiv.innerHTML += `
            <div class="team-box">
                <h3>Tim ${index + 1} (${team.length} Orang)</h3>
                <ul>${listHtml}</ul>
            </div>
        `;
    });
}