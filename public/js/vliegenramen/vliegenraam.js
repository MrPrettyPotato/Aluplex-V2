/*
BENAMINGEN
*/
const _AFWERKING = "Afwerking"
const _PROFIELDIKTE = "Profiel dikte"
const _TYPEGAAS = "Type gaas"
const _PROFIELKLEUR = "Profiel kleur"
const _TYPECLIPS = "Type clips"
const _GROOTTECLIPS = "Grootte clips"


console.log('vliegenraam geladen')
let winkelmand = {
    type: "Vliegenraam",
    status: "winkelmand",
    uref: "",
    positie: "",
    klant: klant.bedrijf,
    klantID: klant.bedrijfID,
    aantal: 0,
    breedte: 0,
    hoogte: 0,
    afwerking: "",
    dikteprofiel: 0,
    typegaas: "",
    kleur: "",
    kleurral: "",
    typeclips: "",
    grootteclips: ""
}

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
var clickborstelDIV = document.getElementById("clickborstelDIV");
var clickborstelpositieDIV = document.getElementById("clickborstelpositieDIV");
var buttonsDIV = document.getElementById("addToCartBtnDIV");
var afwerkingDIV = document.getElementById("afwerkingDIV");

//states
var aantalstate = false;
var breedtestate = false;
var hoogtestate = false;
var afwerkingstate = false;
var diktestate = false;
var gaasstate = false;
var kleurstate = false;
var kleurralstate = false;
var clipsstate = false;
var grootteclipsstate = false;
var clickborstelstate = false;
var clickborstelpositiesstate = false;

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
        if (!breedtestate) {
            hoogteInputDIV.style.display = "none"
        } else {
            hoogteInputDIV.style.display = "block"
        }
    }
    if (!hoogtestate && winkelmand.hoogte === 0) {
        allstates = false
        afwerkingDIV.style.display = "none"
    } else {
        afwerkingDIV.style.display = "block"
    }
    if (!afwerkingstate && winkelmand.afwerking === "") {
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
        if (winkelmand.typeclips === "standaardclips") {
            grootteClipsDIV.style.display = "block"
            if (!grootteclipsstate) {
                allstates = false
            } else {}
        } else {
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
    if (value > 50 && value <= 1500) {
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

async function changeHoogte(value) {
    if (value > 50 && value <= 2500) {
        winkelmand.hoogte = value
        hoogtestate = true
    } else if (value < 50) {
        hoogtestate = false
        console.error('Breedte te klein')
    } else if (value > 2500) {

        hoogtestate = false
        console.error('Breedte te groot')
    }
    await zoekafwerking()
    checkstate()
}
window.changeHoogte = changeHoogte
async function zoekafwerking() {
    await fillElement('mugafwerking', 'afwerkingDIV', 'afwerking', changeAfwerking, _AFWERKING, false, winkelmand.afwerking)
}
async function changeAfwerking(value) {
    console.log('set afwerking', value)
    winkelmand.afwerking = value
    afwerkingstate = true
    await zoekType()
    checkstate()
}
async function zoekType() {
    await fillElement('mugtypes', 'dikteProfielDIV', 'dikteprofiel', changeDikteProfiel, _PROFIELDIKTE, false, winkelmand.dikteprofiel)
}
async function changeDikteProfiel(value) {
    console.log('set dikte profiel', value)
    winkelmand.dikteprofiel = value
    diktestate = true
    await zoekTypegaas()
    checkstate()
}
//toevoegen aan window object
window.changeDikteProfiel = changeDikteProfiel;

async function zoekTypegaas() {
    await fillElement('mugtypegaas', 'typeGaasDIV', 'typegaas', changeTypeGaas, _TYPEGAAS, false, winkelmand.typegaas)
}

function changeTypeGaas(value) {
    console.log('set dikte profiel', value)
    winkelmand.typegaas = value
    gaasstate = true
    loadProfielKleur()
    checkstate()
}


window.changeTypeGaas = changeTypeGaas;
async function loadProfielKleur() {
    await fillElement('zoekKleuren', 'kleurProfielDIV', 'profielkleur', profielKleurChange, _PROFIELKLEUR, true, winkelmand.kleur)

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

function kleurRalChange(value) {
    console.log('kleurRAlChange', value)
    winkelmand.kleurral = value
    kleurralstate = true
    checkstate()
    loadTypeClips()
}
window.kleurRalChange = kleurRalChange
async function loadTypeClips() {
    await fillElement('zoekTypeClips', 'typeClipsDIV', 'typeclips', typeClipsChange, _TYPECLIPS, false, winkelmand.typeclips)
    console.log('loadTypeClips element data', typeClipsDIV)
}

function typeClipsChange(value) {
    console.log('typeClipsChange', value)
    winkelmand.typeclips = value
    clipsstate = true
    if (value === "standaardclips") {
        loadGrootteClips()
    }
    checkstate()
}
window.typeClipsChange = typeClipsChange

async function loadGrootteClips() {
    await fillElement('zoekGrootteClips', 'grootteClipsDIV', 'grootteclips', grootteClipsChange, _GROOTTECLIPS, false, winkelmand.grootteclips)
}

function grootteClipsChange(value) {
    console.log('grootteClipsChange', value)
    winkelmand.grootteclips = value
    grootteclipsstate = true
    checkstate()
}

//parameter documentation
/**
 * 
 * @param {string} database - is het de id van de database
 * @param {string} container - is het de id van de container
 * @param {string} benaming - is het de benaming van de elementen
 * @param {function} callback - functie die wordt aangeroepen bij de change
 */

async function fillElement(database, container, benaming, callback, title, RAL = false, winkelmandData = null) {
    const data = await goFetch(database)
    const _title = title
    const DIV = document.getElementById(container)
    DIV.innerHTML = ""
    var radiobutton = document.createElement('div')
    radiobutton.className = 'form-check'

    var titlelabel = document.createElement('label')
    titlelabel.className = 'form-check-label'
    titlelabel.textContent = _title
    //bold and underlined
    // titlelabel.style = 'font-color: red'
    titlelabel.style = 'font-weight: bold ; text-decoration: underline; color: #000080'
    // titlelabel.style = 'font-weight: bold '

    var input = document.createElement('input')
    input.className = 'form-check-input'
    input.type = 'radio'
    input.name = benaming


    var label = document.createElement('label')
    label.className = 'form-check-label'
    label.textContent = benaming
    label.style = 'color: #000080'
    DIV.appendChild(titlelabel)
    data.forEach(element => {
        var _elementOmschrijving;
        if(element.aecode){
            _elementOmschrijving = "RAL "+ element.ral+ " - " + element.omschrijving  + " - " +element.aecode
        } else {
            _elementOmschrijving = element.omschrijving
        }
        let newInput = input.cloneNode(true)
        newInput.id = element.benaming
        newInput.value = element.benaming
        newInput.checked = winkelmandData === element.benaming;

        let newLabel = label.cloneNode(true)
        newLabel.textContent = _elementOmschrijving
        newLabel.htmlFor = element.benaming

        console.log('newInput', newInput)
        const newRadiobuttons = radiobutton.cloneNode(true)
        newRadiobuttons.appendChild(newInput)
        newRadiobuttons.appendChild(newLabel)
        console.log('newRadiobuttons', newRadiobuttons)
        DIV.appendChild(newRadiobuttons)
        console.log('DIV', DIV)
        newInput.addEventListener('change', function () {
            callback(this.value)
        })

    });
    if (RAL) {
        var ralbutton = document.createElement('div')
        ralbutton.className = 'form-check'

        var ralinput = document.createElement('input')
        ralinput.className = 'form-check-input'
        ralinput.type = 'radio'
        ralinput.name = benaming
        ralinput.id = 'RAL'
        ralinput.value = 'RAL'
        ralinput.addEventListener('change', function () {
            callback(this.value)
        })


        var rallabel = document.createElement('label')
        rallabel.className = 'form-check-label'
        rallabel.textContent = benaming
        rallabel.textContent = 'RAL naar keuze'
        rallabel.for = 'RAL'
        rallabel.style = "color: #000080"
        ralbutton.appendChild(ralinput)
        ralbutton.appendChild(rallabel)
        DIV.appendChild(ralbutton)
    }
}

async function goFetch(link, data = "") {
    try {
        return await fetch("/vliegenraam/" + link, {
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

async function addAndStay() {
    try {
        goFetch("addtocart", winkelmand)
            .then((data) => {
                console.log("Toevoegen aan winkelmand en naar winkelmand", winkelmand)
                console.log("returned data", data)
                alert("Toevoegen aan winkelmand gelukt")
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            })
            .catch((err) => {
                alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen")
            })
    } catch (err) {
        console.error("error", err)
    }

}
window.addAndStay = addAndStay

async function addAndGo() {
    try {
        goFetch("addtocart", winkelmand)
            .then((data) => {
                console.log("Toevoegen aan winkelmand en naar winkelmand", winkelmand)
                console.log("returned data", data)
                alert("Toevoegen aan winkelmand gelukt")
                window.location.href = "/cart"
            })
            .catch((err) => {
                alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen")
            })
    } catch (err) {
        console.error("error", err)
    }
}
window.addAndGo = addAndGo