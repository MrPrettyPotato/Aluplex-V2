function calculateTotalPrice(data, user) {
    console.log('Calculate totalprice gestart')

    var totalBruto = 0
    var totalNetto = 0
    var dataNetto = 0
    var minTotBruto = 0
    var minTotNetto = 0
    var extraNetto = 0
    var extraBruto = 0

   
    
 

    // const zenders = JSON.parse(data.zenders).zenders
    if(data.type === "Rolluikblad"){
        if (data.RBbladprijs) {
            
            const korting = data.typelamel + data.type + "korting";
            totalBruto += (data.RBbladprijs * data.aantal)
            totalNetto += Math.round((data.RBbladprijs - data.RBbladprijs * (data[korting] / 100))) * data.aantal
        }
        if (data.RBlakprijs) {
            totalBruto += (data.RBlakprijs * data.aantal)
            totalNetto += ((data.RBlakprijs - data.RBlakprijs * (data.bladlakkerijkorting / 100)) * data.aantal)
        }
       
    } else if (data.type === "Voorzetrolluik") {
        if (data.vzrprijs) {
            const korting = data.typelamel + data.typebediening + data.type + 'korting';
            if(data.feryndb === 1){

                totalBruto += (data.vzrprijs * data.aantal)
                totalNetto += data.vzrprijs * data.aantal
            } else {
                
            totalBruto += (data.vzrprijs * data.aantal)
            totalNetto += Math.round((data.vzrprijs - data.vzrprijs * (data[korting] / 100))) * data.aantal
            }
        }
        if (data.vzrlakprijs) {
            if(data.feryndb === 1){

            } else {
                
            totalBruto += (data.vzrlakprijs * data.aantal)
            totalNetto += ((data.vzrlakprijs - data.vzrlakprijs * (data.vzrlakkerijkorting / 100)) * data.aantal)
            }
        }
        if (data.typebedieningPrijs) {
            totalBruto += (data.typebedieningPrijs * data.aantal)
            totalNetto += +Math.round((data.typebedieningPrijs - data.typebedieningPrijs * (data.VZRbedieningkorting / 100)) * data.aantal).toFixed(2)
        }
        if (data.zendersOmschrijving && data.zendersOmschrijving !== "geen") {
            if(typeof data.zendersOmschrijving === 'string'){
                data.zendersOmschrijving = JSON.parse(data.zendersOmschrijving)
            }
            data.zendersOmschrijving.zenders.forEach(element => {
                if (element.prijs && element.prijs > 0) {
                    if(data.feryndb === 1){
                        
                    totalBruto += (element.prijs * element.aantal)
                    totalNetto += (element.prijs * element.aantal)
                    } else {

                        totalBruto += (element.prijs * element.aantal)
                        totalNetto += ((element.prijs * element.aantal) - ((element.prijs * (data.VZRzenderkorting / 100))) * element.aantal)
                    }

                }
            });
        } 
         if (data.manueelData && data.manueelData !== "geen") {
            if(typeof data.manueelData === 'string'){
                data.manueelData = JSON.parse(data.manueelData)
            }
            data.manueelData.manueel.forEach(element => {
                if (element.prijs && element.prijs > 0) {
                    totalBruto += element.prijs
                    totalNetto += element.prijs - element.prijs * (data.VZRmanueelkorting / 100)

                }
            });
        }
         if (data.schakelaarprijs) {
            if (data.schakelaarprijs && data.schakelaarprijs > 0) {
                totalBruto += data.schakelaarprijs * data.aantal
                totalNetto += (data.schakelaarprijs - data.schakelaarprijs * (data.Tradischakelaarkorting / 100))* data.aantal
            }
        }
        if(data.geleiderstoppen != "geen"){
            if(data.geleiderstopprijs && data.geleiderstopprijs > 0){
                
            const korting = data.typelamel + data.typebediening + data.type + 'korting';
                totalBruto += ((data.geleiderstopprijs*2) * data.aantal)
                totalNetto += ((data.geleiderstopprijs*2) - (data.geleiderstopprijs*2) * (data[korting] / 100)) * data.aantal
            }
        }
    } else if(data.type === "Tradirolluik"){
        if (data.RBbladprijs) {
            const korting = data.typelamel + data.typebediening + data.type + 'korting';
            totalBruto += (data.RBbladprijs * data.aantal)
            totalNetto += Math.round((data.RBbladprijs - data.RBbladprijs * (data[korting] / 100))) * data.aantal
        }
        if (data.RBlakprijs) {
            totalBruto += (data.RBlakprijs * data.aantal)
            totalNetto += ((data.RBlakprijs - data.RBlakprijs * (data.tradilakkerijkorting / 100)) * data.aantal)
        }
        if (data.typebedieningPrijs) {
            totalBruto += (data.typebedieningPrijs * data.aantal)
            totalNetto += ((data.typebedieningPrijs - data.typebedieningPrijs * (data.Tradibedieningkorting / 100)) * data.aantal)
        }
       
            if (data.zendersOmschrijving && data.zendersOmschrijving !== "geen") {
                let _data = JSON.parse(JSON.stringify(data.zendersOmschrijving))
                if(typeof _data === "string"){
                    _data = JSON.parse(_data).zenders
                } else {
                    _data = _data.zenders
                }
                _data.forEach(element => {
                    if (element.prijs && element.prijs > 0) {
                        totalBruto += (element.prijs * element.aantal)
                        totalNetto += ((element.prijs * element.aantal) - ((element.prijs * (data.Tradizenderkorting / 100))) * element.aantal)
    
                    }
                });
            } else if (data.manueelData && data.manueelData !== "geen") {
                let _data = JSON.parse(JSON.stringify(data.manueelData))
                if(typeof _data === "string"){
                    _data = JSON.parse(_data).manueel
                } else {
                    _data = _data.manueel
                }
                _data.forEach(element => {
                    if (element.prijs && element.prijs > 0) {
                        totalBruto += element.prijs
                        totalNetto += element.prijs - element.prijs * (data.Tradimanueelkorting / 100)
    
                    }
                });
            } else if (data.schakelaarOmschrijving) {
                if (data.schakelaarOmschrijving && data.schakelaarOmschrijving != "geen") {
                    totalBruto += data.schakelaarprijs
                    totalNetto += data.schakelaarprijs - data.schakelaarprijs * (data.Tradischakelaarkorting / 100)
                }
            }

        
    } else if (data.type === "Screen") {
        if (data.screenprijs) {
            const korting = "screen"+ data.kastgrootte + data.typebediening
            totalBruto += (data.screenprijs * data.aantal)
            totalNetto += Math.round((data.screenprijs - data.screenprijs * (data[korting] / 100))) * data.aantal
        }
       
      
        if (data.screenlakprijs) {
            totalBruto += (data.screenlakprijs * data.aantal)
            totalNetto += ((data.screenlakprijs - data.screenlakprijs * (data.screenlakkerijkorting / 100)) * data.aantal)
        }
    if (data.zendersOmschrijving && data.zendersOmschrijving !== "geen") {
            if(typeof data.zendersOmschrijving === 'string'){
                data.zendersOmschrijving = JSON.parse(data.zendersOmschrijving)
            }
            data.zendersOmschrijving.zenders.forEach(element => {
                if (element.prijs && element.prijs > 0) {
                    totalBruto += (element.prijs * element.aantal)
                    totalNetto += ((element.prijs * element.aantal) - ((element.prijs * (data.screenzenderkorting / 100))) * element.aantal)

                }
            });
        }  else if (data.schakelaarprijs) {
        totalBruto += data.schakelaarprijs
        totalNetto += data.schakelaarprijs - data.schakelaarprijs * (data.screenschakelaarkorting / 100)
    }
    if (data.typedoekprijs) {

        totalBruto += data.typedoekprijs
        totalNetto += data.typedoekprijs - data.typedoekprijs * (data.screendoekkorting / 100)
    }
}



//totaal voor 1 rolluik
var totaalNettoInclBTW = (totalNetto + (totalNetto * 21 / 100)).toFixed(2)
var totaalBTW = totaalNettoInclBTW - totalNetto
data.totaalNettoInclBTW = totalNetto + totaalBTW
data.totalBruto = totalBruto
data.totalNetto = totalNetto
data.totalBTW = totaalBTW
console.log('totaalNettoInclBTW', totaalNettoInclBTW , typeof totaalNettoInclBTW)
console.log('totalNetto', totalNetto, typeof totalNetto)
console.log('totaalBTW', totaalBTW, typeof totaalBTW)
console.log('data.totaalNettoInclBTW', data.totaalNettoInclBTW,typeof data.totaalNettoInclBTW)


//af te trekken indien meerdere rolluiken
var minTotNettoInclBTW = minTotNetto + (minTotNetto * 21 / 100)
var minTotBTW = minTotNettoInclBTW - minTotNetto
data.minTotaalNettoInclBTW = minTotNettoInclBTW
data.minTotalBruto = minTotBruto
data.minTotalNetto = minTotNetto
data.minTotalBTW = minTotBTW

return data
}

module.exports = calculateTotalPrice;