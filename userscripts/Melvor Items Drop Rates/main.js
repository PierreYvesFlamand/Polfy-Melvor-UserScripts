// ==UserScript==
// @name            Melvor Items Drop Rates
// @version         2.3.3
// @license         MIT
// @description     Shows monsters, chests and already acquired thieving npcs items drop rates - Last updated for Melvor v1.0.3 - Join https://discord.gg/hAdGcWc4nY for any questions or issues.
// @author          Polfy
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// ==/UserScript==

function ItemsDropRates() {
    ScriptLog();

    // Grab Melvor data
    const MELVOR = {
        // Swal
        Swal: Swal,
        getSplitedSwal: () => this.Swal.getHtmlContainer().innerHTML.split("<br>"),

        // Monsters Drops
        combatManager: combatManager, // Combat manager
        Monsters: Monsters, // List of monsters id <-> name
        MONSTERS: MONSTERS, // List of monsters data
        Items: Items, // List of items id <-> name
        items: items, // List of items data

        dropsBtns: document.querySelectorAll("#combat-container .btn.btn-sm.btn-primary.m-1"),

        getPossibleExtraDropsText() {
            const splitedSwal = this.getSplitedSwal();

            // Trick for monsters with no "always drop"
            if (splitedSwal[4].slice(-1) === ":") {
                return splitedSwal[4];
            } else {
                return splitedSwal[3];
            }
        },

        // Chest Drops
        getViewChestContentsBtns() {
            const btns = [];

            // View Chest Contents bank btn
            document.querySelectorAll("lang-string").forEach((btn) => {
                if (btn.hasAttributes() && btn.attributes["lang-cat"].value === "BANK_STRING" && btn.attributes["lang-id"].value === "36") {
                    btns.push(btn);
                }
            });

            // Dungeons rewards btn
            document.querySelectorAll("#combat-select-area-Dungeon .combat-action").forEach((btn) => {
                btns.push(btn);
            });

            return btns;
        },

        // Thieving npcs Drops
        ThievingNpcs: Thieving.npcs, // List of thieving npcs
        ThievingGeneralRareItems: Thieving.generalRareItems, // List of general rare items
        ThievingAreas: Thieving.areas, // List of thieving areas

        showDropsBtns: document.querySelectorAll("#thieving-npc-container .btn.btn-sm.btn-info.m-1.mt-3"),

        getAreaUniqueChance() {
            return Math.floor(game.thieving.areaUniqueChance * (game.thieving.isPoolTierActive(3) ? 3 : 1) * 10) / 10;
        },
        getNpcUniqueDropChance(npcId) {
            return Math.round(game.thieving.getNPCPickpocket(Thieving.npcs[npcId]) * 1000) / 1000;
        },
        getPossibleCommonDropsText() {
            return this.getSplitedSwal()[1];
        },
    };

    // Init
    initShowMonstersDropRates();
    initShowChestDropRates();
    initShowThievingNpcsDropRates();

    // Add monsters items drop rates when opening the monster Swal
    function initShowMonstersDropRates() {
        MELVOR.dropsBtns.forEach((btn) => {
            if (btn.id === "combat-btn-modifiers-raid") return;

            if (btn.id === "combat-btn-monster-drops") {
                btn.addEventListener("click", () => {
                    if (MELVOR.combatManager.isInCombat) {
                        addDropRates("monster");
                    }
                });
            } else {
                btn.addEventListener("click", () => {
                    addDropRates("monster");
                });
            }
        });
    }

    // Add chests items drop rates when opening the chest Swal
    function initShowChestDropRates() {
        MELVOR.getViewChestContentsBtns().forEach((node) => {
            node.addEventListener("click", () => {
                addDropRates("chest");
            });
        });
    }

    // Add thieving npcs items drop rates when opening the thieving npc Swal
    function initShowThievingNpcsDropRates() {
        MELVOR.showDropsBtns.forEach((node) => {
            node.addEventListener("click", () => {
                addDropRates("thievingNpcs");
            });
        });
    }

    function addDropRates(type) {
        setTimeout(() => {
            const SwalTitle = MELVOR.Swal.getTitle().innerText;
            let lootChance = 100;
            let lootTable = [];

            switch (type) {
                case "monster":
                    const monsterData = MELVOR.MONSTERS.find((monster) => monster.name === SwalTitle);
                    lootChance = monsterData.lootChance;
                    lootTable = monsterData.lootTable;

                    // Add total loot chance
                    editSwalHtml({
                        toEdit: MELVOR.getPossibleExtraDropsText(),
                        newContent: `${MELVOR.getPossibleExtraDropsText().slice(0, -1)} (${lootChance}%):`,
                    });
                    break;

                case "chest":
                    const chestData = MELVOR.items.find((item) => item.name === SwalTitle);
                    lootTable = chestData.dropTable;
                    break;

                case "thievingNpcs":
                    const npc = MELVOR.ThievingNpcs.find((npc) => npc.name === SwalTitle);
                    lootChance = 75;
                    lootTable = npc.lootTable;

                    // Add total loot chance
                    if (lootTable.length) {
                        editSwalHtml({
                            toEdit: MELVOR.getPossibleCommonDropsText(),
                            newContent: `${MELVOR.getPossibleCommonDropsText().slice(0, -1)} (${lootChance}%):`,
                        });
                    }

                    // Add general rare items drop rates
                    MELVOR.ThievingGeneralRareItems.forEach(({ itemID, chance }) => {
                        const itemName = MELVOR.items[itemID].name;
                        const itemChance = Math.round(chance * 10000) / 10000;

                        editSwalHtml({
                            toEdit: `${itemName}`,
                            newContent: `${itemName} (${itemChance}%)`,
                        });
                    });

                    // Add area items drop rates
                    MELVOR.ThievingAreas.find((area) => area.npcs.indexOf(npc.id) >= 0).uniqueDrops.forEach(({ itemID }) => {
                        const itemName = MELVOR.items[itemID].name;

                        editSwalHtml({
                            toEdit: `${itemName}`,
                            newContent: `${itemName} (${MELVOR.getAreaUniqueChance()}%)`,
                        });
                    });

                    // Add unique npc items drop rates
                    const uniqueDropItemID = npc.uniqueDrop.itemID;
                    if (uniqueDropItemID !== -1) {
                        const itemName = MELVOR.items[uniqueDropItemID].name;

                        editSwalHtml({
                            toEdit: `${itemName}`,
                            newContent: `${itemName} (${MELVOR.getNpcUniqueDropChance(npc.id)}%)`,
                        });
                    }
                    break;
            }

            editSwalDropTable(lootChance, lootTable, type);
        }, 100);
    }

    function editSwalDropTable(lootChance, lootTable, type) {
        const totalWeight = lootTable.reduce((total, [_, weight]) => total + weight, 0);
        const adjustedTotalWeight = Math.round((totalWeight / lootChance) * 100);

        lootTable.forEach(([itemId, itemWeight]) => {
            const itemLootChance = lootTable.length > 1 ? Math.round((itemWeight / adjustedTotalWeight) * 10000) / 100 : lootChance;

            const itemName = MELVOR.items[itemId].name;

            switch (type) {
                case "monster":
                case "chest":
                    editSwalHtml({
                        toEdit: `> ${itemName}`,
                        newContent: `> ${itemName} (${itemLootChance}%)`,
                    });
                    break;

                case "thievingNpcs":
                    editSwalHtml({
                        toEdit: `>${itemName}`,
                        newContent: `>${itemName} (${itemLootChance}%)`,
                    });
                    break;
            }
        });
    }

    function editSwalHtml({ toEdit, newContent }) {
        MELVOR.Swal.getHtmlContainer().innerHTML = MELVOR.Swal.getHtmlContainer().innerHTML.replace(toEdit, newContent);
    }

    // Polfy Melvor UserScripts Log
    function ScriptLog() {
        console.log("Melvor Items Drop Rates: Loaded [Contact info : https://discord.gg/hAdGcWc4nY | Polfy#6924]");

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
            scriptElem.textContent = `try {(${ItemsDropRates})();} catch (e) {console.log(e);}`;
            document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
        }
    }

    const scriptLoader = setInterval(loadScript, 250);
})();
