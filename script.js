// ===== ICON =====
const icons = {
    sword: "./TIERS_CORE/sword.svg",
    axe: "./TIERS_CORE/axe.svg",
    mace: "./TIERS_CORE/mace.svg",
    spear: "./TIERS_CORE/spear.png"
};

// ===== DATA =====
const playerTiers = {
    "AK47": { sword: "C", axe: "D", mace: "D", spear: "F", region: "QT" },
    "hung30082012": { sword: "B", axe: "B", mace: "F", spear: "C", region: "QT" },
    "langcoc_29": { sword: "S", axe: "S", mace: "B", spear: "D", region: "QT" },
    "Bearseetinhhhhh": { sword: "A", axe: "A", mace: "B", spear: "B", region: "QT" },
    "Reapergamer303": { sword: "A", axe: "A", mace: "S", spear: "B", region: "QT" },
    "panduuuu2310": { sword: "A", axe: "A", mace: "B", spear: "S", region: "QT" },
    "nvkd": { sword: "F", axe: "F", mace: "F", spear: "F", region: "QT" },
    "afkbot2": { sword: "F", axe: "F", mace: "F", spear: "F", region: "QT" },
    "thuyduong28212": { sword: "C", axe: "C", mace: "F", spear: "", region: "QT" },
    "AFKBot": { sword: "F", axe: "F", mace: "F", spear: "F", region: "QT" }
};

const uuidMap = {
    "1b31db26-8fae-3d2d-87b0-92192f6c066c": "AK47",
    "238ab380-7d69-361e-9387-b34adcf0adf3": "hung30082012",
    "2a53511d-3eb5-3dd6-a89f-90cc0da9d719": "langcoc_29",
    "4f1916ab-011d-3e59-9194-bcb4dd32628c": "Bearseetinhhhhh",
    "7c9319ca-8f93-3938-882b-84b24c594490": "Reapergamer303",
    "b7dc4aec-1414-3bb1-ab02-9013834705d8": "panduuuu2310",
    "bb7bd5e6-853b-3109-b668-31ef0439f3f8": "nvkd",
    "e49f2148-1b19-365c-9c64-56db60c8f02c": "afkbot2",
    "ec7028c4-97bb-33c4-8ec9-0064bda38014": "thuyduong28212",
    "f7c4ba52-346c-3338-9a6a-2cf73bc8e0e1": "AFKBot"
};

let currentTab = 'overall';

// ===== MAP TIER =====
function getTierLevel(t){
    if(t === "S") return "tier-1";
    if(t === "A") return "tier-2";
    if(t === "B") return "tier-3";
    return "tier-4";
}

// ===== TAB =====
function switchTab(tab){
    currentTab = tab;

    document.querySelectorAll('.tab-btn').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    loadStats();
}
// ===== RENDER =====
function render(players){
    if(currentTab === 'overall'){
        renderOverall(players);
    } else {
        renderTierBoard(players, currentTab);
    }
}

// ===== OVERALL =====
function renderOverall(players){
    players.sort((a,b)=>b.kills-a.kills);

    const list = document.getElementById("list");
    list.innerHTML = "";

    players.forEach((p,i)=>{
        let cls = i===0?"top1":i===1?"top2":i===2?"top3":"";

        const div = document.createElement("div");
        div.className = `player ${cls}`;
        div.onclick = () => showPlayerDetails(p);

        div.innerHTML = `
        <div class="rank-banner">${i+1}</div>

        <div class="player-main">
            <img class="avatar" src="https://mc-heads.net/avatar/${p.name}">
            <div class="info">
                <div class="name">${p.name}</div>
                <div class="kills">${p.kills} kills • <b>${p.points} pts</b></div>
            </div>
        </div>

        <div class="tiers">
            ${renderTier("sword", p.tiers.sword)}
            ${renderTier("axe", p.tiers.axe)}
            ${renderTier("mace", p.tiers.mace)}
            ${renderTier("spear", p.tiers.spear)}
        </div>
        `;

        list.appendChild(div);
    });
}

// ===== TIER BOARD (CHỈ 4 TIER) =====
function renderTierBoard(players, type){

    const groups = {
        "Tier 1": [],
        "Tier 2": [],
        "Tier 3": [],
        "Tier 4": []
    };

    players.forEach(p=>{
        const t = p.tiers[type];

        if(t === "S") groups["Tier 1"].push(p);
        else if(t === "A") groups["Tier 2"].push(p);
        else if(t === "B") groups["Tier 3"].push(p);
        else groups["Tier 4"].push(p);
    });

    const list = document.getElementById("list");
    list.innerHTML = `<div class="tier-board"></div>`;
    const board = list.querySelector(".tier-board");

    Object.keys(groups).forEach(tier=>{
        const col = document.createElement("div");
        col.className = "tier-col";

        col.innerHTML = `<h3 class="tier-title">${tier}</h3>`;

        groups[tier]
        .sort((a,b)=>b.kills-a.kills)
        .forEach(p=>{
            const card = document.createElement("div");
            card.className = "player-card";
            card.onclick = () => showPlayerDetails(p);

            card.innerHTML = `
            <img src="https://mc-heads.net/avatar/${p.name}">
            <span>${p.name}</span>
            `;

            col.appendChild(card);
        });

        board.appendChild(col);
    });
}

// ===== RENDER TIER BOX =====
function renderTier(type, value){
    const tierClass = getTierLevel(value);

    return `
    <div class="tier-box ${tierClass}">
        <img src="${icons[type]}">
        <div class="tier-label">${value || "-"}</div>
    </div>
    `;
}

// ===== POPUP =====
function showPlayerDetails(p){
    const popup = document.getElementById('popup-overlay');
    const body = document.getElementById('popup-body');

    body.innerHTML = `
        <img src="https://mc-heads.net/avatar/${p.name}" class="popup-avatar">
        <h2>${p.name}</h2>
        <p class="points">🏆 ${p.points} pts</p>
        <p class="kills">${p.kills} kills</p>
    `;

    popup.style.display = 'flex';
}

function closePopup(){
    document.getElementById('popup-overlay').style.display = 'none';
}

// ===== LOAD =====
async function loadStats(){
    const players = await Promise.all(Object.keys(uuidMap).map(async uuid=>{
        try{
            const res = await fetch(`./kill_player/${uuid}.json`);
            const data = await res.json();

            const name = uuidMap[uuid];
            const kills = data?.stats?.["minecraft:custom"]?.["minecraft:player_kills"] ?? 0;

            return {
                name,
                kills,
                points: Math.floor(kills * 1.5),
                tiers: playerTiers[name] || {}
            };

        } catch {
            return {
                name: uuidMap[uuid],
                kills: 0,
                points: 0,
                tiers: {}
            };
        }
    }));

    render(players);
}

function copyIP(){
  const ip = "thachminh09022010.aternos.me:49218";

  navigator.clipboard.writeText(ip);

  const el = document.querySelector(".server-ip");
  el.classList.add("copied");
  el.innerText = "Copied! ✔";

  setTimeout(()=>{
    el.innerHTML = `
      thachminh09022010.aternos.me:49218
      <span class="copy-text">Click to copy</span>
    `;
    el.classList.remove("copied");
  },1500);
}

// INIT
loadStats();
setInterval(loadStats, 5000);