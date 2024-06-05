console.log('vliegenraam geladen')
let winkelmand = {
    type: "Schuifvliegendeur",
    status: "winkelmand",
    ref: "",
    positie: "",
    klant: klant.bedrijf,
    klantID: klant.bedrijfID,
    aantal: 0,
    breedte: 0,
    hoogte: 0,
    dikteprofiel: 0,
    typegaas: "",
    kleur: "",
    kleurral: "",
    typeclips: "",
    grootteclips: "",
};

let winkelData;
//divs
var aantalDIV = document.getElementById("aantalDIV");
var breedteInputDIV = document.getElementById("breedteInputDIV");
var hoogteInputDIV = document.getElementById("hoogteInputDIV");
var dikteProfielDIV = document.getElementById("dikteProfielDIV");
var typeGaasDIV = document.getElementById("typeGaasDIV");
var kleurProfielDIV = document.getElementById("kleurProfielDIV");
var kleurRalProfielDIV = document.getElementById("kleurRalProfielDIV");
var typeClipsDIV = document.getElementById("typeClipsDIV");
var grootteClipsDIV = document.getElementById("grootteClipsDIV");


//states
var aantalstate = false;
var breedtestate = false;
var hoogtestate = false;
var diktestate = false;
var gaasstate = false;
var kleurstate = false;
var kleurralstate = false;
var clipsstate = false;
var grootteclipsstate = false;


function checkstate() {
    var allstates = true;
    console.log('all states')
    if (!aantalstate && winkelmand.aantal === 0) {
        allstates = false
        breedteInputDIV.style.display = "none"
    } else {
        breedteInputDIV.style.display = "block"
    }
    if (!breedtestate && winkelmand.breedte === 0) {
        allstates = false
        hoogteInputDIV.style.display = "none"
    } else {
        if(!breedtestate){
            hoogteInputDIV.style.display = "none"
        } else {

            hoogteInputDIV.style.display = "block"
        }
    }
    if (!hoogtestate && winkelmand.hoogte === 0) {
        allstates = false
        dikteProfielDIV.style.display = "none"
    } else {
        dikteProfielDIV.style.display = "block"
    }
    if (!diktestate && winkelmand.dikteprofiel === 0) {
        allstates = false
        typeGaasDIV.style.display = "none"
    } else {
        typeGaasDIV.style.display = "block"

    }
    if (!gaasstate && winkelmand.typegaas === "") {
        allstates = false
        kleurProfielDIV.style.display = "none"
    } else {
        kleurProfielDIV.style.display = "block"
    }
    if (!kleurstate && winkelmand.kleur === "") {
        console.log('kleur state', kleurstate)
        typeClipsDIV.style.display = "none"
        allstates = false
    } else {
        console.log('kleur state', kleurstate)
        if (winkelmand.kleur === "RAL") {
            kleurRalProfielDIV.style.display = "block"
            typeClipsDIV.style.display = "none"
            if (!kleurralstate) {
                allstates = false
                typeClipsDIV.style.display = "none"
            } else {
                typeClipsDIV.style.display = "block"

            }
        } else {
            typeClipsDIV.style.display = "block"
            kleurRalProfielDIV.style.display = "none"
        }
    }

    if (!clipsstate) {
        allstates = false
    } else {
        if (winkelmand.typeclips === "standaard") {
            grootteClipsDIV.style.display = "block"
            if (!grootteclipsstate) {
                allstates = false

            } 
        }else {
            grootteClipsDIV.style.display = "none"
        }


    }
    if (allstates) {
        buttonsDIV.style.display = "block";
    } else {
        buttonsDIV.style.display = "none";
    }
}






function changeAantal(value) {
    console.log('change aantal', value)
    if (value > 0 && value < 101) {
        winkelmand.aantal = value
        aantalstate = true
    } else {
        if (value <= 0) {
            aantalstate = false
            console.error('aantal waarde is te laag: ' + value)
        }
        if (value > 100) {
            aantalstate = false
            console.error('aantal waarde is te hoog: ' + value)
        }
    }
    checkstate()
}
window.changeAantal = changeAantal

function changeBreedte(value) {
    if (value > 50 && value < 1500) {
        winkelmand.breedte = value
        breedtestate = true
    } else if (value < 50) {
        breedtestate = false
        console.error('Breedte te klein')
    } else if (value > 1500) {
        breedtestate = false
        console.error('Breedte te groot')


    }
    checkstate()


}

window.changeBreedte = changeBreedte

function changeHoogte(value) {
    if (value > 50 && value < 2500) {
        winkelmand.breedte = value
        hoogtestate = true
    } else if (value < 50) {
        hoogtestate = false
        console.error('Breedte te klein')
    } else if (value > 2500) {
        hoogtestate = false
        console.error('Breedte te groot')


    }
    checkstate()


}
window.changeHoogte = changeHoogte


function changeDikteProfiel(value) {
    console.log('set dikte profiel', value)
    winkelmand.dikteprofiel = value
    diktestate = true
    checkstate()
}
//toevoegen aan window object
window.changeDikteProfiel = changeDikteProfiel;

function changeTypeGaas(value) {
    console.log('set dikte profiel', value)
    winkelmand.typegaas = value
    gaasstate = true
    loadProfielKleur()
    checkstate()
}

window.changeTypeGaas = changeTypeGaas;
async function loadProfielKleur() {
    kleurstate = false
    console.log('loadProfielKleur')
    const data = await goFetch('zoekKleuren')

    const DIV = document.getElementById('kleurProfielDIV')
    DIV.innerHTML = ""
    var radiobutton = document.createElement('div')
    radiobutton.className = 'form-check'

    var input = document.createElement('input')
    input.className = 'form-check-input'
    input.type = 'radio'
    input.name = 'profielkleur'


    var label = document.createElement('label')
    label.className = 'form-check-label'
    label.textContent = 'profielkleur'
    data.forEach(element => {
        let newInput = input.cloneNode(true)
        newInput.id = element.kleur
        newInput.for = element.kleur
        newInput.value = element.benaming
        let newLabel = label.cloneNode(true)
        newLabel.textContent = element.kleur
        newLabel.for = element.kleur

        console.log('newInput', newInput)
        const newRadiobuttons = radiobutton.cloneNode(true)
        newRadiobuttons.appendChild(newInput)
        newRadiobuttons.appendChild(newLabel)
        console.log('newRadiobuttons', newRadiobuttons)
        DIV.appendChild(newRadiobuttons)
        console.log('DIV', DIV)
        newInput.addEventListener('change', function () {
            profielKleurChange(this.value)
        })

    });

    var ralbutton = document.createElement('div')
    ralbutton.className = 'form-check'

    var ralinput = document.createElement('input')
    ralinput.className = 'form-check-input'
    ralinput.type = 'radio'
    ralinput.name = 'profielkleur'
    ralinput.id = 'RAL'
    ralinput.value = 'RAL'
    ralinput.addEventListener('change', function () {
        profielKleurChange(this.value)
    })


    var rallabel = document.createElement('label')
    rallabel.className = 'form-check-label'
    rallabel.textContent = 'profielkleur'
    rallabel.textContent = 'RAL'
    rallabel.for = 'RAL'
    ralbutton.appendChild(ralinput)
    ralbutton.appendChild(rallabel)
    DIV.appendChild(ralbutton)
    /**
     *  <div class="form-check">
                <input class="form-check-input" type="radio" name="dikteprofiel" value="16"
                    onchange="changeDikteProfiel(value)" id="dikteprofiel1" checked>
                <label class="form-check-label" for="dikteprofiel1">
                    Profiel 16 mm (Standaard profiel)
                </label>
            </div>
     */

    console.log('data', data)
}

function profielKleurChange(value) {
    console.log('profielKleurChange', value)
    winkelmand.kleur = value
    kleurstate = true
    checkstate()
    if (value === "RAL") {
        loadRalKleuren()
    } else {
        loadTypeClips()
    }
}


window.profielKleurChange = profielKleurChange

let ralkleuren = []
async function loadRalKleuren() {
    kleurralstate = false
    console.log('loadRalKleuren')
    const data = await goFetch('zoekRalKleuren')
    console.log('Data loadRalKleuren', data)
    data.forEach(element => {
        ralkleuren.push(element.alles)
        console.log('in foreach')
    })
    console.log('na foreach')
    addRalkleuren(ralkleuren)

}


// Functie om de dropdown te initialiseren of bij te werken
function addRalkleuren(ralkleur) {
    const DIV = document.getElementById('kleurRalProfielDIV');
    let dropdown = document.getElementById('profielRalKleurDropdown');
    
    // Als de dropdown niet bestaat, maak deze dan
    if (!dropdown) {
        dropdown = document.createElement('select');
        dropdown.id = 'profielRalKleurDropdown';
        dropdown.className = 'form-select';
        dropdown.name = 'profielRalKleur';

        dropdown.addEventListener('change', function () {
            kleurRalChange(this.value);
        });
    }

    // Leeg de bestaande opties
    dropdown.innerHTML = '';

    // Voeg een standaardoptie toe die gebruikers aanspoort om te kiezen
    var defaultOption = document.createElement('option');
    // defaultOption.textContent = "Kies een kleur...";
    // defaultOption.value = "";
    // dropdown.appendChild(defaultOption);

    // Voeg nieuwe opties toe op basis van de gefilterde kleuren
    ralkleur.forEach(element => {
        var option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        dropdown.appendChild(option);
    });
    DIV.appendChild(dropdown);
}

// Filterfunctie om te reageren op input
function filterRalkleuren(value) {
    console.log('filter gestart')
    const searchTokens = value.toLowerCase().split(' ').filter(token => token.trim() !== '');

    const newRalkleuren = ralkleuren.filter(element => {
        // Zet elk element om in lowercase en splits het in woorden (tokens)
        const elementTokens = element.toLowerCase().split(' ');
        // Controleer of elk zoektoken voorkomt in de element tokens
        return searchTokens.every(searchToken => 
            elementTokens.some(elementToken => elementToken.includes(searchToken))
        );
    });
    addRalkleuren(newRalkleuren);
}
window.filterRalkleuren = filterRalkleuren

// Zorg ervoor dat 'ralkleuren' een beschikbare array van kleuren is
// Bijvoorbeeld: let ralkleuren = ['RAL 9001 Crème wit', 'RAL 9005 Zwart'];


function kleurRalChange(value) {
console.log('kleurRAlChange', value)
winkelmand.kleurral = value
kleurralstate = true
checkstate()
loadTypeClips()

}

window.kleurRalChange = kleurRalChange

async function loadTypeClips() {

    const data = await goFetch('zoekTypeClips')
    console.log('data', data)
    var value = ""
    data.forEach((element,index) => {
        console.log('element', element)
        value += `
        <div class="form-check">
        <input class="form-check-input" type="radio" name="typeclips" value="${element.benaming}"
            onchange="typeClipsChange(value)" id="typeclips">
        <label class="form-check-label" for="typeclips${index}">
            ${element.omschrijving}
        </label>
    </div>
    `

    })
    console.log('typeClipsDIV', typeClipsDIV.innerHTML)
   typeClipsDIV.innerHTML = value


}

function typeClipsChange(value) {
console.log('typeClipsChange', value)
winkelmand.typeclips = value
clipsstate = true
if(value === "standaard"){
    loadGrootteClips()
} 
checkstate()

}
window.typeClipsChange = typeClipsChange

async function loadGrootteClips() {
    const data =await  goFetch('zoekGrootteClips')
    console.log('data', data)
    var value = ""
    data.forEach((element,index) => {
        console.log('element', element)
        value += `
        <div class="form-check">
        <input class="form-check-input" type="radio" name="grootteclips" value="${element.grootte}"
            onchange="grootteClipsChange(value)" id="grootteclips">
        <label class="form-check-label" for="grootteclips${index}">
            ${element.grootte}
        </label>
    </div>
    `

})
    console.log('grootteClipsDIV', typeClipsDIV.innerHTML)
    grootteClipsDIV.innerHTML = value

}

function grootteClipsChange(value) {
console.log('grootteClipsChange', value)
winkelmand.grootteclips = value
grootteclipsstate = true
checkstate()


}
window.grootteClipsChange = grootteClipsChange


async function goFetch(link, data = "") {
    try {
        return await fetch("/schuifvliegendeur/" + link, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: data,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                //console.log("gofetch DATA", data);
                return data;
            })
            .catch((error) => console.error(error));
    } catch (err) {
        console.error("Error" + link, err);
    } finally {


    }

}