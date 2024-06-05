console.log('user/account/profiel.js')
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('btnEdit').addEventListener('click', slaGegevensOp);
});


async function loadUserData() {
    return await fetch("/users/loadUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: ""
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            let gebruiker = document.getElementById('gebruikerbody')
            let bedrijf = document.getElementById('bedrijfbody')
            gebruiker.innerHTML = `
            <div class="card-body">
                
                <div class="form-group">
                    <label for="email" class="card-subtitle mb-2 text-muted">E-mail:</label>
                    <input type="email" id="email" class="form-control" value="${data.email}">
                </div>
                <div class="form-group">
                    <label for="tel" class="card-subtitle mb-2 text-muted">Tel./GSM:</label>
                    <input type="tel" id="tel" class="form-control" value="${data.tel}">
                </div>
                <div class="form-group">
                <label for="straatnaam" class="card-subtitle mb-2 text-muted">Straatnaam:</label>
                <input type="straatnaam" id="straatnaam" class="form-control" value="${data.straatnaam}">
            </div>
            <div class="form-group">
            <label for="huisnummer" class="card-subtitle mb-2 text-muted">Huisnummer:</label>
            <input type="huisnummer" id="huisnummer" class="form-control" value="${data.huisnummer}">
        </div>
        <div class="form-group">
        <label for="bus" class="card-subtitle mb-2 text-muted">Bus:</label>
        <input type="bus" id="bus" class="form-control" value="${data.bus}">
    </div>
    <div class="form-group">
    <label for="postcode" class="card-subtitle mb-2 text-muted">Postcode:</label>
    <input type="postcode" id="postcode" class="form-control" value="${data.postcode}">
</div>
<div class="form-group">
<label for="testadl" class="card-subtitle mb-2 text-muted">Stad/Gemeente:</label>
<input type="stad" id="stad" class="form-control" value="${data.stad}">
</div>
                <!-- Voeg meer form-groups toe voor extra input velden -->
            </div>`;

            bedrijf.innerHTML =`
            <div class="card-body">
                
                <div class="form-group">
                    <label for="bedrijf" class="card-subtitle mb-2 text-muted">Bedrijf:</label>
                    <input type="text" id="bedrijf" class="form-control" value="${data.bedrijf}" disabled>
                    <p style="font-size: 10px; color: red;"> Gelieve contact met ons op te nemen om de naam van uw bedrijf te wijzigen.</p>
                </div>
                <div class="form-group">
                    <label for="facemail" class="card-subtitle mb-2 text-muted">E-mail:</label>
                    <input type="facemail" id="facemail" class="form-control" value="${data.facemail}">
                </div>
                <div class="form-group">
                    <label for="btwnummer" class="card-subtitle mb-2 text-muted">BTW nummer:</label>
                    <input type="btwnummer" id="btwnummer" class="form-control" value="${data.btwnummer}">
                </div>
                <div class="form-group">
                <label for="facstraatnaam" class="card-subtitle mb-2 text-muted">Straatnaam:</label>
                <input type="facstraatnaam" id="facstraatnaam" class="form-control" value="${data.facstraatnaam}">
            </div>
            <div class="form-group">
            <label for="fachuisnummer" class="card-subtitle mb-2 text-muted">Huisnummer::</label>
            <input type="fachuisnummer" id="fachuisnummer" class="form-control" value="${data.fachuisnummer}">
        </div>
        <div class="form-group">
        <label for="facbus" class="card-subtitle mb-2 text-muted">Bus:</label>
        <input type="facbus" id="facbus" class="form-control" value="${data.facbus}">
    </div>
    <div class="form-group">
    <label for="facpostcode" class="card-subtitle mb-2 text-muted">Postcode:</label>
    <input type="facpostcode" id="facpostcode" class="form-control" value="${data.facpostcode}">
</div>
<div class="form-group">
<label for="facstad" class="card-subtitle mb-2 text-muted">Stad/Gemeente:</label>
<input type="facstad" id="facstad" class="form-control" value="${data.facstad}">
</div>
                <!-- Voeg meer form-groups toe voor extra input velden -->
            </div>`;


            // return data;
        })
        .catch((error) => console.error(error));
}

loadUserData()


async function slaGegevensOp() {
    // Verzamel gebruikersgegevens
    let gebruikerData = {
        email: document.getElementById('email').value,
        tel: document.getElementById('tel').value,
        straatnaam: document.getElementById('straatnaam').value,
        huisnummer: document.getElementById('huisnummer').value,
        bus: document.getElementById('bus').value,
        postcode: document.getElementById('postcode').value,
        stad: document.getElementById('stad').value,
        bedrijf: document.getElementById('bedrijf').value,
        facemail: document.getElementById('facemail').value,
        btwnummer: document.getElementById('btwnummer').value,
        facstraatnaam: document.getElementById('facstraatnaam').value,
        fachuisnummer: document.getElementById('fachuisnummer').value,
        facbus: document.getElementById('facbus').value,
        facpostcode: document.getElementById('facpostcode').value,
        facstad: document.getElementById('facstad').value,
        // Voeg andere gebruikersgegevens toe
    };

    

    // Combineer de verzamelde gegevens
    let data = {gebruiker: gebruikerData};

    // Verstuur de gegevens naar een server of verwerk ze lokaal
    console.log(data); // Verwijder deze lijn als je klaar bent voor productie

    // Voorbeeld om gegevens naar een server te sturen via fetch
    try {
        const response = await fetch('/users/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert(data.message); // Of gebruik een meer geavanceerde methode om meldingen te tonen
          } else {
            alert('Er is iets misgegaan: ' + data.message);
          }
        })
        .catch(error => console.error('Fout bij het updaten van de gebruiker:', error));

        const responseData = await response.json();
        console.log(responseData); // Verwerking van de server response
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
    }
}