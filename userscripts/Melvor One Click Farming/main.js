// ==UserScript==
// @name            Melvor One Click Farming
// @version         1.1.0
// @license         MIT
// @description     Harvest All, Apply Weird Gloop to all Plots and Plant All Selected Crops on every farming areas in one click - Last updated for Melvor v1.0.3 - Join https://discord.gg/hAdGcWc4nY for any questions or issues.
// @author          Polfy
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// ==/UserScript==

function Farming() {
    ScriptLog();

    // Grab Melvor data
    const MELVOR = {
        tippy: tippy,

        goldIcon: '<img class="skill-icon-xxs" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg">',

        farmingBtnsContainer: document.querySelector("#farming-container .col-12.col-md-4 .ml-2.mr-2.text-right"),

        loadFarmingArea: loadFarmingArea,
        harvestAll: harvestAll,
        gloopAll: gloopAll,
        plantAllSelectedCrops: plantAllSelectedCrops,
    };

    const btn = document.createElement("button");
    btn.id = "WIP-FARMING";
    btn.classList.add(...["btn", "btn-sm", "btn-warning", "m-1"]);
    btn.innerText = "Harvest & Plant All";
    btn.addEventListener("click", () => {
        for (let i = 0; i < 3; i++) {
            MELVOR.loadFarmingArea(i);
            MELVOR.harvestAll();
            MELVOR.gloopAll();
            MELVOR.plantAllSelectedCrops();
        }

        MELVOR.loadFarmingArea(0);
    });

    MELVOR.farmingBtnsContainer.appendChild(btn);
    MELVOR.tippy("#WIP-FARMING", {
        content: `
            Click to perform these actions on all farming plots:
            <br>
            -> Harvest All
            <br>
            -> Apply Weird Gloop to all Plots
            <br>
            -> Plant All Selected Crops
            <br><br>
            Max cost: ${MELVOR.goldIcon} 27000`,
        allowHTML: true,
    });

    // Polfy Melvor UserScripts Log
    function ScriptLog() {
        console.log("Melvor One Click Farming: Loaded [Contact info : https://discord.gg/hAdGcWc4nY | Polfy#6924]");

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
            scriptElem.textContent = `try {(${Farming})();} catch (e) {console.log(e);}`;
            document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
        }
    }

    const scriptLoader = setInterval(loadScript, 250);
})();
