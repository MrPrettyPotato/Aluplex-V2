async function klanten(){
    console.log('klanten');
    return fetch("/admin/gebruikersLijst", {
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
        // console.log('data', data);
        //vull dropdown

        const gebruikersDropdown = document.getElementById("gebruikersDropdown");
        gebruikersDropdown.innerHTML = "";
        //haal dubbele uit de data
        const newData = data.filter((item, index, self) => index === self.findIndex((t) => t.bedrijf === item.bedrijf));

//zet de newData in de gebruikersDropdown,
//en geef het ook een onchange functie aan de dropdown

        for (let i = 0; i < newData.length; i++) {
          const option = document.createElement("option");
          option.value = newData[i].bedrijf;
          option.text = newData[i].bedrijf;
          gebruikersDropdown.appendChild(option);
        }

        gebruikersDropdown.addEventListener("change", (event) => {
          const selectedValue = event.target.value;
          klantenDropdownChange(selectedValue);
        });

        return data;
      })
      .catch((error) => console.error(error));
}


document.addEventListener('DOMContentLoaded', async function() {
    const data = await klanten()
    console.log('data', data)
 
});


function winkelmandData(){

}

function gefilterdeData(){

}


async function loadUsers(){

    // Voer hier je logica uit om de gebruikerslijst op te halen van de backend /admin/usersList.
   
}

function klantenDropdownChange(bedrijf){
    console.log('dropdown', bedrijf);
    return fetch("/admin/winkelmandData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: bedrijf
        }),
      })
      .then((response) => response.json())
      .then(async(data) => {
        // console.log('data', data);
        //vull dropdown
        const aantalrolluiken = data.filter((item) => item.leverancier == 'ALUPLEX');
            const rolluikblad = data.filter((item) => item.type === 'Rolluikblad');
            const voorzetrolluik = data.filter((item) => item.type === 'Voorzetrolluik');
            const tradirolluik = data.filter((item) => item.type === 'Tradirolluik');
console.log('rolluikblad', rolluikblad);
console.log('voorzetrolluik', voorzetrolluik);
console.log('tradirolluik', tradirolluik);

            const value = `
            <p> ${data.length}</p>
            <p> ${aantalrolluiken.length}</p>
            <p> ${rolluikblad.length}</p>
            <p> ${voorzetrolluik.length}</p>
            <p> ${tradirolluik.length}</p>
            `
            console.log('value', value);

            const StatistiekenWaardes = document.getElementById("StatistiekenWaardes")
            console.log('StatistiekenWaardes', StatistiekenWaardes);
        console.log('value', value);
        if(StatistiekenWaardes){

            console.log('statistiekenwaardes in orde');
            StatistiekenWaardes.innerHTML = value
        }

        makeCakeDiagram(data,aantalrolluiken,rolluikblad,voorzetrolluik,tradirolluik);

        return data;
      })
      .catch((error) => console.error(error));

}


function maakTaartdiagram(data,aantalrolluiken,rolluikblad,voorzetrolluik,tradirolluik){
 const chatCanvas = document.getElementById("chartCanvas");
 console.log('chatCanvas', chatCanvas);
 if(chatCanvas){
    console.log('chatCanvas in orde');
    const ctx = chatCanvas.getContext("2d");
    console.log('rolluikblad', rolluikblad);
    console.log('voorzetrolluik', voorzetrolluik);
    console.log('tradirolluik', tradirolluik);  

    const labels = ['Rolluikblad', 'Voorzetrolluik', 'Tradirolluik'];

    const rolluikbladData = rolluikblad.length;
    const voorzetrolluikData = voorzetrolluik.length;
    const tradirolluikData = tradirolluik.length;
    console.log('rolluikbladData', rolluikbladData);
    console.log('voorzetrolluikData', voorzetrolluikData);
    console.log('tradirolluikData', tradirolluikData);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Type rolluikblad',
            data: [rolluikbladData, voorzetrolluikData, tradirolluikData],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    new Chart(ctx, config);
 }

}
let myChart;
function makeCakeDiagram(data,aantalrolluiken,rolluikblad,voorzetrolluik,tradirolluik){
    //make a round cake diagram
    if (myChart) {
        myChart.destroy();
    }
    // Grafiek configuratie
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Rolluikblad', 'Voorzetrolluik', 'Tradirolluik'],
            datasets: [{
                data: [rolluikblad.length, voorzetrolluik.length, tradirolluik.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Aantal Rolluiken'
                }
            }
        }
    });



}
