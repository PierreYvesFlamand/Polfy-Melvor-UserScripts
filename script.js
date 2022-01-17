class userScript {
    constructor(props, stats) {
        this.order = props.order;
        this.name = props.name;
        this.description = props.description;
        this.version = props.version;
        this.scriptID = props.scriptID;
        this.imageGalleryName = props.imageGalleryName;
        this.todos = props.todos || [];

        this.stats = {
            creationDate: new Date("2000-01-01"),
            totalInstalls: 0,
            averageInstallPerDay: 0,
        };

        this.initStats(stats);
    }

    initStats(stats) {
        const keys = Object.keys(stats);
        const totalInstalls = keys.reduce((total, key) => total + stats[key].installs, 0);

        this.stats.creationDate = new Date(keys[0]);
        this.stats.totalInstalls = totalInstalls;
        this.stats.averageInstallPerDay = Math.round((totalInstalls / keys.length) * 10) / 10;
    }

    getNameSlug() {
        return this.name.split(" ").join("-");
    }

    getImageUrl(id) {
        return `https://raw.githubusercontent.com/PierreYvesFlamand/${this.getNameSlug()}/main/${
            this.imageGalleryName[id]
        }.png`;
    }
}

const USERSCRIPTS = [
    {
        order: 0,
        name: "Melvor Items Drop Rates",
        description: "Shows monsters, chests and already acquired thieving npcs items drop rates",
        scriptID: "435520",
        version: "v1.0.1",
        imageGalleryName: [
            "monsterItemsDropRatesExample",
            "chestItemsDropRatesExample",
            "thievingNpcItemsDropRatesExample",
        ],
        todos: ["Show thieving item and drop rate when not already acquired"],
    },
    {
        order: 1,
        name: "Melvor Better Completion Log",
        description:
            "Shows images of undiscovered items, monsters, pets and open wiki page on click",
        scriptID: "438058",
        version: "v1.0.1",
        imageGalleryName: ["betterCompletionLogExample", "betterCompletionLogTooltipExample"],
        todos: ["Adding non completion log entries in a separate tab"],
    },
    {
        order: 2,
        name: "Melvor Auto Loot",
        description: "Add an Auto Loot toggle in combat",
        scriptID: "435548",
        version: "v1.0.1",
        imageGalleryName: ["autoLootExample"],
    },
    {
        order: 3,
        name: "Melvor One Click Farming",
        description:
            "Harvest All, Apply Weird Gloop to all Plots and Plant All Selected Crops on every farming areas in one click",
        scriptID: "438680",
        version: "v1.0.1",
        imageGalleryName: ["oneClickFarmingExample"],
        todos: ["Adding a customization menu to choose actions to perform"],
    },
];

USERSCRIPTS.forEach((USERSCRIPTData) => {
    // Fetch data
    fetch(`https://greasyfork.org/en/scripts/${USERSCRIPTData.scriptID}/stats.json`)
        .then((res) => res.json())
        .then((stats) => {
            const userScriptData = new userScript(USERSCRIPTData, stats);

            // Menu item
            const item = document.createElement("li");
            item.innerHTML = `<a class="dropdown-item" href="#${userScriptData.getNameSlug()}">${
                userScriptData.name
            }</a>`;
            document.querySelector("#navbarNav .dropdown-menu").appendChild(item);

            // Page data
            const scriptDiv = document.createElement("div");
            scriptDiv.id = `${userScriptData.getNameSlug()}`;
            scriptDiv.style.order = userScriptData.order;
            scriptDiv.classList.add(...["callout", "callout-dark"]);
            scriptDiv.innerHTML = `
                <h3>${userScriptData.name} <span class="badge rounded-pill bg-dark">Melvor ${
                userScriptData.version
            }</span></h3>
                <small>Created ${userScriptData.stats.creationDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                })} | ${userScriptData.stats.totalInstalls} total installs | ${
                userScriptData.stats.averageInstallPerDay
            } average installs per day</small>
                <p>${userScriptData.description}</p>
                <div class="gallery gallery${userScriptData.scriptID}">
                    ${userScriptData.imageGalleryName.reduce(
                        (html, img, id) =>
                            html +
                            `<a class="me-2" href="${userScriptData.getImageUrl(
                                id
                            )}"><img src="${userScriptData.getImageUrl(
                                id
                            )}" alt="" title=""/></a>`,
                        ""
                    )}
                    
                </div>
                <div class="d-flex mt-3">
                    <a role="button" type="button" class="btn btn-success me-2" href="https://greasyfork.org/en/scripts/${
                        userScriptData.scriptID
                    }" target="_blank">Install</a>
                    <a role="button" type="button" class="btn btn-dark me-2" href="https://greasyfork.org/en/scripts/${
                        userScriptData.scriptID
                    }/feedback" target="_blank">Comment</a>
                    <a role="button" type="button" class="btn btn-dark me-2" href="https://github.com/PierreYvesFlamand/${userScriptData.getNameSlug()}" target="_blank">Source Code</a>
                    <a role="button" type="button" class="btn btn-danger me-2" href="https://github.com/PierreYvesFlamand/${userScriptData.getNameSlug()}/issues" target="_blank">Report issue</a>
                </div>
                <p class="mt-4">Todo :</p>
                <ul>
                    ${userScriptData.todos.reduce((html, todo) => html + `<li>${todo}</li>`, "")}
                </ul>
            `;
            document.querySelector("#Script .scriptContent").appendChild(scriptDiv);
            new SimpleLightbox(`.gallery${userScriptData.scriptID} a`);
        });
});
