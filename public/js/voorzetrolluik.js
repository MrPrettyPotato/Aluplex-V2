"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var aantalinput = document.getElementById("aantalInput");
var breedteinput = document.getElementById("breedteInput");
var hoogteinput = document.getElementById("hoogteInput");
var aantallabel = document.getElementById("aantallabel");
var breedtelabel = document.getElementById("breedtelabel");
var hoogtelabel = document.getElementById("hoogtelabel");
var kasthoogteData;
var typelintofmotorData;
var typebedieningData;
var zendersData = [];
var manueelData = [{ benaming: "geen", checked: false }];
var typebediening;
var kastData;
var lamelData;
var lamelAanwezig = false;
const MIN_AANTAL = 1;
const MAX_AANTAL = 100;
const MIN_BREEDTE = 400;
const MAX_BREEDTE = 3800;
const MIN_HOOGTE = 500;
const MAX_HOOGTE = 3000;
const MAX_OPP = 8;
/**
 * Element error.
 * @param {Element} element - Welk element moet er aangepast worden met of zonder error.
 * @param {Element} label - Welke label moet er een text krijgen en moet deze wel of niet weergegeven worden.
 * @param {String} text - Welke text moet er op de label komen.
 * @param {Boolean} bool - Fout weergeven of niet # true = weergeven, false = niet weergeven.
 */
function addRemoveBlurEvent(element, label, text, bool) {
    if (bool) {
        //console.log("ADDREMOVEBLUREVENT : TOGGLE ERROR ON");
        // Voeg de klasse "error-border" toe aan het inputveld
        label.style.display = "block";
        label.innerHTML = text;
        element.classList.add("error-border");
    }
    else {
        //console.log("ADDREMOVEBLUREVENT : TOGGLE ERROR OFF");
        // Verwijder de klasse "error-border" van het inputveld
        label.style.display = "none";
        label.innerHTML = "";
        element.classList.remove("error-border");
    }
}
var positieDIV = document.getElementById("refpositieDIV");
var refPositieInput = document.getElementById("refPositieInput");
var aantalDIV = document.getElementById("aantalDIV");
var breedteInputDIV = document.getElementById("breedteInputDIV");
var hoogteInputDIV = document.getElementById("hoogteInputDIV");
var typeafwerkingDIV = document.getElementById("typeAfwerkingDIV");
var typelintofmotorDIV = document.getElementById("typelintofmotorDIV");
var typebedieningDIV = document.getElementById("typebedieningDIV");
var bedieningDIV = document.getElementById("bedieningDIV");
var kastbinnenbuitenDIV = document.getElementById("kastbinnenbuitenDIV");
var kleurkastDIV = document.getElementById("kleurkastDIV");
var typeAfwerkingdagDIV = document.getElementById("typeafwerkingdagDIV");
var typeAfwerkingdag = document.getElementById("typeAfwerkingdag");
var uitvoeringbladDIV = document.getElementById("uitvoeringbladDIV");
var kleurkastralDIV = document.getElementById("kleurkastralDIV");
var typelamelDIV = document.getElementById("typelamelDIV");
var kleurlamelDIV = document.getElementById("kleurlamelDIV");
var typegeleiderLinksDIV = document.getElementById("typegeleiderLinksDIV");
var typegeleiderRechtsDIV = document.getElementById("typegeleiderRechtsDIV");
var bedieningskantDIV = document.getElementById("bedieningskantDIV");
var geleiderstoppenDIV = document.getElementById("geleiderstoppenDIV");
var kastgrootteKiezenDIV = document.getElementById("kastgrootteKiezenDIV");
var opmerkingDIV = document.getElementById("opmerkingDIV");
var buttonsDIV = document.getElementById("addToCartBtnDIV");
//
let winkelmand = {
    type: "Voorzetrolluik",
    status: "winkelmand",
    leverancier: "ALUPLEX",
    ref: "",
    positie: "",
    klant: klant.bedrijf,
    klantID: klant.bedrijfID,
    aantal: 0,
    breedte: 0,
    hoogte: 0,
    typeafwerking: "",
    typeafwerkingdagdata: "",
    afwerkingdata: "",
    typelintofmotor: "",
    typebediening: "",
    kastbinnenbuiten: "",
    typelamel: "",
    kleurlamel: "",
    uitvoeringblad: "",
    kleurkast: "",
    kleurkastral: "",
    zenders: "",
    schakelaar: "",
    manueel: "",
    kastdata: 0,
    typegeleiderlinks: "",
    typegeleiderrechts: "",
    bedieningskant: "",
    geleiderstoppen: "",
    opmerking: "",
};
//STATES
var aantalstate = false;
var positiestate = false;
var breedtestate = false;
var hoogtestate = false;
var oppervlaktestate = false;
var typelintofmotorstate = false;
var typeafwerkingstate = false;
var typeafwerkingdagstate = false;
var lintofmotorstate = false;
var typebedieningstate = false;
var bedieningstate = false;
var kastbinnenbuitenstate = false;
var typelamelstate = false;
var kleurlamelstate = false;
var kleurkaststate = false;
var kleurkastralstate = false;
var zenderState = false;
var ralstate = false;
var ralcheckedstate = false;
var typegeleiderlinksstate = false;
var typegeleiderrechtsstate = false;
var bedieningskantstate = false;
var kastbinnenbuitenstate = false;
var uitvoeringbladstate = false;
var geleiderstoppenstate = false;
var changedstateTypelamel = false;
var changedstateKleurlamel = false;
var changedstateKleurkast = false;
var changedstateBedieningkant = false;
function checkstate() {
    addErrorLog();
    //console.log("typelintofmotorData", typelintofmotorData);
    var allstates = true;
    if (lamelAanwezig === false) {
        allstates = false;
    }
    if (breedteInputDIV) {
        if (aantalstate) {
            //
            breedteInputDIV.style.display = "block";
        }
        else {
            breedteInputDIV.style.display = "none";
            allstates = false;
        }
    }
    //max breedte zoeken of ingeven
    if (hoogteInputDIV) {
        if (breedtestate) {
            hoogteInputDIV.style.display = "block";
        }
        else {
            hoogteInputDIV.style.display = "none";
            allstates = false;
        }
    }
    if (typeafwerkingDIV) {
        if (hoogtestate && breedtestate) {
            typeafwerkingDIV.style.display = "block";
        }
        else {
            typeafwerkingDIV.style.display = "none";
            allstates = false;
        }
    }
    //max breedte zoeken of ingeven
    if (typeAfwerkingdag) {
        /*//console.log(
          "in typeafwerkingdag",
          typeafwerkingstate,
          winkelmand.typeafwerking
        );
        */
        if (typeafwerkingstate && winkelmand.typeafwerking === "dag") {
            //console.log("weergeven", typeafwerkingstate, winkelmand.typeafwerking);
            typeAfwerkingdag.style.display = "block";
        }
        else {
            /*//console.log(
              "Nietweergeven",
              typeafwerkingstate,
              winkelmand.typeafwerking
            );*/
            if (typeafwerkingstate && winkelmand.typeafwerking === "af") {
                typelintofmotorDIV.style.display = "block";
                typeAfwerkingdag.style.display = "none";
                typeafwerkingdagstate = true;
            }
            else {
                typeafwerkingdagstate = false;
                typelintofmotorDIV.style.display = "none";
                allstates = false;
            }
        }
    }
    if (typelintofmotorDIV) {
        if (typeafwerkingdagstate) {
            typelintofmotorDIV.style.display = "block";
        }
        else {
            typelintofmotorDIV.style.display = "none";
            allstates = false;
        }
    }
    if (typebedieningDIV) {
        if (typelintofmotorstate) {
            typebedieningDIV.style.display = "block";
        }
        else {
            typebedieningDIV.style.display = "none";
        }
    }
    if (bedieningDIV && kastbinnenbuitenDIV) {
        if (typebedieningstate) {
            if (winkelmand.typelintofmotor === "veeras" ||
                winkelmand.typelintofmotor === "csi" ||
                winkelmand.typelintofmotor === "csirts") {
                // typelamelDIV.style.display = "block";
                kastbinnenbuitenDIV.style.display = "block";
                if (kastbinnenbuitenstate) {
                    if (winkelmand.typelintofmotor === "veeras") {
                        typelamelDIV.style.display = "block";
                    }
                    else {
                        bedieningDIV.style.display = "block";
                    }
                }
            }
            else {
                kastbinnenbuitenDIV.style.display = "none";
            }
            bedieningDIV.style.display = "block";
        }
        else {
            bedieningDIV.style.display = "none";
        }
    }
    if (typelamelDIV) {
        if (zenderState) {
            //console.log("ZENDERSTATE : MANUEELDATA", manueelData);
            //console.log("winkelmanddata schakelaar", winkelmand.schakelaar);
            //console.log("zenderdata", zendersData);
            if (typelintofmotorData === "manueel") {
                //console.log("manueel geselecteerd");
                if (manueelData[0].checked) {
                    typelamelDIV.style.display = "block";
                }
                else if ((manueelData.length > 1 && manueelData[1].checked) ||
                    (manueelData.length > 2 && manueelData[2].checked) ||
                    (manueelData.length > 3 && manueelData[3].checked) ||
                    (manueelData.length > 4 && manueelData[4].checked)) {
                    typelamelDIV.style.display = "block";
                }
                else {
                    typelamelDIV.style.display = "none";
                    allstates = false;
                }
            }
            else if (typelintofmotorData === "schakelaar") {
                if (winkelmand.schakelaar !== "" && winkelmand.schakelaar !== null) {
                    typelamelDIV.style.display = "block";
                }
                else {
                    typelamelDIV.style.display = "none";
                    allstates = false;
                }
            }
            else if (typelintofmotorData === "afstandsbediening" ||
                typelintofmotorData === "afstandsbedieningsolar") {
                //console.log("afstandsbediening");
                if (zendersData[0].checked) {
                    //laat ophangveren zien
                    typelamelDIV.style.display = "block";
                }
                else {
                    if ((zendersData.length > 1 &&
                        zendersData[1].checked &&
                        zendersData[1].aantal > 0) ||
                        (zendersData.length > 2 &&
                            zendersData[2].checked &&
                            zendersData[2].aantal > 0) ||
                        (zendersData.length > 3 &&
                            zendersData[3].checked &&
                            zendersData[3].aantal > 0) ||
                        (zendersData.length > 4 &&
                            zendersData[4].checked &&
                            zendersData[4].aantal > 0) ||
                        (zendersData.length > 5 &&
                            zendersData[5].checked &&
                            zendersData[5].aantal > 0)) {
                        // Jouw code hier
                        typelamelDIV.style.display = "block";
                    }
                    else {
                        typelamelDIV.style.display = "none";
                        allstates = false;
                    }
                }
            }
        }
        else {
            if (winkelmand.typelintofmotor !== "veeras") {
                typelamelDIV.style.display = "none";
                allstates = false;
            }
        }
        if (kastbinnenbuitenstate) {
            //als veeras of csi
            //
        }
        if (kleurlamelDIV) {
            if (typelamelstate) {
                kleurlamelDIV.style.display = "block";
            }
            else {
                kleurlamelDIV.style.display = "none";
                allstates = false;
            }
        }
        if (uitvoeringbladDIV) {
            if (kleurlamelstate) {
                uitvoeringbladDIV.style.display = "block";
            }
            else {
                uitvoeringbladDIV.style.display = "none";
                allstates = false;
            }
        }
        if (kleurkastDIV) {
            if (uitvoeringbladstate) {
                kleurkastDIV.style.display = "block";
            }
            else {
                kleurkastDIV.style.display = "none";
                allstates = false;
            }
        }
        if (kleurkastralDIV) {
            if (kleurkaststate) {
                //console.log('kleurkastRAL weergeven?')
                if (ralstate) {
                    //console.log('kleurkastRAL 2 weergeven?')
                    kleurkastralDIV.style.display = "block";
                }
                else {
                    kleurkastralDIV.style.display = "none";
                    typegeleiderLinksDIV.style.display = "block";
                }
            }
            else {
                allstates = false;
            }
        }
        if (typegeleiderLinksDIV) {
            if (typegeleiderlinksstate) {
                typegeleiderRechtsDIV.style.display = "block";
            }
            else {
                typegeleiderRechtsDIV.style.display = "none";
                allstates = false;
            }
        }
        if (typegeleiderRechtsDIV) {
            if (typegeleiderrechtsstate) {
                if (winkelmand.typelintofmotor === "veeras") {
                    bedieningskantDIV.style.display = "none";
                }
                else {
                    bedieningskantDIV.style.display = "block";
                }
            }
            else {
                bedieningskantDIV.style.display = "none";
                allstates = false;
            }
        }
        if (geleiderstoppenDIV) {
            if (winkelmand.typelintofmotor !== "veeras") {
                if (bedieningskantstate) {
                    geleiderstoppenDIV.style.display = "block";
                }
                else {
                    geleiderstoppenDIV.style.display = "none";
                    allstates = false;
                }
            }
            else {
                if (typegeleiderrechtsstate) {
                    geleiderstoppenDIV.style.display = "block";
                }
                else {
                    geleiderstoppenDIV.style.display = "none";
                    allstates = false;
                }
            }
            if (!geleiderstoppenstate) {
                allstates = false;
            }
        }
        if (ralstate) {
            if (!ralcheckedstate) {
                allstates = false;
            }
            else {
                typegeleiderLinksDIV.style.display = "block";
            }
        }
        //console.log('allstate : ',allstates)
        if (buttonsDIV) {
            if (allstates &&
                !changedstateBedieningkant &&
                !changedstateKleurkast &&
                !changedstateKleurlamel &&
                !changedstateTypelamel) {
                buttonsDIV.style.display = "block";
                opmerkingDIV.style.display = "block";
            }
            else {
                buttonsDIV.style.display = "none";
                opmerkingDIV.style.display = "none";
            }
        }
    }
    //console.log("WINKELMAND", winkelmand);
}
/*
elementPosition 1283.6646881103516
voorzetrolluik.js:376 offsetPosition 1433.6646881103516
 */
var typelintofmotorErrorLog = "";
var typebedieningErrorLog = "";
var kleurlamelErrorLog = "";
var typelamelErrorLog = "";
var kleurkastErrorLog = "";
var bedieningskantErrorLog = "";
function addErrorLog() {
    //errorLog
    const element = document.getElementById("errorLog");
    if (element) {
        var message = "";
        message += typelintofmotorErrorLog
            ? `<span style="color: red; font-size: 10px; font-weight: bold;">${typelintofmotorErrorLog}</span>`
            : "";
        message += typebedieningErrorLog
            ? ` <span style="color: red; font-size: 10px; font-weight: bold;" >${typebedieningErrorLog}</span>`
            : "";
        message += kleurlamelErrorLog
            ? ` <span style="color: red; font-size: 10px; font-weight: bold;" >${kleurlamelErrorLog}</span>`
            : "";
        message += typelamelErrorLog
            ? ` <span style="color: red; font-size: 10px; font-weight: bold;" >${typelamelErrorLog}</span>`
            : "";
        message += kleurkastErrorLog
            ? ` <span style="color: red; font-size: 10px; font-weight: bold;" >${kleurkastErrorLog}</span>`
            : "";
        message += bedieningskantErrorLog
            ? ` <span style="color: red; font-size: 10px; font-weight: bold;" >${bedieningskantErrorLog}</span>`
            : "";
        element.innerHTML = message;
        if (message !== "") {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    }
    //console.log("Geen element gevonden errorLog");
}
if (refPositieInput) {
    refPositieInput.oninput = function () {
        const element = this;
        const _value = element.value;
        winkelmand.positie = _value;
    };
}
if (aantalinput) {
    aantalinput.oninput = function () {
        return __awaiter(this, void 0, void 0, function* () {
            // aantalinput.oninput = function(this: HTMLInputElement, event: Event) {
            const element = this;
            const _value = Number(element.value);
            //console.log("_value", _value);
            if (_value >= MIN_AANTAL && _value <= MAX_AANTAL) {
                aantalstate = true;
                winkelmand.aantal = _value;
                addRemoveBlurEvent(aantalinput, aantallabel, "", false);
            }
            else {
                if (_value === 0 || isNaN(_value)) {
                    // te klein of niet-numeriek
                    aantalstate = false;
                    addRemoveBlurEvent(aantalinput, aantallabel, "Aantal te klein!", true);
                }
                else {
                    //te groot
                    aantalstate = false;
                    addRemoveBlurEvent(aantalinput, aantallabel, "Aantal te groot", true);
                }
            }
            yield zoektypelamel();
            yield zoekgeleiderstoppen();
            checkstate();
        });
    };
}
breedteinput.oninput = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const element = this;
        const _value = Number(element.value);
        winkelmand.breedte = _value;
        if (_value >= MIN_BREEDTE && _value <= MAX_BREEDTE) {
            if (winkelmand.hoogte && winkelmand.breedte) {
                if (winkelmand.hoogte <= MAX_HOOGTE) {
                    addRemoveBlurEvent(hoogteinput, hoogtelabel, "", false);
                }
                const _opp = (winkelmand.hoogte * winkelmand.breedte) / 1000000;
                if (_opp < MAX_OPP) {
                    breedtestate = true;
                    hoogtestate = true;
                    oppervlaktestate = true;
                    addRemoveBlurEvent(breedteinput, breedtelabel, "", false);
                    zoektypeafwerking();
                }
                else {
                    oppervlaktestate = false;
                    breedtestate = true;
                    addRemoveBlurEvent(breedteinput, breedtelabel, "Totaal oppervlak te groot!", true);
                }
            }
            else {
                breedtestate = true;
                addRemoveBlurEvent(breedteinput, breedtelabel, "", false);
            }
        }
        else {
            if (_value < MIN_BREEDTE) {
                // te klein
                breedtestate = false;
                addRemoveBlurEvent(breedteinput, breedtelabel, "Breedte te klein!", true);
            }
            else {
                //te groot
                breedtestate = false;
                addRemoveBlurEvent(breedteinput, breedtelabel, "Breedte te groot", true);
            }
        }
        yield zoektypelamel();
        checkstate();
    });
};
hoogteinput.oninput = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const element = this;
        const _value = Number(element.value);
        winkelmand.hoogte = _value;
        if (_value >= MIN_HOOGTE && _value <= MAX_HOOGTE) {
            if (winkelmand.hoogte && winkelmand.breedte) {
                if (winkelmand.breedte <= MAX_BREEDTE) {
                    addRemoveBlurEvent(breedteinput, breedtelabel, "", false);
                }
                const _opp = (winkelmand.hoogte * winkelmand.breedte) / 1000000;
                if (_opp < MAX_OPP) {
                    breedtestate = true;
                    hoogtestate = true;
                    oppervlaktestate = true;
                    addRemoveBlurEvent(hoogteinput, hoogtelabel, "", false);
                    zoektypeafwerking();
                }
                else {
                    oppervlaktestate = false;
                    hoogtestate = true;
                    addRemoveBlurEvent(hoogteinput, hoogtelabel, "Totaal oppervlak te groot!", true);
                }
            }
            else {
                hoogtestate = true;
                addRemoveBlurEvent(hoogteinput, hoogtelabel, "", false);
            }
        }
        else {
            if (_value < MIN_HOOGTE) {
                // te klein
                hoogtestate = false;
                addRemoveBlurEvent(hoogteinput, hoogtelabel, "Hoogte te laag!", true);
            }
            else {
                //te groot
                hoogtestate = false;
                addRemoveBlurEvent(hoogteinput, hoogtelabel, "Hoogte te hoog", true);
            }
        }
        yield zoektypelamel();
        checkstate();
    });
};
function zoektypeafwerking() {
    return __awaiter(this, void 0, void 0, function* () {
        const _afwerking = yield goFetch("/typeafwerking", "voorzetrolluik");
        typeafwerkingDIV.innerHTML = toevoegenaanDIV(_afwerking, "typeafwerking", false); // indien images toegevoegd - verander false naar true
    });
}
function zoekafwerkingdata(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const _afwerking = yield goFetch("/zoekafwerkingdata", value);
        //console.log("_afwerking", _afwerking);
        return _afwerking;
    });
}
function afrondenop100Tal(value) {
    const _newValue = Math.ceil(value / 100) * 100;
    return _newValue;
}
function typeafwerkingChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("value typeafwerkingchange", value);
        //console.log("typeafwerkingchangevalue", value);
        typeafwerkingstate = true;
        winkelmand.typeafwerking = value;
        const _afwerking = yield zoekafwerkingdata(value);
        winkelmand.afwerkingdata = JSON.stringify({ afwerking: _afwerking });
        if (winkelmand.typeafwerking === "dag") {
            typeafwerkingdagstate = false;
        }
        yield zoektypelintofmotor();
        yield zoekafwerkingdag();
        yield zoektypelamel();
        checkstate();
    });
}
// Voeg de functie toe aan het window object
window.typeafwerkingChange = typeafwerkingChange;
function zoekafwerkingdag() {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/afwerkingdag", "data");
        //console.log("afwerkingdag data", _data);
        const _value = yield toevoegenaanDIV(_data, "afwerkingdag", false);
        typeAfwerkingdag.innerHTML = _value;
    });
}
function afwerkingdagChange() {
    return __awaiter(this, void 0, void 0, function* () {
        const checkboxes = typeAfwerkingdag.querySelectorAll('input[type="checkbox"]');
        const checkedValues = [];
        typeafwerkingdagstate = false;
        var checked = false;
        for (const [index, checkbox] of checkboxes.entries()) {
            // Controleer of de checkbox aangevinkt is
            if (checkbox.checked) {
                //console.log("checked");
                checked = true;
                const _data = yield goFetch("/zoekafwerkingdagdata", checkbox.value);
                //console.log("afwerkingdagChange data", _data);
                // Voeg de waarde van de aangevinkte checkbox toe aan de array
                checkedValues.push(_data);
            }
        }
        if (checked) {
            //console.log("typeafwerkingdagstate is checked");
            typeafwerkingdagstate = true;
        }
        else {
            //console.log("typeafwerkingdagstate is not checked");
            typeafwerkingdagstate = false;
        }
        yield zoektypelamel();
        checkstate();
        //console.log("afwerkingdag data", _data);
        winkelmand.typeafwerkingdagdata = JSON.stringify({
            afwerkingdag: checkedValues,
        });
        /*//console.log(
          "winkelmand.typeafwerkingdagdata",
          winkelmand.typeafwerkingdagdata
        );
        */
    });
}
window.afwerkingdagChange = afwerkingdagChange;
function zoektypelintofmotor() {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/typelintofmotor", "data");
        //console.log("typelintofmotor data", _data);
        const _value = yield toevoegenaanDIV(_data, "typelintofmotor", false);
        typelintofmotorDIV.innerHTML = _value;
    });
}
// Voeg de functie toe aan het window object
function typelintofmotorChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("typelingofmotorchangevalue", value);
        typelintofmotorstate = true;
        typelintofmotorData = value;
        winkelmand.typebediening = value;
        const _data = yield zoektypebediening(typelintofmotorData);
        //console.log("data typelintofmotorchange", _data);
        const _value = yield toevoegenaanDIV(_data, "typebediening", false);
        //console.log("_value toevoegen aan DIV");
        typebedieningDIV.innerHTML = _value;
        winkelmand.zenders = "";
        zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
        const _dataBedieningskant = yield zoekbedieningskant();
        bedieningskantDIV.innerHTML = toevoegenaanDIV(_dataBedieningskant, "bedieningskant", true);
        yield zoektypelamel();
        checkstate();
    });
}
window.typelintofmotorChange = typelintofmotorChange;
function zoektypebediening(value) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("data zoektypebediening", value);
        const _data = yield goFetch("/typebediening", value);
        //console.log("Data typebediening", _data);
        typebedieningData = _data;
        return _data;
    });
}
function typebedieningChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('typebediening change', value);
        typebedieningstate = true;
        typebediening = value;
        winkelmand.typelintofmotor = value;
        winkelmand.zenders = "";
        zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
        yield zoektypelamel();
        var _data;
        var _value = "veeras";
        if (value !== "Veeras") {
            _data = yield zoekbedieningdata(value);
            _value = _data.value();
            //console.log("value is geen veeras", value, "nieuwe value = ", _value);
        }
        if (_value === "veeras") {
            console.log("veeras");
        }
        else if (_value === "manueel") {
            console.log("manueel");
            const _valueDIV = toevoegenaanDIV(_data.data, "manueel", false);
            bedieningDIV.innerHTML = _valueDIV;
        }
        else if (_value === "schakelaar") {
            console.log("schakelaar");
            const _valueDIV = toevoegenaanDIV(_data.data, "schakelaar", false);
            bedieningDIV.innerHTML = _valueDIV;
        }
        else if (_value === "afstandsbediening") {
            console.log("afstandsbediening");
            console.log("value typebedieningchange", value);
            const _valueDIV = toevoegenaanDIV(_data.data, "afstandsbediening", false);
            bedieningDIV.innerHTML = _valueDIV;
        }
        else if (_value === "error") {
            console.log("Error typebedieningchange");
            bedieningDIV.innerHTML = "";
        }
        const _kastbinnenbuiten = yield zoekkastbinnenbuiten(winkelmand.typelintofmotor);
        if (_kastbinnenbuiten === null) {
        }
        else {
            kastbinnenbuitenDIV.innerHTML = toevoegenaanDIV(_kastbinnenbuiten, "kastbinnenbuiten", true);
        }
        checkstate();
        console.log(winkelmand.zenders);
        console.log("zendersData - typebedieningchange", zendersData);
        ;
    });
}
window.typebedieningChange = typebedieningChange;
function zoekkastbinnenbuiten(typelintofmotor) {
    return __awaiter(this, void 0, void 0, function* () {
        var _typelintofmotor = "";
        if (typelintofmotor === "veeras") {
            _typelintofmotor = "veeras";
        }
        else if (typelintofmotor === "csi" || typelintofmotor === "csirts") {
            _typelintofmotor = "csi";
        }
        else {
            return null;
        }
        const _data = yield goFetch("/zoekkastbinnenbuiten", _typelintofmotor);
        return _data;
    });
}
function kastbinnenbuitenChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        winkelmand.kastbinnenbuiten = value;
        kastbinnenbuitenstate = true;
        checkstate();
    });
}
window.kastbinnenbuitenChange = kastbinnenbuitenChange;
function zoekbedieningdata(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekbedieningdata", value);
        const _value = function () {
            if (_data.error === "error")
                return "error";
            if (_data[0].manueel === 1)
                return "manueel";
            if (_data[0].schakelaar === 1)
                return "schakelaar";
            if (_data[0].afstandsbediening === 1)
                return "afstandsbediening";
            return "veeras";
        };
        return { data: _data, value: _value };
    });
}
//te gebruiken bij kleurlamel change
function berekenkastgrootte(kastdata, kleurlamel) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekkastgrootte", {
            kastdata: kastdata,
            kleurlamel: kleurlamel,
        });
        winkelmand.kastdata = _data;
    });
}
function herberekenalles() { }
function handleCheckboxChange(elementId, checked) {
    //console.log("elementId", elementId, "this", checked);
    var checkbox = document.getElementById(elementId);
    var tekstvak = document.getElementById("aantalTekstvak_" + elementId);
    var aantaltekst = document.getElementById("aantalTekst_" + elementId);
    manueelData = [{ benaming: "geen", checked: false }];
    winkelmand.schakelaar = "geen";
    if (checkbox.checked) {
        tekstvak.style.display = "inline-block";
        aantaltekst.style.display = "inline-block";
    }
    else {
        tekstvak.style.display = "none";
        aantaltekst.style.display = "none";
    }
    if (zendersData.length > 0) {
        zendersData.forEach((element, index) => {
            if (element.benaming === elementId) {
                if (checked) {
                    zendersData[index].checked = true;
                    winkelmand.zenders = JSON.stringify({ zenders: zendersData });
                    checkstate();
                }
                else {
                    zendersData[index].checked = false;
                    winkelmand.zenders = JSON.stringify({ zenders: zendersData });
                    checkstate();
                }
            }
        });
    }
    else {
        //console.log("nog geen data");
        zendersData = [{ benaming: checkbox.value, aantal: 0, checked: true }];
        winkelmand.zenders = JSON.stringify({ zenders: zendersData });
    }
    //console.log("zenderData handleChecboxCange", zendersData);
}
window.handleCheckboxChange = handleCheckboxChange;
function manueelgeen(checked) {
    //console.log("maneel geen", checked);
    zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
    winkelmand.zenders = JSON.stringify({ zenders: zendersData });
    winkelmand.manueel = JSON.stringify({ manueel: manueelData });
    winkelmand.schakelaar = "";
    if (checked) {
        manueelData = [{ benaming: "geen", checked: true }];
        winkelmand.manueel = JSON.stringify({ manueel: manueelData });
        zenderState = true;
        checkstate();
    }
    else {
        manueelData = [{ benaming: "geen", checked: false }];
        zenderState = false;
        checkstate();
    }
}
window.manueelgeen = manueelgeen;
function manueelChange(manueel) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("manueelchange", manueel);
        zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
        winkelmand.zenders = "";
        manueelData = [{ benaming: manueel, checked: true }];
        winkelmand.manueel = JSON.stringify({ manueel: manueelData });
        zenderState = true;
        //console.log("winkelmand schakelaar", winkelmand.manueel);
        checkstate();
    });
}
window.manueelChange = manueelChange;
function zendergeen(checked) {
    if (checked) {
        //zet zendersdata.benaming geen op true
        zendersData[0].checked = true;
        winkelmand.zenders = JSON.stringify({ zenders: zendersData });
        //console.log("Geen", zendersData);
        zenderState = true;
        checkstate();
    }
    else {
        //zet zendersdata.benaming geen op false
        zendersData[0].checked = false;
        winkelmand.zenders = JSON.stringify({ zenders: zendersData });
        //console.log("Geen", zendersData);
        zenderState = false;
        checkstate();
    }
}
window.zendergeen = zendergeen;
function zenderaantalchange(aantal, benaming) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("zendersaantalchange - banming", benaming);
        var checked = false;
        //console.log("zenderData", zendersData);
        zendersData.forEach((element, index) => {
            //console.log("element zenderData", element);
            if (element.benaming === benaming) {
                checked = true;
                zendersData[index].aantal = Number(aantal);
            }
        });
        if (!checked) {
            //console.log("zenderdata not checked", zendersData);
            zendersData.push({
                benaming: benaming,
                aantal: Number(aantal),
                checked: true,
            });
            winkelmand.zenders = JSON.stringify({ zenders: zendersData });
            //console.log("aantal changed", winkelmand.zenders, zendersData);
        }
        else {
            winkelmand.zenders = JSON.stringify({ zenders: zendersData });
        }
        //console.log("zendersData - zenderaantalchange", zendersData);
        zenderState = true;
        checkstate();
    });
}
window.zenderaantalchange = zenderaantalchange;
function schakelaargeen() {
    return __awaiter(this, void 0, void 0, function* () {
        zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
        winkelmand.zenders = JSON.stringify({ zenders: zendersData });
        manueelData = [{ benaming: "geen", checked: false }];
        winkelmand.zenders = "geen";
        winkelmand.schakelaar = "geen";
        zenderState = true;
        checkstate();
        //naar aanslagtop
    });
}
window.schakelaargeen = schakelaargeen;
function schakelaarChange(schakelaar) {
    //console.log("schakelaarOnchange", schakelaar);
    zendersData = [{ benaming: "geen", aantal: 0, checked: false }];
    winkelmand.zenders = JSON.stringify({ zenders: zendersData });
    manueelData = [{ benaming: "geen", checked: false }];
    winkelmand.schakelaar = schakelaar;
    zenderState = true;
    //console.log("winkelmand schakelaar", winkelmand.schakelaar);
    checkstate();
}
window.schakelaarChange = schakelaarChange;
function typelamelchange(typelamel) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield zoekkleurlamel(typelamel);
        kleurlamelDIV.innerHTML = toevoegenaanDIV(_data, "kleurlamel", false);
        typelamelstate = true;
        winkelmand.typelamel = typelamel;
        //console.log("kast data", kastData);
        for (let index = 0; index < kastData.length; index++) {
            if (kastData[index].benaming === typelamel) {
                winkelmand.kastdata = Number(kastData[index].kastgrootte);
            }
        }
        changedstateTypelamel = false;
        typelamelErrorLog = "";
        yield zoektypelamel();
        checkstate();
    });
}
window.typelamelChange = typelamelchange;
function zoektypelamel() {
    return __awaiter(this, void 0, void 0, function* () {
        var afwerkingdataChecked = false;
        if (winkelmand.typeafwerking === "af") {
            afwerkingdataChecked = true;
        }
        else if (winkelmand.typeafwerking === "dag" &&
            winkelmand.typeafwerkingdagdata !== "") {
            afwerkingdataChecked = true;
        }
        if (winkelmand.breedte &&
            winkelmand.hoogte &&
            winkelmand.typeafwerking &&
            afwerkingdataChecked &&
            winkelmand.typelintofmotor) {
            try {
                const _data = yield goFetch("/zoektypelamel", {
                    data: winkelmand.typelintofmotor,
                    breedte: winkelmand.breedte,
                    hoogte: winkelmand.hoogte,
                    afwerking: winkelmand.typeafwerking,
                    afwerkingdata: winkelmand.typeafwerkingdagdata,
                    kleurlamel: winkelmand.kleurkast,
                });
                //console.log("_data zoek typelamel", _data);
                if (_data.length === 0) {
                    lamelAanwezig = false;
                    typelamelErrorLog =
                        "Er is iets misgelopen bij het zoeken voor het type lamel, de afmetingen zijn te groot.";
                }
                else {
                    lamelAanwezig = true;
                    //console.log("Lamel aanwezig", lamelAanwezig);
                }
                //console.log("ZOEKTYPELAMEL : ", _data);
                typelamelDIV.innerHTML = toevoegenaanDIV(_data, "typelamel", false);
                //console.log("_data zoektypelamel", _data);
                kastData = _data;
                //console.log('kastData', kastData);
                for (let index = 0; index < kastData.length; index++) {
                    if (kastData[index].benaming === winkelmand.typelamel) {
                        winkelmand.kastdata = Number(kastData[index].kastgrootte);
                        //console.log("Kastdata aangepast?", winkelmand.kastdata);
                    }
                }
            }
            catch (err) {
                console.error("ERROR :", err);
            }
        }
        else {
            //console.log(" zoektypelamel - Te weinig data");
            typelamelstate = false;
            return;
        }
        if (winkelmand.kleurlamel) {
        }
        checkstate();
    });
}
function zoekuitvoeringblad() {
    return __awaiter(this, void 0, void 0, function* () {
        //zoeken naar de juiste uitvoeringen.
        //console.log('zoekuitvoeringblad gestart')
        try {
            const _data = yield goFetch("/uitvoeringblad", "");
            //console.log("_data uitvoeringblad", _data)
            uitvoeringbladDIV.innerHTML = toevoegenaanDIV(_data, "uitvoeringblad", false);
        }
        catch (err) {
            //console.log("error", err);
        }
    });
}
function uitvoeringbladchange(uitvoeringblad) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log('uitvoeringbladchange gestart', uitvoeringblad)
        winkelmand.uitvoeringblad = uitvoeringblad;
        uitvoeringbladstate = true;
        const _data = yield zoekkastkleur("");
        kleurkastDIV.innerHTML = toevoegenaanDIV(_data, "kleurkast", false);
        checkstate();
    });
}
window.uitvoeringbladChange = uitvoeringbladchange;
function checkKastgroottekleur() {
    return __awaiter(this, void 0, void 0, function* () {
        /*//console.log(
          "winkelmand.kleurlamel",
          winkelmand.kleurlamel,
          "kastData",
          kastData
        );
        */
        if (winkelmand.kleurlamel && kastData) {
            try {
                const _data = yield goFetch("/checkkastgroottekleur", {
                    kleur: winkelmand.kleurlamel,
                    kastdata: winkelmand.kastdata,
                });
                //console.log("checkKastgroottekleur", _data);
                if (_data !== null) {
                    return _data;
                }
                else {
                    return null;
                }
            }
            catch (err) {
                //console.log("error checkKastgroottekleur", err);
            }
        }
    });
}
function kleurlamelchange(kleurlamel) {
    return __awaiter(this, void 0, void 0, function* () {
        kleurlamelstate = true;
        winkelmand.kleurlamel = kleurlamel;
        changedstateKleurlamel = false;
        kleurlamelErrorLog = "";
        yield zoektypelamel();
        yield zoekuitvoeringblad();
        checkstate();
    });
}
window.kleurlamelChange = kleurlamelchange;
function zoekkleurlamel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekkleurlamel", data);
        //console.log("kleurlamel");
        return _data;
    });
}
function zoekkastkleur(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekkastkleur", data);
        //console.log("kleurlamel");
        return _data;
    });
}
function kleurkastChange(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data === "RAL") {
            ralstate = true;
            const _data = yield zoekral(data);
            //console.log("data kleurkastchange", _data);
            toevoegenaanDIV(_data, "RAL", false);
            kleurkaststate = true;
            winkelmand.kleurkast = data;
            checkstate();
        }
        else {
            ralstate = false;
            kleurkaststate = true;
            const _data = yield zoekgeleiders();
            //console.log("Zoekkastkleur Change - zoek geleiders", _data);
            typegeleiderLinksDIV.innerHTML = toevoegenaanDIV(_data, "typegeleiderlinks", true);
            winkelmand.kleurkast = data;
            changedstateKleurkast = false;
            kleurkastErrorLog = "";
            yield zoektypelamel();
            checkstate();
        }
    });
}
window.kleurkastChange = kleurkastChange;
function zoekral(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekral", "ral");
        //console.log("zoekral", _data);
        return _data;
    });
}
function typegeleiderlinksChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        typegeleiderlinksstate = true;
        winkelmand.typegeleiderlinks = value;
        const _data = yield zoekgeleiders();
        typegeleiderRechtsDIV.innerHTML = toevoegenaanDIV(_data, "typegeleiderrechts", true);
        checkstate();
    });
}
window.typegeleiderlinksChange = typegeleiderlinksChange;
function typegeleiderrechtsChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        typegeleiderrechtsstate = true;
        winkelmand.typegeleiderrechts = value;
        checkstate();
    });
}
window.typegeleiderrechtsChange = typegeleiderrechtsChange;
function bedieningskantChange(value) {
    return __awaiter(this, void 0, void 0, function* () {
        bedieningskantstate = true;
        winkelmand.bedieningskant = value;
        changedstateBedieningkant = false;
        bedieningskantErrorLog = "";
        checkstate();
    });
}
window.bedieningskantChange = bedieningskantChange;
function zoekgeleiders() {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekgeleiders", "voorzet");
        //console.log("zoekgeleiders data", _data);
        return _data;
    });
}
function zoekbedieningskant() {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekbedieningskant", winkelmand.typebediening);
        return _data;
    });
}
function zoekgeleiderstoppen() {
    return __awaiter(this, void 0, void 0, function* () {
        const _data = yield goFetch("/zoekgeleiderstoppen", "");
        geleiderstoppenDIV.innerHTML = toevoegenaanDIV(_data, "geleiderstoppen", false);
        return _data;
    });
}
function geleiderstoppenChange(value) {
    winkelmand.geleiderstoppen = value;
    geleiderstoppenstate = true;
    //console.log("geleiderstoppenstate", geleiderstoppenstate);
    berekenMogelijkeKastgroottes(winkelmand.typeafwerking);
    checkstate();
}
window.geleiderstoppenChange = geleiderstoppenChange;
function opmerkingChange(value) {
    winkelmand.opmerking = value;
    checkstate();
}
window.opmerkingChange = opmerkingChange;
function addToCartAndStay() {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("zendersData", zendersData);
        try {
            if (winkelmand.typelintofmotor === "manueel") {
                winkelmand.manueel = JSON.stringify({ manueel: manueelData });
                winkelmand.zenders = JSON.stringify({ zenders: zendersData });
            }
            else if (winkelmand.typelintofmotor === "afstandsbediening") {
                winkelmand.zenders = JSON.stringify({ zenders: zendersData });
            }
            //console.log("winkelmandData", winkelmand);
            const _data = yield goFetch("/addtocart", winkelmand);
            alert("Toevoegen aan winkelmand gelukt");
            window.scroll({
                top: 0,
                behavior: "smooth",
            });
            //console.log("Data doorgestuurd", _data);
        }
        catch (err) {
            console.error("error", err);
        }
    });
}
window.addToCartAndStay = addToCartAndStay;
function addAndGoToCart() {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("zendersData", zendersData);
        const _zenders = JSON.stringify({ zenders: zendersData });
        //console.log("_zenders", _zenders);
        //console.log("Toevoegen en naar winkelmand", winkelmand);
        try {
            if (winkelmand.typelintofmotor === "manueel") {
                winkelmand.manueel = JSON.stringify({ manueel: manueelData });
                winkelmand.zenders = "";
                winkelmand.schakelaar = "";
            }
            else if (winkelmand.typelintofmotor === "schakelaar") {
                winkelmand.manueel = "";
                winkelmand.zenders = "";
            }
            else if (winkelmand.typelintofmotor === "afstandsbediening") {
                winkelmand.zenders = _zenders;
                winkelmand.manueel = "";
                winkelmand.schakelaar = "";
            }
            const _data = yield goFetch("/addtocart", winkelmand);
            alert("Toevoegen aan winkelmand gelukt");
            window.location.href = "/cart";
            //console.log("Data doorgestuurd", _data);
        }
        catch (err) {
            console.error("error", err);
            alert("Toevoegen aan winkelmand mislukt, gelieve opnieuw te proberen");
        }
    });
}
window.addAndGoToCart = addAndGoToCart;
/**
 * Data sturen naar de backend functie, er iets mee doen ,en het resultaat returnen.
 * @param {string} link - Link naar de backend functie, voorbeeld: "/typeafwerking".
 * @param {*} data - De data die meegestuurd word naar de backend functie, dit kan een string,nummer of object zijn.
 */
function goFetch(link, data) {
    try {
        return fetch("/voorzetrolluik" + link, {
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
    }
    catch (err) {
        console.error("Error" + link, err);
    }
    finally {
        //console.log("Function ended" + link);
    }
}
/**
 * De juiste html  genereren om dan te returnen om op een element in de frondend te zetten.
 * @param {Object} elementdata - De data voor het element in de html.
 * @param {String} type - Een string om een if else functie te maken , indien radiobuttons, indien checkboxes, etc..
 * @param {Boolean} type - Indien afbeeldingen.
 */
function toevoegenaanDIV(elementdata, type, img) {
    //console.log("toevoegen aan DIV gestart", elementdata, type);
    var _value = "";
    var typelamelChecked = false;
    var kleurlamelChecked = false;
    var kleurkastChecked = false;
    var bedieningskantChecked = false;
    if (type === "typeafwerking" ||
        type === "typelamel" ||
        type === "typelintofmotor" ||
        type === "typebediening" ||
        type === "manueel" ||
        type === "schakelaar" ||
        type === "typegeleiderlinks" ||
        type === "typegeleiderrechts" ||
        type === "bedieningskant" ||
        type === "uitvoeringblad" ||
        type === "kastbinnenbuiten" ||
        type === "geleiderstoppen") {
        //console.log("toevoegen aan DIV type OK");
        var title;
        var winkelData;
        if (type === "typeafwerking") {
            title = "Afmetingen";
            winkelData = winkelmand.typeafwerking;
        }
        else if (type === "typelamel") {
            title = "Type lamel";
            winkelData = winkelmand.typelamel;
        }
        else if (type === "typelintofmotor") {
            title = "Bediening";
            winkelData = winkelmand.typelintofmotor;
        }
        else if (type === "typebediening") {
            //console.log("toevoegen aan DIV type OK");
            title = "Type bediening";
            winkelData = winkelmand.typebediening;
        }
        else if (type === "manueel") {
            title = "Manueel opties";
            winkelData = winkelmand.manueel;
        }
        else if (type === "schakelaar") {
            title = "Schakelaars";
            winkelData = winkelmand.schakelaar;
        }
        else if (type === "typegeleiderlinks") {
            //console.log("Type geleider links OK");
            title = "Type geleider links (Binnenzicht)";
            winkelData = winkelmand.typegeleiderlinks;
        }
        else if (type === "typegeleiderrechts") {
            title = "Type geleider rechts (Binnenzicht)";
            winkelData = winkelmand.typegeleiderrechts;
        }
        else if (type === "bedieningskant") {
            title = "Bedieningskant (Binnenzicht)";
            winkelData = winkelmand.bedieningskant;
        }
        else if (type === "uitvoeringblad") {
            title = "Uitvoeringblad";
            winkelData = winkelmand.uitvoeringblad;
        }
        else if (type === "kastbinnenbuiten") {
            if (winkelmand.typelintofmotor === "veeras") {
                title = "Veeras";
                winkelData = winkelmand.kastbinnenbuiten;
            }
            else if (winkelmand.typelintofmotor === "csi" ||
                winkelmand.typelintofmotor === "csirts") {
                title = "Noodbediening";
                winkelData = winkelmand.kastbinnenbuiten;
            }
            else {
                title = "nvt";
            }
        }
        else if (type === "geleiderstoppen") {
            title = "Geleiderstoppen";
            winkelData = winkelmand.geleiderstoppen;
        }
        else {
            title = "nvt";
        }
        //label voor bovenaan
        var _value = `<div class="form-group">
    <span style="font-weight: bold;">${title}</span>
  </div>`;
        elementdata.forEach((element, index) => {
            if (type === "schakelaar" || type === "manueel") {
                if (index === 0) {
                    _value =
                        _value +
                            `<div class="form-check">
      <input id="geen" class="form-check-input" type="radio" value="geen" onchange="${type + "geen(this.checked)"}" name=${type} id="geen"" ${"geen" === winkelData ? "checked" : ""}>
      
         
      <label class="form-check-label" for="geen" style="margin-left:30px">
       Geen
      </label>
      </div>
      `;
                }
            }
            //console.log("element", element);
            _value += `<div class="form-check">
              <input id="${element.benaming + type}" class="form-check-input" type="radio" value="${element.benaming}" name=${type} onchange="${type + "Change(value)"}" ${element.benaming === winkelData ? "checked" : ""}>
              <label class="form-check-label" for="${element.benaming + type}" style="margin-left:30px">
              `;
            if (type === "typelamel") {
                if (winkelData) {
                    if (element.benaming === winkelData) {
                        typelamelChecked = true;
                    }
                    else {
                    }
                }
            }
            if (type === "bedieningskant") {
                if (winkelData) {
                    if (element.benaming === winkelData) {
                        bedieningskantChecked = true;
                    }
                    else {
                    }
                }
            }
            if (img) {
                if (type === "typegeleiderlinks" || type === "typegeleiderrechts") {
                    _value += `
          <img src="/img/rolluiken/${element.img}" alt="${element.benaming} Image" onclick="document.getElementById('${element.benaming + type}').click();" style="width: 50px; height: 50px; margin-right: 10px;">
          `;
                }
                else {
                    _value += `
          <img src="/img/rolluiken/${element.img}" alt="${element.benaming} Image" onclick="document.getElementById('${element.benaming + type}').click();"  style="width: 100px; height: 100px; margin-right: 10px;">
          `;
                }
            }
            _value += `
                ${element.omschrijving}
              </label>
            </div>`;
        });
        if (type === "typelamel") {
            if (winkelmand.typelamel) {
                if (typelamelChecked) {
                    changedstateTypelamel = false;
                    typelamelErrorLog = "";
                }
                else {
                    changedstateTypelamel = true;
                    typelamelErrorLog = "Typelamel is niet ingevuld";
                }
            }
        }
        if (type === "bedieningskant") {
            if (winkelmand.bedieningskant) {
                if (bedieningskantChecked) {
                    changedstateBedieningkant = false;
                    bedieningskantErrorLog = "";
                }
                else {
                    changedstateBedieningkant = true;
                    bedieningskantErrorLog = "Bedieningskant is niet ingevuld";
                }
            }
        }
    }
    else if (type === "afwerkingdag") {
        elementdata.forEach((element, index) => {
            _value += ` <div class="form-check" name="typeafwerkingdag2">
      <input class="form-check-input" type="checkbox" value="${element.benaming}" name="typeafwerkingdag"
      onchange="afwerkingdagChange(value)" id="${element.benaming}">
  <label class="form-check-label" for="${element.benaming}" style="margin-left:30px">
      ${element.omschrijving}
  </label></div>`;
        });
    }
    else if (type === "afstandsbediening") {
        //console.log("type komt niet overeen in toevoegen aan DIV");
        //nog toe te voegen
        var _value;
        elementdata.forEach((element, index) => {
            if (index === 0) {
                _value = `<div class="form-group">
      <span style="font-weight: bold;">Zenders</span>
    </div>`;
                _value =
                    _value +
                        `<div class="form-check">
      <input class="form-check-input" type="checkbox" value="geen" onchange="zendergeen(this.checked)" name="zenders" id="geen"" ${"geen" === winkelmand.zenders ? "checked" : ""}>
      
         
      <label class="form-check-label" for="geen" style="margin-left:30px">
       Geen
      </label>
      </div>
      `;
            }
            //console.log("_value vullen met de juiste html data");
            // Voeg checkbox en tekstvak toe
            _value =
                _value +
                    `<div class="form-check" style="margin-top: 10px">
    <input class="form-check-input" type="checkbox" value="${element.benaming}" onchange="handleCheckboxChange('${element.benaming}',this.checked)" name="zenders" id="${element.benaming}" ${element.benaming === winkelmand.zenders ? "checked" : ""}>
   
    <label class="form-check-label" for="${element.benaming}" style="margin-left:30px; display: block;">
      ${element.omschrijving}
    </label>
  
    <!-- Voeg een div toe voor het tekstvak -->
    <label style="margin-left: 30px; display: none;" id="aantalTekst_${element.benaming}">Aantal: </label>
     <input type="number" class="form-check-input" id="aantalTekstvak_${element.benaming}" onchange="zenderaantalchange(value,'${element.benaming}')" placeholder="Aantal" value=0 style="margin: 0px 0px 0px 30px; ${element.benaming === winkelmand.zenders
                        ? "display: inline-block;"
                        : "display: none;"}">
   
  </div>`;
        });
    }
    else if (type === "veeras") {
        //console.log("veeras");
    }
    else if (type === "kleurlamel" || type === "kleurkast") {
        //console.log("type is", type);
        if (type === "kleurlamel") {
            title = "Kleur lamel";
            winkelData = winkelmand.kleurlamel;
        }
        else if (type === "kleurkast") {
            title = "Kleur kast,geleiders & onderlat";
            winkelData = winkelmand.kleurkast;
        }
        else {
            title = "nvt";
        }
        var _value = `<div class="form-group">
    <span style="font-weight: bold;">${title}</span>
  </div>`;
        if (type === "kleurkast") {
            elementdata.forEach((element, index) => {
                if (winkelData) {
                    if (element.kleur === winkelData) {
                        kleurkastChecked = true;
                    }
                    else {
                    }
                }
                if (element.kleur === "Wit" || element.kleur === "Beige") {
                    //console.log("achtergrondkleur", element.RGB);
                    _value += `<div class="form-check">
          <input class="form-check-input" type="radio" value="${element.kleur}"  onchange="${type + "Change(value)"}" name="kleurkast" id="${element.kleur + index.toString() + "kleurkast"}" ${element.kleur === winkelmand.kleurkast ? "checked" : ""}>
          <label class="form-check-label" for="${element.kleur + index.toString() + "kleurkast"}">
            <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
            ${element.kleur}  
          </label>
        </div>`;
                }
                else {
                    //console.log("achtergrondkleur", element.RGB);
                    _value += `<div class="form-check">
        <input class="form-check-input" type="radio" value="${element.kleur}"  onchange="${type + "Change(value)"}" name="kleurkast" id="${element.kleur + index.toString() + "kleurkast"}" ${element.kleur === winkelmand.kleurkast ? "checked" : ""}>
        <label class="form-check-label" for="${element.kleur + index.toString() + "kleurkast"}">
          <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
          ${element.kleur + " - " + element.RAL}  
        </label>
      </div>`;
                }
            });
            if (winkelmand.kleurkast) {
                if (kleurkastChecked) {
                    changedstateKleurkast = false;
                    kleurkastErrorLog = "";
                }
                else {
                    changedstateKleurkast = true;
                    kleurkastErrorLog = "Er is geen kleur kast geselecteerd.";
                }
            }
        }
        else if (type === "kleurlamel") {
            elementdata.forEach((element, index) => {
                if (winkelData) {
                    if (element.kleur === winkelData) {
                        kleurlamelChecked = true;
                    }
                    else {
                    }
                }
                if (element.kleur === "Wit" || element.kleur === "Beige") {
                    //console.log("achtergrondkleur", element.RGB);
                    _value += `<div class="form-check">
          <input class="form-check-input" type="radio" value="${element.kleur}"  onchange="${type + "Change(value)"}" name="kleurlamel" id="${element.kleur + index.toString() + "kleurlamel"}" ${element.kleur === winkelmand.kleurlamel ? "checked" : ""}>
          <label class="form-check-label" for="${element.kleur + index.toString() + "kleurlamel"}">
            <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
            ${element.kleur}  
          </label>
        </div>`;
                }
                else {
                    //console.log("achtergrondkleur", element.RGB);
                    _value += `<div class="form-check">
        <input class="form-check-input" type="radio" value="${element.kleur}"  onchange="${type + "Change(value)"}" name="kleurlamel" id="${element.kleur + index.toString() + "kleurlamel"}" ${element.kleur === winkelmand.kleurlamel ? "checked" : ""}>
        <label class="form-check-label" for="${element.kleur + index.toString() + "kleurlamel"}">
          <span style="background-color: ${element.RGB}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
          ${element.kleur + " - " + element.RAL}  
        </label>
      </div>`;
                }
            });
            if (winkelmand.kleurlamel) {
                if (kleurlamelChecked) {
                    changedstateKleurlamel = false;
                    kleurlamelErrorLog = "";
                }
                else {
                    changedstateKleurlamel = true;
                    kleurlamelErrorLog = "Er is geen kleur lamel geselecteerd.";
                }
            }
        }
        if (type === "kleurkast") {
            _value += `
<div class="form-check">
  <input class="form-check-input" type="radio" value="RAL" onchange="${type + "Change(value)"}" name=${type} id="RAL" ${"RAL" === winkelmand.kleurkast ? "checked" : ""}>
  <label class="form-check-label" for="RAL">
    <span class="multiColorConic"></span>
    RAL
  </label>
    </div>`;
        }
    }
    else if (type === "RAL") {
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
            let dropdownHtml = elementdata
                .map((element) => `<option value="${element.alles}" ${element.alles === winkelmand.kleurkastral ? "selected" : ""}>${element.alles}</option>`)
                .join("");
            dropdownSelect.innerHTML = dropdownHtml;
        }
        function filterOptions() {
            const input = filterInput.value.toLowerCase();
            // Splits de invoer op niet-alfanumerieke karakters om meerdere zoektermen te ondersteunen
            const searchTerms = input.split(/\W+/).filter((term) => term.length > 0);
            const filteredOptions = elementdata
                .filter((element) => {
                // Zet de element waarde om naar lowercase voor de vergelijking
                const elementValueLower = element.alles.toLowerCase();
                // Controleer of alle zoektermen in de element waarde voorkomen
                return searchTerms.every((term) => elementValueLower.includes(term));
            })
                .map((element) => `<option value="${element.alles}" ${element.alles === winkelmand.kleurkastral ? "selected" : ""}>${element.alles}</option>`)
                .join("");
            dropdownSelect.innerHTML = filteredOptions;
        }
        window.filterOptions = filterOptions;
        function updateInputValue() {
            return __awaiter(this, void 0, void 0, function* () {
                filterInput.value = dropdownSelect.value;
                // Implementeer eventuele aanvullende logica die nodig is wanneer een nieuwe waarde wordt geselecteerd
                ralcheckedstate = true;
                winkelmand.kleurkastral = dropdownSelect.value;
                const _data = yield zoekgeleiders();
                typegeleiderLinksDIV.innerHTML = toevoegenaanDIV(_data, "typegeleiderlinks", true);
                checkstate();
            });
        }
        window.updateInputValue = updateInputValue;
        // Roep initializeDropdown aan om de dropdown te vullen bij het laden
        initializeDropdown();
    }
    return _value;
}
function berekenMogelijkeKastgroottes(afwerking) {
    return __awaiter(this, void 0, void 0, function* () {
        if (afwerking === "dag") {
            const _data = { "breedte": winkelmand.breedte, "hoogte": winkelmand.hoogte, "afwerkingdag": JSON.parse(winkelmand.typeafwerkingdagdata), "typelamel": winkelmand.typelamel, "typelintofmotor": winkelmand.typelintofmotor, "kastdata": winkelmand.kastdata };
            //const result = stuur naar backend om te berekenen
            const results = yield goFetch('/berekenMogelijkeKastgroottes', _data);
            if (results && results.length) {
                //console.log('mogelijke kastgroottes', results)
                kastgrootteKiezenDIV.innerHTML = toevoegenaanDIV(results, "kastgrootte", false);
            }
        }
        else {
            //console.log('afwerking is niet dag,Kastgrootte veranderd niet, dus afmetingen zijn afgewerkte maten!')
        }
    });
}
function voegnieuwekastgroottetoe(afwerking) {
    const afwerkingdagData = JSON.parse(winkelmand.typeafwerkingdagdata);
    if (afwerking === "dag") {
        if (afwerkingdagData.hoogte === "kast") {
        }
    }
    else {
        //console.log('afwerking is niet dag,Kastgrootte veranderd niet!')
    }
}
