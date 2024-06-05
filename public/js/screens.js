console.log('screens.js is geladen');
const KAST1 = 89;
const KAST2 = 103;
const KAST3 = 131;
const KASTSOLAR = 150;
const KASTBREEDTE1 = 2000;
const KASTBREEDTE2 = 4500;
const KASTBREEDTE3 = 6000;
const KASTHOOGTE1 = 2400;
const KASTHOOGTE2 = 3200;
const KASTHOOGTE3 = 6000;

const globalLogs = true;
const checkStatelog = true;



function log(data, logs) {
    if (globalLogs) {
        if (logs) {
            console.log(data)
        }
    }
}


//Verkrijg alle HTML elementen van de pagina screens.ejs.
var positieDIV = document.getElementById("positieDIV")
var aantalDIV = document.getElementById("aantalDIV")
var breedteInputDIV = document.getElementById("breedteInputDIV")
var hoogteInputDIV = document.getElementById("hoogteInputDIV")
var typeafwerkingDIV = document.getElementById("typeafwerkingDIV")
var typeAfwerkingdag = document.getElementById("typeAfwerkingdag")
var bedieningskantDIV = document.getElementById("bedieningskantDIV")
var typebedieningDIV = document.getElementById("typebedieningDIV")
var bedieningDIV = document.getElementById("bedieningDIV")
var typedoekDIV = document.getElementById("typedoekDIV")
var doekDIV = document.getElementById("doekDIV")
var kleurkastDIV = document.getElementById("kleurkastDIV")
var kleurkastralDIV = document.getElementById("kleurkastralDIV")
var addToCartBtnDIV = document.getElementById("addToCartBtnDIV")

//states om te checken

var positieState = false;
var aantalState = false;
var breedteState = false;
var hoogteState = false;
var typeafwerkingState = false;
var typeafwerkingdagstate = false;
var bedieningskantState = false;
var typebedieningState = false;
var bedieningState = false;
var typedoekState = false;
var doekState = false;
var confectieState = false;
var kleurkastState = false;
var kleurkastralState = false;
var zenderState = false;
var schakelaarState = false;
var ralcheckedState = false;

//globale variables
var zendersData = []



let winkelmand = {
    type : "Screen",
    status:"winkelmand",
    klant: klant.bedrijf,
    klantID: klant.bedrijfID,
    positie: "",
    aantal: null,
    breedte: null,
    afgbreedte: null,
    hoogte: null,
    afghoogte: null,
    kastgrootte: null,
    typeafwerking: null,
    typeafwerkingdagdata: null,
    bedieningskant: null,
    typebediening: null,
    typedoek: null,
    doek: null,
    confectie: null,
    kleurkast: null,
    kleurkastral: null,
    zenders: null,
    schakelaar: null

}

//Functie om te zien of de winkelmand is gevuld.
//Indien kleurkast gelijk is aan "RAL"
//dan moet kleurkastral gevuld zijn, anders mag deze leeg blijven.
// document.addEventListener('click', function(event) {
//     // Voer je functie hier uit
//     console.log('Er is ergens op de pagina geklikt!');
//     // Je kunt ook informatie over het event gebruiken, zoals waar er geklikt is
//     console.log('Kliklocatie:', event.clientX, event.clientY);

async function checkState() {

    console.log('checkState', winkelmand)
    const allVisible = await checkScreen(
        winkelmand.breedte,
        winkelmand.hoogte,
        winkelmand.typeafwerking,
        winkelmand.typebediening
    );
    // console.log('waarde allVisible', allVisible)
    

    // log(('aantalState : ' + aantalState), checkStatelog)
    breedteInputDIV.style.display = aantalState ? 'block' : 'none';

    // log(('breedteState : ' + breedteState), checkStatelog)
    hoogteInputDIV.style.display = breedteState ? 'block' : 'none';



    if(typeafwerkingDIV){
        if (hoogteState && breedteState) {
          typeafwerkingDIV.style.display = "block";
        } else {
          typeafwerkingDIV.style.display = "none";
        }
      }
      //max breedte zoeken of ingeven
      if (typeAfwerkingdag) {
        console.log('in typeafwerkingdag',typeafwerkingState,winkelmand.typeafwerking);
        if (typeafwerkingState && winkelmand.typeafwerking === "dag") {
          console.log('weergeven',typeafwerkingState,winkelmand.typeafwerking);
          typeAfwerkingdag.style.display = "block";
          typebedieningDIV.style.display = "none";
        } else {
          console.log('Nietweergeven',typeafwerkingState,winkelmand.typeafwerking);
          if(typeafwerkingState && winkelmand.typeafwerking === "af"){
            typebedieningDIV.style.display = "block";
            typeAfwerkingdag.style.display = "none";
            typeafwerkingdagstate = true
          } else {
            typeafwerkingdagstate = false;
            typebedieningDIV.style.display = "none";
          }
          
        }
      }


   
    log(('typeafwerkingdagState : ' + typeafwerkingdagstate), checkStatelog)
    typebedieningDIV.style.display = typeafwerkingdagstate ? 'block' : 'none';

    // log(('typebedieningState : ' + typebedieningState), checkStatelog)
    bedieningDIV.style.display = typebedieningState ? 'block' : 'none';

    // log(('zenderState || schakelaarState : ' + zenderState || schakelaarState), checkStatelog)
    
    bedieningskantDIV.style.display = zenderState || schakelaarState ? 'block' : 'none';
    // log(('bedieningskantState : ' + bedieningskantState), checkStatelog)
    typedoekDIV.style.display = bedieningskantState ? 'block' : 'none';
    // log(('typedoekState : ' + typedoekState), checkStatelog)
    doekDIV.style.display = typedoekState ? 'block' : 'none';
    // log(('doekState : ' + doekState), checkStatelog)
    confectieDIV.style.display = doekState ? 'block' : 'none';
    // log(('confecteState : ' + confectieState), checkStatelog)
    kleurkastDIV.style.display = confectieState ? 'block' : 'none';
    // log(('kleurkastState : ' + kleurkastState), checkStatelog)
    kleurkastralDIV.style.display = kleurkastState && winkelmand.kleurkast === 'RAL' ? 'block' : 'none';
    // log(('kleurkastralState : ' + kleurkastralState), checkStatelog)
    // log(('Allvisible : ' + allVisible), checkStatelog)




    if (aantalState &&
        breedteState &&
        hoogteState &&
        typeafwerkingState &&
        typeafwerkingdagstate &&
        bedieningskantState &&
        typebedieningState &&
        (zenderState || schakelaarState) &&
        typedoekState &&
        doekState &&
        confectieState &&
        kleurkastState && allVisible) {
            if(winkelmand.kleurkast === "RAL"){
                if(kleurkastralState){
                    addToCartBtnDIV.style.display = 'block';
                    log(("winkelmand data : " + winkelmand), checkStatelog)
                } else {
                    addToCartBtnDIV.style.display = 'none';
                }
            } else {
                addToCartBtnDIV.style.display = 'block';
            }
    } else {
        addToCartBtnDIV.style.display = 'none';
    }

}

/**
 * Check if the given screen is available
 * @param {number} breedte - screen width
 * @param {number} hoogte - screen height
 * @param {string} afwerking - screen finishing
 * @param {string} typebediening - screen control type
 * @returns {boolean} - true if the screen is available
 */
async function checkScreen(breedte, hoogte, afwerking, typebediening) { //winkelmand.afgbreedte,winkelmand.afghoogte,winkemand.afwerking,winkelmand.typebediening
    log("checkcsreen: START breedte", breedte, "hoogte", hoogte, "afwerking", afwerking, "typebediening", typebediening, checkStatelog)
    // check if all parameters are filled
    if (!breedte || !hoogte || !afwerking || !typebediening) {
        console.error('CHECKSCREEN: een van de velden is leeg')
        console.log("checkcsreen: END")
        return false
    }
    console.log("checkcsreen: END breedte,hoogte,afwerking,typebediening OK")
    // get the available screen sizes
    const _afmetingen = await checkAfmetingen(Number(breedte), Number(hoogte), winkelmand.typeafwerking, typebediening)
    console.log('Afmetingen checkscreen', _afmetingen)
    // get the price for the available screen sizes
    const _data = await goFetch('/screenprijs', {
        afmetingen: _afmetingen,
        typebediening: typebediening
    })
    //const _data = [{prijs: 0, afmetingen: _afmetingen}]
    console.log('screenprijs', _data)
    // check if there is a price for the available screen sizes
    if (_data.length > 0) {
        winkelmand.kastgrootte = _afmetingen.kastgrootte
        winkelmand.afgbreedte = _afmetingen.afgbreedte
        winkelmand.afghoogte = _afmetingen.afghoogte
        winkelmand.zoekbreedte = _afmetingen.zoekbreedte
        winkelmand.zoekhoogte = _afmetingen.zoekhoogte
        console.log('CHECKSCREEN: Prijs ' + _data[0].prijs)
        console.log("checkcsreen: END")
        return true;

    } else {
        console.error('CHECKSCREEN: error ' + _data[0])
       // show error message that the screen is not available
        console.log("checkcsreen: END")
        return false;
    }

}

function afrondenAfmeting(afmeting, kastgrootte, type) {
    console.log('AFRONDEN: afmeting:', afmeting, "kastgrootte", kastgrootte, "type", type)
    if (afmeting < 1000) {
        return 1000
    }
    if (type === "hoogte") {
        if (kastgrootte === 89 || kastgrootte === 103 || kastgrootte === 150) {
            return Math.ceil(afmeting / 100) * 100;
        } else if (kastgrootte === 131) {
            return Math.ceil(afmeting / 200) * 200;
        } else {
            console.log('False returned from afrondenAfmeting')
            return false;
        }
    } else if (type === "breedte") {
        return Math.ceil(afmeting / 200) * 200;
    }




}

async function checkAfmetingen(breedte, hoogte, afwerking, typebediening) {
    console.log('typeafwerking', afwerking)

    var nieuweHoogte;
    var kastgrootte;
    var _afgbreedte;
    var _afghoogte;

    //zoek naar afwerkingdata waar benaming gelijk is aan afwerking.
    // const _afwerkingData = await goFetch('/zoekafmetingafwerkingData', afwerking)
    const _afwerkingData = afwerking


    var _afwerkingBreedte = 0
    var _afgbreedte = breedte
    var _afwerkingHoogte = 0
    var _afghoogte = hoogte
    var count = 0
    var omschrijvingBreedte = ""
    var omschrijvingHoogte = ""
    var omschrijving = ""
    if(afwerking === "dag"){

    
    console.log('_afwerkingdata', _afwerkingData)
    if(winkelmand.typeafwerkingdagdata && JSON.parse(winkelmand.typeafwerkingdagdata).afwerkingdag.length > 0){
      const _afwerkingDagData = JSON.parse(winkelmand.typeafwerkingdagdata).afwerkingdag
      for (const [index, data] of _afwerkingDagData.entries()){
        console.log('afwerkingdag Data = ' + data)
        if(data.breedte){
          count ++
          console.log('Breedte = ' + data.screenbreedte)
          _afwerkingBreedte += data.screenbreedte
        } else {
          console.log('Hoogte = ' + data.hoogte)
          _afwerkingHoogte = data.hoogte
        }
      }
      if(count === 0){
        omschrijvingBreedte = "Afgewerkte breedte"
      }  else if (count === 1){
        omschrijvingBreedte = "Breedte + 1 geleider"

      } else if (count === 2){
        
        omschrijvingBreedte = "Breedte + 2 Geleiders"
      }
      if(_afwerkingHoogte === 0){
        omschrijvingHoogte = " - Afgewerkte hoogte"
      } else if (_afwerkingHoogte === "kast"){
        omschrijvingHoogte = " + kast"
      }
      omschrijving = omschrijvingBreedte + omschrijvingHoogte
    } else {
      omschrijving = "Afgewerkte breedte + Afgewerkte hoogte"
    }
    } else {

    }


winkelmand.typeafwerkingOmschrijving = omschrijving

    console.log('afwerkingdata', _afwerkingData)
    _afgbreedte = breedte + _afwerkingBreedte
    var _tijdelijkeBreedte = afrondenAfmeting(breedte + Number(_afwerkingBreedte), 0, "breedte")
    if (_tijdelijkeBreedte > 6000) {
        console.log('_tijdelijke breedte te hoog', _tijdelijkeBreedte)

        return false;
    }

    if (_afwerkingHoogte === "kast") {

        if (typebediening === "somfyiosolar") {

            nieuweHoogte = afrondenAfmeting((hoogte + KASTSOLAR), KASTSOLAR, "hoogte")
            _afghoogte = hoogte + KASTSOLAR
            kastgrootte = KASTSOLAR
        } else {
            const _tijdelijkeHoogte1 = afrondenAfmeting((hoogte + KAST1), KAST1, "hoogte")
            const _tijdelijkeHoogte2 = afrondenAfmeting((hoogte + KAST2), KAST2, "hoogte")
            const _tijdelijkeHoogte3 = afrondenAfmeting((hoogte + KAST3), KAST3, "hoogte")
            if (_tijdelijkeHoogte1 <= KASTHOOGTE1 && _tijdelijkeBreedte <= KASTBREEDTE1) {
                nieuweHoogte = _tijdelijkeHoogte1
                _afghoogte = hoogte + KAST1
                kastgrootte = KAST1
            } else if (_tijdelijkeHoogte2 <= KASTHOOGTE2 && _tijdelijkeBreedte <= KASTBREEDTE2) {
                nieuweHoogte = _tijdelijkeHoogte2
                _afghoogte = hoogte + KAST2
                kastgrootte = KAST2
            } else if (_tijdelijkeHoogte3 <= KASTHOOGTE3 && _tijdelijkeBreedte <= KASTBREEDTE3) {
                nieuweHoogte = _tijdelijkeHoogte3
                _afghoogte = hoogte + KAST3
                kastgrootte = KAST3
            } else {
                return false;
            }

        }

    } else {
        _afghoogte = hoogte
        if(typebediening === "somfyiosolar"){
            kastgrootte = KASTSOLAR
            nieuweHoogte = afrondenAfmeting(hoogte, KASTSOLAR, "hoogte")
        } else {
            if (afrondenAfmeting(hoogte, KAST1, "hoogte") <= KASTHOOGTE1 && afrondenAfmeting(_tijdelijkeBreedte, 0, "breedte") <= KASTBREEDTE1) {
                kastgrootte = KAST1
                nieuweHoogte = afrondenAfmeting(hoogte, KAST1, "hoogte")
            } else if (afrondenAfmeting(hoogte, KAST2, "hoogte") <= KASTHOOGTE2 && afrondenAfmeting(_tijdelijkeBreedte, 0, "breedte") <= KASTBREEDTE2) {
                kastgrootte = KAST2
                nieuweHoogte = afrondenAfmeting(hoogte, KAST2, "hoogte")
            } else if (afrondenAfmeting(hoogte, KAST3, "hoogte") <= KASTHOOGTE3 && afrondenAfmeting(_tijdelijkeBreedte, 0, "breedte") <= KASTBREEDTE3) {
                kastgrootte = KAST3
                nieuweHoogte = afrondenAfmeting(hoogte, KAST3, "hoogte")
            } else {
                return false;
            }
        }

       
    }


    return {
        afgbreedte: _afgbreedte,
        afghoogte: _afghoogte,
        zoekbreedte:_tijdelijkeBreedte,
        zoekhoogte: nieuweHoogte,
        kastgrootte: kastgrootte
    }

    //bekijk de data van afwerking en voeg de breedte bij de breedte.

    //Indien afwerkingdata.hoogte === "kast"
    //zoek de kast

    //anders
    //hou de breedte zoals ze is.


}

//vul de DIV's met de juiste data
function toevoegenaanDIV(elementData, type, img) {
    console.log('elementData', elementData)
    //value word de html waarde die word terug gegeven en toegevoegd aan de DIV.

    var value = ""
    //title word de "header" van de div gegeven.
    var title = ""
    //winkelData is de data die uit de winkelmand komt.
    // Dit word achteraf gebruikt om te zien of de winkelmand data als is ingevuld of niet.
    var winkelData = ""
    if (type === "aantal") {
        title = "Aantal"
        winkelData = winkelmand.aantal
    }
    if (type === "breedte") {
        title = "Breedte"
        winkelData = winkelmand.breedte
    }
    if (type === "hoogte") {
        title = "Hoogte"
        winkelData = winkelmand.hoogte
    }
    if (type === "typeafwerking") {
        title = "Type afwerking"
        winkelData = winkelmand.typeafwerking
    }
    if (type === "bedieningskant") {
        title = "Bedieningskant"
        winkelData = winkelmand.bedieningskant
    }
    if (type === "typebediening") {
        title = "Type bediening"
        winkelData = winkelmand.typebediening
    }
    if (type === "schakelaar") {
        title = "Schakelaar"
        winkelData = winkelmand.schakelaar
    }
    if (type === "somfyio" || type === "somfyiosolar") {
        title = "Zenders"
        winkelData = winkelmand.zenders
    }
    if (type === "typedoek") {
        title = "Type doek"
        winkelData = winkelmand.typedoek
    }
    if (type === "doek") {
        title = "Doek"
        winkelData = winkelmand.doek
    }
    if (type === "confectie") {
        title = "Confectie"
        winkelData = winkelmand.confectie
    }
    if (type === "kleurkast") {
        title = "Kleur kast"
        winkelData = winkelmand.kleurkast
    }
    if (type === "kleurkastral") {
        title = "Kleur kastraal"
        winkelData = winkelmand.kleurkastral
    }
    if(type === "screenkleurkast") {
        title = "Kleur kast"
        winkelData = winkelmand.kleurkast
    }
    //label voor bovenaan
    value += `<div class="form-group">
<span style="font-weight: bold;">${title}</span>
</div>`;


    //indien type gelijk is aan ... dan word het een invoerveld met nummer
    //voeg ook een onChange toe vb: onchange=${type + "onChange(value"}"
    if (type === "breedte" || type === "hoogte") {
        value += `<div class="form-group">
        <input type="number" onchange=${type + "OnChange(value"} class="form-control" id="${type}" placeholder="${type}">
        </div>`;

    }


    //indien type gelijk is aan ... dan word het een radiobutton veld.
    if (type === "typeafwerking" || type === "bedieningskant" || type === "typebediening" || type === "schakelaar" || type === "typedoek" || type === "confectie") {
        elementData.forEach(element => {
            value += `<div class="form-check">
    <input class="form-check-input" type="radio" value="${
      element.benaming
    }" name=${type} onchange="${type + "onChange(value)"}" ${
element.benaming === winkelData ? "checked" : ""
}>
    <label class="form-check-label" for="flexRadioDefault1" style="margin-left:30px">
    `;
            if (img) {
                value += `<a data-fancybox="gallery" href="/img/rolluiken/${element.img}">
      <img class="fancybox" src="/img/screens/${element.img}" alt="${element.benaming} Image" style="max-width: 100px; max-height: 100px; margin-right: 10px; margin-bottom: 10px;">
      </a>`;
            }

            value += `
      ${element.omschrijving}
    </label>
  </div>`;

        });

    } else if (type === "afwerkingdag"){
        value = `<div class="form-group">
        <span style="font-weight: bold;">Afwerking opties</span>
      </div>`;
        elementData.forEach((element,index)=>{
          value += ` <div class="form-check" name="typeafwerkingdag2">
          <input class="form-check-input" type="checkbox" value="${element.benaming}" name="typeafwerkingdag"
          onchange="afwerkingdagChange(value)" id="${element.benaming}">
      <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
          ${element.omschrijving}
      </label></div>`
        })
        
        
      } else if (type === "somfyio" || type === "somfyiosolar") {
        elementData.forEach((element, index) => {
            if (index === 0) {
                value = `<div class="form-group">
            <span style="font-weight: bold;">Zenders</span>
          </div>`;

                value =
                    value +
                    `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="geen" onchange="zendergeen(this.checked)" name="zenders" id="geen"" ${
              "geen" === winkelmand.zenders ? "checked" : ""
            }>
            
               
            <label class="form-check-label" for="flexRadioDefault1" style="margin-left:30px">
             Geen
            </label>
            </div>
            `;
            }
            //console.log("_value vullen met de juiste html data");
            // Voeg checkbox en tekstvak toe
            value =
                value +
                `<div class="form-check" style="margin-top: 10px">
          <input class="form-check-input" type="checkbox" value="${
            element.benaming
          }" onchange="handleCheckboxChange('${
                element.benaming
              }',this.checked)" name="zenders" id="${element.benaming}" ${
                element.benaming === winkelmand.zenders ? "checked" : ""
              }>
         
          <label class="form-check-label" for="${
            element.benaming
          }" style="margin-left:30px; display: block;">
            ${element.omschrijving}
          </label>
        
          <!-- Voeg een div toe voor het tekstvak -->
          <label style="margin-left: 30px; display: none;" id="aantalTekst_${
            element.benaming
          }" name="aantalTekst">Aantal: </label>
           <input type="number" class="form-check-input" id="aantalTekstvak_${
             element.benaming
           }" name="aantalTekstvak" onchange="zenderaantalonChange(value,'${
                element.benaming
              }')" placeholder="Aantal" value=0 style="margin: 0px 0px 0px 30px; ${
                element.benaming === winkelmand.zenders
                  ? "display: inline-block;"
                  : "display: none;"
              }">
         
        </div>`;
        });
    } else if (type === "kleurkast") {

        var _value = `<div class="form-group">
        <span style="font-weight: bold;">${title}</span>
      </div>`;

        elementData.forEach((element, index) => {
            if (element.kleur === "Wit" || element.kleur === "Beige") {
                //console.log("achtergrondkleur", element.RGB);
                value += `<div class="form-check">
              <input class="form-check-input" type="radio" value="${
                element.kleur
              }"  onchange="${type + "Change(value)"}" name=${type} id=${
              element.kleur
            } ${element.kleur === winkelmand.kleurlamel ? "checked" : ""}>
              <label class="form-check-label" for=${element.kleur}>
                <span style="background-color: ${
                  element.RGB
                }; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
                ${element.kleur}  
              </label>
            </div>`;
            } else {
                //console.log("achtergrondkleur", element.RGB);
                value += `<div class="form-check">
            <input class="form-check-input" type="radio" value="${
              element.kleur
            }"  onchange="${type + "Change(value)"}" name=${type} id=${
              element.kleur
            } ${element.kleur === winkelmand.kleurlamel ? "checked" : ""}>
            <label class="form-check-label" for=${element.kleur}>
              <span style="background-color: ${
                element.RGB
              }; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
              ${element.kleur + " - " + element.RAL}  
            </label>
          </div>`;
            }

        });
        if (type === "kleurkast") {
            value += `
      <div class="form-check">
        <input class="form-check-input" type="radio" value="RAL" onchange="${
          type + "Change(value)"
        }" name=${type} id="RAL" ${"RAL" === winkelmand.kleurkast ? "checked" : ""}>
        <label class="form-check-label" for="RAL">
          <span class="multiColorConic"></span>
          RAL
        </label>
          </div>`;
        }

    } else if (type === "screenkleurkast") {

        var _value = `<div class="form-group">
        <span style="font-weight: bold;">${title}</span>
      </div>`;

        elementData.forEach((element, index) => {
          
                //console.log("achtergrondkleur", element.RGB);
                value += `<div class="form-check">
            <input class="form-check-input" type="radio" value="${
              element.aecode
            }"  onchange="${type + "Change(value)"}" name=${type} id=${
              element.aecode
            } ${element.aecode === winkelmand.kleurkast ? "checked" : ""}>
            <label class="form-check-label" for=${element.aecode}>
              <span style="background-color: ${
                element.RGB
              }; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
              ${element.kleur + " - " + element.RAL + ' - ' + element.uitvoering + ' - ' + element.aecode}  
            </label>
          </div>`;
            

        });
        if (type === "screenkleurkast") {
            value += `
      <div class="form-check">
        <input class="form-check-input" type="radio" value="RAL" onchange="${
          type + "Change(value)"
        }" name=${type} id="RAL" ${"RAL" === winkelmand.kleurkast ? "checked" : ""}>
        <label class="form-check-label" for="RAL">
          <span class="multiColorConic"></span>
          RAL
        </label>
          </div>`;
        }

    } else if (type === "doek") {
        console.log('toevoegenaanDIV doek')
        doekDIV.style.display = "flex";
        doekDIV.style.flexDirection = "column";
        // Stel dat je een container div hebt met de ID 'dropdownContainer'
        // Als deze niet bestaat, moet je die eerst maken of een bestaande container gebruiken

        // Maak het invoerveld
        let filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.id = "filterInput";
        filterInput.className = "form-control";
        filterInput.placeholder = "Type om te filteren...";
        filterInput.oninput = filterOptions; // Functie die later wordt gedefinieerd
        filterInput.style.width = "100%";

        // Maak de dropdown
        let dropdownSelect = document.createElement("select");
        dropdownSelect.id = "dropdownSelect";
        dropdownSelect.className = "form-select";
        dropdownSelect.name = type; // Zorg dat de variabele 'type' correct is ingesteld
        dropdownSelect.onchange = updateInputValue; // Functie die later wordt gedefinieerd
        doekDIV.innerHTML = "";
        dropdownSelect.style.width = "100%";

        // Maak het afbeeldingselement
        let dropdownImage = document.createElement("img");
        dropdownImage.id = "dropdownImage";
        dropdownImage.className = "dropdown-image-class"; // Voeg een klasse toe voor eventuele CSS-styling
        dropdownImage.src = ""; // Start met een lege bron of een standaardafbeelding
        dropdownImage.alt = "Geselecteerde doek afbeelding";
        doekDIV.appendChild(dropdownImage);

        // Voeg zowel het invoerveld als de dropdown toe aan de container
        doekDIV.appendChild(filterInput);
        doekDIV.appendChild(dropdownSelect);
        doekDIV.appendChild(dropdownImage);

        // Functies zoals eerder beschreven
        function initializeDropdown() {
            let dropdownHtml = elementData
                .map(
                    (element) =>
                    `<option value="${element.benaming}" ${
              element.benaming === winkelmand.doek ? "selected" : ""
            }>${element.omschrijving}</option>`
                )
                .join("");

            dropdownSelect.innerHTML = dropdownHtml;
        }

        function filterOptions() {
            const input = filterInput.value.toLowerCase();
            // Splits de invoer op niet-alfanumerieke karakters om meerdere zoektermen te ondersteunen
            const searchTerms = input.split(/\W+/).filter((term) => term.length > 0);

            const filteredOptions = elementData
                .filter((element) => {
                    // Zet de element waarde om naar lowercase voor de vergelijking
                    const elementValueLower = element.omschrijving.toLowerCase();
                    // Controleer of alle zoektermen in de element waarde voorkomen
                    return searchTerms.every((term) => elementValueLower.includes(term));
                })
                .map(
                    (element) =>
                    `<option value="${element.benaming}" ${
              element.benaming === winkelmand.doek ? "selected" : ""
            }>${element.omschrijving}</option>`
                )
                .join("");

            dropdownSelect.innerHTML = filteredOptions;
        }
        (window).filterOptions = filterOptions;

        async function updateInputValue() {
            filterInput.value = dropdownSelect.value;
            // Zoek de bijbehorende 'img' waarde in 'elementData'
            const selectedElement = elementData.find(element => element.benaming === dropdownSelect.value);
            if (selectedElement && selectedElement.img) {
                // Update de bron van de afbeelding
                dropdownImage.src = selectedElement.img;
            } else {
                // Optioneel: zet een standaardafbeelding als geen overeenkomst gevonden is
                dropdownImage.src = "pad-naar-standaardafbeelding.jpg";
            }

            // Bestaande logica
            doekState = true;
            winkelmand.doek = dropdownSelect.value;
            checkState();
            const newData = [{
                benaming: "Confectie 1 (Standaard)",
                omschrijving: "Confectie 1 (Standaard)"
            }, {
                benaming: "Confectie 2 (Kast naar binnen)",
                omschrijving: "Confectie 2 (Kast naar binnen)"
            }]

            confectieDIV.innerHTML = toevoegenaanDIV(newData, 'confectie', false)
        }

        (window).updateInputValue = updateInputValue;
        // Roep initializeDropdown aan om de dropdown te vullen bij het laden
        initializeDropdown();
    } else if (type === "RAL") {
        // Stel dat je een container div hebt met de ID 'dropdownContainer'
        // Als deze niet bestaat, moet je die eerst maken of een bestaande container gebruiken

        // Maak het invoerveld
        let filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.id = "filterInput";
        filterInput.className = "form-control";
        filterInput.placeholder = "Type om te filteren...";
        filterInput.oninput = filterOptions; // Functie die later wordt gedefinieerd

        // Maak de dropdown
        let dropdownSelect = document.createElement("select");
        dropdownSelect.id = "dropdownSelect";
        dropdownSelect.className = "form-select";
        dropdownSelect.name = type; // Zorg dat de variabele 'type' correct is ingesteld
        dropdownSelect.onclick = updateInputValue; // Functie die later wordt gedefinieerd
        kleurkastralDIV.innerHTML = "";
        // Voeg zowel het invoerveld als de dropdown toe aan de container
        kleurkastralDIV.appendChild(filterInput);
        kleurkastralDIV.appendChild(dropdownSelect);

        // Functies zoals eerder beschreven
        function initializeDropdown() {
            let dropdownHtml = elementData
                .map(
                    (element) =>
                    `<option value="${element.alles}" ${
                  element.alles === winkelmand.kleurkastral ? "selected" : ""
                }>${element.alles}</option>`
                )
                .join("");

            dropdownSelect.innerHTML = dropdownHtml;
        }

        function filterOptions() {
            const input = filterInput.value.toLowerCase();
            // Splits de invoer op niet-alfanumerieke karakters om meerdere zoektermen te ondersteunen
            const searchTerms = input.split(/\W+/).filter((term) => term.length > 0);

            const filteredOptions = elementData
                .filter((element) => {
                    // Zet de element waarde om naar lowercase voor de vergelijking
                    const elementValueLower = element.alles.toLowerCase();
                    // Controleer of alle zoektermen in de element waarde voorkomen
                    return searchTerms.every((term) => elementValueLower.includes(term));
                })
                .map(
                    (element) =>
                    `<option value="${element.alles}" ${
                  element.alles === winkelmand.kleurkastral ? "selected" : ""
                }>${element.alles}</option>`
                )
                .join("");

            dropdownSelect.innerHTML = filteredOptions;
        }
        (window).filterOptions = filterOptions;

        function updateInputValue() {
            filterInput.value = dropdownSelect.value;
            // Implementeer eventuele aanvullende logica die nodig is wanneer een nieuwe waarde wordt geselecteerd
            ralcheckedState = true;
            winkelmand.kleurkastral = dropdownSelect.value;
            kleurkastRALonChange()
            checkState();
        }

        (window).updateInputValue = updateInputValue;
        // Roep initializeDropdown aan om de dropdown te vullen bij het laden
        initializeDropdown();
    }


    //indien type gelijk is aan ... dan word het een checkbox veld.




    return value

}

function aantalonChange(value) {
    console.log('aantal onchange start')

    if (value > 0 && value < 101) {
        winkelmand.aantal = value;
        console.log('aantal waarde: ' + value);
        aantalState = true
    } else {
        if (value <= 0) {
            aantalState = false
            console.error('aantal waarde is te laag: ' + value);
        }
        if (value > 100) {
            aantalState = false
            console.error('aantal waarde is te hoog: ' + value);
        }
    }
    checkState();
    console.log('aantal onchange afronden.')

}
(window).aantalonChange = aantalonChange;



/**
 * Function to handle the change event of the 'breedte' input field.
 * @param {number} value - The new value of the 'breedte' input field.
 */
function breedteonChange(value) {
    // Check if the value is within the valid range
    if (value > 400 && value < 6000) {
        winkelmand.breedte = value; // Update the 'breedte' property of the 'winkelmand' object
        console.log('breedte waarde: ' + value); // Log the new 'breedte' value
        breedteState = true; // Set the 'breedteState' variable to true
    } else {
        // Check if the value is too low
        if (value <= 400) {
            breedteState = false; // Set the 'breedteState' variable to false
            console.error('breedte waarde is te laag: ' + value); // Log an error message
        }
        // Check if the value is too high
        if (value > 6000) {
            breedteState = false; // Set the 'breedteState' variable to false
            console.error('breedte waarde is te hoog: ' + value); // Log an error message
        }
    }
    checkState(); // Call the 'checkState' function
    console.log('breedte onchange afronden.'); // Log a message indicating the end of the 'breedte' onchange event
}
(window).breedteonChange = breedteonChange;

/**
 * Function to handle the change event of the height input field.
 * @param {number} value - The new value of the height input field.
 */
async function hoogteonChange(value) {
        // Check if the value is within the valid range
        if (value > 400 && value < 6000) {
            winkelmand.hoogte = value; // Update the height value in the winkelmand object
            console.log('hoogte waarde: ' + value); // Log the new height value
            hoogteState = true; // Set the hoogteState to true
            const _data = await zoekafwerkingData()
            typeafwerkingDIV.innerHTML = toevoegenaanDIV(_data, "typeafwerking", false);
        } else {
            // Check if the value is too low
            if (value <= 400) {
                hoogteState = false; // Set the hoogteState to false
                console.error('hoogte waarde is te laag: ' + value); // Log the too low height value
            }
            // Check if the value is too high
            if (value > 6000) {
                hoogteState = false; // Set the hoogteState to false
                console.error('hoogte waarde is te hoog: ' + value); // Log the too high height value
            }
        }
        checkState(); // Call the checkState function
        console.log('hoogte onchange afronden.'); // Log the message "breedte onchange afronden."
    }
    (window).hoogteonChange = hoogteonChange;

async function zoekafwerkingData() {
    console.log('zoekafwerkingData gestart')
    const _data = await goFetch("/typeafwerkingData", "");
    console.log('verkregen data zoek afwerking', _data)
    return _data;
}

async function zoekafwerkingdag(){
    console.log('')
    const _data = await goFetch("/afwerkingdag", "data");
    console.log("afwerkingdag data", _data);
    const _value = await toevoegenaanDIV(_data, "afwerkingdag", false);
    typeAfwerkingdag.innerHTML = _value;
  }
/**
 * Updates the type of finishing in the shopping cart based on the given value.
 * @param {string} value - The new value for the type of finishing.
 */
async function typeafwerkingonChange(value) {

    typeafwerkingState = true
    if (value) {
        console.log('typeafwerking waarde' + value)
        typeafwerkingState = true
        winkelmand.typeafwerking = value
        const _data = await zoektypebediening()
        typebedieningDIV.innerHTML = toevoegenaanDIV(_data, "typebediening", false);
        if(value === "dag"){    
            console.log('value dag')
            await zoekafwerkingdag();
            typeafwerkingdagstate = false;
            
        } else {
            console.log('value niet dag')
            typeafwerkingdagstate = true;
        }
    } else {
        console.log('typeafwerking niet OK' + value)
        winkelmand.typeafwerking = null
        typeafwerkingState = false
    }
    console.log('bedieningskantononChange afronden')
    checkState()



    }
    (window).typeafwerkingonChange = typeafwerkingonChange;


    
async function afwerkingdagChange(){

    const checkboxes = typeAfwerkingdag.querySelectorAll('input[type="checkbox"]');
    
    const checkedValues = [];
    // typeafwerkingdagstate = false;
    var checked = false
    for (const [index, checkbox] of checkboxes.entries()){
      // Controleer of de checkbox aangevinkt is
      if (checkbox.checked) {
        console.log('checked')
        checked = true
    const _data = await goFetch("/zoekafwerkingdagdata", checkbox.value);
    console.log('afwerkingdagChange data', _data);
          // Voeg de waarde van de aangevinkte checkbox toe aan de array
          checkedValues.push(_data);
      }
  };
  if (checked){
    console.log('typeafwerkingdagstate is checked')
    typeafwerkingdagstate = true;
    winkelmand.typeafwerkingdagdata = JSON.stringify({ afwerkingdag: checkedValues });
    console.log('winkelmand.typeafwerkingdagdata', winkelmand.typeafwerkingdagdata);
    checkState()
  } else {
    console.log('typeafwerkingdagstate is not checked')
    typeafwerkingdagstate = false;
    winkelmand.typeafwerkingdagdata = JSON.stringify({ afwerkingdag: checkedValues });
    console.log('winkelmand.typeafwerkingdagdata', winkelmand.typeafwerkingdagdata);
    checkState()
  }
    //console.log("afwerkingdag data", _data);
  
  
  }
  
  window.afwerkingdagChange = afwerkingdagChange;

async function zoekbedieningskantData() {
    console.log('zoekbedieningskant gestart')
    const _data = await goFetch("/zoekbedieningskantData", winkelmand.typebediening);
    console.log('verkregen data', _data)
    return _data
}
async function bedieningskantonChange(value) {
    bedieningskantState = true
    winkelmand.bedieningskant = value
    const _data = await zoektypedoek()
    typedoekDIV.innerHTML = toevoegenaanDIV(_data, "typedoek", false)
    checkState();
    }
    (window).bedieningskantonChange = bedieningskantonChange;
async function zoektypebediening() {
    console.log('zoekbedieningskant gestart')
    const _data = await goFetch("/zoektypebedieningData", klant.bedrijf);
    console.log('verkregen data', _data)
    return _data
}

async function typebedieningonChange(value) {
        if (value) {
            console.log('typebediening waarde' + value)
            typebedieningState = true
            schakelaarState =false;
            zenderState = false;
            winkelmand.typebediening = value
            const _data = await zoekbedieningsData(value)

            bedieningDIV.innerHTML = toevoegenaanDIV(_data.data, _data.db, false);
        } else {
            console.log('typebediening niet OK' + value)
            winkelmand.typebediening = null
            typebedieningState = false
        }
        console.log('typebedieningonChange afronden')
        checkState()
    }
    (window).typebedieningonChange = typebedieningonChange

async function zoekbedieningsData(value) {
    console.log('zoekbedieningsData gestart')
    if(klant.bedrijf != "feryn"){
        const _data = await goFetch("/zoekbedieningData", value);
        console.log('verkregen data', _data)
        return _data
    } else {
        const _data = await goFetch("/zoekbedieningData", {value:value,klant:klant.bedrijf});
    console.log('verkregen data', _data)
    return _data

    }
    
}

function handleCheckboxChange(elementId, checked) {
    //console.log("elementId", elementId, "this", checked);
    var checkbox = document.getElementById(elementId);
    var tekstvak = document.getElementById("aantalTekstvak_" + elementId);
    var aantaltekst = document.getElementById("aantalTekst_" + elementId);
    winkelmand.schakelaar = "geen";

    var checkboxes = document.querySelectorAll('input[name="zenders"]');
    checkboxes[0].checked = false;

    if (checkbox.checked) {
        tekstvak.style.display = "inline-block";
        aantaltekst.style.display = "inline-block";
    } else {
        tekstvak.style.display = "none";
        aantaltekst.style.display = "none";
    }
    if (zendersData.length > 0) {
        zendersData.forEach((element, index) => {
            if (element.benaming === elementId) {
                if (checked) {
                    zendersData[index].checked = true;
                    winkelmand.zenders = JSON.stringify({
                        zenders: zendersData
                    });

                    checkState();
                } else {
                    zendersData[index].checked = false;
                    winkelmand.zenders = JSON.stringify({
                        zenders: zendersData
                    });
                    checkState();
                }
            }
        });

    } else {
        console.log("nog geen data");

        zendersData = [{
            benaming: checkbox.value,
            aantal: 0,
            checked: true
        }];
        winkelmand.zenders = JSON.stringify({
            zenders: zendersData
        });
    }

    //console.log("zenderData handleChecboxCange", zendersData);
}
(window).handleCheckboxChange = handleCheckboxChange;

async function zendergeen(checked) {
    if (checked) {
        //zet zendersdata.benaming geen op true
        console.log("zendergeen checked")
        zendersData[0].checked = true;
        winkelmand.zenders = JSON.stringify({
            zenders: zendersData
        });
        
        //console.log("Geen", zendersData);
        zenderState = true;
        var checkboxes = document.querySelectorAll('input[name="zenders"]');
        var aantaltekst = document.querySelectorAll('label[name="aantalTekst"]');
        var aantaltekstvak = document.querySelectorAll('input[name="aantalTekstvak"]');
        if (checkboxes.length > 0) {
            // Doorloop alle checkboxes
            checkboxes.forEach(function (checkbox, index) {
                // Als het niet de eerste checkbox is, vink deze dan uit
                if (index !== 0) {
                    checkbox.checked = false;
                }
            });
            aantaltekstvak.forEach(function (tekstvak, index) {
                //Als het niet de eerste checkbox is, vink deze dan uit
                if (index !== 0) {
                    tekstvak.style.display = "none";
                    tekstvak.value = 0
                }
            })
            aantaltekst.forEach(function (tekst, index) {
                //Als het niet de eerste checkbox is, vink deze dan uit
                if (index !== 0) {
                    tekst.style.display = "none";

                }
            })

        } else {
            console.log('checkboxes', checkboxes)
        }
        checkState();
    } else {
        //zet zendersdata.benaming geen op false
        zendersData[0].checked = false;
        winkelmand.zenders = JSON.stringify({
            zenders: zendersData
        });
        //console.log("Geen", zendersData);
        zenderState = false;
        checkState();
    }
    const _data = await zoekbedieningskantData()
    if(winkelmand.typebediening === "somfyiosolar"){

        bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", false);
    } else {
        
    bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", true);
    }
    checkState()
}
(window).zendergeen = zendergeen;

async function zenderaantalonChange(aantal, benaming) {
    //console.log("zendersaantalchange - banming", benaming);

    var checked = false;
    console.log("zenderData", zendersData);

    zendersData.forEach((element, index) => {
        console.log("element zenderData", element);
        if (element.benaming === benaming) {
            checked = true;
            zendersData[index].aantal = Number(aantal);
        }
    });
    if (!checked) {
        console.log("zenderdata not checked", zendersData);
        zendersData.push({
            benaming: benaming,
            aantal: Number(aantal),
            checked: true,
        });
        winkelmand.zenders = JSON.stringify({
            zenders: zendersData
        });
        console.log("aantal changed", winkelmand.zenders, zendersData);
    } else {
        winkelmand.zenders = JSON.stringify({
            zenders: zendersData
        });
    }

    //console.log("zendersData - zenderaantalchange", zendersData);
    zenderState = true;
    const _data = await zoekbedieningskantData()
    if(winkelmand.typebediening === "somfyiosolar"){

        bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", false);
    } else {
        
    bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", true);
    }
    checkState()
}

(window).zenderaantalonChange = zenderaantalonChange;
async function schakelaargeen() {
    zendersData = [{
        benaming: "geen",
        aantal: 0,
        checked: false
    }];
    winkelmand.zenders = JSON.stringify({
        zenders: zendersData
    });
    winkelmand.zenders = "geen";
    winkelmand.schakelaar = "geen";
    schakelaarState = true;

    const _data = await zoekbedieningskantData()
    if(winkelmand.typebediening === "somfyiosolar"){

        bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", false);
    } else {
        
    bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", true);
    }
    checkState()
    //naar aanslagtop
}

(window).schakelaargeen = schakelaargeen;
async function schakelaaronChange(schakelaar) {
    //console.log("schakelaarOnchange", schakelaar);
    zendersData = [{
        benaming: "geen",
        aantal: 0,
        checked: false
    }];
    winkelmand.zenders = JSON.stringify({
        zenders: zendersData
    });
    winkelmand.schakelaar = schakelaar;
    zenderState = true;

    const _data = await zoekbedieningskantData()
    if(winkelmand.typebediening === "somfyiosolar"){

        bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", false);
    } else {
        
    bedieningskantDIV.innerHTML = toevoegenaanDIV(_data, "bedieningskant", true);
    }
    checkState()
}

(window).schakelaaronChange = schakelaaronChange;


async function zoektypedoek() {

    const response = await goFetch('/zoektypedoekData', "");
    console.log('response zoektypedoek', response);
    let data = response;
    return data;
}


async function typedoekonChange(value) {

        if (value) {
            console.log('typedoek waarde' + value)
            typedoekState = true
            doekState = false;
            winkelmand.typedoek = value
            const _data = await zoekdoekData(value)

            toevoegenaanDIV(_data, "doek", false)
        } else {
            console.log('typedoek niet OK' + value)
            winkelmand.typedoek = null
            typedoekState = false
        }
        console.log('typedoekonChange afronden')
        checkState()
    }
    (window).typedoekonChange = typedoekonChange
async function zoekdoekData(value) {

    const response = await goFetch('/zoekdoekData', value);
    console.log("response zoekdoekData", response);
    let data = response;
    return data;
}

async function zoekkastkleur() {
    const response = await goFetch('/kastkleurData')
    console.log('zoekkastkleur', response)
    return response;
}

async function screenkleurkastChange(data) {
    if (data === "RAL") {
        const _data = await zoekral(data);
        //console.log("data kleurkastchange", _data);
        toevoegenaanDIV(_data, "RAL", false);
        kleurkastState = true;
        winkelmand.kleurkast = data;
        checkState();
    } else {
        kleurkastralState = false;
        kleurkastState = true;
        winkelmand.kleurkast = data;

        checkState();
    }
}

(window).screenkleurkastChange = screenkleurkastChange;

async function zoekral(data) {
    const _data = await goFetch("/zoekral", "ral");
    //console.log("zoekral", _data);
    return _data;
}

async function kleurkastRALonChange() {
    console.log('kleurkastRAL changed')
    kleurkastralState = true
    checkState()
}

async function confectieonChange(value) {
        confectieState = true
        winkelmand.confectie = value
        const _data = await zoekkastkleur()
        console.log('toevoegenaandiv zoekkastkleur', _data)
        kleurkastDIV.innerHTML = toevoegenaanDIV(_data, 'screenkleurkast', false)
        checkState()
    }
    (window).confectieonChange = confectieonChange





    async function addToCartAndStay() {
        console.log("zendersData", zendersData);
        try {
          console.log("winkelmandData", winkelmand);
          const _data = await goFetch("/addtocart", winkelmand);
          console.log("Data doorgestuurd", _data);
        } catch (err) {
          console.error("error", err);
        }
      }
      (window).addToCartAndStay = addToCartAndStay;
      async function addAndGoToCart() {
        try {
      
            console.log("winkelmandData", winkelmand);
          const _data = await goFetch("/addtocart", winkelmand);
          console.log("Data doorgestuurd", _data);
        } catch (err) {
          console.error("error", err);
        }
      }
      (window).addAndGoToCart = addAndGoToCart;






function goFetch(link, data) {
    return fetch("/screens" + link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
        })
        .then(response => response.json())
        .then((data) => {
            return data;
        })
        .catch(error => console.error(error));
}

