const {
    format
} = require("path");

function generateTable(data, user, type) {
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

    function formaatGetalfixed0(input) {
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

        return geformatteerdGetal;
    }


    function formatGetal(getal) {
        return getal.toLocaleString('nl-NL');
    }



    //generate the table
    const table = {
        headers: [{
                label: "Aantal",
                property: 'aantal',
                width: 35,
                headerColor: '#000080',
                headerOpacity: '1',
                align: "center",
                render: null
            },
            {
                label: "Naam",
                property: 'naam',
                width: 135,
                headerColor: '#000080',
                headerOpacity: '1',
                renderer: null
            },
            {
                label: "Omschrijving",
                property: 'omschrijving',
                width: 240,
                headerColor: '#000080',
                headerOpacity: '1',
                renderer: null
            },
            {
                label: "Bruto (€)",
                property: 'bruto',
                width: 50,
                headerColor: '#000080',
                headerOpacity: '1',
                align: "right",
                renderer: null
            },
            {
                label: "Korting (%)",
                property: 'korting',
                width: 60,
                headerColor: '#000080',
                headerOpacity: '1',
                align: "center",
                renderer: null,
            },
            {
                label: "Netto (€)",
                property: 'netto',
                width: 50,
                headerColor: '#000080',
                headerOpacity: '1',
                align: "right",
                renderer: null
            },
        ],
        // complex data
        datas: []
    };
    //Voeg data toe aan datas van de table
    var fillData = []
    if (data.aantal) {
        // console.log('data generate Table')

        if (data.type) {
            if (data.type === "Rolluikblad") {
                data.omschrijving = "Rolluikblad"
        
              } else if (data.type === "Tradirolluik") {
                data.omschrijving = "Inbouwrolluik"
        
              } else if (data.type === "Voorzetrolluik") {
                data.omschrijving = "Voorzetrolluik"
        
              }
            var totaalprijs = 0
            if (data.type === "Rolluikblad" || data.type === "Tradirolluik" || data.type === "Voorzetrolluik" || data.type === "Screen") {
                fillData.push({
                    aantal: "",
                    naam: "Positie",
                    omschrijving: data.positie,
                    bruto: "",
                    korting: "",
                    netto: "",
                })
               
                if (data.type === "Rolluikblad") {
                    
                    const korting = data.typelamel + data.type + "korting";
                    fillData.push({
                        aantal: data.aantal,
                        naam: "Type",
                        omschrijving: data.omschrijving,
                        bruto: formaatGetal(data.aantal, data.RBbladprijs.toFixed(2)),
                        korting: data[korting],
                        netto: formaatGetal(data.aantal, Math.round((data.RBbladprijs - (data.RBbladprijs * data[korting] / 100)).toFixed(2))),
    
                    })
                    totaalprijs = totaalprijs + (data.RBbladprijs - (data.RBbladprijs * data[korting] / 100)).toFixed(2) * data.aantal.toFixed(2)
                    fillData.push({
                        aantal: "",
                        naam: "Afgewerkte maten (Br x H)",
                        omschrijving: data.afgbreedte + " x " + data.afghoogte + " mm",
                        bruto: '',
                        korting: '',
                        netto: '',
                    })
                    if (data.kleurlamel === "Wit" || data.kleurlamel === "Beige") {

                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - " + data.kleurlamel +  ((data.kleurlamelRAL) ? " - RAL " + data.kleurlamelRAL : ""),
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - RAL " + data.kleurlamelRAL + " - " + data.kleurlamel,
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    }

                    fillData.push({
                        aantal: "",
                        naam: "Uitvoering blad",
                        omschrijving: data.uitvoeringbladomschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                    
                    // console.log('Nieuwe totaalprijs', totaalprijs)
                    
                    if (data.kleuronderlat === "RAL") {
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Kleur onderlat",
                            omschrijving: "RAL - " + data.odlral + " - " + data.odluitvoering + " - " + data.odlaecode,
                            bruto: formaatGetal(data.aantal, data.RBlakprijs),
                            korting: data.bladlakkerijkorting,
                            netto: formaatGetal(data.aantal, (data.RBlakprijs - (data.RBlakprijs * data.bladlakkerijkorting / 100)).toFixed(2)) + " ",
                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Kleur onderlat",
                            omschrijving: "RAL " + data.ralonderlat + " - " + data.kleuronderlat + " - " + data.odlaecode,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                 
                    if (data.aanslagtop) {
                        fillData.push({
                            aantal: '',
                            naam: "Aanslagtop",
                            omschrijving: data.aanslagtop,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                } else if (data.type === "Tradirolluik") {
                    
                    const korting = data.typelamel + data.typebediening + data.type + 'korting';
                    fillData.push({
                        aantal: data.aantal,
                        naam: "Type",
                        omschrijving: data.omschrijving,
                        bruto: formaatGetal(data.aantal, data.RBbladprijs.toFixed(2)),
                        korting: data[korting],
                        netto: formaatGetal(data.aantal, Math.round((+data.RBbladprijs - (data.RBbladprijs * data[korting] / 100)).toFixed(2))),
                    })
                    fillData.push({
                        aantal: "",
                        naam: "Afgewerkte maten (Br x H)",
                        omschrijving: data.afgbreedte + " x " + data.afghoogte + " mm",
                        bruto: '',
                        korting: '',
                        netto: '',
                    })
                    
                    totaalprijs = totaalprijs + (data.RBbladprijs - (data.RBbladprijs * data[korting] / 100)).toFixed(2) * data.aantal.toFixed(2)
                    if (data.kleurlamel === "Wit" || data.kleurlamel === "Beige") {

                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - " + data.kleurlamel + ((data.kleurlamelRAL) ? " - RAL " + data.kleurlamelRAL : ""),
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - " + data.kleurlamel + " - RAL " + data.kleurlamelRAL,
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    }

                    fillData.push({
                        aantal: "",
                        naam: "Uitvoering blad",
                        omschrijving: data.uitvoeringbladomschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                    // console.log('Nieuwe totaalprijs', totaalprijs)
                   
                    if (data.typebedieningPrijs) {
                        const datatypebedieningprijs = Number(data.typebedieningPrijs)
                        totaalprijs = totaalprijs + (datatypebedieningprijs - (datatypebedieningprijs * data.Tradibedieningkorting / 100)).toFixed(2) * data.aantal.toFixed(2)
                        
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Bediening",
                            omschrijving: data.typebedieningOmschrijving,
                            bruto: formaatGetal(data.aantal, datatypebedieningprijs.toFixed(2)),
                            korting: data.Tradibedieningkorting,
                            netto: formaatGetal(data.aantal, (datatypebedieningprijs - (datatypebedieningprijs * data.Tradibedieningkorting / 100)).toFixed(2)),

                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Bediening",
                            omschrijving: data.typebedieningOmschrijving,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                    if (data.typebediening === "manueel") {
                        // console.log('data.manueelData',data.manueelData)
                        const _newdata = JSON.parse(JSON.stringify(data.manueelData))
                        let _data = _newdata
                        if (typeof _newdata === "string") {
                            _data = JSON.parse(JSON.stringify(_newdata))
                        }
                        // console.log('zendersData',_data,typeof _data)
                        if (_data && _data !== "geen") {
                            var typeBediening = "Lint optie";
                            for (const [index, zenderElement] of _data.manueel.entries()) {
                                // console.log('zender Element', zenderElement)
                                if (zenderElement.prijs && zenderElement.prijs > 0) {
                                    fillData.push({
                                        aantal: zenderElement.aantal,
                                        naam: typeBediening,
                                        omschrijving: zenderElement.omschrijving,
                                        bruto: formaatGetal(data.aantal, zenderElement.prijs.toFixed(2)),
                                        korting: (zenderElement.feryn === true) ? 0 : data.Tradimanueelkorting,
                                        netto: formaatGetal(data.aantal, (zenderElement.feryn === true) ? Number(zenderElement.prijs) : (Number(zenderElement.prijs) - (Number(zenderElement.prijs) * Number(data.Tradimanueelkorting) / 100)).toFixed(2)),

                                    })
                                } else if (index !== 0 && zenderElement.benaming !== "geen") {
                                    fillData.push({
                                        aantal: '',
                                        naam: typeBediening,
                                        omschrijving: zenderElement.benaming,
                                        bruto: '',
                                        korting: '',
                                        netto: '',
                                    })
                                }

                            }
                        }
                    } else if (data.typebediening === "schakelaar") {
                        if (data.schakelaarprijs && data.schakelaarprijs > 0) {
                            fillData.push({
                                aantal: "",
                                naam: "Schakelaar",
                                omschrijving: data.schakelaarOmschrijving,
                                bruto: formaatGetal(data.aantal, Number(data.schakelaarprijs).toFixed(2)),
                                korting: data.Tradischakelaarkorting,
                                netto: formaatGetal(data.aantal, (Number(data.schakelaarprijs) - (Number(data.schakelaarprijs) * Number(data.Tradischakelaarkorting) / 100)).toFixed(2)),

                            })
                        } else {
                            // console.log('data.schakelaardata',data)
                            if(data.schakelaar !== "geen"){
                                fillData.push({
                                    aantal: '',
                                    naam: "Schakelaar",
                                    omschrijving: data.schakelaarOmschrijving,
                                    bruto: '',
                                    korting: '',
                                    netto: '',
                                })
                            } else {
                                fillData.push({
                                    aantal: '',
                                    naam: "Schakelaar",
                                    omschrijving: "Geen",
                                    bruto: '',
                                    korting: '',
                                    netto: '',
                                })
                            }
                           
                        }
                    } else if (data.typebediening === "afstandsbediening") {

                        const _newdata = JSON.parse(JSON.stringify(data.zendersOmschrijving))
                        let _data = _newdata
                        if (typeof _newdata === "string") {
                            _data = JSON.parse(_newdata)
                        }
                        // console.log('zendersData',_data,typeof _data)
                        if (_data && _data !== "geen") {
                            var typeBediening = "Zender";
                            for (const [index, zenderElement] of _data.zenders.entries()) {
                                // console.log('zender Element', zenderElement)
                                if (zenderElement.prijs && zenderElement.prijs > 0) {
                                    fillData.push({
                                        aantal: zenderElement.aantal,
                                        naam: typeBediening,
                                        omschrijving: zenderElement.omschrijving,
                                        bruto: formaatGetal(zenderElement.aantal, Number(zenderElement.prijs).toFixed(2)),
                                        korting: data.Tradizenderkorting,
                                        netto: formaatGetal(zenderElement.aantal, (Number(zenderElement.prijs) - (Number(zenderElement.prijs) * Number(data.Tradizenderkorting) / 100)).toFixed(2)),

                                    })
                                } else if (index !== 0 && zenderElement.benaming !== "geen") {
                                    fillData.push({
                                        aantal: '',
                                        naam: typeBediening,
                                        omschrijving: zenderElement.benaming,
                                        bruto: '',
                                        korting: '',
                                        netto: '',
                                    })
                                }

                            }
                        }
                    }
                    if (data.kleuronderlat === "RAL") {

                        fillData.push({
                            aantal: data.aantal,
                            naam: "Kleur onderlat",
                            omschrijving: "RAL " + data.odlral + " - " + data.odluitvoering + " - " + data.odlaecode,
                            bruto: formaatGetal(data.aantal, data.RBlakprijs.toFixed(2)),
                            korting: data.tradilakkerijkorting,
                            netto: formaatGetal(data.aantal, (data.RBlakprijs - (data.RBlakprijs * data.tradilakkerijkorting / 100)).toFixed(2)) + " ",
                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Kleur onderlat",
                            omschrijving: data.kleuronderlat + " - RAL " + data.ralonderlat + " - " + data.odlaecode,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }

                    if (data.aanslagtop) {
                        fillData.push({
                            aantal: '',
                            naam: "Aanslagtop",
                            omschrijving: data.aanslagtop,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                } else if (data.type === "Voorzetrolluik") {
                    const korting = data.typelamel + data.typebediening + data.type + 'korting';

                    fillData.push({
                        aantal: data.aantal,
                        naam: "Type",
                        omschrijving: data.omschrijving,
                        bruto: formaatGetal(data.aantal, data.vzrprijs.toFixed(2)),
                        korting: data[korting],
                        netto: formaatGetal(data.aantal, (data.feryndb === 1) ? Math.round(data.vzrprijs).toFixed(2) : Math.round(Number((data.vzrprijs - (data.vzrprijs * data[korting] / 100)).toFixed(2)))),
                    })
                    
                    totaalprijs = totaalprijs + (data.vzrprijs - (data.vzrprijs * data.VZRbedieningkorting / 100)).toFixed(2) * data.aantal.toFixed(2)
                    //TODO - Meerprijs motor nog toeveogen
                    fillData.push({
                        aantal: "",
                        naam: "Afgewerkte maten (Br x H)",
                        omschrijving: data.afgbreedte + " x " + data.afghoogte + " mm",
                        bruto: '',
                        korting: '',
                        netto: '',
                    })
                    if (data.kleurlamel === "Wit" || data.kleurlamel === "Beige") {

                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - " + data.kleurlamel,
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Type lamel",
                            omschrijving: data.typelamelomschrijving + " - " + data.kleurlamel + " - RAL " + data.kleurlamelRAL,
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    }
                    fillData.push({
                        aantal: "",
                        naam: "Uitvoering blad",
                        omschrijving: data.uitvoeringbladomschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                    if (data.kleurkast === "RAL") {
                        // console.log('ralprijs',data.vzrlakrpijs)
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Kleur Kast, gel. & odl.",
                            omschrijving: "RAL " + data.kastral + " - " + data.kastuitvoering + " - " + data.kastaecode,
                            bruto: formaatGetal(data.aantal, data.vzrlakprijs.toFixed(2)),
                            korting: data.vzrlakkerijkorting,
                            netto: formaatGetal(data.aantal, (data.vzrlakprijs - (data.vzrlakprijs * data.vzrlakkerijkorting / 100)).toFixed(2)) + " ",
                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Kleur Kast, gel. & odl.",
                            omschrijving: data.kleurkast + " - RAL " + data.kleurkastral + " - " + data.kastaecode,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                    // console.log('Nieuwe totaalprijs', totaalprijs)
                    
                    if (data.typebedieningPrijs) {
                        const datatypebedieningprijs = Number(data.typebedieningPrijs)
                        totaalprijs = totaalprijs + (datatypebedieningprijs - (datatypebedieningprijs * data.VZRbedieningkorting / 100)).toFixed(2) * data.aantal.toFixed(2)
                        
                        let newBedienignskant = ""
                        if (data.typelintofmotor === "veeras") {
                            newBedienignskant = ""
                        } else {
                            newBedienignskant = data.typebedieningskantOmschrijving
                        }
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Bediening",
                            omschrijving: data.typebedieningOmschrijving + newBedienignskant,
                            bruto: formaatGetal(data.aantal, datatypebedieningprijs.toFixed(2)),
                            korting: data.VZRbedieningkorting,
                            netto: formaatGetal(data.aantal, Math.round((datatypebedieningprijs - (datatypebedieningprijs * data.VZRbedieningkorting / 100)).toFixed(2))),

                        })
                        if (data.typelintofmotor === "veeras" || data.typelintofmotor === "csirts" || data.typelintofmotor === "csi") {
                            fillData.push({
                                aantal: "",
                                naam: "Kast positie",
                                omschrijving: data.kastbinnenbuitenomschrijving,
                                bruto: '',
                                korting: '',
                                netto: '',
                            })
                        }

                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Bediening",
                            omschrijving: data.typebedieningOmschrijving,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                        fillData.push({
                            aantal: "",
                            naam: "Bedieningskant",
                            omschrijving: data.typebedieningskantOmschrijving,
                            bruto: '',
                            korting: '',
                            netto: '',
                        })
                    }
                    if (data.typebediening === "manueel") {
                        if (data.typelintofmotor === "veeras") {

                        } else {
                            // console.log('data.manueelData',data.manueelData)
                            const _newdata = JSON.parse(JSON.stringify(data.manueelData))
                            let _data = _newdata
                            if (typeof _newdata === "string") {
                                _data = JSON.parse(_newdata)
                            }
                            // console.log('zendersData',_data,typeof _data)
                            if (_data && _data !== "geen") {
                                var typeBediening = "Lint optie";
                                for (const [index, zenderElement] of _data.manueel.entries()) {
                                    totaalprijs = totaalprijs + (zenderElement.prijs - (zenderElement.prijs * data.VZRmanueelkorting / 100)).toFixed(2) * data.aantal.toFixed(2)
                                    // console.log('zender Element', zenderElement)
                                    if (zenderElement.prijs && zenderElement.prijs > 0) {
                                        fillData.push({
                                            aantal: zenderElement.aantal,
                                            naam: typeBediening,
                                            omschrijving: zenderElement.omschrijving,
                                            bruto: formaatGetal(data.aantal, Number(zenderElement.prijs).toFixed(2)),
                                            korting: data.VZRmanueelkorting,
                                            netto: formaatGetal(data.aantal, (zenderElement.prijs - (zenderElement.prijs * data.VZRmanueelkorting / 100)).toFixed(2)),

                                        })
                                    } else if (index !== 0 && zenderElement.benaming !== "geen") {
                                        fillData.push({
                                            aantal: '',
                                            naam: typeBediening,
                                            omschrijving: zenderElement.benaming,
                                            bruto: '',
                                            korting: '',
                                            netto: '',
                                        })
                                    }

                                }
                            }
                        }
                    } else if (data.typebediening === "schakelaar") {
                        if (data.schakelaarprijs && data.schakelaarprijs > 0) {
                            const schakelaarprijs = Number(data.schakelaarprijs)
                            // console.log('schakelaar prijs OK',schakelaarprijs ,typeof schakelaarprijs,"? totaalprijs",totaalprijs)
                            totaalprijs = totaalprijs + (schakelaarprijs - (schakelaarprijs * data.VZRschakelaarkorting / 100)).toFixed(2) * data.aantal
                            // console.log('totaalprijs', totaalprijs)

                            fillData.push({
                                aantal: "",
                                naam: "Schakelaar",
                                omschrijving: data.schakelaarOmschrijving,
                                bruto: formaatGetal(data.aantal, data.schakelaarprijs),
                                korting: data.VZRschakelaarkorting,
                                netto: formaatGetal(data.aantal, (data.schakelaarprijs - (data.schakelaarprijs * data.VZRschakelaarkorting / 100)).toFixed(2)),

                            })
                        } else {
                            // console.log('data.schakelaardata',data)
                            fillData.push({
                                aantal: '',
                                naam: "Schakelaar",
                                omschrijving: (data.schakelaar === "geen") ? "Geen" : data.schakelaarOmschrijving,
                                bruto: '',
                                korting: '',
                                netto: '',
                            })
                        }
                    } else if (data.typebediening === "afstandsbediening" || data.typebediening === "afstandsbedieningsolar") {

                        const _newdata = JSON.parse(JSON.stringify(data.zendersOmschrijving))
                        let _data = _newdata
                        if (typeof _newdata === "string") {
                            _data = JSON.parse(_newdata)
                        }
                        // console.log('zendersData',_data,typeof _data)
                        if (_data && _data !== "geen") {
                            var typeBediening = "Zender";
                            for (const [index, zenderElement] of _data.zenders.entries()) {
                                // console.log('zender Element', zenderElement)
                                if (zenderElement.prijs && zenderElement.prijs > 0) {
                                    if(zenderElement.aantal > 0){
                                        totaalprijs = totaalprijs + (zenderElement.prijs - (zenderElement.prijs * data.VZRzenderkorting / 100)).toFixed(2) * zenderElement.aantal.toFixed(2)
                                    
                                        fillData.push({
                                            aantal: zenderElement.aantal,
                                            naam: typeBediening,
                                            omschrijving: zenderElement.omschrijving,
                                            bruto: formaatGetal(zenderElement.aantal, zenderElement.prijs),
                                            korting: (zenderElement.feryn === true) ? 0 : data.VZRzenderkorting,
                                            netto: formaatGetal(zenderElement.aantal, (zenderElement.feryn === true) ? zenderElement.prijs : (zenderElement.prijs - (zenderElement.prijs * data.VZRzenderkorting / 100)).toFixed(2)),
    
                                        })
                                    }

                                  
                                } else if (zenderElement.benaming != "geen") {
                                    fillData.push({
                                        aantal: '',
                                        naam: typeBediening,
                                        omschrijving: zenderElement.omschrijving,
                                        bruto: '',
                                        korting: '',
                                        netto: '',
                                    })
                                }

                            }
                        }
                    }


                    fillData.push({
                        aantal: "",
                        naam: "Geleider links",
                        omschrijving: data.typegeleiderlinksOmschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })

                    fillData.push({
                        aantal: "",
                        naam: "Geleider rechts",
                        omschrijving: data.typegeleiderrechtsOmschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                 

                    if (data.geleiderstoppen != "geen" && data.geleiderstoppen !== null && data.geleiderstoppen !== 0) {

                        const korting = data.typelamel + data.typebediening + data.type + 'korting';
                        fillData.push({
                            aantal: "",
                            naam: "Geleiderstoppen",
                            omschrijving: data.geleiderstoppen,
                            bruto: formaatGetal(data.aantal, (data.geleiderstopprijs * 2).toFixed(2)),
                            korting: data[korting],
                            netto: formaatGetal(data.aantal, ((data.geleiderstopprijs * 2) - ((data.geleiderstopprijs * 2) * data[korting] / 100)).toFixed(2)) + " ",

                        })
                    }

                } else if (data.type === "Screen") {

                    const korting = "screen" + data.kastgrootte + data.typebediening
                    // console.log('korting',korting)
                    fillData.push({
                        aantal: data.aantal,
                        naam: "Screen",
                        omschrijving: "Screen lounge " + data.kastgrootte,
                        bruto: formaatGetal(data.aantal, data.screenprijs.toFixed(2)),
                        korting: data[korting],
                        netto: formaatGetal(data.aantal, Math.round(data.screenprijs - (data.screenprijs * data[korting] / 100)).toFixed(2)),

                    })
                    fillData.push({
                        aantal: "",
                        naam: "Afgewerkte maten (Br x H)",
                        omschrijving: data.afgbreedte + " x " + data.afghoogte + " mm",
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                    if (data.typedoekprijs > 0) {
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Type doek",
                            omschrijving: data.typedoekOmschrijving + " - " + data.doekOmschrijving + " - " + data.confectie,
                            bruto: formaatGetal(data.aantal, data.typedoekprijs.toFixed(2)),
                            korting: data.screendoekkorting,
                            netto: formaatGetal(data.aantal, (data.typedoekprijs - (data.typedoekprijs * data.screendoekkorting / 100)).toFixed(2)),

                        })
                    } else {
                        fillData.push({
                            aantal: "",
                            naam: "Type doek",
                            omschrijving: data.typedoekOmschrijving + " - " + data.doekOmschrijving + " - " + data.confectie,
                            bruto: "",
                            korting: "",
                            netto: "",

                        })
                    }
                    fillData.push({
                        aantal: "",
                        naam: "Type bediening",
                        omschrijving: data.typebedieningOmschrijving + " - " + data.typebedieningskantOmschrijving,
                        bruto: "",
                        korting: "",
                        netto: "",

                    })
                    if (data.typebediening === "schakelaar") {
                        if (data.schakelaarprijs && data.schakelaarprijs > 0) {
                            fillData.push({
                                aantal: "",
                                naam: "Schakelaar",
                                omschrijving: data.schakelaarOmschrijving,
                                bruto: formaatGetal(data.aantal, data.schakelaarprijs),
                                korting: data.screenschakelaarkorting,
                                netto: formaatGetal(data.aantal, (data.schakelaarprijs - (data.schakelaarprijs * data.screenschakelaarkorting / 100)).toFixed(2)),

                            })
                        } else {
                            // console.log('data.schakelaardata',data)
                            fillData.push({
                                aantal: '',
                                naam: "Schakelaar",
                                omschrijving: data.schakelaarData,
                                bruto: '',
                                korting: '',
                                netto: '',
                            })
                        }
                    } else if (data.typebediening === "somfyio" || data.typebediening === "somfyiosolar") {
                        let _data = JSON.parse(JSON.stringify(data.zendersOmschrijving))
                        if (typeof _data === 'string') {
                            _data = JSON.parse(_data).zenders
                        } else {
                            _data = _data.zenders
                        }

                        if (_data && _data !== "geen") {
                            var typeBediening = "Zender";
                            for (const [index, zenderElement] of _data.entries()) {
                                // console.log('zender Element', zenderElement)
                                if (zenderElement.prijs && zenderElement.prijs > 0) {
                                    fillData.push({
                                        aantal: zenderElement.aantal,
                                        naam: typeBediening,
                                        omschrijving: zenderElement.benaming,
                                        bruto: formaatGetal(zenderElement.aantal, zenderElement.prijs),
                                        korting: data.screenzenderkorting,
                                        netto: formaatGetal(zenderElement.aantal, (zenderElement.prijs - (zenderElement.prijs * data.screenzenderkorting / 100)).toFixed(2)),

                                    })
                                } else if (index !== 0 && zenderElement.benaming !== "geen") {
                                    fillData.push({
                                        aantal: '',
                                        naam: typeBediening,
                                        omschrijving: zenderElement.benaming,
                                        bruto: '',
                                        korting: '',
                                        netto: '',
                                    })
                                }

                            }
                        }
                    }

                    if (data.kleurkast === "RAL") {
                        fillData.push({
                            aantal: data.aantal,
                            naam: "Kleur kast",
                            omschrijving: "RAL : " + data.kastral + " - " + data.kastaecode + " - " + data.kastuitvoering + " - " + data.kastomschrijving,
                            bruto: formaatGetal(data.aantal, data.screenlakprijs.toFixed(2)),
                            korting: data.screenlakkerijkorting,
                            netto: formaatGetal(data.aantal, (data.screenlakprijs - (data.screenlakprijs * data.screenlakkerijkorting / 100)).toFixed(2)),

                        })
                    } else {

                        if (data.kastral) {
                            fillData.push({
                                aantal: '',
                                naam: 'Kleur kast',
                                omschrijving: "RAL " + data.kastral + " - " + data.kastkleur + " - " + data.kastuitvoering + " - " + data.kastaecode,
                                bruto: '',
                                korting: '',
                                netto: '',
                            })
                        } else {
                            fillData.push({
                                aantal: '',
                                naam: 'Kleur kast',
                                omschrijving: data.kastkleur + " - " + data.kastuitvoering + " - " + data.kastaecode,
                                bruto: '',
                                korting: '',
                                netto: '',
                            })
                        }


                    }



                }

                if (data.Opmerking) {
                    fillData.push({
                        aantal: "",
                        naam: "Opmerking",
                        omschrijving: data.Opmerking,
                        bruto: '',
                        korting: '',
                        netto: '',
                    })
                }

            }
        }
    }
    table.datas = fillData

    return table

}


module.exports = generateTable;