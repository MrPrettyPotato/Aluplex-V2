//*****TO-DO******
//Functies aanpassen dat er in verschillende types geen zelfde functies gebruikt worden.

function pause(message) {
  return new Promise((resolve) => {
      if (confirm(message)) {
          resolve();
      }
  });
}
const URL = "http://localhost:3000";
var winkelData;
var newWinkelData;
var aanklanttoevoegen = false
var klant = ""
var klantID = ""
loadKlanten("")
loadData(user);

function filterklanten(data,value){
  return data.filter(klant => {
    let referentieTekst = [
      klant.bedrijf
  ].join(' ').toLowerCase();

  return referentieTekst.includes(value)
  })
}
function loadKlanten(newValue){
  goFetch("/cart/klantenlijst").then((data) => {
    // console.log('data', data)
    if(newValue != ""){
      data = filterklanten(data,newValue)
      console.log('nieuweData', data)
    }
    var value = "";
    value += `
   
    <option onclick="changeKlant(this)" value="default" name="default">Geen</option>`
    
    for (const [index, klant] of data.entries()) {
      console.log('klantID', klant.bedrijfID)
     value += ` <option value="${klant.bedrijf}" id="${klant.bedrijfID}">${klant.bedrijf} - ${klant.voornaam}</option>`
       
  }
  value += `</select>`
  document.getElementById("klanten").innerHTML = value

})
}



function changeKlant(){
  const dropdown = document.getElementById('klanten');
  const selectedOption = dropdown.options[dropdown.selectedIndex]
if(selectedOption.value === "default"){
  console.log('default selected')
  aanklanttoevoegen = false
} else {
  console.log('Niet default selected')
  aanklanttoevoegen = true
  klant = selectedOption.value
  klantID = selectedOption.id

}
console.log('aanklanttoevoegen', aanklanttoevoegen, 'klant', klant, 'klantID', klantID)
  
  // const data = JSON.parse(klanten)
}
window.changeKlant = changeKlant

async function loadData(user) {
  try {
    const data = await goFetch("/cart/winkelmand", user);
    winkelData = JSON.parse(JSON.stringify(data));


    console.log("winkelData", winkelData);

    const winkelmand = document.getElementById("winkelmand");
    var _value = "";

    for (const [index, element] of data.entries()) {

      let typelamelomschrijving;
      let kleurlamelomschrijving;
      let kleuronderlatRAL;
      let kleurkastRAL;

      //data op te slagen voor later gebruik.
      if (element.type === "Rolluikblad") {
        typelamelomschrijving = await getTypelamelOmschrijving(element.typelamel)
        kleurlamelomschrijving = await getKleurlamelOmschrijving(element.kleurlamel)
        kleuronderlatRAL = await getKleuronderlatRAL(element.kleuronderlat)

        winkelData[index].typelamelomschrijving = typelamelomschrijving
        winkelData[index].kleurlamelRAL = kleurlamelomschrijving.RAL.toString()

      } else if (element.type === "Tradirolluik") {
        typelamelomschrijving = await getTypelamelOmschrijving(element.typelamel)
        kleurlamelomschrijving = await getKleurlamelOmschrijving(element.kleurlamel)
        kleuronderlatRAL = await getKleuronderlatRAL(element.kleuronderlat)

        winkelData[index].typelamelomschrijving = typelamelomschrijving
        winkelData[index].kleurlamelRAL = kleurlamelomschrijving.RAL.toString()
      } else if (element.type === "Voorzetrolluik") {
        typelamelomschrijving = await getTypelamelOmschrijving(element.typelamel)
        kleurlamelomschrijving = await getKleurlamelOmschrijving(element.kleurlamel)
        // kleuronderlatRAL = await getKleuronderlatRAL(element.kleuronderlat)
        kleurkastRAL = await VZRgetKleurkastRAL(element.kleurkast)
        if (kleurlamelomschrijving) {
          console.log(kleurlamelomschrijving)

        }
        winkelData[index].typelamelomschrijving = typelamelomschrijving
        winkelData[index].kleurlamelRAL = kleurlamelomschrijving.RAL.toString()


      } else if (element.type === "Screen") {
        //bewerking voor de screens
      }

      if (index !== 0) {
        _value += ` <tr>
          <td bgcolor="grey"></td>
          <td bgcolor="grey"></td>
        </tr>`;
      }
      if (!winkelData[index].positie) {
        winkelData[index].positie = "R" + formatNumberWithTwoDigits(index);
      }
      if (element.type) {
        //Word voor alle types gebruikt
        if (!element.positie) {
          winkelData[index].positie = "R" + formatNumberWithTwoDigits(index)
        }
        _value =
          _value +
          ` <tr>
      <td>Positie</td>
      <td>${element.positie || "R" + formatNumberWithTwoDigits(index)}</td>
    </tr>`;
        _value =
          _value +
          ` <tr>
    <td>Aantal</td>
    <td>${element.aantal}</td>
  </tr>`;

        //Data om weer te geven op de cart pagina.
        if (element.type === "Rolluikblad") {
          const uitvoeringblad = await getomschrijving("uitvoeringblad", "benaming", element.uitvoeringblad)
          winkelData[index].uitvoeringbladomschrijving = uitvoeringblad
          _value =
            _value +
            ` <tr>
    <td>Rolluikblad</td>
    <td>${typelamelomschrijving + " - " + kleurlamelomschrijving.RAL + " - RAL " + element.kleurlamel + " - " + uitvoeringblad}</td>
  </tr>`;




          //bereken juiste maten.
          /* TODO */
          const afwerkingdata = await calculateAfgewerktematen(element.typeafwerking);
          console.log('afwerkingdata', afwerkingdata)
          //AANGEPAST NAAR JSON AANGEZIEN BIJ GEBRUIK VAN XAMPP ANDERS NEW DATA VERWIJDEREN
          const newData = JSON.parse(afwerkingdata.data)
          // const afwerkingdata = JSON.parse(afwerkingdataawait)
          const newBreedte = Number(element.breedte) + Number(newData.breedte);
          const newHoogte = Number(element.hoogte) + Number(newData.hoogte);
          winkelData[index].afgbreedte = newBreedte;
          winkelData[index].afghoogte = newHoogte;
          winkelData[index].typeafwerkingOmschrijving = afwerkingdata.omschrijving;
          if (Number(element.breedte) == newBreedte && Number(element.hoogte) == newHoogte) {
            _value =
              _value +
              ` <tr>
  <td>Afgewerkte maten (Br x h)</td>
  <td>${newBreedte + " x " + newHoogte + " - " + afwerkingdata.omschrijving}</td>
</tr>`;
          } else {


            _value =
              _value +
              ` <tr>
  <td>Doorgegeven maten (Br x h)</td>
  <td>${element.breedte + " x " + element.hoogte + " mm - " + afwerkingdata.omschrijving
            }</td>
</tr>`;

            _value =
              _value +
              ` <tr>
<td>Afgewerkte maten (Br x h)</td>
<td>${newBreedte + " x " + newHoogte + " mm"}</td>
</tr>`;
          }
          if (element.kleuronderlat === "RAL") {
            _value =
              _value +
              ` <tr>
    <td>Onderlat</td>
    <td>${element.kleuronderlat + " " + element.ralonderlat}</td>
  </tr>`;
          } else {
            winkelData[index].ralonderlat = kleuronderlatRAL.RAL
            winkelData[index].odlaecode = kleuronderlatRAL.aecode
            if (element.kleuronderlat === "Beige") {
              _value =
                _value +
                ` <tr>
    <td>Onderlat</td>
    <td>${element.kleuronderlat + " - " + winkelData[index].odlaecode}</td>
  </tr>`;
            } else {
              _value =
                _value +
                ` <tr>
    <td>Onderlat</td>
    <td>${"RAL " + winkelData[index].ralonderlat + " - " + element.kleuronderlat+ " - " + winkelData[index].odlaecode}</td>
  </tr>`;
            }




          }
          if (element.typeophangveer) {
            _value =
              _value +
              ` <tr>
        <td>Type ophangveer</td>
        <td>${element.typeophangveer}</td>
      </tr>`;
          }
          if (element.aanslagtop) {
            _value =
              _value +
              ` <tr>
      <td>Aanslagtop</td>
      <td>${element.aanslagtop}</td>
    </tr>`;
          }

        } else if (element.type === "Tradirolluik") {
          const uitvoeringblad = await getomschrijving("uitvoeringblad", "benaming", element.uitvoeringblad)
          winkelData[index].uitvoeringbladomschrijving = uitvoeringblad
          console.log("Tradirolluik", element);
          _value =
            _value +
            ` <tr>
    <td>Inbouwrolluik</td>
    <td>${typelamelomschrijving + " - " + kleurlamelomschrijving.RAL + " - RAL " + element.kleurlamel + " - " + uitvoeringblad}</td>
  </tr>`;



          //bereken juiste maten.
          /* TODO */
          const afwerkingdata = await calculateAfgewerktematen(element.typeafwerking);
          const newData = JSON.parse(afwerkingdata.data)
          console.log('newData', newData)
          const newBreedte = Number(element.breedte) + Number(newData.breedte);
          const newHoogte = Number(element.hoogte) + Number(newData.hoogte);
          winkelData[index].afgbreedte = newBreedte;
          winkelData[index].afghoogte = newHoogte;
          if (Number(element.breedte) == newBreedte && Number(element.hoogte) == newHoogte) {
            _value =
              _value +
              ` <tr>
  <td>Afgewerktematen (Br x h)</td>
  <td>${newBreedte + " x " + newHoogte + " - " + afwerkingdata.omschrijving}</td>
</tr>`;
          } else {


            _value =
              _value +
              ` <tr>
  <td>Doorgegeven maten (Br x h)</td>
  <td>${element.breedte + " x " + element.hoogte + " - " + afwerkingdata.omschrijving
            }</td>
</tr>`;

            _value =
              _value +
              ` <tr>
<td>Afgewerktematen (Br x h)</td>
<td>${newBreedte + " x " + newHoogte}</td>
</tr>`;
          }
          if (element.kleuronderlat === "RAL") {
            _value =
              _value +
              ` <tr>
    <td>Onderlat</td>
    <td>${element.kleuronderlat + " - " + element.ralonderlat}</td>
  </tr>`;
          } else {
            winkelData[index].ralonderlat = kleuronderlatRAL.RAL
            winkelData[index].odlaecode = kleuronderlatRAL.aecode
            if (element.kleuronderlat === "Beige") {
              _value =
                _value +
                ` <tr>
    <td>Onderlat</td>
    <td>${element.kleuronderlat + " - " + winkelData[index].odlaecode}</td>
  </tr>`;
            } else {
              _value =
                _value +
                ` <tr>
    <td>Onderlat</td>
    <td>${element.kleuronderlat + " - RAL " + winkelData[index].ralonderlat + " - " + winkelData[index].odlaecode}</td>
  </tr>`;
            }




          }
          console.log("element.typebediening", element.typebediening)
          if (element.typebediening === "manueel") {
            const bedieningOmschrijving = await getBedieningOmschrijving(element.typelintofmotor)
            //zoek juiste omschrijving - > zet het in de plaats
            _value += ` <tr>
      <td>Bediening</td>
      <td>${bedieningOmschrijving}</td>
    </tr>`;


            const manueels = JSON.parse(element.manueel).manueel
            for (const [index, manueel] of manueels.entries()) {
              if (manueel.benaming === "geen" && manueel.checked) {
                //indien type bediening lint 
                //geen lint opties
                //indien type bediening motor
                //geen schakelaars
                // indien type bediening motor afstandsbediening
                //geen zenders
                _value += ` <tr>
                <td>Extra opties</td>
                <td>${manueel.benaming}</td>
              </tr>`;
              } else if (!manueels[0].checked && manueel.checked) {
                const manueelOmschrijving = await getManueelOmschrijving(manueel.benaming)
                //zoek juiste omschrijving - > zet het in de plaats
                _value += ` <tr>
                <td>Extra opties</td>
                <td>${manueelOmschrijving}</td>
              </tr>`;
              }
            };
          } else if (element.typebediening === "schakelaar") {
            const bedieningOmschrijving = await getBedieningOmschrijving(element.typelintofmotor)
            _value += ` <tr>
            <td>Bediening</td>
            <td>${bedieningOmschrijving}</td>
          </tr>`;
           
            //zoek juiste omschrijving - > zet het in de plaats
           
            if (element.schakelaar !== "geen") {
              const schakelaarOmschrijving = await getomschrijving("zenders", "benaming", element.schakelaar)
              _value += ` <tr>
              <td>Schakelaar</td>
              <td>${schakelaarOmschrijving}</td>
            </tr>`;
            } else {
              _value += ` <tr>
              <td>Schakelaar</td>
              <td>Geen schakelaar</td>
            </tr>`;
            }
          } else if (element.typebediening === "afstandsbediening") {
            const bedieningOmschrijving = await getBedieningOmschrijving(element.typelintofmotor)
            //zoek juiste omschrijving - > zet het in de plaats
            _value += ` <tr>
      <td>Bediening</td>
      <td>${bedieningOmschrijving}</td>
    </tr>`;


            const zenders = JSON.parse(element.zenders).zenders
            var checked = false
            for (const [index, zender] of zenders.entries()) {
              if (zender.benaming === "geen" && zender.checked) {
                //indien type bediening lint 
                //geen lint opties
                //indien type bediening motor
                //geen schakelaars
                // indien type bediening motor afstandsbediening
                //geen zenders

              } else if (!zenders[0].checked && index > 0 && zender.checked && zender.aantal > 0) {
                const zenderOmschrijving = await getZenderOmschrijving(zender.benaming)
                checked = true;
                //zoek juiste omschrijving - > zet het in de plaats
                _value += ` <tr>
            <td>Zender</td>
            <td>${zenderOmschrijving + " - Aantal: " + zender.aantal }${zender.aantal === 1 ? " Stuk" : " Stuks"}</td>
          </tr>`;
              }
            };
            if (!checked) {
              _value += ` <tr>
            <td>Zender</td>
            <td>Geen zender</td>
          </tr>`;
            }
          }
          if (element.typeophangveer) {
            _value =
              _value +
              ` <tr>
        <td>Type ophangveer</td>
        <td>${element.typeophangveer}</td>
      </tr>`;
          }
          if (element.aanslagtop) {
            _value =
              _value +
              ` <tr>
      <td>Aanslagtop</td>
      <td>${element.aanslagtop}</td>
    </tr>`;
          }


        } else if (element.type === "Voorzetrolluik") {
          if (!winkelData[index].positie) {
            winkelData[index].positie = "R" + formatNumberWithTwoDigits(index);
          }
          const uitvoeringblad = await getomschrijving("uitvoeringblad", "benaming", element.uitvoeringblad)
          winkelData[index].uitvoeringbladomschrijving = uitvoeringblad
          if (element.kleurlamel === "Beige") {
            _value =
              _value +
              ` <tr>
        <td>Voorzetrolluik</td>
        <td>${typelamelomschrijving + " - " + element.kleurlamel + " - " + uitvoeringblad}</td>
      </tr>`;
          } else {
            _value =
              _value +
              ` <tr>
        <td>Voorzetrolluik</td>
        <td>${typelamelomschrijving + " - RAL " + kleurlamelomschrijving.RAL + " - " + element.kleurlamel + " - " + uitvoeringblad}</td>
      </tr>`;
          }
          //zoeken naar omschrijving?
          if (element.typelintofmotor !== "veeras") {

            const bedieningskantOmschrijving = await getomschrijving("vzrbedieningskant", "benaming", element.bedieningskant)
            _value = _value +
              ` <tr>
        <td>Bedieningskant</td>
        <td>${bedieningskantOmschrijving}</td>
      </tr>`;
          }
          if (element.typelintofmotor === "veeras" || element.typelintofmotor === "csirts" || element.typelintofmotor === "csi") {
            console.log('Veeras, CSI, CSIRTS')

            kastbinnenbuitenomschrijving = await getomschrijving("vzrbedieningskant", "benaming", element.kastbinnenbuiten)
            winkelData[index].kastbinnenbuitenomschrijving = kastbinnenbuitenomschrijving
            console.log('kastbinnenbuitenomschrijving', kastbinnenbuitenomschrijving)
            _value = _value +
              ` <tr>
    <td>Kast positie</td>
    <td>${kastbinnenbuitenomschrijving}</td>
  </tr>`;
          }


          const typegeleiderlinksOmschrijving = await getomschrijving("typevzrgeleiders", "benaming", element.typegeleiderlinks)
          const typegeleiderrechtsOmschrijving = await getomschrijving("typevzrgeleiders", "benaming", element.typegeleiderrechts)

          _value = _value +
            ` <tr>
        <td>Type geleiders</td>
        <td>${"Links : " + typegeleiderlinksOmschrijving + " - Rechts : " + typegeleiderrechtsOmschrijving}</td>
      </tr>`;


          //bereken juiste maten.
          /* TODO */
          //AANGEPAST NAAR JSON AANGEZIEN BIJ GEBRUIK VAN XAMPP ANDERS NEW DATA VERWIJDEREN
          const _afwerkingdata = JSON.parse(element.afwerkingdata)
          const _afwerkingOmschrijving = await getomschrijving("typeafwerking", "benaming", element.typeafwerking)

          var _afwerkingBreedte = 0
          var _afwerkingHoogte = 0
          var count = 0
          var omschrijvingBreedte = ""
          var omschrijvingHoogte = ""
          var omschrijving = ""
          console.log('_afwerkingdata', _afwerkingdata)
          if (element.typeafwerking === "af") {
            omschrijving = "Afgewerkte breedte + Afgewerkte hoogte"
          } else {
            if (element.typeafwerkingdagdata && JSON.parse(element.typeafwerkingdagdata).afwerkingdag.length > 0) {
              const _afwerkingDagData = JSON.parse(element.typeafwerkingdagdata).afwerkingdag
              for (const [index, data] of _afwerkingDagData.entries()) {
                console.log('afwerkingdag Data = ' + data)
                if (data.breedte) {
                  count++
                  console.log('Breedte = ' + data.breedte)
                  _afwerkingBreedte += data.breedte
                } else {
                  console.log('Hoogte = ' + data.hoogte)
                  _afwerkingHoogte = data.hoogte
                }
              }
              if (count === 0) {
                omschrijvingBreedte = "Afgewerkte breedte"
              } else if (count === 1) {
                omschrijvingBreedte = "Breedte + 1 geleider"

              } else if (count === 2) {

                omschrijvingBreedte = "Breedte + 2 Geleiders"
              }
              if (_afwerkingHoogte === 0) {
                omschrijvingHoogte = " - Afgewerkte hoogte"
              } else if (_afwerkingHoogte === "kast") {
                omschrijvingHoogte = " + kast"
              }
              omschrijving = omschrijvingBreedte + omschrijvingHoogte
            } else {
              omschrijving = "Afgewerkte breedte + Afgewerkte hoogte"
            }

          }

          console.log('_afwerkingdata', _afwerkingOmschrijving)
          const _kast = vzrcalculateAfgewerktematen(element.kastdata, _afwerkingHoogte)
          console.log('_kast', _kast)
          // const afwerkingdata = JSON.parse(afwerkingdataawait)
          const newBreedte = Number(element.breedte) + Number(_afwerkingBreedte);
          const newHoogte = Number(element.hoogte) + Number(_kast);
          console.log("omschrijving", omschrijving)
          winkelData[index].afgbreedte = newBreedte;
          winkelData[index].afghoogte = newHoogte;
          winkelData[index].afwerkingdagdataomschrijving = omschrijving
          if (Number(element.breedte) == newBreedte && Number(element.hoogte) == newHoogte) {
            _value =
              _value +
              ` <tr>
  <td>Afgewerkte maten (Br x h)</td>
  <td>${newBreedte + " x " + newHoogte + " mm - " + omschrijving}</td>
</tr>`;
          } else {


            _value =
              _value +
              ` <tr>
  <td>Doorgegeven maten (Br x h)</td>
  <td>${element.breedte + " x " + element.hoogte + " mm - " + omschrijving
            }</td>
</tr>`;

            _value =
              _value +
              ` <tr>
<td>Afgewerktematen (Br x h)</td>
<td>${newBreedte + " x " + newHoogte + " mm"}</td>
</tr>`;
          }
          if (element.kleurkast === "RAL") {
            _value = _value + ` <tr>
        <td>Kleur kast</td>
        <td>${element.kastdata} - RAL ${element.kleurkastral}</td>
      </tr>`;
          } else {
            winkelData[index].kleurkastral = kleurkastRAL.RAL
            winkelData[index].kastaecode = kleurkastRAL.aecode
            if (kleurkastRAL.aecode) {
              if (kleurkastRAL.RAL) {
                _value += ` <tr>
                <td>Kast</td>
                <td>${element.kastdata + "mm - "+ element.kleurkast+" - RAL " + kleurkastRAL.RAL +" - " + kleurkastRAL.aecode}</td>
              </tr>`;
              } else {
                _value += ` <tr>
                <td>Kast</td>
                <td>${element.kastdata + "mm - "+ element.kleurkast+" - " + kleurkastRAL.aecode}</td>
              </tr>`;
              }

            } else {
              _value += ` <tr>
        <td>Kast</td>
        <td>${element.kastdata + "mm - "+ element.kleurkast+" - RAL " + kleurkastRAL.RAL +" - " + element.kleurkast}</td>
      </tr>`;
            }

          }

          if (element.typebediening === "manueel") {
            console.log('Manueel')
            const bedieningOmschrijving = await vzrgetBedieningOmschrijving(element.typelintofmotor)
            //zoek juiste omschrijving - > zet het in de plaats
            _value += ` <tr>
      <td>Bediening</td>
      <td>${bedieningOmschrijving}</td>
    </tr>`;
            console.log('element.typelingofmotor', element.typelintofmotor)
            if (element.typelintofmotor === "veeras") {

            } else {


              const _oldManueels = JSON.parse(JSON.stringify(element.manueel))
              let manueels;
              if (typeof _oldManueels === 'string') {
                manueels = JSON.parse(_oldManueels).manueel
              } else {
                manueels = _oldManueels.manueel
              }
              console.log('manueels data', manueels, typeof manueels)
              for (const [index, manueel] of manueels.entries()) {
                console.log('manueel entries', manueel)
                if (manueel.benaming === "geen" && manueel.checked) {
                  console.log('manueel NIET is gechecked')
                  //indien type bediening lint 
                  //geen lint opties
                  //indien type bediening motor
                  //geen schakelaars
                  // indien type bediening motor afstandsbediening
                  //geen zenders
                  _value += ` <tr>
                <td>Extra opties</td>
                <td>${manueel.benaming}</td>
              </tr>`;
                } else if (manueel.benaming !== "geen" && manueel.checked) {

                  console.log('manueel benaming')
                  const manueelOmschrijving = await getManueelOmschrijving(manueel.benaming)
                  //zoek juiste omschrijving - > zet het in de plaats
                  _value += ` <tr>
                <td>Extra opties</td>
                <td>${manueelOmschrijving}</td>
              </tr>`;
                }
              };
            }
          } else if (element.typebediening === "schakelaar") {
            const bedieningOmschrijving = await vzrgetBedieningOmschrijving(element.typelintofmotor)
            //zoek juiste omschrijving - > zet het in de plaats
            _value += ` <tr>
      <td>Bediening</td>
      <td>${bedieningOmschrijving}</td>
    </tr>`;
            if (element.schakelaar !== "geen") {
              const schakelaarOmschrijving = await getomschrijving("zenders", "benaming", element.schakelaar)
              _value += ` <tr>
              <td>Schakelaar</td>
              <td>${schakelaarOmschrijving}</td>
            </tr>`;
            } else {
              _value += ` <tr>
              <td>Schakelaar</td>
              <td>Geen schakelaar</td>
            </tr>`;
            }
          } else if (element.typebediening === "afstandsbediening" || element.typebediening === "afstandsbedieningsolar") {
            const bedieningOmschrijving = await vzrgetBedieningOmschrijving(element.typelintofmotor)
            //zoek juiste omschrijving - > zet het in de plaats
            _value += ` <tr>
      <td>Bediening</td>
      <td>${bedieningOmschrijving}</td>
    </tr>`;


            const zenders = JSON.parse(element.zenders).zenders
            var checked = false
            for (const [index, zender] of zenders.entries()) {
              if (zender.benaming === "geen" && zender.checked) {
                //indien type bediening lint 
                //geen lint opties
                //indien type bediening motor
                //geen schakelaars
                // indien type bediening motor afstandsbediening
                //geen zenders

              } else if (!zenders[0].checked && index > 0 && zender.checked && zender.aantal > 0) {
                const zenderOmschrijving = await getZenderOmschrijving(zender.benaming)
                checked = true;
                //zoek juiste omschrijving - > zet het in de plaats
                _value += ` <tr>
            <td>Zender</td>
            <td>${zenderOmschrijving + " - Aantal: " + zender.aantal }${zender.aantal === 1 ? " Stuk" : " Stuks"}</td>
          </tr>`;
              }
            };
            if (!checked) {
              _value += ` <tr>
            <td>Zender</td>
            <td>Geen zender</td>
          </tr>`;
            }
          }
          if(element.geleiderstoppen != "geen"){
            const geleiderstopOmschrijving = await getomschrijving("geleiderstoppen", "benaming", element.geleiderstoppen)
            _value +=` <tr>
      <td>Eindstoppen</td>
      <td>${geleiderstopOmschrijving}</td>
      </tr>`;
          }

        } else if (element.type === "Screen") {
          const typedoekOmschrijving = await getomschrijving("typescreendoeken", "benaming", element.typedoek)
          _value =
            _value +
            ` <tr>
      <td>Type</td>
      <td>${"Screen Lounge " + element.kastgrootte}</td>
      </tr>`;
          if (element.breedte != element.afgbreedte || element.hoogte != element.afghoogte) {
            _value =
              _value +
              ` <tr>
    <td>Doorgegeven maten (BrxH)</td>
    <td>${element.breedte + " x " + element.hoogte + "mm" + " - " + element.typeafwerkingOmschrijving}</td>
    </tr>`;
          }
          _value =
            _value +
            ` <tr>
      <td>Afgewerkte maten (BrxH)</td>
      <td>${element.afgbreedte + " x " + element.afghoogte + "mm"}</td>
      </tr>`;


          _value =
            _value +
            ` <tr>
      <td>Doek</td>
      <td>${typedoekOmschrijving + " - " + element.doek + " - " + element.confectie}</td>
      </tr>`;
          console.log('element.typebediening', element.typebediening, 'element.typebedieningskant', element.typebedieningskant)
          const typebedieningOmschrijving = await getomschrijving("screentypebediening", "benaming", element.typebediening)
          const typebedieningskantOmschrijving = await getomschrijving("screenbedieningskant", "benaming", element.bedieningskant)
          winkelData[index].typebedieningOmschrijving = typebedieningOmschrijving
          winkelData[index].typebedieningskantOmschrijving = typebedieningskantOmschrijving
          _value =
            _value +
            ` <tr>
  <td>Typebediening</td>
  <td>${typebedieningOmschrijving + " - " + typebedieningskantOmschrijving}</td>
  </tr>`;





          if (element.typebediening === "schakelaar") {

            if (element.schakelaar !== "geen") {
              console.log(' is niet  geen')

              const schakelaarOmschrijving = await getomschrijving("zenders", "benaming", element.schakelaar)
              console.log('schakelaarOmschrijving', schakelaarOmschrijving)
              winkelData[index].schakelaarOmschrijving = schakelaarOmschrijving
              _value += ` <tr>
<td>Schakelaar</td>
<td>${schakelaarOmschrijving}</td>
</tr>`;
            } else {
              _value += ` <tr>
<td>Schakelaar</td>
<td>Geen schakelaar</td>
</tr>`;
            }
          } else if (element.typebediening === "somfyio" || element.typebediening === "somfyiosolar") {



            const zenders = JSON.parse(element.zenders).zenders
            var checked = false
            var _zenders = []
            for (const [index, zender] of zenders.entries()) {
              console.log('benaming zender', zender.benaming)
              if (zender.benaming === "geen" && zender.checked) {
                _value += ` <tr>
        <td>Zender</td>
        <td>Geen zender</td>
        </tr>`;

              } else if (zender.checked && zender.aantal > 0) {
                const zenderOmschrijving = await VZRgetZenderOmschrijving(zender.benaming)
                _zenders.push({
                  benaming: zender.benaming,
                  omschrijving: zenderOmschrijving,
                  aantal: zender.aantal
                })
                checked = true;
                //zoek juiste omschrijving - > zet het in de plaats
                _value += ` <tr>
<td>Zender</td>
<td>${zenderOmschrijving + " - Aantal: " + zender.aantal }${zender.aantal === 1 ? " Stuk" : " Stuks"}</td>
</tr>`;
              }
            };
            winkelData[index].zendersOmschrijving = _zenders
            if (!checked) {
              _value += ` <tr>
<td>Zender</td>
<td>Geen zender</td>
</tr>`;
            }
          }

          kleurkastRAL = await SCREENgetKleurkastRAL(element.kleurkast)
          if (element.kleurkast === "RAL") {
            winkelData[index].kastaecode = kleurkastRAL.aecode
            winkelData[index].kastral = kleurkastRAL.RAL
            winkelData[index].kastuitvoering = kleurkastRAL.uitvoering
            winkelData[index].kastomschrijving = kleurkastRAL.omschrijving
            _value = _value + ` <tr>
<td>Kleur kast</td>
<td>RAL - ${element.kleurkastral}</td>
</tr>`;
          } else {
            console.log('Kleur kast gevonden', kleurkastRAL)
            winkelData[index].kastral = kleurkastRAL.RAL
            winkelData[index].kastaecode = kleurkastRAL.aecode
            winkelData[index].kastuitvoering = kleurkastRAL.uitvoering
            winkelData[index].kastkleur = kleurkastRAL.kleur
            if (kleurkastRAL.aecode) {
              if (kleurkastRAL.RAL) {
                _value += ` <tr>
        <td>Kleur kast</td>
        <td>${"RAL " + kleurkastRAL.RAL + " - " + kleurkastRAL.kleur + " - " + kleurkastRAL.uitvoering + " - " + kleurkastRAL.aecode}</td>
      </tr>`;
              } else {
                if (element.kleurkast === "Beige") {
                  _value += `<tr>
          <td>Kleur kast</td>
          <td>${"kleur : "+ element.kleurkast+" - " + kleurkastRAL.aecode}</td>
        </tr>`;
                } else {
                  _value += `<tr>
        <td>Kleur kast</td>
        <td>${element.kleurkast+" - " + kleurkastRAL.RAL + " - " + kleurkastRAL.aecode}</td>
      </tr>`;
                }

              }

            } else {
              _value += ` <tr>
<td>Kleur kast</td>
<td>${element.kleurkast+" - RAL " + kleurkastRAL.RAL}</td>
</tr>`;
            }

          }

        }
        if(element.Opmerking){
          _value +=` <tr>
          <td>Opmerking</td>
          <td>${element.Opmerking}</td>
          </tr>`;
        }
       

        _value = _value + `
  <tr>
    <td colspan="2">
      <button class="btn btn-danger" onclick="removeFromWinkelmand(${index})">Verwijder</button>
    </td>
  </tr>`;



      } else {

      }
    }
    winkelmand.innerHTML = _value;
    newWinkelData = JSON.parse(JSON.stringify(winkelData));

  } catch (error) {
    console.error("Fout bij het laden van gegevens:", error);
  }
}

function getomschrijving(db, kolom, data) {
  console.log('db', db, 'kolom', kolom, 'data', data)
  return goFetch("/cart/getomschrijving", {
      "db": db,
      "data": data,
      "kolom": kolom
    })
    .then((data) => {
      console.log('retrieved omscrijving data', data)

      return data[0].omschrijving
    })
}

function getTypelamelOmschrijving(lamel) {
  return goFetch("/cart/RBtypelamelomschrijving", lamel)
    .then((data) => {

      return data[0].omschrijving
    })
}

async function getKleurlamelOmschrijving(kleur) {
  const _data = await goFetch("/cart/RBkleurlamelomschrijving", kleur)
  return _data
}

function getKleuronderlatRAL(kleur) {
  if (kleur !== "RAL") {
    return goFetch("/cart/kleurRAL", kleur)
      .then((data) => {

        return data
      })
  } else {
    return kleur
  }

}
async function TRADIgetKleurkastRAL(kleur) {
  console.log('getKleurkastRAL', kleur)
  if (kleur !== "RAL") {
    return goFetch("/cart/kleurRAL", kleur)
      .then((data) => {

        return data
      })
  } else {
    return kleur
  }

}
async function VZRgetKleurkastRAL(kleur) {
  console.log('getKleurkastRAL', kleur)
  if (kleur !== "RAL") {
    return goFetch("/cart/kleurRAL", kleur)
      .then((data) => {

        return data
      })
  } else {
    return kleur
  }

}
async function SCREENgetKleurkastRAL(kleur) {
  console.log('getKleurkastRAL', kleur)
  if (kleur !== "RAL") {
    return goFetch("/cart/screenkleurRAL", kleur)
      .then((data) => {

        return data
      })
  } else {
    return kleur
  }

}

function getZenderOmschrijving(zender) {
  return goFetch("/cart/TRzenderOmschrijving", zender)
    .then((data) => {

      return data.omschrijving
    })
}


function getManueelOmschrijving(zender) {
  return goFetch("/cart/TRzenderOmschrijving", zender)
    .then((data) => {

      return data.omschrijving
    })
}

function getBedieningOmschrijving(bediening) {
  console.log('bediening data', bediening)
  return goFetch("/cart/TRbedieningOmschrijving", bediening)
    .then((data) => {

      return data.omschrijving
    })
}

function vzrgetBedieningOmschrijving(bediening) {
  console.log('bediening lint of motor', bediening)
  return goFetch("/cart/VZRbedieningOmschrijving", bediening)
    .then((data) => {

      return data.omschrijving
    })
}



function VZRgetZenderOmschrijving(zender) {
  return goFetch("/cart/VZRzenderOmschrijving", zender)
    .then((data) => {

      return data.omschrijving
    })
}


function VZRgetManueelOmschrijving(zender) {
  console.log('manueel zender data', zender)
  return goFetch("/cart/VZRmanuelOmschrijving", zender)
    .then((data) => {

      return data.omschrijving
    })
}

function VZRgetBedieningOmschrijving(bediening) {
  return goFetch("/cart/VZRbedieningOmschrijving", bediening)
    .then((data) => {

      return data.omschrijving
    })
}

function formatNumberWithTwoDigits(number) {
  // Zorg ervoor dat het getal een string is
  const numStr = String(number + 1);

  // Voeg een voorloopnul toe als het getal maar één cijfer heeft
  return numStr.length === 1 ? `0${numStr}` : numStr;
}

function calculateAfgewerktematen(afwerking) {
  return goFetch("/cart/RBafwerking", afwerking).then((data) => {
    console.log('afwerkingdata', data)

    return data;
  });
}

function vzrcalculateAfgewerktematen(kasthoogte, afwerking) {
  if (afwerking === "kast") {
    return kasthoogte
  } else {
    return 0
  }

}
// function removeFromWinkelmand(index) {
//   winkelData.splice(index, 1); // Verwijder het element op de opgegeven index uit de array
//   loadData(user); // Herlaad de tabel met de bijgewerkte gegevens
// }
function removeFromWinkelmand(index) {

  const dataToRemove = winkelData[index];

  goFetch("/cart/cartRemove", dataToRemove).then(() => {
    window.location.href = "/cart";
  });
}

function removeAll() {

  const dataToRemove = winkelData;

  goFetch("/cart/cartRemoveall", dataToRemove).then(() => {
    window.location.href = "/cart";
  });
}

function goFetch(link, data) {
  const ref = document.getElementById("referentie").value;
  return fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
        ref: ref,
        
      }),
    })
    .then((response) => response.json())
    .then((data) => {


      return data;
    })
    .catch((error) => console.error(error));
}

async function offerte(bestelofferte) {
  const ref = document.getElementById("referentie");
  const referentieText = document.getElementById("referentieText");

  if (ref.value && newWinkelData.length > 0) {
    referentieText.style.display = "none";

    const bevestigd = confirm(`U staat op het punt om een ${bestelofferte} aan te vragen. Gelieve op onderstaande knop te klikken om te bevestigen.`) // moet knop bevestigen & annuleren weergeve
    if (bevestigd) {
      console.log('aanklanttoeveogen', aanklanttoevoegen)
      console.log('klant', klant, 'klantID', klantID)
      if(aanklanttoevoegen){
        console.log('Klant toevoegen')
        for (const [index, value] of newWinkelData.entries()) {
          
        newWinkelData[index].klant = klant
        newWinkelData[index].klantID = klantID
        }
        console.log('newWinkelData', newWinkelData)
      }
      goFetch("/cart/offerte", {winkelData:newWinkelData,bestelofferte:bestelofferte}).then((data) => {
        if(data){
          if(data.success){
            if(bestelofferte === "offerte"){
              window.location.href = "/offertes"

            } else if (bestelofferte === "bestelling"){
              window.location.href = "/bestelling"

            }
            // console.log('data.message',data.message)
          } else {
            console.log('data.message error',data.error)
                    }
        }

      });
    } else {
      alert("Offerte aanvraag geannuleerd.")
    }

  } else if (!ref.value) {
    //laat zien dat het geen value heeft
    referentieText.innerHTML = "Vul een referentie in";
    referentieText.style.display = "block";
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    //laat zien dat er geen producten in de winkelmand zitten
    referentieText.innerHTML = "Voeg eerst producten toe aan de winkelmand";
    referentieText.style.display = "block";
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
}

function bestellen() {
  goFetch("/cart/bestellen", winkelData).then((data) => {
    //Bereken de prijzen
    //voeg deze toe aan de data
    //zet de data in de bestelling database

    //stuur een mail naar aluplex
    //pas eventuele leverdatum aan
    //genereer een werkbon & aflever bon
    //stuur deze door naar aluplex (Speciaal email hiervoor aanmaken?)
    //stuur een mailtje naar de klant dat de bestelling is aangekomen, en met de leverdatum


  });
}