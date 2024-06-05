const URL = "http://localhost:3000"

let offerteData;

function formaatGetal(aantal, input) {

  // Zet het getal om naar een getal met twee decimalen
  var afgerondGetal = input;

  // Scheid het getal in het gehele deel en het decimale deel
  var delen = afgerondGetal.toString().split('.');

  // Voeg nullen toe aan het decimale deel indien nodig
  var decimaalDeel = delen[1] ? delen[1].padEnd(2, '0') : '00';

  // Gebruik toLocaleString om het gehele deel te formatteren
  var geheelDeel = parseFloat(delen[0]).toLocaleString('nl-NL');

  // Combineer het gehele deel en het decimale deel met een komma ertussen
  var geformatteerdGetal = geheelDeel + ',' + decimaalDeel;
  if (aantal > 1) {

    return geformatteerdGetal + " /st.";
  } else {

    return geformatteerdGetal;
  }
}

function test() {

  // console.log(offerteData)
}

function fillContainerWithData(data) {
  const preparedData = prepareDataForParsing(data)
  // console.log('normal data', prepareDataForParsing)
  const _data = JSON.parse(preparedData)
  offerteData = _data
  // console.log('Data fillContainer', _data)
  const container = document.getElementById('offertesTabel')
  var value = `<table class="table table-hover align-middle ">
  <thead class="table-light custom-thead-color">
    <tr>
      <th scope="col">Aantal</th>
      <th scope="col">Naam</th>
      <th scope="col">Omschrijving</th>
      <th scope="col">Bruto (€)</th>
      <th scope="col">Korting (%)</th>
      <th scope="col">Netto (€)</th>
    </tr>
  </thead>
  <tbody>`
  var totaalNetto = 0
  var totaalBruto = 0
  var totaalNettoInclBTW = 0

  _data.forEach((element, index) => {
    var nettoStuk = 0
    var brutoStuk = 0
    if (element.type) {

      //aanpassingen te doen voor dat deze weergegeven worden
      if (element.type === "Rolluikblad") {
        element.omschrijving = "Rolluikblad"

      } else if (element.type === "Tradirolluik") {
        element.omschrijving = "Inbouwrolluik"

      } else if (element.tyme === "Voorzetrolluik") {
        element.omschrijving = "Voorzetrolluik"

      }

      //Elk type heeft een Positie


      value += `
        
        <tr>
          <td></td>
          <td>Positie</td>
          <td>${element.positie}</td>
          <td></td>
          <td></td>
          <td></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`

      if (element.type === "Rolluikblad") {
        const korting = element.typelamel + element.type + 'korting';
        const netto = Math.round(Number((element.RBbladprijs - (element.RBbladprijs * element[korting] / 100)).toFixed(2)))
        brutoStuk += Number(element.RBbladprijs) * element.aantal
        totaalBruto += Number(element.RBbladprijs) * Number(element.aantal)
        nettoStuk += netto * element.aantal
        totaalNetto += netto * element.aantal
       value += `<tr>
        <td>${element.aantal}</td>
        <td>Type</td>
        <td>${element.omschrijving}</td>
        <td>${formaatGetal(element.aantal,element.RBbladprijs.toFixed(2))}</td>
        <td>${element[korting]}</td>
        <td>${formaatGetal(element.aantal,netto)}</td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`

      if (element.afgbreedte && element.afghoogte) {
        value += `
<tr>
  <td></td>
  <td>Afgewerkte maten (Br x H)</td>
  <td>${element.afgbreedte} x ${element.afghoogte} mm</td>
  <td></td>
  <td></td>
  <td></td>
  <!-- voeg andere kolommen toe indien nodig -->
</tr>`
      }
       
        if (element.kleurlamelRAL) {
          value += `
      <tr>
        <td></td>
        <td>Type lamel</td>
        <td>${element.typelamelomschrijving + " - " + element.kleurlamel  + " - RAL " + element.kleurlamelRAL}</td>
        <td></td>
        <td></td>
        <td></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
        } else {
          value += `
      <tr>
        <td></td>
        <td>Type lamel</td>
        <td>${element.typelamel + " - " + element.kleurlamel }</td>
        <td></td>
        <td></td>
        <td></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
        }
        value += `
        <tr>
          <td></td>
          <td>Uitvoering blad</td>
          <td>${element.uitvoeringbladomschrijving}</td>
          <td></td>
          <td></td>
          <td></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        

        if (element.kleuronderlat) {
          // console.log('kleuronderlat gevonden', element.kleuronderlat)
          if (element.kleuronderlat === "RAL") {
            // console.log('RAL gevonden onderlat')
            const netto = Number((element.RBlakprijs - ((element.RBlakprijs * element.bladlakkerijkorting) / 100)).toFixed(2))
            // console.log('Netto prijs', netto,typeof netto)

            brutoStuk += element.RBlakprijs * element.aantal
            totaalBruto += Number(element.RBlakprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `
<tr>
<td>${element.aantal}</td>
<td>Kleur onderlat</td>
<td >${element.kleuronderlat + ' ' + element.odlral + ' - ' + element.odluitvoering + ' - ' + element.odlomschrijving + ' - ' + element.odlaecode}</td>
<td >${formaatGetal(element.aantal,element.RBlakprijs.toFixed(2))}</td>
<td >${element.bladlakkerijkorting}</td>
<td >${formaatGetal(element.aantal,netto)}</td>
<!-- voeg andere kolommen toe indien nodig -->
</tr>
`
          } else {
            let ral = ""
            let aecode = ""
            if (element.ralonderlat) {
              ral = "RAL " + element.ralonderlat + " - "
            }
            if (element.odlaecode) {
              aecode = " - " + element.odlaecode
            }
            value += `
<tr>
<td></td>
<td >Kleur onderlat</td>
<td >${(element.ralonderlat ? "RAL " + element.ralonderlat + " - " : "") + element.kleuronderlat + (element.odlaecode ? " - " + element.odlaecode : "")}</td>
<td ></td>
<td ></td>
<td ></td>
<!-- voeg andere kolommen toe indien nodig -->
</tr>`
          }

        }

        if (element.aanslagtop) {
          value += `
        <tr>
          <td></td>
          <td >Aanslagtop</td>
          <td >${element.aanslagtop}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        }
      } else if (element.type === "Tradirolluik") {
        const korting = element.typelamel + element.typebediening + element.type + 'korting';
        const netto = Math.round(Number((element.RBbladprijs - (element.RBbladprijs * element[korting] / 100).toFixed(2))))

        brutoStuk += element.RBbladprijs * element.aantal
        totaalBruto += Number(element.RBbladprijs) * Number(element.aantal)
        nettoStuk += netto * element.aantal
        totaalNetto += netto * element.aantal

        value += `
        <tr>
          <td>${element.aantal}</td>
          <td>Type</td>
          <td>${element.omschrijving}</td>
          <td>${formaatGetal(element.aantal,element.RBbladprijs.toFixed(2))}</td>
          <td>${element[korting]}</td>
          <td>${formaatGetal(element.aantal,netto)}</td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`

        if (element.afgbreedte && element.afghoogte) {
          value += `
  <tr>
    <td></td>
    <td>Afgewerkte maten (Br x H)</td>
    <td>${element.afgbreedte} x ${element.afghoogte} mm</td>
    <td></td>
    <td></td>
    <td></td>
    <!-- voeg andere kolommen toe indien nodig -->
  </tr>`
        }

        if (element.kleurlamelRAL) {
        
          value += `
      <tr>
        <td></td>
        <td>Type lamel</td>
        <td>${element.typelamel + " - " + element.kleurlamel + "- RAL " + element.kleurlamelRAL}</td>
        <td></td>
        <td></td>
        <td></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
        } else {
          value += `
      <tr>
        <td>${element.aantal}</td>
        <td>Type lamel</td>
        <td>${element.typelamel + " - " + element.kleurlamel  + " - " + element.uitvoeringbladomschrijving}</td>
        <td></td>
        <td></td>
        <td></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
        }

        value += `
        <tr>
          <td></td>
          <td>Uitvoering blad</td>
          <td>${element.uitvoeringbladomschrijving}</td>
          <td></td>
          <td></td>
          <td></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        
        if (element.kleuronderlat) {
          // console.log('kleuronderlat gevonden', element.kleuronderlat)
          if (element.kleuronderlat === "RAL") {
            // console.log('RAL gevonden onderlat')
            const netto = Number((element.RBlakprijs - (element.RBlakprijs * element.tradilakkerijkorting / 100)).toFixed(2))

            brutoStuk += element.RBlakprijs * element.aantal
            totaalBruto += Number(element.RBlakprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `
<tr>
  <td>${element.aantal}</td>
  <td>Kleur onderlat</td>
  <td >${element.kleuronderlat + ' ' + element.odlral + ' - ' + element.odlaecode + ' - ' + element.odluitvoering}</td>
  <td >${formaatGetal(element.aantal,element.RBlakprijs.toFixed(2))}</td>
  <td >${element.tradilakkerijkorting}</td>
  <td >${formaatGetal(element.aantal,netto)}</td>
  <!-- voeg andere kolommen toe indien nodig -->
</tr>
`
          } else {
            value += `
              <tr>
                <td></td>
                <td >Kleur onderlat</td>
                <td >${ (element.ralonderlat ? "RAL " + element.ralonderlat + ' - ' :"") + element.kleuronderlat  + (element.odlaecode ? " - " + element.odlaecode : "")}</td>
                <td ></td>
                <td ></td>
                <td ></td>
                <!-- voeg andere kolommen toe indien nodig -->
              </tr>`


          }

        }

        if (element.typebediening) {
          if (element.typebedieningPrijs) {
            const netto = Number((Number(element.typebedieningPrijs) - (Number(element.typebedieningPrijs) * element.Tradibedieningkorting / 100)).toFixed(2))

            brutoStuk += Number(element.typebedieningPrijs) * Number(element.aantal)
            totaalBruto += Number(element.typebedieningPrijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `
          <tr>
            <td></td>
            <td >Type bediening</td>
            <td >${element.typebedieningOmschrijving}</td>
            <td >${formaatGetal(element.aantal,Number(element.typebedieningPrijs).toFixed(2))}</td>
            <td >${element.Tradibedieningkorting}</td>
            <td >${formaatGetal(element.aantal,netto)}</td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          } else {
            value += `
          <tr>
            <td></td>
            <td >Type Bediening</td>
            <td >${element.typebedieningOmschrijving}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          }

        }

        if (element.typebediening === "afstandsbediening" || element.typebediening === "afstandsbedieningsolar") {
          if (element.zendersOmschrijving === "geen") {
            value += `<tr>
          <td></td>
          <td >Zenders</td>
          <td >${element.zendersOmschrijving}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          } else {

            const _data = JSON.parse(JSON.stringify(element.zendersOmschrijving)).zenders
            // console.log('zenders data', _data)
            var checked = false
            var _zenders = []
            for (const [index, zender] of _data.entries()) {
              // console.log('zender', zender)

              if (zender.benaming === "geen" && zender.checked) {
                value += `<tr>
    <td></td>
    <td >Zender</td>
    <td >Geen</td>
    <td ></td>
    <td ></td>
    <td ></td>
    <!-- voeg andere kolommen toe indien nodig -->
    </tr>`

              } else if (zender && zender.aantal > 0) {
                const netto = (zender.feryn === true) ? Number(zender.prijs) : Number((zender.prijs - (zender.prijs * element.Tradizenderkorting / 100)).toFixed(2))
                brutoStuk += Number(zender.prijs) * zender.aantal
                totaalBruto += Number(zender.prijs) * Number(zender.aantal)
                nettoStuk += netto * zender.aantal
                totaalNetto += netto * zender.aantal
                checked = true;
                //zoek juiste omschrijving - > zet het in de plaats
                value += `<tr>
    <td>${zender.aantal}</td>
    <td >Zender</td>
    <td >${zender.omschrijving}</td>
    <td >${formaatGetal(zender.aantal,Number(zender.prijs).toFixed(2))}</td>
    <td >${(zender.prijs === true) ? 0 : element.Tradizenderkorting}</td>
    <td >${formaatGetal(zender.aantal,netto)}</td>
    <!-- voeg andere kolommen toe indien nodig -->
    </tr>`

              }
            }
          }
        } else if (element.typebediening === "schakelaar") {
          if (element.schakelaarprijs) {
            const netto = Number((element.schakelaarprijs - (element.schakelaarprijs * element.Tradischakelaarkorting / 100)).toFixed(2))
            brutoStuk += Number(element.schakelaarprijs) * element.aantal
            totaalBruto += Number(element.schakelaarprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `<tr>
            <td></td>
            <td >Schakelaar</td>
            <td >${element.schakelaarOmschrijving}</td>
            <td >${formaatGetal(element.aantal,Number(element.schakelaarprijs).toFixed(2))}</td>
            <td >${element.Tradischakelaarkorting}</td>
            <td >${formaatGetal(element.aantal,netto)}</td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
          } else {
            if(element.schakelaar !== "geen"){
              value += `<tr>
              <td></td>
              <td >Schakelaar</td>
              <td >${element.schakelaarOmschrijving}</td>
              <td ></td>
              <td ></td>
              <td ></td>
              <!-- voeg andere kolommen toe indien nodig -->
              </tr>`
            } else {
              value += `<tr>
              <td></td>
              <td >Schakelaar</td>
              <td >Geen</td>
              <td ></td>
              <td ></td>
              <td ></td>
              <!-- voeg andere kolommen toe indien nodig -->
              </tr>`
            }
           
          }

        } else if (element.typebediening === "manueel") {

          const _data = JSON.parse(JSON.stringify(element.manueelData)).manueel
          // // console.log('_data', _data)
          if (_data !== "geen" && _data) {
            _data.forEach((zenderElement, index) => {
              if (zenderElement.benaming !== "geen" && zenderElement.benaming) {
                const netto = Number((zenderElement.prijs - (zenderElement.prijs * element.Tradimanueelkorting / 100)).toFixed(2))

                brutoStuk += Number(zenderElement.prijs) * element.aantal
                totaalBruto += Number(zenderElement.prijs) * Number(element.aantal)
                nettoStuk += netto * element.aantal
                totaalNetto += netto * element.aantal
                value += `<tr>
          <td></td>
          <td >Extra optie</td>
          <td >${zenderElement.omschrijving}</td>
          <td >${formaatGetal(element.aantal,Number(zenderElement.prijs).toFixed(2))}</td>
          <td >${element.Tradimanueelkorting}</td>
          <td >${formaatGetal(element.aantal,netto)}</td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
              } else {
                return
              }


            })
          } else {
            value += `<tr>
          <td></td>
          <td >Extra opties</td>
          <td >Geen</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
          }


        }
        if (element.aanslagtop) {
          value += `
        <tr>
          <td></td>
          <td >Aanslagtop</td>
          <td >${element.aanslagtop}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        }


      } else if (element.type === "Voorzetrolluik") {
        const korting = element.typelamel + element.typebediening + element.type + 'korting';
        // console.log('element.typelamel', element.typelamel, 'element.typebediening', element.typebediening, 'element.type', element.type, 'korting', korting,'element[korting]', element.ULTRA42schakelaarVoorzetrolluikkorting)

        const netto = (element.feryndb === 1) ? Number(element.vzrprijs) : Math.round(Number((element.vzrprijs - (element.vzrprijs * element[korting] / 100)).toFixed(2)))
        brutoStuk += element.vzrprijs * element.aantal
        totaalBruto += Number(element.vzrprijs) * Number(element.aantal)
        nettoStuk += netto * element.aantal
        totaalNetto += netto * element.aantal
        value += `<tr>
        <td>${element.aantal}</td>
        <td>Type</td>
        <td>${element.type}</td>
        <td>${formaatGetal(element.aantal,element.vzrprijs.toFixed(2))}</td>
        <td>${(element.feryndb === 1) ? 0 : element[korting]}</td>
        <td>${formaatGetal(element.aantal,netto)}</td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`

      if (element.afgbreedte && element.afghoogte) {
        value += `
    <tr>
      <td></td>
      <td>Afgewerkte maten (Br x H)</td>
      <td>${element.afgbreedte} x ${element.afghoogte} mm</td>
      <td></td>
      <td></td>
      <td></td>
      <!-- voeg andere kolommen toe indien nodig -->
    </tr>`
      }
       
        value += `
        <tr>
          <td></td>
          <td>Type lamel</td>
          
          <td>${element.typelamelomschrijving + " - " + element.kleurlamel  + ((element.kleurlamelRAL !== null) ? " - RAL " + element.kleurlamelRAL : "")}</td>
          <td></td>
          <td></td>
          <td></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`

       value += ` <tr>
        <td></td>
        <td>Uitvoering blad</td>
        
        <td>${element.uitvoeringbladomschrijving}</td>
        <td></td>
        <td></td>
        <td></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`

       
        if (element.kleurkast) {
          if (element.kleurkast === "RAL" && element.klant.toLowerCase() != 'feryn') {
            // console.log('RAL gevonden onderlat')
            const netto = Number((element.vzrlakprijs - (element.vzrlakprijs * element.vzrlakkerijkorting / 100)).toFixed(2))

            brutoStuk += element.vzrlakprijs * element.aantal
            totaalBruto += Number(element.vzrlakprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `
      <tr>
        <td></td>
        <td>Kleur kast, gel. & odl.</td>
        <td >${element.kleurkast + ' RAL - ' + element.kastral + ' - ' + element.kastaecode + ' - ' + element.kastuitvoering}</td>
        <td >${formaatGetal(element.aantal,element.vzrlakprijs.toFixed(2))}</td>
        <td >${element.vzrlakkerijkorting}</td>
        <td >${formaatGetal(element.aantal,netto)}</td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
          } else {


            value += `
              <tr>
                <td></td>
                <td>Kleur kast, gel. & odl.</td>
                 <td>${element.kleurkast + 
    (element.kleurkastral ? " - RAL " + element.kleurkastral : "") +
    (element.kastaecode ? " - " + element.kastaecode : "")}</td>
                <td ></td>
                <td ></td>
                <td ></td>
                <!-- voeg andere kolommen toe indien nodig -->
              </tr>`


          }

        }
        value += `
        <tr>
          <td></td>
          <td >Kastgrootte</td>
          <td >${element.kastdata}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`

        value += `
        <tr>
          <td></td>
          <td >Geleider links</td>
          <td >${element.typegeleiderlinksOmschrijving}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`

        value += `
        <tr>
          <td></td>
          <td >Geleider rechts</td>
          <td >${element.typegeleiderrechtsOmschrijving}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`


        if (element.typebediening) {
          if (element.typebedieningPrijs) {
            var newBedieningskant = ""
            if (element.typelintofmotor === "veeras") {
              newBedieningskant = ""
            } else {
              newBedieningskant = element.typebedieningskantOmschrijving
            }

            const netto = Number((Number(element.typebedieningPrijs) - (Number(element.typebedieningPrijs) * element.VZRbedieningkorting / 100)).toFixed(2))

            brutoStuk += Number(element.typebedieningPrijs) * element.aantal
            totaalBruto += Number(element.typebedieningPrijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `
          <tr>
            <td></td>
            <td >Bediening</td>
            <td >${element.typebedieningOmschrijving}</td>
            <td >${formaatGetal(element.aantal,element.typebedieningPrijs.toFixed(2))}</td>
            <td >${element.VZRbedieningkorting}</td>
            <td >${formaatGetal(element.aantal,netto)}</td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          if(newBedieningskant !== ""){
            value += `<tr>
            <td></td>
            <td >Bedieningskant</td>
            <td >${newBedieningskant}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          }
          


            if (element.typelintofmotor === "veeras" || element.typelintofmotor === "csi" || element.typelintofmotor === "csirts") {

              value += `
            <tr>
              <td></td>
              <td >Kast positie</td>
              <td >${element.kastbinnenbuitenomschrijving}</td>
              <td ></td>
              <td ></td>
              <td ></td>
              <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
            }
          } else {
            value += `
          <tr>
            <td></td>
            <td >Bediening</td>
            <td >${element.typebedieningOmschrijving}</td>
            <td ></td>}
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`

          value += `
          <tr>
            <td></td>
            <td >Bedieningskant</td>
            <td >${element.typebedieningskantOmschrijving}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
          </tr>`

          }
          
       
          

        }

        if (element.typebediening === "afstandsbediening" || element.typebediening === "afstandsbedieningsolar") {
          if (element.zendersOmschrijving === "geen") {
            value += `<tr>
          <td></td>
          <td >Zenders</td>
          <td >${element.zendersOmschrijving}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
          </tr>`
          } else {

            const _oldData = JSON.parse(JSON.stringify(element.zendersOmschrijving))
            // console.log('old data', _oldData, typeof _oldData)
            let _data;
            if (typeof _data === "string") {
              _data = JSON.parse(_oldData).zenders
            } else {
              _data = _oldData.zenders
            }
            // console.log('zenders data', _data)
            var checked = false
            var _zenders = []
            for (const [index, zender] of _data.entries()) {
              // console.log('zender', zender)

              if (zender.benaming === "geen" && zender.checked) {
                value += `<tr>
    <td></td>
    <td >Zender</td>
    <td >Geen</td>
    <td ></td>
    <td ></td>
    <td ></td>
    <!-- voeg andere kolommen toe indien nodig -->
    </tr>`

              } else if (zender && zender.aantal > 0) {
                const netto = (zender.feryn === true) ? Number(zender.prijs) : Number((zender.prijs - (zender.prijs * element.VZRzenderkorting / 100)).toFixed(2))
                brutoStuk += zender.prijs * zender.aantal
                totaalBruto += Number(zender.prijs) * Number(zender.aantal)
                nettoStuk += netto * zender.aantal
                totaalNetto += netto * zender.aantal
                checked = true;
                //zoek juiste omschrijving - > zet het in de plaats
                value += `<tr>
    <td>${zender.aantal}</td>
    <td >Zender</td>
    <td >${zender.omschrijving}</td>
    <td >${formaatGetal(zender.aantal,zender.prijs)}</td>
    <td >${(zender.feryn === true) ? 0 : element.VZRzenderkorting}</td>
    <td >${formaatGetal(zender.aantal,netto)}</td>
    <!-- voeg andere kolommen toe indien nodig -->
    </tr>`

              }
            }
          }
        }
        if (element.typebediening === "schakelaar") {
          if (element.schakelaarprijs && element.schakelaarprijs > 0) {
            const netto = Number((element.schakelaarprijs - (element.schakelaarprijs * element.VZRschakelaarkorting / 100)).toFixed(2))
            brutoStuk += element.schakelaarprijs * element.aantal
            totaalBruto += Number(element.schakelaarprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            checked = true;
            //zoek juiste omschrijving - > zet het in de plaats
            value += `<tr>
<td>${element.aantal}</td>
<td >Schakelaar</td>
<td >${element.schakelaarOmschrijving}</td>
<td >${formaatGetal(element.aantal,element.schakelaarprijs.toFixed(2))}</td>
<td >${element.VZRschakelaarkorting}</td>
<td >${formaatGetal(element.aantal,netto)}</td>
<!-- voeg andere kolommen toe indien nodig -->
</tr>`
          } else {

            checked = true;
            value += `<tr>
  <td>${element.aantal}</td>
  <td >Schakelaar</td>
  <td >${(element.schakelaar === "geen") ? "Geen" : element.schakelaarOmschrijving}</td>
  <td ></td>
  <td ></td>
  <td ></td>
  </tr>`
          }


        } else if (element.typebediening === "manueel") {
          if (element.typelintofmotor === "veeras") {

          } else {

            let _data = JSON.parse(JSON.stringify(element.manueelData))
            if (typeof _data === "string") {
              _data = JSON.parse(_data).manueel
            } else {
              _data = _data.manueel
            }
            // console.log('_data', _data)
            if (_data !== "geen") {
              _data.forEach((zenderElement, index) => {
                if (zenderElement.benaming !== "geen" && zenderElement.benaming) {
                  const netto = Number((zenderElement.prijs - (zenderElement.prijs * element.VZRmanueelkorting / 100)).toFixed(2))

                  brutoStuk += zenderElement.prijs * element.aantal
                  totaalBruto += zenderElement.prijs * element.aantal
                  nettoStuk += netto * element.aantal
                  totaalNetto += netto * element.aantal
                  value += `<tr>
          <td></td>
          <td >Extra optie</td>
          <td >${zenderElement.benaming}</td>
          <td >${formaatGetal(element.aantal,Number(zenderElement.prijs).toFixed(2))}</td>
          <td >${element.VZRmanueelkorting}</td>
          <td >${formaatGetal(element.aantal,netto)}</td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
                } else {
                  return
                }


              })
            } else {
              value += `<tr>
          <td></td>
          <td >Extra opties</td>
          <td >Geen</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
            }
          }

        }
        if (element.geleiderstoppen != "geen") {
          const korting = element.typelamel + element.typebediening + element.type + 'korting';
          const netto = (Number((Number(element.geleiderstopprijs) - (Number(element.geleiderstopprijs) * element[korting] / 100)).toFixed(2)) * 2)

          brutoStuk += (Number(element.geleiderstopprijs) * 2) * element.aantal
          totaalBruto += (Number(element.geleiderstopprijs * 2) * Number(element.aantal))
          nettoStuk += (netto * element.aantal)
          totaalNetto += (netto * element.aantal)
          value += `<tr>
          <td scope="row"></td>
          <td >Geleiderstop</td>
          <td >${element.geleiderstoppen}</td>
          <td >${formaatGetal(element.aantal,(element.geleiderstopprijs*2))}</td>
          <td >${element[korting]}</td>
          <td >${formaatGetal(element.aantal,netto)}</td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        }
      } else if (element.type === "Screen") {
        // console.log('Screen')
        if (element.type) {
          const korting = "screen" + element.kastgrootte.toString() + element.typebediening
          const netto = (element.feryndb === 1) ? Math.round(element.screenprijs) : Math.round(Number((element.screenprijs - (element.screenprijs * element[korting] / 100)).toFixed(2)))
          brutoStuk += element.screenprijs * element.aantal
          totaalBruto += Number(element.screenprijs) * Number(element.aantal)
          nettoStuk += netto * element.aantal
          totaalNetto += netto * element.aantal

          value += `<tr>
  <td scope="row">${element.aantal}</td>
  <td >Type</td>
  <td >${"Screen Lounge " + element.kastgrootte}</td>
  <td >${formaatGetal(element.aantal,element.screenprijs.toFixed(2))}</td>
  <td >${(element.feryndb === 1) ? 0 :  element[korting]}</td>
  <td >${formaatGetal(element.aantal,netto)}</td>
  <!-- voeg andere kolommen toe indien nodig -->
</tr>`
        }
        if (element.afgbreedte && element.afghoogte) {
          value += `<tr>
          <td scope="row"></td>
          <td >Afgewerkte maten (Br x H)</td>
          <td >${element.afgbreedte + " x " + element.afghoogte + " mm"}</td>
          <td ></td>
          <td ></td>
          <td ></td>
          <!-- voeg andere kolommen toe indien nodig -->
        </tr>`
        }
        if (element.typedoek) {
          const netto = Number((element.typedoekprijs - (element.typedoekprijs * element.screendoekkorting / 100)).toFixed(2))
          brutoStuk += element.typedoekprijs * element.aantal
          totaalBruto += Number(element.typedoekprijs) * Number(element.aantal)
          nettoStuk += netto * element.aantal
          totaalNetto += netto * element.aantal
          if (element.typedoekprijs && element.typedoekprijs > 0) {
            value += `<tr>
            <td>${element.aantal}</td>
            <td >Type doek</td>
            <td >${element.typedoekOmschrijving + " - " + element.doekOmschrijving + " - " + element.confectie}</td>
            <td >${formaatGetal(element.aantal,element.typedoekprijs.toFixed(2))}</td>
            <td >${element.screendoekkorting}</td>
            <td >${formaatGetal(element.aantal,netto)}</td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
          } else {
            value += `<tr>
            <td></td>
            <td >Type doek</td>
            <td >${element.typedoekOmschrijving + " - " + element.doekOmschrijving + " - " + element.confectie}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
          }


        }

        if (element.typebediening) {
          if (element.typebediening === "somfyio" || element.typebediening === "somfyiosolar") {
            value += `<tr>
            <td></td>
            <td >Type bediening</td>
            <td >${element.typebedieningOmschrijving + " - " + element.typebedieningskantOmschrijving}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
            // console.log('zenders omschrijving', element.zendersOmschrijving)
            if (element.zendersOmschrijving === "geen") {
              value += `<tr>
            <td></td>
            <td >Zenders</td>
            <td >${element.zendersOmschrijving}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
            } else {

              const _data = JSON.parse(JSON.stringify(element.zendersOmschrijving)).zenders
              // console.log('zenders data', _data)
              var checked = false
              var _zenders = []
              for (const [index, zender] of _data.entries()) {
                // console.log('zender', zender)

                if (zender.benaming === "geen" && zender.checked) {
                  value += `<tr>
      <td></td>
      <td >Zender</td>
      <td >Geen</td>
      <td ></td>
      <td ></td>
      <td ></td>
      <!-- voeg andere kolommen toe indien nodig -->
      </tr>`

                } else if (zender && zender.aantal > 0) {
                  const netto = Number((zender.prijs - (zender.prijs * element.screenzenderkorting / 100)).toFixed(2))
                  brutoStuk += Number(zender.prijs) * zender.aantal
                  totaalBruto += Number(zender.prijs) * Number(zender.aantal)
                  nettoStuk += netto * zender.aantal
                  totaalNetto += netto * zender.aantal
                  checked = true;
                  //zoek juiste omschrijving - > zet het in de plaats
                  value += `<tr>
      <td>${zender.aantal}</td>
      <td >Zender</td>
      <td >${zender.benaming}</td>
      <td >${formaatGetal(zender.aantal,Number(zender.prijs).toFixed(2))}</td>
      <td >${element.screenzenderkorting}</td>
      <td >${formaatGetal(zender.aantal,netto)}</td>
      <!-- voeg andere kolommen toe indien nodig -->
      </tr>`

                }
              }
            }
          } else {
            value += `<tr>
            <td></td>
            <td >Type bediening</td>
            <td >${element.typebedieningOmschrijving + " - " + element.typebedieningskantOmschrijving}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
            if (element.schakelaar && element.schakelaar != "geen") {
              if (element.schakelaarprijs) {
                const netto = Number((element.schakelaarprijs - (element.schakelaarprijs * element.screenschakelaarkorting / 100)).toFixed(2))
                brutoStuk += Number(element.schakelaarprijs) * element.aantal
                totaalBruto += Number(element.schakelaarprijs) * Number(element.aantal)
                nettoStuk += netto * element.aantal
                totaalNetto += netto * element.aantal
                value += `<tr>
                <td></td>
                <td >Schakelaar</td>
                <td >${element.schakelaarOmschrijving}</td>
                <td >${formaatGetal(element.aantal,Number(element.schakelaarprijs).toFixed(2))}</td>
                <td >${element.screenschakelaarkorting}</td>
                <td >${formaatGetal(element.aantal,netto)}</td>
                <!-- voeg andere kolommen toe indien nodig -->
                </tr>`
              } else {
                value += `<tr>
                <td></td>
                <td >Schakelaar</td>
                <td >${element.schakelaarOmschrijving}</td>
                <td ></td>
                <td ></td>
                <td ></td>
                <!-- voeg andere kolommen toe indien nodig -->
                </tr>`
              }
            }
          }
        }

        if (element.kleurkast) {
          if (element.kleurkast === "RAL") {
            const netto = Number((element.screenlakprijs - (element.screenlakprijs * element.screenlakkerijkorting / 100)).toFixed(2))
            brutoStuk += element.screenlakprijs * element.aantal
            totaalBruto += Number(element.screenlakprijs) * Number(element.aantal)
            nettoStuk += netto * element.aantal
            totaalNetto += netto * element.aantal
            value += `<tr>
            <td></td>
            <td >Kleurkast</td>
            <td >${"RAL " + element.kastral + " - " + element.kastaecode + " - " + element.kastuitvoering + " - " + element.kastomschrijving}</td>
            <td >${formaatGetal(element.aantal,element.screenlakprijs.toFixed(2))}</td>
            <td >${element.screenlakkerijkorting}</td>
            <td >${formaatGetal(element.aantal,netto)}</td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
          } else {


            if (element.kastral) {
              value += `<tr>
            <td></td>
            <td >Kleurkast</td>
            <td >${"RAL " + element.kastral +" - " + element.kastkleur + " - " + element.kastuitvoering + " - " + element.kastaecode}</td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- voeg andere kolommen toe indien nodig -->
            </tr>`
            } else {
              value += `<tr>
              <td></td>
              <td >Kleurkast</td>
              <td >${element.kastkleur + " - " + element.kastuitvoering + " - " + element.kastaecode}</td>
              <td ></td>
              <td ></td>
              <td ></td>
              <!-- voeg andere kolommen toe indien nodig -->
              </tr>`
            }

          }
        }


      }
      if (element.Opmerking) {
        value += `<tr>
        <td scope="row"></td>
        <td >Opmerking</td>
        <td >${element.Opmerking}</td>
        <td ></td>
        <td ></td>
        <td ></td>
        <!-- voeg andere kolommen toe indien nodig -->
      </tr>`
      }


      //end



      if (element.type === "Screen") {
        value += `
  <tr style="color : red;">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><b></b></td>
      <!-- voeg andere kolommen toe indien nodig -->
    </tr>
  </tbody>`
        value += `
<tr style="color : red;">
    <td></td>
    <td></td>
    <td>Totaal positie:</td>
    <td>${formaatGetal(1,(brutoStuk).toFixed(2))}</td>
    <td></td>
    <td style="border: 2px solid black; border-color: red"><b>${formaatGetal(1,(nettoStuk).toFixed(2))}</b></td>
    <!-- voeg andere kolommen toe indien nodig -->
  </tr>
  <tr>
    <td>
      <button class="btn btn-danger" onclick="removeFromOfferte(${index})">Verwijder</button>
    </td>
  </tr>
</tbody>`
      } else {
        value += `
  <tr style="color : red;">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><b></b></td>
      <!-- voeg andere kolommen toe indien nodig -->
    </tr>
  </tbody>`
        value += `
<tr style="color : red;">
    <td></td>
    <td></td>
    <td>Totaal positie: ${element.positie}</td>
    <td>${formaatGetal(1,Number(brutoStuk).toFixed(2))}</td>
    <td></td>
    <td><b>${formaatGetal(1,Number(nettoStuk).toFixed(2))}</b></td>
    <!-- voeg andere kolommen toe indien nodig -->
  </tr>
  <tr>
    <td colspan="1">
      <button class="btn btn-danger" onclick="removeFromOfferte(${index})">Verwijder</button>
    </td>
  </tr>
</tbody>`
      }
      //leeg veld voor scheiding te voorzien tussen het rolluik en de totaalprijs.


      //le
      value += `
    <tr class="custom-row">
    <td></th>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <!-- voeg andere kolommen toe indien nodig -->
  </tr>`

    }
  })
  // console.log('totaal bruto', totaalBruto, "typeof", typeof totaalBruto)
  value += `
    <tbody>
      <tr>
      <td style="color:#000080"></td>
      <td style="color:#000080"></td>
        <td style="color:#000080"><b>Bruto totaal:</b></td>
        <td><b>${formaatGetal(1,Number(totaalBruto).toFixed(2))}</b></td>
        <td style="color:#000080"><b>Netto totaal:</b></td>
        <td><b>${formaatGetal(1,Number(totaalNetto).toFixed(2))}</b></td>
      </tr>
      <tr>
      <td></td>
      <td></td>
      <td style="color:#000080"></td>
      <td style="color:#000080"></td>
        <td style="color:#000080"><b>BTW (21%):</b></td>
        <td><b>${formaatGetal(1,(Number(totaalNetto)/100*21).toFixed(2))}</b></td>
      </tr>
      <tr>
      <td></td>
      <td></td>
      <td style="color:#000080"></td>
      <td style="color:#000080"></td>
        <td style="color : red"><b>Netto totaal incl. BTW:</b></td>
        <td style="color : red;"><b>${formaatGetal(1,(Number(totaalNetto)*1.21).toFixed(2))}</b></td>
      </tr>
    </tbody>
  </table>
</div>
  


 
  
            `

  container.innerHTML = value
}
// console.log('Offerte data', offerte)
fillContainerWithData(offerte)


function prepareDataForParsing(data) {
  // Eerst converteren we de data naar een string indien het nog geen string is
  let dataString = typeof data === 'string' ? data : JSON.stringify(data);

  // Vervolgens vervangen we incorrect geformatteerde delen
  // Let op: Deze aanpak vereist dat je exact weet welke patronen je moet vervangen
  // en kan complex worden als de structuren variabel zijn
  dataString = dataString.replace(/"\{/g, '{').replace(/\}"/g, '}').replace(/\\\\"/g, '\\"');

  // Dit is een eenvoudige vervanging en kan niet alle gevallen afhandelen,
  // vooral als de data complexe of geneste objecten als strings bevat.
  // Je zou dit kunnen uitbreiden met meer specifieke regels indien nodig.
  return dataString;
}

function offertepdf() {
  // console.log('pdf doorgestuurd')
  fetch("/offertes/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: offerteData,
        user: user
      })
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Success:", data);
      if (data.success) {
        alert('pdf doorgestuurd');

      } else {
        alert('Er us iets fout gelopen tijdens het pdf proccess');
      }
    })
    .catch((error) => {
      console.error("Error:", error);

    })

}

function bestel() {

  const _data = offerteData
  //fetch

  const bevestigd = confirm("U staat op het punt om een bestelling te plaatsen. Gelieve op onderstaande knop te klikken om te bevestigen.") // moet knop bevestigen & annuleren weergeve
  //na de bevestiging past volgende uitvoeren
  if (bevestigd) {
    fetch("/offertes/bestel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: _data,
          user: user
        })
      })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Success:", data);
        if (data.success) {
          alert('Bestelling succesvol geplaatst');
          window.location.href = '/bestelling';
        } else {
          alert('Er us iets fout gelopen tijdens het bestel proccess');
        }
      })
      .catch((error) => {
        console.error("Error:", error);

      })
  } else {
    // console.log('Bestelling geannuleerd');
    alert('Bestelling geannuleerd.');
  }



}

function removeFromOfferte(index) {

  const dataToRemove = offerteData[index];

  goFetch("/offertes/removeFromOfferte", dataToRemove).then((data) => {
    if (data) {
      if (data.succes) {
        // console.log('succesvol verwijderd',data.message)
        window.location.href = `/offertes/ref/${offerteData[0].offerteRefNr}`;
      } else {
        window.location.href = `/offertes`
        // console.log('succesvol verwijderd',data.message)
      }
    } else {
      // console.log('error',data)
    }


  });
}

function goFetch(link, data) {
  return fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data
      }),
    })
    .then((response) => response.json())
    .then((data) => {


      return data;
    })
    .catch((error) => console.error(error));
}