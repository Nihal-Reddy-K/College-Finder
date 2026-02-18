let url = "http://universities.hipolabs.com/search?country=";
let btn = document.querySelector("button");

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

    // filter by state if provided
    if(state){
        colleges = colleges.filter(c =>
            c["state-province"] &&
            c["state-province"].toLowerCase().includes(state.toLowerCase())
        );
    }

    show(colleges);

    status.innerText = `Found ${colleges.length} universities`;
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
        }else{
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
        let res = await axios.get(url + country);
        return res.data;
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
