const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");

let page = 0;

const localSurvivorCheckedPerks = localStorage.getItem("survivorCheckedPerks");
const localKillerCheckedPerks = localStorage.getItem("killerCheckedPerks");

const checkedPerkSets = {
    survivor: localSurvivorCheckedPerks ? JSON.parse(localSurvivorCheckedPerks) : [],
    killer: localKillerCheckedPerks ? JSON.parse(localKillerCheckedPerks) : []
}

nextButton.addEventListener("click", async () => {
    page++;
    renderPerks();
})

prevButton.addEventListener("click", async () => {
    if (page === 0) return;
    page--;
    renderPerks();
})

const searchButton = document.getElementById("searchButton");

const perkBrowser = document.getElementById("perkBrowser");
perkBrowser.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
})


searchButton.addEventListener("click", () => {
    const searchTerm = perkBrowser.value.toLowerCase();

    if (!searchTerm) return renderPerks();

    const perkIndex = perkList.findIndex(perk => perk.name.toLowerCase() === searchTerm);

    if (perkIndex === -1) return;

    page = 0;
    const renderPerksDiv = document.getElementById("renderPerks");
    renderPerksDiv.innerHTML = ""
    renderPerksDiv.appendChild(createPerkCard(perkList[perkIndex], perkIndex));
})

const clearSearchButton = document.getElementById("clearSearchButton");

clearSearchButton.addEventListener("click", () => {
    const perkBrowser = document.getElementById("perkBrowser");
    perkBrowser.value = "";
    page = 0;
    renderPerks();
})

function renderPerks(perPage = 45) {
    const renderPerksDiv = document.getElementById("renderPerks");
    renderPerksDiv.innerHTML = ""

    const start = page * perPage;
    const end = start + perPage;

    const perksToRender = perkList.slice(start, end);

    perksToRender.forEach((perk, i) => {
        const $perkDiv = createPerkCard(perk, i);
        renderPerksDiv.appendChild($perkDiv);
    })
}

function createPerkCard(perk, index, start = page * 45) {
    const $perkDiv = document.createElement("div");
    $perkDiv.style.display = "flex";
    $perkDiv.style.flexDirection = "column";
    $perkDiv.style.border = "1px solid white";
    $perkDiv.style.padding = "12px";
    $perkDiv.style.flexGrow = "1";
    $perkDiv.style.alignItems = "center";
    $perkDiv.style.minWidth = "100px";
    $perkDiv.style.borderRadius = "8px";

    const $checkBox = document.createElement("input");
    $checkBox.type = "checkbox";
    $checkBox.id = `checklist-item-${index + start}`;
    $checkBox.value = index + start;

    if (checkedPerkSets[modo].includes(index + start)) {
        $checkBox.checked = true;
    } else {
        $checkBox.checked = false;
    }

    $perkDiv.addEventListener("click", () => {
        $checkBox.checked = !$checkBox.checked;

        const value = parseInt($checkBox.value);

        if ($checkBox.checked) {
            if (!checkedPerkSets[modo].includes(value)) {
                checkedPerkSets[modo].push(value);
            }
        } else {
            checkedPerkSets[modo] = checkedPerkSets[modo].filter(item => item !== value);
        }

        localStorage.setItem(`${modo}CheckedPerks`, JSON.stringify(checkedPerkSets[modo]));
    })

    $perkDiv.appendChild(createImgElement(perk.image));
    $perkDiv.appendChild(createAElement(perk));
    $perkDiv.appendChild($checkBox);

    return $perkDiv;
}

function addPerkToDatalist(perk) {
    const datalist = document.getElementById("perkOptions");
    const option = document.createElement("option");
    option.value = perk.name;
    datalist.appendChild(option);
}


function createImgElement(src) {
    const $img = document.createElement("img");
    $img.loading = "lazy";
    $img.decoding = "async";
    $img.src = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    $img.style.width = "64px";
    $img.style.height = "64px";

    return $img;
}

function createAElement(perk) {
    const $a = document.createElement("a");
    $a.innerText = perk.name;
    $a.href = perk.wikiLink;
    $a.target = "_blank";
    $a.style.color = "white";
    const $p = document.createElement("p");
    $p.appendChild($a);

    return $p;
}

const modos = {
    survivor: "survivor",
    killer: "killer"
}

let modo

const perkList = []

const killerFetchingBtn = document.getElementById("killerButton");
killerFetchingBtn.addEventListener("click", async () => {
    const perks = await fetchKillerPerks();
    modo = modos.killer;
    perkList.push(...perks);

    hideModal();
    renderPerks();
})

const survivorFetchingBtn = document.getElementById("survivorButton");
survivorFetchingBtn.addEventListener("click", async () => {
    const perks = await fetchSurvivorPerks();
    modo = modos.survivor;
    perkList.push(...perks);

    hideModal();
    renderPerks();
})



function hideModal() {
    const searchContainer = document.getElementById("searchContainer");
    searchContainer.style.display = "flex";
    const modal = document.getElementById("selectModeModal");
    modal.style.display = "none";
}

async function fetchKillerPerks() {
    const response = await fetch("/static/json/dbd/perksKiller.json");

    if (!response.ok) return [];
    const perks = await response.json();

    if (perks.length === 0) return [];

    perks.forEach(perk => {
        addPerkToDatalist(perk);
    })

    return perks;
}

async function fetchSurvivorPerks() {
    const response = await fetch("/static/json/dbd/perksSurvivor.json");

    if (!response.ok) return [];

    const perks = await response.json();

    if (perks.length === 0) return [];


    perks.forEach(perk => {
        addPerkToDatalist(perk);
    })

    return perks;
}