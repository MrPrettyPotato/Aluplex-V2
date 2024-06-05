const URL = "http://localhost:3000"
var xhr = new XMLHttpRequest();
//HTML ELEMENTEN
var aantal = document.getElementById("aantalInput")
var breedteDiv = document.getElementById("breedteInputDIV")
var breedte = document.getElementById("breedteInput")
var hoogteDiv = document.getElementById("hoogteInputDIV")
var hoogte = document.getElementById("hoogteInput")
var typeLamelDiv = document.getElementById("typeLamelDIV")

var typeAfwerkingDiv = document.getElementById("typeAfwerkingDIV")
var kleurLamelDiv = document.getElementById("kleurLamelDIV")
var uitvoeringbladDIV = document.getElementById("uitvoeringbladDIV")
var kleurOnderlatDiv = document.getElementById("kleurOnderlatDIV")
var kleurOnderlatRalDiv = document.getElementById("kleurOnderlatRalDIV")
var typeOphangveerDIV = document.getElementById("typeOphangveerDIV")
var aanslagtopDIV = document.getElementById("aanslagtopDIV")
var buttonsDIV = document.getElementById("addToCartBtnDIV")
//validation Messages
var validationAantal = document.getElementById("validationAantal")
var validAantal = false
var validationBreedte = document.getElementById("validationBreedte")
var validBreedte = false
var validationAavalidationHoogtental = document.getElementById("validationHoogte")
var validHoogte = false

//Variables
var kleurOnderlatData
var kleurOnderlatRalData
var typeLamelData
var kleurLamelData
var lamel = ""
var minitradi = ""

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

function checkstate(){
  console.log('all states')
  console.log('aantal',aantalstate)
  console.log('breedte',breedtestate)
  console.log('hoogte',hoogtestate)
  console.log('afwerking',afwerkingstate)
  console.log('typelamel',typelamelstate)
  console.log('kleurlamel',kleurlamelstate)
  console.log('kleuronderlat',kleuronderlatstate)
  console.log('typeophangveer',typeophangveerstate)
  console.log('typeaanslagtop',aanslagtopstate)
  console.log('ralselected',ralselecetd)
  console.log('ralstate',ralstate)
  var allstates = true
  if(aantalstate){ //
    breedteDiv.style.display = "block"
  } else {
    breedteDiv.style.display = "none"
    allstates = false

  }
  if(breedtestate){ //
    hoogteDiv.style.display = "block"
  } else {
    
    hoogteDiv.style.display = "none"
    allstates = false
  }
  if(hoogtestate){ //
    typeAfwerkingDiv.style.display = "block"
  } else {
    
    typeAfwerkingDiv.style.display = "none"
    allstates = false
  }
  if(afwerkingstate){
    typeLamelDiv.style.display = "block"
  } else {

    typeLamelDiv.style.display = "none"
    allstates = false
  }
  if(typelamelstate){
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
  if(uitvoeringbladstate){
    kleurOnderlatDiv.style.display = "block"
  } else {
    kleurOnderlatDiv.style.display = "none"
    allstates = false
  }
  if(kleuronderlatstate){
    if(ralselecetd){
      kleurOnderlatRalDiv.style.display = "block"
      if(ralstate){
        
        aanslagtopDIV.style.display = "block"
      } else {
        
        aanslagtopDIV.style.display = "none"
      allstates = false
      }
    } else {

      kleurOnderlatRalDiv.style.display = "none"
      aanslagtopDIV.style.display = "block"
      
    }
  } else {
    kleurOnderlatRalDiv.style.display = "none"
    aanslagtopDIV.style.display = "none"
    allstates = false
  }
  
  if(aanslagtopstate){

  } else {
    allstates = false
  }
  if(allstates){

    buttonsDIV.style.display = "block"

  } else {
    buttonsDIV.style.display = "none"

  }

}

//Winkelmand default Data
var winkelmand = {
  type: "Rolluikblad",
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
  kleuronderlat: "",
  ralonderlat: "",
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
  checkValues()
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
    getTypeLamel()
    // toggleVisibility(hoogteDiv, true)
    breedtestate = true
    checkstate()

    winkelmand.breedte = breedte.value
    return
  } else {
    
    breedtestate = false
    winkelmand.breedte = 0
    checkstate()
  }
}
/* Indien Hoogte aangepast word */

hoogte.oninput = async function () {
  try {
    if (hoogte.value >= 200 && hoogte.value < 3001) {


      const data = await goFetch("/rolluikblad/typeafwerking", "rolluikblad");

      var _value = `<div class="form-group">
        <span style="font-weight: bold;">Uw opgegeven afmetingen zijn:</span>
      </div>`;
      
      data.forEach((element) => {
        console.log('element', element, typeof element.benaming)
        _value += `<div class="form-check">
          <input class="form-check-input" type="radio" value="${element.benaming}" name="typeafwerking" id="${element.benaming}" onchange="typeafwerkingChange(value)" ${element.benaming === winkelmand.typeafwerking ? 'checked' : ''}>
          <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
              <img class="fancybox" src="/img/rolluiken/${element.img}" alt="${element.benaming} Image" style="width: 100px; height: 100px; margin-right: 10px;">
            
            ${element.omschrijving}
          </label>
        </div>`;
      });

      typeAfwerkingDiv.innerHTML = _value;
      hoogtestate = true
      checkstate()
      winkelmand.hoogte = hoogte.value;
      console.log('Data typeafwerking', data);
    } else {
      
      hoogtestate = false
      checkstate()
      winkelmand.hoogte = 0;
    }
  } catch (error) {
    console.error(error);
  }
};
window.typeafwerkingChange = function (value) {
  console.log('input',value)
    afwerkingstate = true
    winkelmand.typeafwerking = value
    checkstate()

  console.log('value typeafwerking', value)
  getTypeLamel()
}



async function typelamelchange() {
  try {
    const _lamel = this.value;
    winkelmand.typelamel = _lamel;

    const _data = await goFetch("/rolluikblad/kleurlamel", { lamel: _lamel });
    console.log('onderlat kleuren',_data)

    var _value = `<div class="form-group">
      <span style="font-weight: bold;">Kleur Lamel</span>
    </div>`;
var checked = false
    //loop door de data
    _data.forEach((element,index) => {
      //indien de kleur in de data gelijk is aan de kleur in de winkelmand, zet checked naar true
      if(element.kleur === winkelmand.kleurlamel){
        console.log('element kleuren',element.kleur,winkelmand.kleurlamel)
        checked = true
      }
      if(element.kleur === "Beige" || element.kleur === "Wit"){
        console.log("achtergrondkleur beige", element.RGB);
        _value += `<div class="form-check">
          <input class="form-check-input" type="radio" value="${element.kleur}" name="kleurlamel" id="${element.kleur + index.toString() + "kleurlamel"}" ${element.kleur === winkelmand.kleurlamel ? 'checked' : ''}>
          <label class="form-check-label" for="${element.kleur + index.toString() + "kleurlamel"}">
            <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
            ${element.kleur}  
          </label>
        </div>`;
      } else {
        console.log("achtergrondkleur anderekleur", element.RGB);
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
    if(checked){
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

/* Indien  kleur onderlat aangepast word*/
function kleuronderlatchange() {
  console.log('kleur onderlat aangepast')
  const _data = this.value
  winkelmand.kleuronderlat = this.value
  const _value = `<div class="form-group">
  <span style="font-weight: bold;">Aanslagtop</span>
</div>
  <div class="form-check">
      <input class="form-check-input" type="radio" value="Ja" id="Ja" name="aanslagtop" onchange="aanslagtopchange(value)" ${"Ja" === winkelmand.aanslagtop ? 'checked' : ''}>
      
         
      <label class="form-check-label" for="Ja" style="margin-left:30px">
       Ja
      </label>
     </div>
      <div class="form-check">
      <input class="form-check-input" type="radio" value="Nee" id="Nee" name="aanslagtop" onchange="aanslagtopchange(value)" ${"Nee" === winkelmand.aanslagtop ? 'checked' : ''}>
      <label class="form-check-label" for="Nee" style="margin-left:30px">
       Nee
      </label>
    </div`
  aanslagtopDIV.innerHTML = _value
  //-Indien RAL is aangeduid
  if (_data === "RAL") {
    //- Geef Dropdown van de rallijst weer
    getRal()
    kleuronderlatstate = true
    ralselecetd = true
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


function kleuronderlatralchange(value) {
console.log('value kleuronderlatralchange', value)
  console.log("ral changed")
}

function toggleVisibility(id, bool) {
  var element = id
  if (bool) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}




async function getMiniTradi(_lamel) {
  await goFetch("/rolluikblad/minitradi", _lamel)
    .then((_data) => {
      minitradi = _data
      lamel = _lamel
    }).catch(error => console.error(error))
}

function getKleurOnderlat() {
  console.log("minitradi", minitradi)
  goFetch("/rolluikblad/kleurOnderlat", minitradi)
    .then((_data) => {
      console.log("data")
      console.log(_data)
      var _value = `<div class="form-group">
    <span style="font-weight: bold;">Type Onderlat</span>
  </div>`
      _data.forEach((element,index) => {
        let ral = ""
        if(element.kleur != "Beige"){
ral = " - " + element.RAL
        }
        _value = _value + `<div class="form-check">
    <input class="form-check-input" type="radio" value="${element.kleur}" name="kleuronderlat" id="${element.kleur + index.toString() + "kleuronderlat"}" ${element.kleur === winkelmand.kleuronderlat ? 'checked' : ''}>
    <label class="form-check-label" for="${element.kleur + index.toString() + "kleuronderlat"}">
      <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
      ${element.kleur + ral}  
    </label>
  </div>
  `
      })
      _value = _value + `<div class="form-check">
    <input class="form-check-input" type="radio" value="RAL" name="kleuronderlat" id="RAL" ${"RAL" === winkelmand.kleuronderlat ? 'checked' : ''}>
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
let _RALData;
function getRal() {

  goFetch("/rolluikblad/kleurOnderlatRAL", minitradi)
    .then((_data) => {
      _RALData = _data
      var _value = `
      <div class="input-group">
      <span class="input-group-text" id="basic-addon1">RAL Code </span>
      <table>
      <tbody><tr><td> <input id="idRALCode" list="AE" name="RALCodes" placeholder="RAL Codes" class="form-control" aria-describedby="basic-addon1" onchange="ralchange(value)" oninput="ralchange(value)"/>
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
    let checked = false;
    _RALData.forEach(element => {
      if (element.alles === value) {
        checked = true
      }
    })
    if(checked){
      winkelmand.ralonderlat = value
      ralstate = true
      checkstate()
    } else {
      winkelmand.ralonderlat = ""
      ralstate = false
      checkstate()
    }


}

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
  } catch(err){
    console.log('Error')
  } finally {
    console.log('Function ended')
  }
}



window.aanslagtopchange = function (value) {
  //showButtons (Add to,addto and stay)
  winkelmand.aanslagtop = value
  aanslagtopstate = true;
  checkstate()
}





window.addToCartAndStay = () => { console.log("Toevoegen en naar winkelmand", winkelmand)
try {
goFetch("/rolluikblad/addtocart", winkelmand)
  .then((data) => {
    console.log("Toevoegen aan winkelmand en naar winkelmand", winkelmand)
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
} catch(err){
  console.error("error",err)
} 

}

window.addAndGoToCart = () => {
  console.log("Toevoegen en naar winkelmand", winkelmand)
  try {
  goFetch("/rolluikblad/addtocart", winkelmand)
    .then((data) => {
      console.log("Toevoegen aan winkelmand en naar winkelmand", winkelmand)
      console.log("returned data", data)
      
    alert("Toevoegen aan winkelmand gelukt")
      window.location.href = "/cart"
    })
    .catch((err)=>{
      alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen")
    })
  } catch(err){
    console.error("error",err)
  } 

}



/***** Functies *****/
function getTypeLamel() {
  if (breedte.value & hoogte.value) {
    goFetch("/rolluikblad/getData", {
        "breedte": breedte.value,
        "hoogte": hoogte.value
      })
      .then((data) => {
        console.log('data', data)
        var _data = data
        console.log('data type lamel', _data)
        var _value = `<div class="form-group">
    <span style="font-weight: bold;">Type Lamel</span>
  </div>`
        const count = _data.length;
        var checked = false;
        _data.forEach(element => {
          if(element.benaming === winkelmand.typelamel){
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
        if(checked){
          
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