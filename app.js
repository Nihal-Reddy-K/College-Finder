let url = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

let btn = document.querySelector("#searchBtn");

let allUniversities = [];

let currentColleges = [];

(async () => {
    try{
        let res = await axios.get(url);
        allUniversities = res.data;
    }catch(e){
        console.log(e);
    }
})();

btn.addEventListener("click", async () => {
    let status = document.querySelector("#status");
    let country = document.querySelector("#country").value.trim();
    let state = document.querySelector("#state").value.trim();

    if(!country){
        status.innerText = "Please enter a country";
        return;
    }

    status.innerText = "Searching for universities...";
    let colleges = await getColleges(country);

    if(state){
        colleges = colleges.filter(c =>
            c["state-province"] &&
            c["state-province"].toLowerCase().includes(state.toLowerCase())
        );
    }

    currentColleges = colleges;
    show(colleges);

    status.innerHTML = `Found <strong>${colleges.length}</strong> universities`;
    if(colleges.length === 0){
        status.innerText = "No universities found";
    }
});

function show(colleges){
    let list = document.querySelector("#list");
    list.innerText = "";

    if(colleges.length === 0){
        let li = document.createElement("li");
        li.innerText = "No universities were found for this search.";
        list.appendChild(li);
        return;
    }

    for(let col of colleges){
        const li = document.createElement("li");
        const name = document.createElement("strong");
        const location = document.createElement("p");
        const link = document.createElement("a");

        name.innerText = col.name;
        li.appendChild(name);

        if(col["state-province"]){
            location.innerText = col["state-province"] + ", " + col.country;
        } else {
            location.innerText = col.country;
        }
        li.appendChild(location);

        link.href = col.web_pages[0];
        link.innerText = "Visit Website";
        link.target = "_blank";
        li.appendChild(link);

        list.appendChild(li);
    }
}

async function getColleges(country){
    try{
        if(allUniversities.length === 0){
            let res = await axios.get(url);
            allUniversities = res.data;
        }

        return allUniversities.filter(u =>
            u.country.toLowerCase().includes(country.toLowerCase())
        );

    }catch(e){
        console.log("Error:", e);
        return [];
    }
}

document.querySelector("#country").addEventListener("keypress", e=>{
    if(e.key === "Enter"){
        btn.click();
    }
});

document.querySelector("#themeToggle").onclick = () =>{
    document.body.classList.toggle("dark");
};

document.querySelector("#sortBtn").onclick = () => {
    currentColleges.sort((a,b) =>
        a.name.localeCompare(b.name)
    );
    show(currentColleges);
};

let countryInput = document.querySelector("#country");
let suggestionsBox = document.querySelector("#suggestions");

countryInput.addEventListener("input", () => {

    let val = countryInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if(!val) return;

    let countries = [...new Set(
        allUniversities.map(u => u.country)
    )];

    let matches = countries
        .filter(c => c.toLowerCase().startsWith(val))
        .slice(0,5);

    matches.forEach(country => {
        let div = document.createElement("div");
        div.innerText = country;
        div.className = "suggestion-item";

        div.onclick = () => {
            countryInput.value = country;
            suggestionsBox.innerHTML = "";
        };

        suggestionsBox.appendChild(div);
    });
});

document.addEventListener("click", (e)=>{
    if(!e.target.closest(".search-box")){
        suggestionsBox.innerHTML = "";
    }
});
