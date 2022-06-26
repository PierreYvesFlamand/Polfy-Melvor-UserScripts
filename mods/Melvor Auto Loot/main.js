export function setup({ onInterfaceReady }) {
    onInterfaceReady(() => {
        init();
    });
}

function init() {
    let autoLootIsEnable = false;

    const MELVOR = {
        lootAllBtn: document.querySelector("#combat-btn-loot-all"),

        lootAll() {
            combatManager.loot.lootAll();
        },
    }

    // Button
    const br = document.createElement("br");
    MELVOR.lootAllBtn.parentNode.appendChild(br);

    const autoLootBtn = document.createElement("button");
    autoLootBtn.addEventListener("click", toggleAutoLoot);
    autoLootBtn.classList.add(...["btn", "btn-sm", "mt-2"]);
    autoLootBtn.classList.add("btn-danger");
    autoLootBtn.innerText = "Auto Loot : Disabled";
    MELVOR.lootAllBtn.parentNode.appendChild(autoLootBtn);

    function toggleAutoLoot() {
        if (!autoLootIsEnable) {
            MELVOR.lootAll();
            autoLootBtn.classList.remove("btn-danger");
            autoLootBtn.classList.add("btn-warning");
            autoLootBtn.innerText = "Auto Loot : Enabled";
        } else {
            autoLootBtn.classList.remove("btn-warning");
            autoLootBtn.classList.add("btn-danger");
            autoLootBtn.innerText = "Auto Loot : Disabled";
        }

        autoLootIsEnable = !autoLootIsEnable;
    }

    // Events
    combatManager.on("enemyDeath", ({ after }) => {
        after(() => {
            if (autoLootIsEnable) {
                MELVOR.lootAll();
            }
        });
    })
}