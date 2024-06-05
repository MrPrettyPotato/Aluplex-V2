const express = require('express');
const fetchBlad = require('../database/fetchData/blad')
const fetchTradi = require('../database/fetchData/tradi')
const fetchRalPrice = require('../database/fetchData/lakkerij')
const fetchRal = require('../database/fetchData/ral')
const fetchOphangveer = require('../database/fetchData/ophangveer')
const fetchTradiBediening = require('../database/fetchData/fetchTradiBediening')
const fetchZenderData = require('../database/fetchData/fetchZenderData')
const fetchTypeBediening = require('./rolluiken/fetchTypeBediening')
const fetchVoorzet = require('../database/fetchData/fetchVoorzet')
const fetchKast = require('../database/fetchData/fetchKast')
const fetchOmschrijving = require('../database/fetchData/fetchOmschrijving')
const fetchScreen = require('../database/fetchData/fetchScreen')
const fetchTypedoek = require('../database/fetchData/fetchTypedoek')
const fetchGeleiderstop = require('../database/fetchData/fetchGeleiderstop')





async function calculatePrice(data) {
    console.log('calculate price gestart')

    try {

        var _data = data
        for (const [index, element] of _data.entries()) {
            console.log('calculate price Element')

            var _breedte;
            var _hoogte;
            var _ralOnderlat;
            var _typelamel;
            var _bladPrice
            var _typebedieningPrijs;
            var _typebediening;
            if (element.type === "Rolluikblad") {
                // Te gebruiken variables
                _breedte = calculateSearchSize(element.afgbreedte).toString();
                _hoogte = calculateSearchSize(element.afghoogte);
                _ralOnderlat = element.ralonderlat
                console.log('ral onderlat', _ralOnderlat)
                _typelamel = (element.typelamel).toLowerCase();
                if (element.type === "Rolluikblad") {

                    _bladPrice = await fetchBlad(_breedte, _typelamel, _hoogte)
                    _data[index].RBbladprijs = _bladPrice
                }
                const typelamelOmschrijving = await fetchOmschrijving('typelamel', 'benaming', element.typelamel)
                _data[index].typelamelomschrijving = typelamelOmschrijving

                const ral = await fetchRal(_ralOnderlat)
                console.log('RAL', ral)

                if (element.kleuronderlat === "RAL") {

                    var _odlral = ral.ral
                    var _odlaecode = ral.aecode
                    var _odluitvoering = ral.uitvoering
                    var _odlomschrijving = ral.omschrijving
                    _data[index].odlral = _odlral
                    _data[index].odlaecode = _odlaecode
                    _data[index].odluitvoering = _odluitvoering
                    _data[index].odlomschrijving = _odlomschrijving
                    //zoek RAL meerprijs 
                    const ralPrice = await fetchRalPrice(element.type, _odluitvoering)

                    const ralPrijs = ralPrice.prijs
                    const eenheid = ralPrice.eenheid
                    console.log('ralPrijs', ralPrijs, typeof ralPrijs)
                    var _ralPrijs;
                    //console.log('breedte typeof',typeof element.breedte)
                    if (eenheid == "m") {
                        //console.log('per Meter');
                        _ralPrijs = (((element.afgbreedte) / 1000) * ralPrijs).toFixed(2)
                    } else {
                        //console.log('Niet per meter')
                        _ralPrijs = ralPrijs.toFixed(2)
                    }

                    console.log('_ralPrijs', _ralPrijs)
                    //console.log("ralprijs", _ralPrijs)
                    _data[index].RBlakprijs = _ralPrijs
                }
                if (element.typeophangveer) {
                    console.log('typeophangveer', element.typeophangveer, element.afgbreedte)
                    const ophangveerprijs = await fetchOphangveer(element.typeophangveer, element.afgbreedte)
                    _data[index].RBophangveerprijs = ophangveerprijs
                }

            } else if (element.type === "Tradirolluik") {
                // Te gebruiken variables
                _breedte = calculateSearchSize(element.afgbreedte).toString();
                _hoogte = calculateSearchSize(element.afghoogte);
                _ralOnderlat = element.ralonderlat
                _typelamel = (element.typelamel).toLowerCase();
                if (element.type === "Rolluikblad") {

                    _bladPrice = await fetchBlad(_breedte, _typelamel, _hoogte)
                } else if (element.type === "Tradirolluik") {
                    const bediening = fetchTypeBediening(element.typebediening)
                    console.log('tradiBlad = ', _breedte, _typelamel, _hoogte, element.typebediening)
                    _bladPrice = await fetchTradi(_breedte, _typelamel, _hoogte, bediening)
                    console.log('tradiblad prijs', _bladPrice)
                    const tradiBediening = await fetchTradiBediening(element.typelintofmotor)
                    if (tradiBediening.prijs && tradiBediening.prijs > 0) {
                        _data[index].typebedieningPrijs = Number(tradiBediening.prijs)
                        _data[index].typebedieningOmschrijving = tradiBediening.omschrijving
                    } else {

                        _data[index].typebedieningOmschrijving = tradiBediening.omschrijving
                    }

                    if (element.typebediening === "manueel") {
                        const manueels = JSON.parse(element.manueel).manueel
                        console.log('zenders', manueels, typeof manueels)
                        if (!manueels[0].checked) {
                            var manueelsData = []
                            for (const [index, manueelElement] of manueels.entries()) {
                                if (manueelElement.benaming === "geen") {

                                } else {
                                    const manueelData = await fetchZenderData(manueelElement.benaming)
                                    console.log('manueelsData', manueelData)
                                    manueelsData.push({
                                        "benaming": manueelData.benaming,
                                        "omschrijving": manueelData.omschrijving,
                                        "prijs": manueelData.prijs
                                    })

                                }
                            }
                            console.log("manueelsData", manueelsData)
                            _data[index].manueelData = JSON.stringify({
                                manueel: manueelsData
                            })
                        } else {
                            _data[index].manueelData = "geen"
                        }
                    } else if (element.typebediening === "schakelaar") {
                        if(element.schakelaar != "geen"){

                            const schakelaarData = await fetchZenderData(element.schakelaar)
                            _data[index].schakelaarOmschrijving = schakelaarData.omschrijving
                            _data[index].schakelaarprijs = Number(schakelaarData.prijs)
                        }

                    } else if (element.typebediening === "afstandsbediening") {


                        //___//
                        const zenders = JSON.parse(element.zenders).zenders
                        console.log('zenders', zenders, typeof zenders)
                        if (!zenders[0].checked) {
                            var zendersData = []
                            for (const [index, zenderElement] of zenders.entries()) {
                                if (zenderElement.benaming === "geen") {

                                } else {
                                    if (zenderElement.checked) {
                                        const zenderData = await fetchZenderData(zenderElement.benaming)
                                        console.log('zenderData', zenderData)
                                        if (zenderData.somfyio === 1 && element.klant.toLowerCase() === 'feryn') {
                                            zendersData.push({
                                                "benaming": zenderData.benaming,
                                                "omschrijving": zenderData.omschrijving,
                                                "prijs": zenderData.ferynprijs,
                                                "aantal": zenderElement.aantal,
                                                "feryn": true
                                            })
                                        } else {
                                            zendersData.push({
                                                "benaming": zenderData.benaming,
                                                "omschrijving": zenderData.omschrijving,
                                                "prijs": zenderData.prijs,
                                                "aantal": zenderElement.aantal,
                                                "feryn": false
                                            })
                                        }
                                    }


                                }
                            }
                            _data[index].zendersOmschrijving = JSON.stringify({
                                zenders: zendersData
                            });
                        } else {
                            _data[index].zendersData = "geen"
                        }
                        //___//
                    }



                }

                const ral = await fetchRal(_ralOnderlat)
                console.log('RAL', ral)

                element.RBbladprijs = _bladPrice
                if (element.kleuronderlat === "RAL") {

                    var _odlral = ral.ral
                    var _odlaecode = ral.aecode
                    var _odluitvoering = ral.uitvoering
                    var _odlomschrijving = ral.omschrijving
                    _data[index].odlral = _odlral
                    _data[index].odlaecode = _odlaecode
                    _data[index].odluitvoering = _odluitvoering
                    _data[index].odlomschrijving = _odlomschrijving
                    //zoek RAL meerprijs 
                    const ralPrice = await fetchRalPrice(element.type, _odluitvoering)

                    const ralPrijs = ralPrice.prijs
                    const eenheid = ralPrice.eenheid
                    console.log('ralPrijs', ralPrijs, typeof ralPrijs)
                    var _ralPrijs;
                    //console.log('breedte typeof',typeof element.breedte)
                    if (eenheid == "m") {
                        //console.log('per Meter');
                        _ralPrijs = (((element.afgbreedte) / 1000) * ralPrijs).toFixed(2)
                    } else {
                        //console.log('Niet per meter')
                        _ralPrijs = ralPrijs.toFixed(2)
                    }

                    console.log('_ralPrijs', _ralPrijs)
                    //console.log("ralprijs", _ralPrijs)
                    _data[index].RBlakprijs = Number(_ralPrijs)
                }
                if (element.typeophangveer) {
                    console.log('typeophangveer', element.typeophangveer, element.afgbreedte)
                    const ophangveerprijs = await fetchOphangveer(element.typeophangveer, element.afgbreedte)
                    _data[index].RBophangveerprijs = ophangveerprijs
                }
            } else if (element.type === "Voorzetrolluik") {
                //verander benaming naar omschrijving data
                if (element.typelintofmotor !== "veeras") {

                    const _bedieningskant = await fetchOmschrijving("vzrbedieningskant", "benaming", element.bedieningskant)
                    element.typebedieningskantOmschrijving = _bedieningskant
                }
                const _typegeleiderlinks = await fetchOmschrijving("typevzrgeleiders", "benaming", element.typegeleiderlinks)
                const _typegeleiderrechts = await fetchOmschrijving("typevzrgeleiders", "benaming", element.typegeleiderrechts)


                if (_typegeleiderlinks) {
                    element.typegeleiderlinksOmschrijving = _typegeleiderlinks
                }
                if (_typegeleiderrechts) {
                    element.typegeleiderrechtsOmschrijving = _typegeleiderrechts
                }
                const bediening = fetchTypeBediening(element.typebediening)


                const _afwerking = JSON.parse(element.afwerkingdata).afwerking
                console.log('_afwerking', _afwerking)

                const _tijdelijkeBreedte = element.afgbreedte
                var tijdelijkeHoogte = element.afghoogte

                //BUG : TESTEN VAN DE HOOGTE
                // if (element.typeafwerking !== "af") {
                //     if (_afwerking.hoogte === "kast") {
                //         //kijk of de kastgrootte past bij de juiste kleur
                //         const _nieuweKastgrootte = await fetchKast(element.kastdata, element.kleurkast)
                //         console.log('_nieuwekastgrootte', _nieuweKastgrootte)
                //         element.kastdata = _nieuweKastgrootte

                //         tijdelijkeHoogte = element.hoogte + _nieuweKastgrootte
                //     } else {

                //     }
                // } else {
                //     tijdelijkeHoogte = element.afghoogte
                // }

                _breedte = calculateSearchSize(element.afgbreedte).toString();
                _hoogte = calculateSearchSize(element.afghoogte);

                _typelamel = (element.typelamel).toLowerCase();
                _typebediening = element.typebediening
                _RAL = element.kleurkast
                //zoeken naar prijs voorzetrolluik
                const _vzrData = await fetchVoorzet(_typelamel, _breedte, _hoogte, element.typelintofmotor, element.klant) //returned vzrprijs & meerprijs  //TODO
                console.log('_vzrData', _vzrData)
                _data[index].feryndb = _vzrData.feryn ? 1 : 0;
                _data[index].vzrprijs = _vzrData.vzrprijs
                _data[index].vzrmeerprijs = _vzrData.meerprijs
                console.log('data voorzet', _vzrData)
                if (_vzrData.meerprijs && _vzrData.meerprijs > 0) {
                    console.log('Meerprijs voorzet', _vzrData.meerprijs)
                    _data[index].typebedieningPrijs = _vzrData.meerprijs
                    _data[index].typebedieningOmschrijving = _vzrData.omschrijving
                } else {
                    console.log('Geen meerprijs')
                    _data[index].typebedieningOmschrijving = _vzrData.omschrijving
                }
                const ral = await fetchRal(element.kleurkastral)
                //zoeken naar RAL meerpress indien nodig
                if (_RAL === "RAL") {
                    //meerprijs ral berekenen
                    console.log('_RAL Voorzet', ral)

                    var _kastral = ral.ral
                    var _kastaecode = ral.aecode
                    var _kastuitvoering = ral.uitvoering
                    var _kastomschrijving = ral.omschrijving
                    _data[index].kastral = _kastral
                    _data[index].kastaecode = _kastaecode
                    _data[index].kastuitvoering = _kastuitvoering
                    _data[index].kastomschrijving = _kastomschrijving
                    //zoek RAL meerprijs 
                    console.log('Zoeken naar VZR ralprijs')
                    const ralPrice = await fetchRalPrice(element.type, _kastuitvoering)

                    const ralPrijs = ralPrice.prijs
                    const eenheid = ralPrice.eenheid
                    console.log('VZR ralPrijs', ralPrijs, typeof ralPrijs)
                    var _ralPrijs;
                    //console.log('breedte typeof',typeof element.breedte)
                    if (eenheid == "m") {
                        //console.log('per Meter');
                        _ralPrijs = (((element.breedte) / 1000) * ralPrijs).toFixed(2)
                    } else {
                        //console.log('Niet per meter')
                        _ralPrijs = ralPrijs
                    }

                    console.log('_ralPrijs', _ralPrijs)
                    //console.log("ralprijs", _ralPrijs)
                    _data[index].vzrlakprijs = _ralPrijs

                }

                if (_typebediening === "afstandsbediening" || _typebediening === "afstandsbedieningsolar") {
                    //meerprijs zenders berkeenen
                    //___//
                    //___//
                    const _oldZenders = JSON.parse(JSON.stringify(element.zenders))
                    console.log('zenders', _oldZenders, typeof _oldZenders)
                    let zenders;
                    if (typeof _oldZenders === "string") {
                        zenders = JSON.parse(_oldZenders).zenders
                    } else {
                        zenders = _oldZenders.zenders
                    }
                    var zendersData = []
                    if (_oldZenders === "geen") {
                        zendersData.push({
                            "benaming": "geen",
                            "omschrijving": "Geen",
                            "prijs": 0,
                            "aantal": 0
                        })
                    } else {
                        for (const [index, zenderElement] of zenders.entries()) {
                            if (zenderElement.benaming == "geen" && zenderElement.checked) {
                                zendersData.push({
                                    "benaming": "geen",
                                    "omschrijving": "Geen",
                                    "prijs": 0,
                                    "aantal": 0
                                })

                            } else {
                                if (zenderElement.benaming === "geen") {

                                } else {

                                    if (zenderElement.checked) {
                                        console.log('ZenderElement benaming', zenderElement.benaming)
                                        const zenderData = await fetchZenderData(zenderElement.benaming)
                                        if (zenderData.somfyio === 1 && element.klant.toLowerCase() === 'feryn') {
                                            zendersData.push({
                                                "benaming": zenderData.benaming,
                                                "omschrijving": zenderData.omschrijving,
                                                "prijs": zenderData.ferynprijs,
                                                "aantal": zenderElement.aantal,
                                                "feryn": true
                                            })
                                        } else {
                                            zendersData.push({
                                                "benaming": zenderData.benaming,
                                                "omschrijving": zenderData.omschrijving,
                                                "prijs": zenderData.prijs,
                                                "aantal": zenderElement.aantal,
                                                "feryn": false
                                            })
                                        }
                                        console.log('zenderData', zenderData)
                                    }


                                }

                            }
                        }
                    }

                    _data[index].zendersOmschrijving = JSON.stringify({
                        zenders: zendersData
                    });

                    //___//

                } else if (_typebediening === "manueel") {
                    if (element.typelintofmotor === "veeras") {

                    } else {


                        const _oldManueels = JSON.parse(JSON.stringify(element.manueel))
                        console.log('_oldManueels', _oldManueels)
                        let manueels;
                        if (typeof _oldManueels === "string") {
                            manueels = JSON.parse(_oldManueels).manueel
                        } else {
                            manueels = _oldManueels.manueel
                        }
                        console.log('zenders', manueels, typeof manueels)
                        var manueelsData = []
                        for (const [index, manueelElement] of manueels.entries()) {
                            if (manueelElement.benaming === "geen") {
                                console.log('benaming is geen')
                            } else {
                                const manueelData = await fetchZenderData(manueelElement.benaming)
                                console.log('manueelsData', manueelData)
                                manueelsData.push({
                                    "benaming": manueelData.benaming,
                                    "omschrijving": manueelData.omschrijving,
                                    "prijs": manueelData.prijs
                                })

                            }
                        }

                        console.log("manueelsData", manueelsData)
                        _data[index].manueelData = JSON.stringify({
                            manueel: manueelsData
                        })

                    }
                } else if (_typebediening === "schakelaar") {

                    if (element.schakelaar !== "geen") {

                        const schakelaarData = await fetchZenderData(element.schakelaar)
                        _data[index].schakelaarOmschrijving = schakelaarData.omschrijving
                        _data[index].schakelaarprijs = Number(schakelaarData.prijs)
                    }



                }

                //meeprijs motor berekenen
                const _typelintofmotor = element.typelintofmotor
                //indien motor meerprijs heeft

                //prijs berekenen.
                if (element.geleiderstoppen != "geen") {
                    const prijsGeleiderstop = await fetchGeleiderstop(element.geleiderstoppen)
                    console.log('prijsGeleiderstop', prijsGeleiderstop)
                    _data[index].geleiderstopprijs = Number(prijsGeleiderstop.meerprijs)
                }

            } else if (element.type === "Screen") {



                const screenprijs = await fetchScreen(element.zoekbreedte, element.zoekhoogte, element.kastgrootte, element.typebediening, element.klant)
                console.log('screenprijs', screenprijs)
                _data[index].screenprijs = screenprijs.screenprijs
                _data[index].feryndb = (screenprijs.feryn === true) ? 1 : 0
                const _typedoekOmschrijving = await fetchOmschrijving("typescreendoeken", "benaming", element.typedoek)
                const _doekOmschrijving = await fetchOmschrijving("doeken", "benaming", element.doek)
                const typebedieningOmschrijving = await fetchOmschrijving("screentypebediening", "benaming", element.typebediening)
                _data[index].typedoekOmschrijving = _typedoekOmschrijving
                _data[index].doekOmschrijving = _doekOmschrijving
                _data[index].typebedieningOmschrijving = typebedieningOmschrijving


                if (element.typebediening === "somfyio" || element.typebediening === "somfyiosolar") {
                    //meerprijs zenders berkeenen
                    //___//
                    const zenders = JSON.parse(element.zenders).zenders
                    console.log('zenders', zenders, typeof zenders)
                    if (zenders[0].benaming != "geen" && zenders[0].aantal > 0) {
                        var zendersData = []
                        for (const [index, zenderElement] of zenders.entries()) {
                            if (zenderElement.benaming === "geen") {

                            } else {
                                if (element.klant != "feryn ") {
                                    const zenderData = await fetchZenderData(zenderElement.benaming)
                                    console.log('zenderData', zenderData)
                                    zendersData.push({
                                        "benaming": zenderData.omschrijving,
                                        "prijs": Number(zenderData.prijs),
                                        "aantal": Number(zenderElement.aantal),
                                        "feryn": false
                                    })

                                } else {
                                    const zenderData = await fetchZenderData(zenderElement.benaming)
                                    console.log('zenderData', zenderData)
                                    zendersData.push({
                                        "benaming": zenderData.omschrijving,
                                        "prijs": Number(zenderData.ferynprijs),
                                        "aantal": Number(zenderElement.aantal),
                                        "feryn": true
                                    })
                                }


                            }
                        }
                        console.log("zendersData", zendersData)
                        _data[index].zendersOmschrijving = JSON.stringify({
                            zenders: zendersData
                        });
                    } else {
                        _data[index].zendersOmschrijving = "geen"
                    }
                } else if (element.typebediening === "schakelaar") {
                    //___//
                    const schakelaarData = await fetchZenderData(element.schakelaar)
                    _data[index].schakelaarOmschrijving = schakelaarData.omschrijving
                    _data[index].schakelaarprijs = Number(schakelaarData.prijs)
                } else {
                    _data[index].schakelaarOmschrijving = "geen"


                }

                if (element.typedoek) {
                    const _data = await fetchTypedoek(element.typedoek)
                    if (element.klant.toLowerCase() == "feryn") {
                        const _prijs = _data.ferynprijs * ((element.breedte / 1000) * (element.hoogte / 1000))
                        data[index].typedoekprijs = _prijs
                    } else {
                        const _prijs = _data.prijs * ((element.breedte / 1000) * (element.hoogte / 1000))
                        data[index].typedoekprijs = _prijs
                    }
                }

                if (element.kleurkast === "RAL") {

                    //meerprijs RAL toeveogen aan de screen

                    //RAl opdelen in kastral, kastaecode, kastuitvoering, kastomschrijving

                    const ral = await fetchRal(element.kleurkastral)
                    var _kastral = ral.ral
                    var _kastaecode = ral.aecode
                    var _kastuitvoering = ral.uitvoering
                    var _kastomschrijving = ral.omschrijving
                    _data[index].kastral = _kastral
                    _data[index].kastaecode = _kastaecode
                    _data[index].kastuitvoering = _kastuitvoering
                    _data[index].kastomschrijving = _kastomschrijving
                    //zoek RAL meerprijs 
                    console.log('Zoeken naar Screen ralprijs')
                    const ralPrice = await fetchRalPrice(element.type, _kastuitvoering, element.bedrijf)

                    const ralPrijs = ralPrice.prijs
                    const eenheid = ralPrice.eenheid
                    console.log('Screen ralPrijs', ralPrijs, typeof ralPrijs)
                    var _ralPrijs;
                    //console.log('breedte typeof',typeof element.breedte)
                    if (eenheid == "m") {
                        //console.log('per Meter');
                        _ralPrijs = (((element.breedte) / 1000) * ralPrijs).toFixed(2)
                    } else {
                        //console.log('Niet per meter')
                        _ralPrijs = ralPrijs
                    }

                    console.log('_ralPrijs', _ralPrijs)
                    //console.log("ralprijs", _ralPrijs)
                    _data[index].screenlakprijs = _ralPrijs
                }

            }

        }
        console.log("Data aangepast calculateprice", _data)

        return _data
    } catch (err) {
        console.error('location :', __filename)
        console.error('error', err)
        return null
    }
}

module.exports = calculatePrice;



function calculateSearchSize(size) {
    //Deel door 100 en rond af naar boven
    const _size = Math.ceil(size / 100) * 100;
    if (_size < 1000) {
        return 1000
    }
    return _size

}