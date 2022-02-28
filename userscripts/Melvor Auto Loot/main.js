// ==UserScript==
// @name            Melvor Auto Loot
// @version         1.4.3
// @license         MIT
// @description     Add an Auto Loot toggle in combat - Last updated for Melvor v1.0.2 - Contact Polfy#6924 for any questions or issues.
// @author          Polfy
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// ==/UserScript==

function AutoLoot() {
    console.log("Melvor Auto Loot: Loaded [Contact info : https://discord.gg/hAdGcWc4nY | Polfy#6924]");

    // Grab Melvor data
    const MELVOR = {
        // Loot btn section
        lootAllBtn: document.querySelector("#combat-btn-loot-all"),

        lootAll() {
            combatManager.loot.lootAll(); // Loot all function
        },

        // Melvor autoloot switch
        setAutoLooting(val) {
            player.modifiers.autoLooting = val;
        },
    };

    var autoLootIsEnable = false;

    // Adding the button
    const br = document.createElement("br");
    MELVOR.lootAllBtn.parentNode.appendChild(br);

    var autoLootBtn = document.createElement("button");
    autoLootBtn.addEventListener("click", toggleAutoLoot);
    autoLootBtn.classList.add(...["btn", "btn-sm", "mt-2"]);
    autoLootBtn.classList.add("btn-danger");
    autoLootBtn.innerText = "Auto Loot : Disabled";
    MELVOR.lootAllBtn.parentNode.appendChild(autoLootBtn);

    function toggleAutoLoot() {
        if (!autoLootIsEnable) {
            enableAutoLoot();
        } else {
            disableAutoLoot();
        }
        autoLootIsEnable = !autoLootIsEnable;
    }

    function enableAutoLoot() {
        MELVOR.lootAll();
        MELVOR.setAutoLooting(1);

        autoLootBtn.classList.remove("btn-danger");
        autoLootBtn.classList.add("btn-warning");
        autoLootBtn.innerText = "Auto Loot : Enabled";
    }

    function disableAutoLoot() {
        MELVOR.setAutoLooting(0);

        autoLootBtn.classList.remove("btn-warning");
        autoLootBtn.classList.add("btn-danger");
        autoLootBtn.innerText = "Auto Loot : Disabled";
    }
}

// Injecting the script when possible
(() => {
    function loadScript() {
        // Load script after the actual Melvor game has loaded
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            clearInterval(scriptLoader);

            const scriptElem = document.createElement("script");
            scriptElem.textContent = `try {(${AutoLoot})();} catch (e) {console.log(e);}`;
            document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
        }
    }

    const scriptLoader = setInterval(loadScript, 250);
})();
