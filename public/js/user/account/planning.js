async function loadPlanning(){
    return await fetch("/users/planning",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    
    })
        .then(response => response.json())
        .then((data)=>{
            console.log('data',data)
            const planningTableBody = document.getElementById('planningTableBody');
            let value = ""
            data.forEach(element => {
                let leverdatum;
                let color = "white"
                if (element.status === "offerte" || element.status === "winkelmand") {
                    // return
                } else if(element.status === "bestelling"){
                    color = "white"
                } else if(element.status === "klaar voor levering/afhaling"){
                    color = "yellow"
                }
                if (element.leverdatum === null) {
                    leverdatum = "Nog te bepalen"
                } else {
                    leverdatum = element.leverdatum
                }
                value+=`<tr >
                <td>${leverdatum}</td>
                <td>${element.ref}</td>
                <td>${element.aantal}</td>
                <td>${element.type}</td>
                <td>${element.status}</td>
                </tr>`
            });
            planningTableBody.innerHTML = value
        })
    
}
loadPlanning()