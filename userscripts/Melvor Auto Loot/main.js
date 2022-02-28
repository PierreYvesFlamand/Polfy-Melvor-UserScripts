// ==UserScript==
// @name            Melvor Auto Loot
// @version         1.5.0
// @license         MIT
// @description     Add an Auto Loot toggle in combat - Last updated for Melvor v1.0.3 - Join https://discord.gg/hAdGcWc4nY for any questions or issues.
// @author          Polfy
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// ==/UserScript==

function AutoLoot() {
    ScriptLog();

    // Grab Melvor data
    const MELVOR = {
        combatLootContainer: $("#combat-loot-container"),

        // Loot btn section
        lootAllBtn: document.querySelector("#combat-btn-loot-all"),

        lootAll() {
            combatManager.loot.lootAll(); // Loot all function
        },

        // // Melvor autoloot switch
        // setAutoLooting(val) {
        //     player.modifiers.autoLooting = val;
        // },
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
        // MELVOR.setAutoLooting(1);

        MELVOR.lootAll();

        MELVOR.combatLootContainer.bind("DOMNodeInserted", () => {
            MELVOR.lootAll();
        });

        autoLootBtn.classList.remove("btn-danger");
        autoLootBtn.classList.add("btn-warning");
        autoLootBtn.innerText = "Auto Loot : Enabled";
    }

    function disableAutoLoot() {
        // MELVOR.setAutoLooting(0);

        combatManager.loot.add = (itemID, quantity, stack = false) => {
            MELVOR.add(itemID, quantity, (stack = false));
        };

        autoLootBtn.classList.remove("btn-warning");
        autoLootBtn.classList.add("btn-danger");
        autoLootBtn.innerText = "Auto Loot : Disabled";
    }

    function ScriptLog() {
        console.log("Melvor Auto Loot: Loaded [Contact info : https://discord.gg/hAdGcWc4nY | Polfy#6924]");

        if (!document.querySelector("#PolfyUserScriptsDiscordLink")) {
            let llink = document.createElement("li");
            llink.id = "PolfyUserScriptsDiscordLink";
            llink.classList.add("nav-main-item");
            llink.innerHTML = `
                <a class="nav-main-link nav-compact" href="https://discord.gg/hAdGcWc4nY" target="_blank">
                    <img class="nav-img" src="https://cdn.melvor.net/core/v018/assets/media/main/discord.svg">
                    <span class="nav-main-link-name page-nav-name-misc-15">Polfy UserScript Discord</span>
                </a>
            `;
            document.querySelector(".nav-main-heading.page-nav-name-misc-12").after(llink);
        }
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
