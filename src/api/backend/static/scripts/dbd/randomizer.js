const survivorPerks = []
const killerPerks = []

const survivorButton = document.getElementById("survivorButton");
const killerButton = document.getElementById("killerButton");

const modos = {
    survivor: "survivor",
    killer: "killer"
}

const roleTitle = document.getElementById("radomizerRole");


let modo = modos.survivor

killerButton.addEventListener("click", async () => {
    modo = modos.killer
    if (killerPerks.length > 0) return;

    const response = await fetch("/static/json/dbd/perksKiller.json");

    const perks = await response.json();

    killerPerks.push(...perks)

    const avaliablePerks = JSON.parse(localStorage.getItem(`${modo}CheckedPerks`)) || [];
    roleTitle.innerText = `Selected role: Killer, Perks: ${avaliablePerks.length}`;
})

survivorButton.addEventListener("click", async () => {
    modo = modos.survivor
    if (survivorPerks.length > 0) return;

    const response = await fetch("/static/json/dbd/perksSurvivor.json");

    const perks = await response.json();

    survivorPerks.push(...perks)

    const avaliablePerks = JSON.parse(localStorage.getItem(`${modo}CheckedPerks`)) || [];
    roleTitle.innerText = `Selected role: Survivor, Perks: ${avaliablePerks.length}`;
})

const $randomBtn = document.getElementById("randomize");
$randomBtn.addEventListener("click", () => {
    const perkContainer = document.getElementById("perkContainer");
    perkContainer.innerHTML = "";
    const selectedPerks = [];

    const perkPool = modo === modos.survivor ? survivorPerks : killerPerks;
    const avaliablePerks = JSON.parse(localStorage.getItem(`${modo}CheckedPerks`)) || [];

    if (perkPool.length === 0 || avaliablePerks.length <= 3) {
        alert("Please select a mode and load perks first.");
        return;
    }

    while (selectedPerks.length < 4) {
        const randomIndex = Math.floor(Math.random() * avaliablePerks.length);
        const perk = perkPool[avaliablePerks[randomIndex]];

        if (selectedPerks.some(p => p.name === perk.name)) continue;
        selectedPerks.push({
            name: perk.name,
            icon: perk.image,
            link: perk.wikiLink
        });
    }

    selectedPerks.forEach(perk => {
        const $perkDiv = renderPerk(perk);
        perkContainer.appendChild($perkDiv);
    });
})

function renderPerk(perk){
    const $perkDiv = document.createElement("div");
    $perkDiv.style.display = "flex";
    $perkDiv.style.flexDirection = "column";
    $perkDiv.style.border = "1px solid white";
    $perkDiv.style.padding = "12px";
    $perkDiv.style.flexGrow = "1";
    $perkDiv.style.alignItems = "center";
    $perkDiv.style.minWidth = "100px";
    $perkDiv.style.borderRadius = "8px";

    const $img = createImgElement(perk.icon);
    const $a = createAElement(perk);

    $perkDiv.appendChild($img);
    $perkDiv.appendChild($a);

    return $perkDiv;
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

function createImgElement(src) {
    const $img = document.createElement("img");
    $img.loading = "lazy";
    $img.decoding = "async";
    $img.src = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    $img.style.width = "64px";
    $img.style.height = "64px";

    return $img;
}