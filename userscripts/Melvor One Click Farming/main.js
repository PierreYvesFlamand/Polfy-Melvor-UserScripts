// ==UserScript==
// @name            Melvor One Click Farming
// @version         1.0.1
// @license         MIT
// @description     Harvest All, Apply Weird Gloop to all Plots and Plant All Selected Crops on every farming areas in one click - Last updated for Melvor v1.0.2 - Contact Polfy#6924 for any questions or issues.
// @author          Polfy
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// ==/UserScript==

function Farming() {
    console.log("Melvor One Click Farming: Loaded (Contact info : Polfy#6924)");

	// Grab Melvor data
	const MELVOR = {
		tippy: tippy,

		goldIcon:
			'<img class="skill-icon-xxs" src="https://cdn.melvor.net/core/v018/assets/media/main/coins.svg">',

		farmingBtnsContainer: document.querySelector(
			"#farming-container .col-12.col-md-4 .ml-2.mr-2.text-right"
		),

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
