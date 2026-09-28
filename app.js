const defaultParticipants = [
    "Malvin Kefe Mahadika",
    "Calista Putri Inasyah",
    "M. Fahrul Rozi",
    "M. Farel Luthfiansyahputra",
    "Syafiq dwinnando bhyantoro",
    "Amelia Khairunnisa",
    "Aisyah Kirana Maharani Arista Putri",
    "Christian Natanael Silaban",
    "Putri Zahra Hermawan",
    "Daffy Neoga Aleandra",
    "Muhammad Yusuf Al-fanzi",
    "Vazira Az-Zahra",

    "Bryan Casey Angelo S.",
    "Muhammad faris ibrahim",
    "M. Arya Dwi Saputra",
    "Ancarlo Mohamad",
    "Muhammad Hafiz Mu'afiy",
    "Ramandha Afwa Octarizha. H",
    "Nayla Angelica",
    "Tata Aulia Yustika Jaya",
    "Advent Natanael Hutapea",
    "Devandra Putra Wibawa",
    "Muhammad Farrel Alhakim",
    "Pelangi Nadya Ayudifa",

    "Nayla Salsabila",
    "Afif Ahmad Alkhair",
    "Tio Margaretha Br Tarigan",
    "Andi Michael Manurung",
    "Julian Putra",
    "Nayla Sabrina Cholik",
    "M. Raka Adinata",
    "Deva Azzahra Fadjri",
    "Muhammad Kaisar Arga Putra",
    "R.M. Zia Ulhaq Ghaisani",
    "Raditia Bintang Dinov",
    "Muhammad Aric Arkan Adifa"
];


// ========================================
// DATA PESERTA
// ========================================

let participants;

const savedParticipants =
    localStorage.getItem("participants");

if (savedParticipants) {
    try {
        participants =
            JSON.parse(savedParticipants);

        // Pastikan datanya benar-benar array
        if (!Array.isArray(participants)) {
            participants =
                [...defaultParticipants];
        }
    } catch (error) {
        participants =
            [...defaultParticipants];
    }
} else {
    participants =
        [...defaultParticipants];
}

let selectedIndex = -1;


// ========================================
// ELEMENT HTML
// ========================================

const participantList =
    document.getElementById("participantList");

const participantCount =
    document.getElementById("participantCount");

const participantInput =
    document.getElementById("participantInput");

const addButton =
    document.getElementById("addButton");

const deleteButton =
    document.getElementById("deleteButton");

const spinButton =
    document.getElementById("spinButton");

const groupCount =
    document.getElementById("groupCount");

const idealMembers =
    document.getElementById("idealMembers");

const allowExtra =
    document.getElementById("allowExtra");

const resultContainer =
    document.getElementById("resultContainer");

const errorMessage =
    document.getElementById("errorMessage");


// ========================================
// SIMPAN PESERTA
// ========================================

function saveParticipants() {
    localStorage.setItem(
        "participants",
        JSON.stringify(participants)
    );
}


// ========================================
// TAMPILKAN PESERTA
// ========================================

function renderParticipants() {

    participantList.innerHTML = "";

    participantCount.textContent =
        participants.length;

    participants.forEach(
        (name, index) => {

            const item =
                document.createElement("div");

            item.className =
                "participant-item";

            if (index === selectedIndex) {
                item.classList.add("selected");
            }

            item.textContent =
                `${index + 1}. ${name}`;

            item.addEventListener(
                "click",
                () => {

                    selectedIndex = index;

                    renderParticipants();
                }
            );

            participantList.appendChild(item);
        }
    );
}


// ========================================
// TAMBAH PESERTA
// ========================================

function addParticipant() {

    const name =
        participantInput.value.trim();

    if (!name) {
        return;
    }

    participants.push(name);

    saveParticipants();

    participantInput.value = "";

    selectedIndex = -1;

    renderParticipants();
}


// ========================================
// HAPUS PESERTA
// ========================================

function deleteParticipant() {

    if (selectedIndex === -1) {

        alert(
            "Pilih peserta yang ingin dihapus."
        );

        return;
    }

    participants.splice(
        selectedIndex,
        1
    );

    selectedIndex = -1;

    saveParticipants();

    renderParticipants();
}


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


// ========================================
// SPIN / ACAK KELOMPOK
// ========================================

function spinGroups() {

    errorMessage.textContent = "";

    resultContainer.innerHTML = "";

    // ------------------------------------
    // CEK PESERTA
    // ------------------------------------

    if (participants.length === 0) {

        errorMessage.textContent =
            "Tidak ada peserta.";

        return;
    }


    // ------------------------------------
    // AMBIL PENGATURAN
    // ------------------------------------

    const totalParticipants =
        participants.length;

    const numberOfGroups =
        Number(groupCount.value);

    const idealMemberCount =
        Number(idealMembers.value);

    const isExtraAllowed =
        allowExtra.checked;


    // ------------------------------------
    // VALIDASI JUMLAH KELOMPOK
    // ------------------------------------

    if (
        !Number.isInteger(numberOfGroups) ||
        numberOfGroups < 1 ||
        numberOfGroups > 50
    ) {

        errorMessage.textContent =
            "Jumlah kelompok harus antara 1 sampai 50.";

        return;
    }


    // ------------------------------------
    // VALIDASI ANGGOTA IDEAL
    // ------------------------------------

    if (
        !Number.isInteger(idealMemberCount) ||
        idealMemberCount < 1 ||
        idealMemberCount > 50
    ) {

        errorMessage.textContent =
            "Anggota ideal harus antara 1 sampai 50.";

        return;
    }


    // ------------------------------------
    // JUMLAH KELOMPOK > PESERTA
    // ------------------------------------

    if (
        numberOfGroups > totalParticipants
    ) {

        errorMessage.textContent =
            "Jumlah kelompok tidak boleh lebih banyak dari jumlah peserta.";

        return;
    }


    // ------------------------------------
    // HITUNG PEMBAGIAN
    // ------------------------------------

    const minimumMembers =
        Math.floor(
            totalParticipants /
            numberOfGroups
        );

    const remainder =
        totalParticipants %
        numberOfGroups;

    const maximumMembers =
        minimumMembers +
        (remainder > 0 ? 1 : 0);


    // ------------------------------------
    // CEK ANGGOTA TAMBAHAN
    // ------------------------------------

    if (
        !isExtraAllowed &&
        maximumMembers > idealMemberCount
    ) {

        errorMessage.textContent =
            "Peserta tidak dapat dibagi tanpa melebihi anggota ideal. " +
            "Aktifkan 'Izinkan anggota tambahan' " +
            "atau tambah jumlah kelompok.";

        return;
    }


    // ------------------------------------
    // ACAK PESERTA
    // ------------------------------------

    const shuffledParticipants =
        shuffle(participants);


    // ------------------------------------
    // TENTUKAN UKURAN SETIAP KELOMPOK
    // ------------------------------------

    const groupSizes = [];

    for (
        let i = 0;
        i < numberOfGroups;
        i++
    ) {

        let size =
            minimumMembers;

        if (i < remainder) {
            size++;
        }

        groupSizes.push(size);
    }


    // ------------------------------------
    // ACAK KELOMPOK YANG DAPAT TAMBAHAN
    // ------------------------------------

    const shuffledGroupSizes =
        shuffle(groupSizes);


    // ------------------------------------
    // BENTUK KELOMPOK
    // ------------------------------------

    const groups = [];

    let participantIndex = 0;

    for (
        let i = 0;
        i < numberOfGroups;
        i++
    ) {

        const group = [];

        const targetSize =
            shuffledGroupSizes[i];

        for (
            let j = 0;
            j < targetSize;
            j++
        ) {

            if (
                participantIndex <
                shuffledParticipants.length
            ) {

                group.push(
                    shuffledParticipants[
                        participantIndex
                    ]
                );

                participantIndex++;
            }
        }

        groups.push({
            group:
                i + 1,

            members:
                group
        });
    }


    // ------------------------------------
    // TAMPILKAN HASIL
    // ------------------------------------

    displayGroups(groups);
}


// ========================================
// TAMPILKAN HASIL KELOMPOK
// ========================================

function displayGroups(groups) {

    resultContainer.innerHTML = "";

    groups.forEach(
        group => {

            const card =
                document.createElement("div");

            card.className =
                "group-card";


            const title =
                document.createElement("h3");

            title.textContent =
                `KELOMPOK ${group.group} (${group.members.length} orang)`;


            const list =
                document.createElement("ol");


            group.members.forEach(
                name => {

                    const item =
                        document.createElement("li");

                    item.textContent =
                        name;

                    list.appendChild(item);
                }
            );


            card.appendChild(title);

            card.appendChild(list);

            resultContainer.appendChild(card);
        }
    );
}


// ========================================
// EVENT
// ========================================

addButton.addEventListener(
    "click",
    addParticipant
);

deleteButton.addEventListener(
    "click",
    deleteParticipant
);

spinButton.addEventListener(
    "click",
    spinGroups
);

participantInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addParticipant();
        }
    }
);


// ========================================
// MULAI APLIKASI
// ========================================

renderParticipants();