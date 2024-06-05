const express = require('express');
const fetchBlad = require('../database/fetchData/blad')
const fetchRalPrice = require('../database/fetchData/lakkerij')
const fetchRal = require('../database/fetchData/ral')
const fetchOphangveer = require('../database/fetchData/ophangveer')





async function calculatePrice(data) {
try {
    
    var _data = data
    for (let index = 0; index < _data.length; index++) {
        const element = _data[index]

        // Te gebruiken variables
        const _breedte = calculateSearchSize(element.breedte).toString();
        const _hoogte = calculateSearchSize(element.hoogte);
        const _ralOnderlat = element.ralonderlat
        const _typelamel = (data[index].typelamel).toLowerCase();

        const bladPrice = await fetchBlad(_breedte,_typelamel,_hoogte)

        const ral = await fetchRal(_ralOnderlat)
        //console.log('conRal', conRal[0][0])

        _data[index].RBbladprijs = bladPrice
        if (element.kleuronderlat === "RAL") {
            _odlral = ral.ral
            _odlaecode = ral.aecode
            _odluitvoering = ral.uitvoering
            _odlomschrijving = ral.omschrijving
            _data[index].odlral = _odlral
            _data[index].odlaecode = _odlaecode
            _data[index].odluitvoering = _odluitvoering
            _data[index].odlomschrijving = _odlomschrijving
            //zoek RAL meerprijs 
            const ralPrice = await fetchRalPrice(element.type,_odluitvoering)

            const ralPrijs = ralPrice.prijs
            const eenheid = ralPrice.eenheid
            console.log('ralPrijs',ralPrijs,typeof ralPrijs)
            var _ralPrijs;
            //console.log('breedte typeof',typeof element.breedte)
            if(eenheid == "m"){
                //console.log('per Meter');
                _ralPrijs = (((element.breedte) / 1000) * ralPrijs).toFixed(2)
            } else {
                //console.log('Niet per meter')
                _ralPrijs = ralPrijs.toFixed(2)
            }

            console.log('_ralPrijs',_ralPrijs)
            //console.log("ralprijs", _ralPrijs)
            _data[index].RBlakprijs = Number(_ralPrijs)
        }
        if(element.typeophangveer){
            console.log('typeophangveer',element.typeophangveer,element.afgbreedte)
            const ophangveerprijs = await fetchOphangveer(element.typeophangveer,element.afgbreedte)
            _data[index].RBophangveerprijs = ophangveerprijs
        }
        



    }
    
    return _data
}
catch (err){
    console.error('location :',__filename)
    console.error('error',err)
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