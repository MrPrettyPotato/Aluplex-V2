const URL = "http://localhost:3000"
var xhr = new XMLHttpRequest();
//HTML ELEMENTEN
var aantal = document.getElementById("aantalInput")
var breedteDiv = document.getElementById("breedteInputDIV")
var breedte = document.getElementById("breedteInput")
var hoogteDiv = document.getElementById("hoogteInputDIV")
var hoogte = document.getElementById("hoogteInput")
var typeLamelDiv = document.getElementById("typeLamelDIV")

var typebedieningINPUT = document.getElementById("")

var typeAfwerkingDiv = document.getElementById("typeAfwerkingDIV")
var kleurLamelDiv = document.getElementById("kleurLamelDIV")
var uitvoeringbladDIV = document.getElementById("uitvoeringbladDIV")
var kleurOnderlatDiv = document.getElementById("kleurOnderlatDIV")
var kleurOnderlatRalDiv = document.getElementById("kleurOnderlatRalDIV")
var typeOphangveerDIV = document.getElementById("typeOphangveerDIV")
var buttonsDIV = document.getElementById("addToCartBtnDIV")

var typebedieningDIV = document.getElementById("typebedieningDIV")
var bedieningDIV = document.getElementById("bedieningDIV")
// var meerprijsDIV = document.getElementById("meerprijsDIV")


// var bedieningSchakelaarDIV = document.getElementById("bedieningSchakelaarDIV")
// var bedieningAfstandsbedieningDIV = document.getElementById("bedieningAfstandsbedieningDIV")
//validation Messages
var validationAantal = document.getElementById("validationAantal")
var validAantal = false
var validationBreedte = document.getElementById("validationBreedte")
var validBreedte = false
var validationAavalidationHoogtental = document.getElementById("validationHoogte")
var validHoogte = false

//Variables
var kleurOnderlatData;
var kleurOnderlatRalData;
var typeLamelData;
var kleurLamelData;
var lamel = "";
var minitradi = "";
var bedieningData;
var zendersData = [{"benaming":"geen","aantal":0,"checked":false}]
var manueelData = [{"benaming":"geen","checked":false}]

// checkedStated
var aantalstate = false;
var breedtestate = false;
var hoogtestate = false;
var afwerkingstate = false;
var typelamelstate = false;
var kleurlamelstate = false;
var uitvoeringbladstate = false;
var kleuronderlatstate = false;
var ralselecetd = false;
var ralstate = false;
var typeophangveerstate = false;
var aanslagtopstate = false;
var bedieningstate = false;
var meerprijsstate = false;
var zenderState = false;
var typebedieningstate = false;
var typebedieningoptiesstate = false;


function checkstate() {
  console.log('all states')
  
  var allstates = true
  if (aantalstate) { //
    breedteDiv.style.display = "block"
  } else {
    breedteDiv.style.display = "none"
    allstates = false

  }
  if (breedtestate) { //
    hoogteDiv.style.display = "block"
  } else {

    hoogteDiv.style.display = "none"
    allstates = false
  }
  if (hoogtestate) { //
    typeAfwerkingDiv.style.display = "block"
  } else {

    typeAfwerkingDiv.style.display = "none"
    allstates = false
  }
  if (afwerkingstate) {
    typeLamelDiv.style.display = "block"
  } else {

    typeLamelDiv.style.display = "none"
    allstates = false
  }
  if (typelamelstate) {
    kleurLamelDiv.style.display = "block"
  } else {
    kleurLamelDiv.style.display = "none"
    allstates = false
  }
  if(kleurlamelstate){
    uitvoeringbladDIV.style.display = "block"
  } else {
    uitvoeringbladDIV.style.display = "none"
    allstates = false

  }
  if (uitvoeringbladstate) {
    kleurOnderlatDiv.style.display = "block"
  } else {
    kleurOnderlatDiv.style.display = "none"
    allstates = false
  }
  if (kleuronderlatstate) {
    if (ralselecetd) {
      kleurOnderlatRalDiv.style.display = "block"
      if (ralstate) {
        console.log('bediening')

        typebedieningDIV.style.display = "block"
      } else {
        console.log('geen bediening')

        typebedieningDIV.style.display = "none"
        allstates = false
      }
    } else {
      console.log('bediening')

      kleurOnderlatRalDiv.style.display = "none"
      typebedieningDIV.style.display = "block"

    }
  } else {
    console.log('geen bediening')
    kleurOnderlatRalDiv.style.display = "none"
    typebedieningDIV.style.display = "none"
    allstates = false
  }

  if (typebedieningstate) {
    bedieningDIV.style.display = "block"
  } else {
    bedieningDIV.style.display = "none"
    
    allstates = false

  }

  if (typebedieningoptiesstate) {
    zender1DIV.style.display = "block"
  } else {
    zender1DIV.style.display = "none"
    allstates = false

  }
if(zenderState){
  if(bedieningData === "manueel"){
    if(manueelData[0].checked){
      
    } else if(manueelData.length > 1 && manueelData[1].checked || manueelData.length > 2 && manueelData[2].checked || manueelData.length > 3 && manueelData[3].checked || manueelData.length > 4 && manueelData[4].checked) {
      
    } else {
      allstates = false
    }

  } else if (bedieningData === "schakelaar"){
    if (winkelmand.schakelaar !== "" && winkelmand.schakelaar !== null){

    } else {
        allstates = false
    }

  } else if (bedieningData === "afstandsbediening"){
    console.log('afstandsbediening')
    if (zendersData[0].checked) {

    } else {
      console.log('geet niet checked')
      if ((zendersData.length > 1 && zendersData[1].checked && zendersData[1].aantal > 0) ||
      (zendersData.length > 2 && zendersData[2].checked && zendersData[2].aantal > 0) ||
      (zendersData.length > 3 && zendersData[3].checked && zendersData[3].aantal > 0) ||
      (zendersData.length > 4 && zendersData[4].checked && zendersData[4].aantal > 0) ||
      (zendersData.length > 5 && zendersData[5].checked && zendersData[5].aantal > 0)) {
    // Jouw code hier
    console.log('aanslagtop laten zien',zendersData)
  
      } else {
        allstates = false
      }
    }
  }
 
} else {
  
  allstates = false
}

  
  if (allstates) {

    buttonsDIV.style.display = "block"

  } else {
    buttonsDIV.style.display = "none"

  }

}

//Winkelmand default Data
var winkelmand = {
  type: "Tradirolluik",
  status: "winkelmand",
  leverancier:"ALUPLEX",
  ref: "",
  positie: "",
  klant: klant.bedrijf,
  klantID: klant.bedrijfID,
  aantal: "",
  breedte: "",
  hoogte: "",
  typeafwerking: "",
  typelamel: "",
  kleurlamel: "",
  uitvoeringblad: "",
  kleuronderlat: "",
  ralonderlat: "",
  typeophangveer: "",
  aanslagtop: ""
}


//Check all values, If all values are filled, show buttons
function checkValues() {

  if (winkelmand.positie != "" && winkelmand.aantal != "" && winkelmand.breedte != "" && winkelmand.hoogte != "" && winkelmand.typelamel != "" && winkelmand.kleurlamel != "" && winkelmand.kleuronderlat != "" && winkelmand.ralonderlat != "" && winkelmand.typeophangveer != "" && winkelmand.aanslagtop != "") {
    buttonsDIV.style.display = "block";
  } else {

    buttonsDIV.style.display = "none";
  }
}

/***** ROLLUIK POSITIE *****/
var positie = document.getElementById("refPositieInput")
positie.oninput = function () {
  console.log('traditioneel')
  winkelmand.positie = this.value
}

/***** AANTAL *****/
aantal.oninput = function () {
  //Check of waarde tussen 1 & 100 is
  if (this.value > 0 && this.value <= 100) {
    //Geef hier de functie in om breedte weer te geven.
    // toggleVisibility(breedteDiv, true)
    aantalstate = true
    checkstate()
    //toevoegen aan winkelmand
    winkelmand.aantal = this.value
    return
  } else {
    aantalstate = false
    winkelmand.aantal = 0
    checkstate()

  }
}

/***** BREEDTE *****/
breedte.oninput = function () {
  buttonsDIV.style.display = "none";
  if (breedte.value >= 200 && breedte.value < 4001) {
    /*Geef hier de functie in om hoogte weer te geven. */
    // toggleVisibility(hoogteDiv, true)
    breedtestate = true

    winkelmand.breedte = breedte.value
    getTypeLamel()
    checkstate()
    return
  } else {

    breedtestate = false
    getTypeLamel()
    checkstate()
  }
}
/* Indien Hoogte aangepast word */

hoogte.oninput = async function () {
  try {
    if (hoogte.value >= 200 && hoogte.value < 3001) {


      const data = await goFetch("/tradirolluik/typeafwerking", "rolluikblad");

      var _value = `<div class="form-group">
        <span style="font-weight: bold;">Uw opgegeven afmetingen zijn:</span>
      </div>`;

      data.forEach((element) => {
        console.log('element', element, typeof element.benaming)
        _value += `<div class="form-check">
          <input class="form-check-input" id="${element.benaming}" type="radio" value="${element.benaming}" name="typeafwerking" onchange="typeafwerkingChange(value)" ${element.benaming === winkelmand.typeafwerking ? 'checked' : ''}>
          <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
            
              <img class="fancybox" src="/img/rolluiken/${element.img}" alt="${element.benaming} onclick="document.getElementById('${element.benaming}').click();" Image" style="width: 100px; height: 100px; margin-right: 10px;">
            
            ${element.omschrijving}
          </label>
        </div>`;
      });

      typeAfwerkingDiv.innerHTML = _value;
      hoogtestate = true
      winkelmand.hoogte = hoogte.value;
      console.log('Data typeafwerking', data);
      getTypeLamel()
      checkstate()
    } else {
      getTypeLamel()
      checkstate()

      hoogtestate = false
      winkelmand.hoogte = 0;
    }
  } catch (error) {
    console.error(error);
  }
};

window.typeafwerkingChange = function (value) {
  console.log('input', value)
  afwerkingstate = true
  winkelmand.typeafwerking = value
  getTypeLamel()
  checkstate()

  console.log('value typeafwerking', value)
}


function getTypeLamel() {
  if (breedte.value & hoogte.value) {
    goFetch("/tradirolluik/getData", {
        "breedte": breedte.value,
        "hoogte": hoogte.value,
        "afwerking": winkelmand.typeafwerking
      })
      .then((data) => {
        console.log('data', data)
        var _data = data
        console.log('data type lamel', _data)
        var _value = `<div class="form-group">
    <span style="font-weight: bold;">Type Lamel</span>
  </div>`
        var checked = false;
        _data.forEach(element => {
          if (element.benaming === winkelmand.typelamel) {
            console.log('typelamel true')
            checked = true
          }
          console.log("element", element.omschrijving, "winkelmand", winkelmand.typelamel)
          _value = _value + `<div class="form-check">
    <input class="form-check-input" type="radio" value="${element.benaming}" name="typelamel" id="${element.benaming}" ${element.benaming === winkelmand.typelamel ? 'checked' : ''}>
    
       
    <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
     ${element.omschrijving}
    </label>
  </div>
  `
        });
        // doe iets met de data
        //zet de data naar typelamel -----
        if (checked) {

          typelamelstate = true
          checkstate()
        } else {
          typelamelstate = false;
          checkstate()
        }

        console.log('_value', _value)
        typeLamelDiv.innerHTML = _value
        typeLamelData = document.querySelectorAll('input[name="typelamel"]')
        typeLamelData.forEach(typelamel => typelamel.addEventListener('change', typelamelchange));
      })



    console.log('winkelmand', winkelmand.typelamel)
  }

}



async function typelamelchange() {
  try {
    const _lamel = this.value;
    winkelmand.typelamel = _lamel;

    const _data = await goFetch("/tradirolluik/kleurlamel", {
      lamel: _lamel
    });

    var _value = `<div class="form-group">
      <span style="font-weight: bold;">Kleur Lamel</span>
    </div>`;
    var checked = false
    //loop door de data
    _data.forEach((element,index) => {
      //indien de kleur in de data gelijk is aan de kleur in de winkelmand, zet checked naar true
      if (element.kleur === winkelmand.kleurlamel) {
        console.log('element kleuren', element.kleur, winkelmand.kleurlamel)
        checked = true
      }
      if (element.kleur === "Wit" || element.kleur === "Beige") {
        console.log("achtergrondkleur", element.RGB);
        _value += `<div class="form-check">
          <input class="form-check-input" type="radio" value="${element.kleur}" name="kleurlamel" id="${element.kleur + index.toString() + "kleurlamel"}" ${element.kleur === winkelmand.kleurlamel ? 'checked' : ''}>
          <label class="form-check-label" for="${element.kleur + index.toString() + "kleurlamel"}">
            <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
            ${element.kleur}  
          </label>
        </div>`;
      } else {
        console.log("achtergrondkleur", element.RGB);
        _value += `<div class="form-check">
        <input class="form-check-input" type="radio" value="${element.kleur}" name="kleurlamel" id="${element.kleur + index.toString() + "kleurlamel"}" ${element.kleur === winkelmand.kleurlamel ? 'checked' : ''}>
        <label class="form-check-label" for="${element.kleur + index.toString() + "kleurlamel"}">
          <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
          ${element.kleur + " - "+ element.RAL}  
        </label>
      </div>`;
      }

    });
    //indien de kleuren niet overeen kwamen, hide de volgende opties. 
    if (checked) {
      kleurlamelstate = true
      typelamelstate = true
      checkstate()
    } else {
      kleurlamelstate = false
      typelamelstate = true
      checkstate()
    }



    kleurLamelDiv.innerHTML = _value;

    kleurLamelData = document.querySelectorAll('input[name="kleurlamel"]');
    kleurLamelData.forEach(typelamel => typelamel.addEventListener('change', kleurlamelchange));

    await getMiniTradi(_lamel);
    await getKleurOnderlat()
  } catch (error) {
    console.error(error);
  }
}
/* Indien kleuramel aangepast word */
async function kleurlamelchange() {
  await getKleurOnderlat()
  winkelmand.kleurlamel = this.value
  kleurlamelstate = true;
  await getuitvoeringblad()
  checkstate()

  //- Indien er iets geselecteerd is
  //- Geef kleur onderlatten weer
}
async function getuitvoeringblad(){
  goFetch('/tradirolluik/uitvoeringblad','')
  .then((_data)=>{
    console.log('uitvoeringblad',_data)
    var _value = `<div class="form-group">
    <span style="font-weight: bold;">Uitvoering blad</span>
  </div>`
      _data.forEach((element,index) => {
    _value += `<div class="form-check">
    <input class="form-check-input" id="${element.benaming}" type="radio" value="${element.benaming}" name="uitvoeringblad" onchange="uitvoeringbladchange(value)" ${element.benaming === winkelmand.uitvoeringblad ? 'checked' : ''}>
    <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
      
        
      ${element.omschrijving}
    </label>
  </div>`;
      })
      
      uitvoeringbladDIV.innerHTML = _value
  })
}
function uitvoeringbladchange(value){
  winkelmand.uitvoeringblad = value
  uitvoeringbladstate = true
  checkstate()
}
window.uitvoeringbladchange = uitvoeringbladchange

function getKleurOnderlat() {
  console.log("minitradi", minitradi)
  goFetch("/tradirolluik/kleurOnderlat", minitradi)
    .then((_data) => {
      console.log("data")
      console.log(_data)
      var _value = `<div class="form-group">
    <span style="font-weight: bold;">Type Onderlat</span>
  </div>`
      _data.forEach((element,index) => {
        _value = _value + `<div class="form-check">
    <input class="form-check-input" type="radio" value="${element.kleur}" name="kleuronderlat" id="${element.kleur + index.toString() + "kleuronderlat"}" ${element.kleur === winkelmand.kleuronderlat ? 'checked' : ''}>
    <label class="form-check-label" for="${element.kleur + index.toString() + "kleuronderlat"}">
      <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
      ${element.kleur + " - "+ element.RAL}  
    </label>
  </div>
  `
      })
      _value = _value + `<div class="form-check">
    <input class="form-check-input" type="radio" value="RAL" name="kleuronderlat" id="RAL" ${"RAL" === winkelmand.uitvoering ? 'checked' : ''}>
    <label class="form-check-label" for="RAL">
    <img src="/img/RAL.jpeg" width="20" height="20" style="display: inline-block; margin-right: 10px;">
      RAL  
    </label>
  </div>
  `
      kleurOnderlatDiv.innerHTML = _value
      kleurOnderlatData = document.querySelectorAll('input[name="kleuronderlat"]')

      kleurOnderlatData.forEach(kleuronderlat => kleuronderlat.addEventListener('change', kleuronderlatchange));
    })
    .catch(error => console.error(error))
}

/* Indien  kleur onderlat aangepast word*/
function kleuronderlatchange() {
  const _data = this.value
  winkelmand.kleuronderlat = this.value
  const _value = `<div class="form-group">
  <span style="font-weight: bold;">Aanslagtop</span>
</div>
  <div class="form-check">
      <input class="form-check-input" id="Ja" type="radio" value="Ja" name="aanslagtop" onchange="aanslagtopchange(value)" ${"Ja" === winkelmand.aanslagtop ? 'checked' : ''}>
      
         
      <label class="form-check-label" for="Ja" style="margin-left:30px">
       Ja
      </label>
     </div>
      <div class="form-check">
      <input class="form-check-input" type="radio" id="Nee" value="Nee" name="aanslagtop" onchange="aanslagtopchange(value)" ${"Nee" === winkelmand.aanslagtop ? 'checked' : ''}>
      <label class="form-check-label" for="Nee" style="margin-left:30px">
       Nee
      </label>
    </div`
  aanslagtopDIV.innerHTML = _value
  //-Indien RAL is aangeduid
  if (_data === "RAL") {
    //- Geef Dropdown van de rallijst weer
    getRal()
    ralselecetd = true
    kleuronderlatstate = true
    checkstate()

  } else {
    //- Indien RAL niet is aangeduid

    ralselecetd = false
    winkelmand.ralonderlat = ""
    // kleurOnderlatRalDiv.style.display = "none"
    kleurOnderlatRalDiv.innerHTML = ""
    //- Stuur type lamel door naar de backend
    //- Zoek naar de juiste type ophangveren
    //- krijg deze terug van de back-end
    //- Zet deze in radiobuttons
    kleuronderlatstate = true
    checkstate()
  }

}
function getRal() {

  goFetch("/tradirolluik/kleurOnderlatRAL", minitradi)
    .then((_data) => {
      var _value = `
      <div class="input-group">
      <span class="input-group-text" id="basic-addon1">RAL Code </span>
      <table>
      <tbody><tr><td> <input id="idRALCode" list="AE" name="RALCodes" placeholder="RAL Codes" class="form-control" aria-describedby="basic-addon1" onchange="ralchange(value)" />
          <datalist id="AE">`
      _data.forEach(element => {
        const newElement = element.alles
        _value = _value + `<option value='${newElement}'>`

      });

      _value = _value + `</datalist></td>
        </tr></tbody>
  </table>
  </div>`

      kleurOnderlatRalDiv.innerHTML = _value
      kleurOnderlatRalDiv.style.display = "block"
    })
    .catch(error => console.error(error))

}
window.ralchange = function (value) {
  console.log('Ral is aangepast', value)
  winkelmand.ralonderlat = value
  ralstate = true
  checkstate()


  getTypeOphangveer(minitradi)
}


async function getMiniTradi(_lamel) {
  await goFetch("/tradirolluik/minitradi", _lamel)
    .then((_data) => {
      minitradi = _data
      lamel = _lamel
    }).catch(error => console.error(error))
}

function gettypebediening(bediening) {
  console.log('getbediening start data', bediening)
  goFetch("/tradirolluik/getbediening", bediening)
    .then((data) => {
      console.log('verkregen data', data)
      var _data = data
      if(bediening === "manueel"){
        var _value = `<div class="form-group">
      <span style="font-weight: bold;">Type lint</span>
    </div>`
      } else {
        var _value = `<div class="form-group">
      <span style="font-weight: bold;">Type motor</span>
    </div>`
      }
      var checked = false;
      _data.forEach(element => {
        if (element.benaming === winkelmand.typebediening) {
          console.log('typelamel true')
          checked = true
        }
        console.log("element", element.omschrijving, "winkelmand", winkelmand.typelamel)
        _value = _value + `<div class="form-check">
<input class="form-check-input" type="radio" value="${element.benaming}" onchange="typebedieningchange(value)" name="typebedieningopties" id="${element.benaming}" ${element.benaming === winkelmand.typebediening ? 'checked' : ''}>

   
<label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
 ${element.omschrijving}
</label>
</div>
`
      });
      // doe iets met de data
      //zet de data naar typelamel -----
      if (checked) {

        typebedieningoptiesstate = true
        checkstate()
      } else {
        typebedieningoptiesstate = false;
        checkstate()
      }

      console.log('_value', _value)
      bedieningDIV.innerHTML = _value
      // bedieningData = document.querySelectorAll('input[name="typebedieningopties"]')
      // bedieningData.forEach(bediening => bediening.addEventListener('change', bedieningchange(this)));
    })



  console.log('winkelmand', winkelmand.typelamel)

}


//Type manueel of motor 
window.typebedieningchange = function (value) {
  winkelmand.typelintofmotor = value
  typebedieningoptiesstate = true;
  zenderState = false
  zendersData = [{"benaming":"geen","aantal":0,"checked":false}]

  try {
    //searchdata starten
    goFetch("/tradirolluik/getzender", {
      "select": "*",
      "FROM": "zenders",
      "WHERE": value
    })
      .then((data) => {
        //iets doen met de gevonden data
        console.log('Data gevonden', data)
        var _data = data
        var _value;
        console.log('callback starten indien van toepassing')
    
        var _value;
        console.log('value tyoe bediening',value)
        if (bedieningData === "schakelaar") {
          _value = `<div class="form-group">
          <span style="font-weight: bold;">Type schakelaar</span>
        </div>`
        } else if(bedieningData === "manueel"){
          _value = `<div class="form-group">
          <span style="font-weight: bold;">Optie lint</span>
        </div>`
        } else {
          _value = `<div class="form-group">
          <span style="font-weight: bold;">Type zender</span>
        </div>`
        }
        
      

        var checked = false;
        console.log('Door de gevonden data loopen')
        _data.forEach((element,index) => {
          console.log('element.benaming = ',element.benaming)
          if (element.benaming === winkelmand.zender) {
            console.log('Indien element gelijk aan winkelmand element')
            checked = true
          }
          if(bedieningData === "schakelaar"){
            //indien bediening is schakelaar
            if(index === 0){
              _value = _value + `<div class="form-check">
              <input class="form-check-input" type="radio" value="geen" onchange="schakelaargeen()" name="schakelaar" id="schakelaargeen" ${element.benaming === winkelmand.zender ? 'checked' : ''}>
              
                 
              <label class="form-check-label" for="schakelaargeen" style="margin-left:30px">
               Geen 
              </label>
              </div>`
            }
            _value = _value + `<div class="form-check">
            <input class="form-check-input" type="radio" value="${element.benaming}" onchange="schakelaarOnchange('${element.benaming}')" name="schakelaar" id="${element.benaming}" ${element.benaming} ${element.benaming === winkelmand.zender ? 'checked' : ''}>
            
               
            <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
             ${element.omschrijving}
            </label>
            </div>`
          } else if(bedieningData === "manueel"){
            //indien bediening is manueel
            if(index === 0){
              _value = _value + `<div class="form-check">
              <input class="form-check-input" type="checkbox" value="geen" onchange="manueelgeen(this.checked)" name="manueel" id="manueelgeen" ${"geen" === winkelmand.zender ? 'checked' : ''}>
              
                 
              <label class="form-check-label" for="manueelgeen" style="margin-left:30px">
               Geen
              </label>
              </div>
              `
            }
            _value = _value + `<div class="form-check" style="margin-top: 10px">
            <input class="form-check-input manueel-checkbox" type="checkbox" value="${element.benaming}" onchange="handleCheckboxChangeManueel('${element.benaming}',this.checked)" name="manueel" id="${element.benaming}" ${element.benaming === winkelmand.zender ? 'checked' : ''}>
           
            <label class="form-check-label" for="${element.benaming}" style="margin-left:30px; display: block;">
              ${element.omschrijving}
            </label>
            </div>`
          } else {
            //indien bediening is afstandsbediening
            if(index === 0){
              _value = _value + `<div class="form-check">
              <input class="form-check-input" type="checkbox" value="geen" onchange="zendergeen(this.checked)" name="zenders" id="geen"" ${"geen" === winkelmand.zender ? 'checked' : ''}>
              
                 
              <label class="form-check-label" for="geen" style="margin-left:30px">
               Geen
              </label>
              </div>
              `
            }
            console.log('_value vullen met de juiste html data')
            // Voeg checkbox en tekstvak toe
            _value = _value + `<div class="form-check" style="margin-top: 10px">
            <input class="form-check-input" type="checkbox" value="${element.benaming}" onchange="handleCheckboxChange('${element.benaming}',this.checked)" name="zenders" id="${element.benaming}" ${element.benaming === winkelmand.zender ? 'checked' : ''}>
           
            <label class="form-check-label" for="${element.benaming}" style="margin-left:30px; display: block;">
              ${element.omschrijving}
            </label>
          
            <!-- Voeg een div toe voor het tekstvak -->
            <label style="margin-left: 30px; display: none;" id="aantalTekst_${element.benaming}">Aantal: </label>
             <input type="number" class="form-check-input" id="aantalTekstvak_${element.benaming}" onchange="zenderaantalchange(value,'${element.benaming}')" placeholder="Aantal" value=0 style="margin: 0px 0px 0px 30px; ${element.benaming === winkelmand.zender ? 'display: inline-block;' : 'display: none;'}">
           
          </div>`;
          }
          
          

          
        });
        
        console.log('Als element gelijk was aan winkelmand element -> state aanpassen')
        if (checked) {
          zenderState = true
          checkstate()
        } else {
          zenderState = false;
          checkstate()
        }
        console.log('state aangepast?', zenderState)
        console.log('Return de html _value')

        zender1DIV.innerHTML = _value
      })
      
    checkstate()
  } catch (err) {
    console.log('error search', err)
  } finally {
    console.log('search functie beeindigd')
  }
}

//Manueel - Motor met schakelaar - Motor met afstandsbediening
window.typebedieningChange = function (value) {
  console.log('value typebediening', value)
  if(value === "manueel"){
    winkelmand.aanslagtop = "Ja"
  } else {
    winkelmand.aanslagtop = "Nee"
  }
  typebedieningstate = true;
  zenderState = false
  bedieningData = value
  winkelmand.typebediening = value
  checkstate()
  gettypebediening(value)
  zendersData = [{"benaming":"geen","aantal":0,"checked":false}]

}
window.schakelaargeen = function(){
  
  zendersData = [{"benaming":"geen","aantal":0,"checked":false}]
  manueelData = [{"benaming":"geen","checked":false}]
  winkelmand.zenders = ""
  winkelmand.schakelaar = "geen"
  zenderState = true
  checkstate()
  //naar aanslagtop
}
window.schakelaarOnchange = function (schakelaar){
  console.log('schakelaarOnchange',schakelaar)
  zendersData = [{"benaming":"geen","aantal":0,"checked":false}]
  winkelmand.zenders = ""
  manueelData = [{"benaming":"geen","checked":false}]
  winkelmand.schakelaar = schakelaar
  zenderState = true
  console.log("winkelmand schakelaar",winkelmand.schakelaar)
  checkstate()

}

window.manueelgeen = function(checked){
  console.log('maneel geen')
  zendersData = [{"benaming":"geen","aantal":0,"checked":false}]
  winkelmand.zenders = ""
  winkelmand.schakelaar = ""
  const checkboxes = document.querySelectorAll('.manueel-checkbox');
  console.log('checkboxes',checkboxes)

  // Loop door alle checkboxes heen
  checkboxes.forEach(checkbox => {
    console.log('checkbox', checkbox.id)
    // Disable of enable de checkbox afhankelijk van de staat van de 'geen' checkbox
    if (checkbox.id !== 'manueelgeen') { // Zorg dat de 'geen' checkbox niet wordt gedisabled
      checkbox.disabled = checked;
    }
  });
  if(checked){
  manueelData = [{"benaming":"geen","checked":true}]
  zenderState = true
  checkstate()
  } else {
    manueelData = [{"benaming":"geen","checked":false}]
    zenderState = false
    checkstate()
  }

}

window.zendergeen = function (checked) {
  if(checked){
    //zet zendersdata.benaming geen op true
    zendersData[0].checked = true
    console.log('Geen',zendersData)
    zenderState = true;
    checkstate()
  } else {
    //zet zendersdata.benaming geen op false
    zendersData[0].checked = false
    console.log('Geen',zendersData)
    zenderState = false;
    checkstate()

  }
}
window.handleCheckboxChangeManueel = function(elementId,ischecked){
  console.log('elementId',elementId,"this",ischecked)

  let checked = false;
  manueelData.forEach((element,index)=>{ 
    
    

  if(element.benaming === elementId){
    console.log('dezelfde')
    checked = true
    manueelData[index].checked = ischecked
  }
})
  
  if(!checked && ischecked){
    console.log('checked neen & ischecked')
    manueelData.push({"benaming":elementId,"checked":true})
  } else {
    console.log('niets doen')
  }
  console.log('manueeldata',manueelData)
    zenderState = true
  checkstate()


}



//zenders

window.zenderaantalchange = async function (aantal,benaming) {
  console.log('zendersaantalchange - banming',benaming)
  var checked = false
    zendersData.forEach((element,index)=>{ 
      console.log('element zenderData',element)
      if(element.benaming === benaming){
        checked = true
        zendersData[index].aantal = Number(aantal)
      }
    })
    if(!checked){

      zendersData.push({"benaming":benaming,"aantal":Number(aantal),"checked":true})
    } else {

    }
    
  console.log('zendersData - zenderaantalchange',zendersData)
  zenderState = true;
  checkstate()

}




window.aanslagtopchange = function (value) {
  //showButtons (Add to,addto and stay)
  winkelmand.aanslagtop = value
  aanslagtopstate = true;
  checkstate()
}



window.handleCheckboxChange = function(elementId,checked){
  console.log('elementId',elementId,"this",checked)
  var checkbox = document.getElementById(elementId);
  var tekstvak = document.getElementById("aantalTekstvak_" + elementId);
  var aantaltekst = document.getElementById("aantalTekst_" + elementId);

  if (checkbox.checked) {
    tekstvak.style.display = "inline-block";
    aantaltekst.style.display = "inline-block";
  } else {
    tekstvak.style.display = "none";
    aantaltekst.style.display = "none";
  }
  zendersData.forEach((element,index)=>{ 
    if(element.benaming === elementId){
      if(checked){

        zendersData[index].checked = true
        checkstate()
      } else {
        zendersData[index].checked = false
        checkstate()

      }
    }
  })


  console.log('zenderData handleChecboxCange',zendersData)
}


//SPECIALE FUNCTIES:

//dropdown
function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("dropdownSearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("dropdownOptions");
  li = ul.getElementsByTagName("a");
  for (i = 0; i < li.length; i++) {
    a = li[i];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}


function goFetch(link, data) {
  try {
    return fetch(link, {
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
  } catch (err) {
    console.log('Error')
  } finally {
    console.log('Function ended')
  }
}


window.addToCartAndStay = () => {
  
  if(bedieningData === "manueel"){
    winkelmand.manueel = JSON.stringify({"manueel":manueelData})
    winkelmand.zenders = JSON.stringify({"zenders":zendersData})
  } else if (bedieningData === "afstandsbediening"){
    winkelmand.zenders = JSON.stringify({"zenders":zendersData})
  } 
  console.log('winkelmandData', winkelmand)
  goFetch("/tradirolluik/addtocart", winkelmand)
    .then((data) => {
      console.log("Toevoegen aan winkelmand en blijven", winkelmand)
      console.log("returned data", data)
      alert("Toevoegen aan winkelmand gelukt")
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
    })
    .catch((err)=>{
      alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen")
    })


}

window.addAndGoToCart = () => {
  if(bedieningData === "manueel"){
    winkelmand.manueel = JSON.stringify({"manueel":manueelData})
    winkelmand.zenders = JSON.stringify({"zenders":zendersData})
  } else if (bedieningData === "afstandsbediening"){
    winkelmand.zenders = JSON.stringify({"zenders":zendersData})
  } 
  console.log("Toevoegen en naar winkelmand", winkelmand)
  try {
    goFetch("/tradirolluik/addtocart", winkelmand)
      .then((data) => {
        console.log("Toevoegen aan winkelmand en naar winkelmand", winkelmand)
        console.log("returned data", data)
        alert("Toevoegen aan winkelmand gelukt")
        window.location.href = "/cart"
      })
      .catch((err)=>{
        alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen")
      })
  } catch (err) {
    console.error("error", err)
  }

}



















































































































































































































































































































/**
 * Haalt data uit de database op basis van:
 * @param {String} backendFunctie - backendFunctie die moet gebruikt worden voor de juiste data te zoeken VB: "/tradirolluik/getzender".
 * @param {String} benaming - Is het de banaming van de database of omschrijving. Omschrijving mag spaties hebben, benaming niet".
 * @param {String} omschrijving - Is het de omschrijving van de database of benaming. Omschrijving mag spaties hebben, benaming niet".
 * @param {String} winkelmandElement - het object dat in de winkelmand moet aangepast worden of vergeleken moet worden .
 * @param {Object} query - objects (select,from, where, aditional) - backendFunctie die moet gebruikt worden voor de juiste data te zoeken .
 * @param {boolean} state - welke state er moet aangepast worden.
 * @param {String} DIV - Waar de html data moet ingeladen worden.
 * @param {Function} callback - een functie om te vergelijken .
 * @param {String} onchange - functie voor onchange in html .
 */
function searchData(backendFunctie, benaming, omschrijving, winkelmandElement, query, state, DIV, callback = null,onchange,checkbox = false) {
  try {
    console.log('searchdata gestart', query)
    //searchdata starten
    goFetch(backendFunctie, query)
      .then((data) => {
        //iets doen met de gevonden data
        console.log('Data gevonden', data)
        var _data = data
        var _value;
        console.log('callback starten indien van toepassing')
        if (callback) {
          console.log('werkt dit als er geen callback is?')
        }
        var _value = callback || ''

        var checked = false;
        console.log('Door de gevonden data loopen')
        _data.forEach(element => {
          if (element[benaming] === winkelmand[winkelmandElement]) {
            console.log('Indien element gelijk aan winkelmand element')
            checked = true
          }

          if(checkbox){
          console.log('_value vullen met de juiste html data')
         // Voeg checkbox en tekstvak toe
         _value = _value + `<div class="form-check" style="margin-top: 10px">
         <input class="form-check-input" type="checkbox" value="${element[benaming]}" onchange="handleCheckboxChange('${element[benaming]}')" name="zenders" id="${element[benaming]}" ${element[benaming] === winkelmand[winkelmandElement] ? 'checked' : ''}>
        
         <label class="form-check-label" for="${element[benaming]}" style="margin-left:30px; display: inline-block;">
           ${element[omschrijving]}
         </label>
       
         <!-- Voeg een div toe voor het tekstvak -->
          <input type="number" class="form-check-input" id="aantalTekstvak_${element[benaming]}" placeholder="Aantal" style="margin: 0px 0px 10px 30px; ${element[benaming] === winkelmand[winkelmandElement] ? 'display: inline-block;' : 'display: none;'}">
        
       </div>`;
          } else {
            console.log('_value vullen met de juiste html data')
          _value = _value + `<div class="form-check">
<input class="form-check-input" type="checkbox" value="${element[benaming]}" id=${element[benaming]} ${element[benaming] === winkelmand[winkelmandElement] ? 'checked' : ''}>
<label class="form-check-label" for="flexRadioDefault1" style="margin-left:30px">
 ${element[omschrijving]}
</label>
</div>
`

          }
        });
        console.log('Als element gelijk was aan winkelmand element -> state aanpassen')
        if (checked) {
          state = true
          checkstate()
        } else {
          state = false;
          checkstate()
        }
        console.log('state aangepast?', state)
        console.log('Return de html _value')

        DIV.innerHTML = _value
      })
  } catch (err) {
    console.log('error search', err)
  } finally {
    console.log('search functie beeindigd')
  }
}