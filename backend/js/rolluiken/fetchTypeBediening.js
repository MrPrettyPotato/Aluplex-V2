function fetchTypeBediening(typebediening){
    //typebediening kan het volgende zijn:
    //manueel
    //schakelaar
    //afstandbediening
    //aanpassen naar: manueel,schakelaar of somfyio
var bediening;
if(typebediening === "afstandsbediening"){
    bediening = "somfyio"
} else {
    bediening = typebediening
}


    return bediening
}

module.exports = fetchTypeBediening