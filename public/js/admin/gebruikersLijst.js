document.addEventListener('DOMContentLoaded', async function() {
    const users = await loadUsers();
    var searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('keyup', function() {
        var searchText = this.value.toLowerCase();

        // Filter de gebruikers op basis van de zoektekst
        var filteredUsers = users.filter(function(user) {
            return user.voornaam.toLowerCase().includes(searchText) ||
                   user.bedrijf.toLowerCase().includes(searchText) ||
                   user.tel.includes(searchText);
        });

        // Genereer opnieuw de gebruikerslijst op basis van het filterresultaat
        generateUserList(filteredUsers);
    });

    // Genereer de initiële gebruikerslijst
    generateUserList(users);
 
});

function editSection(section, isEditing) {
    var fields = section.querySelectorAll('p');

    fields.forEach(function(field) {
        var fieldName = field.getAttribute('data-field-name'); // Veronderstelt dat je een 'data-field-name' attribuut hebt toegevoegd aan elke <p>
        var span = field.querySelector('span');
        if (span) {
            var value = span.textContent;
            if (isEditing) {
                var input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control';
                input.value = value;
                input.setAttribute('name', fieldName); // Stel de naam van het veld in op de input
                field.replaceChild(input, span);
            }
        } else {
            var input = field.querySelector('input');
            if (input) {
                var newSpan = document.createElement('span');
                newSpan.textContent = input.value;
                field.replaceChild(newSpan, input);
            }
        }
    });

   

}

function saveUser(updatedUserData) {
    console.log("Opslaan gebruikersdata", updatedUserData);
    return fetch("gebruikerOpslaan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: updatedUserData
        }),
      })
    .then((response) => response.json())
    .then((data) => {
console.log('Gebruiker geupdated:', data);

    })
    // Voer hier je logica uit om de data te verwerken/op te slaan
    // Bijvoorbeeld, versturen naar een server via een POST request
}

async function loadUsers(){

    // Voer hier je logica uit om de gebruikerslijst op te halen van de backend /admin/usersList.
    return fetch("gebruikersLijst", {
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
  
  
        return data;
      })
      .catch((error) => console.error(error));
}

async function generateUserList(usersToDisplay) {
    var userList = document.getElementById('userList');
    userList.innerHTML = ''; // Verwijder bestaande gebruikers

    const fieldMapping = {
        voornaam: 'First Name',
        achternaam: 'Last Name',
        email: 'Email',
        taal: 'Language',
        stad: 'City',
        postcode: 'Postal Code',
        straatnaam: 'Street Name',
        huisnummer: 'House Number',
        bus: 'Bus',
        bedrijf: 'Company',
        tel: 'Phone Number',
        btwNummer: 'VAT Number',
        facstad: 'Billing City',
        facpostcode: 'Billing Postal Code',
        facstraatnaam: 'Billing Street Name',
        fachuisnummer: 'Billing House Number',
        facbus: 'Billing Bus',
        PVC42Rolluikbladkorting: 'PVC 42 Roller Shutter Discount',
        // Voeg hier alle andere mappings toe
    };

    usersToDisplay.forEach(function(user) {
        var card = document.createElement('div');
        card.className = 'card mt-3';

        var cardHeader = document.createElement('div');
        cardHeader.className = 'card-header clickable';
        cardHeader.innerHTML = `<strong>${user.bedrijf}</strong> - ${user.voornaam} - ${user.achternaam}`;

        cardHeader.addEventListener('click', function() {
            cardBody.style.display = cardBody.style.display === 'block' ? 'none' : 'block';
        });

        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardBody.style.display = 'none';

        var sections = [
            { title: 'Gebruikersgegevens', fields: ['voornaam', 'achternaam', 'email', 'taal','stad', 'postcode','straatnaam','huisnummer','bus'] },
            { title: 'Communicatie/Bedrijfsgegevens', fields: ['bedrijf', 'tel', 'btwNummer','facstad','facpostcode','facstraatnaam','fachuisnummer','facbus'] },
            { title: 'Kortingen', fields: ['PVC42Rolluikbladkorting', 'ALU42Rolluikbladkorting', 'ULTRA42Rolluikbladkorting', /* Voeg hier alle andere velden toe */] }
        ];

        sections.forEach(function(section) {
            var sectionElement = document.createElement('div');
            sectionElement.className = 'user-section float-left w-33 p-3';

            var sectionHeader = document.createElement('h5');
            sectionHeader.textContent = section.title;
            sectionElement.appendChild(sectionHeader);

            var userIdInput = document.createElement('input');
            userIdInput.setAttribute('type', 'hidden');
            userIdInput.setAttribute('name', 'ID');
            userIdInput.value = user.ID;
            sectionElement.appendChild(userIdInput);

            section.fields.forEach(function(field) {
                var fieldValue = user[field];
                var displayName = fieldMapping[field] || field; // Gebruik de mapping of de oorspronkelijke naam
                var fieldElement = document.createElement('p');
                fieldElement.setAttribute('data-field-name', field); // Zet de veldnaam als een attribuut
                fieldElement.innerHTML = `${displayName}: <span>${fieldValue}</span>`;
                sectionElement.appendChild(fieldElement);
            });

            // Maak de Edit knop
            var editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-primary btn-sm';
            sectionElement.appendChild(editBtn);

            // Maak de Opslaan knop, standaard verborgen
            var saveBtn = document.createElement('button');
            saveBtn.textContent = 'Opslaan';
            saveBtn.className = 'btn btn-success btn-sm d-none';
            sectionElement.appendChild(saveBtn);

            editBtn.addEventListener('click', function() {
                var isEditing = editBtn.getAttribute('data-editing') === 'true';
                editSection(sectionElement, !isEditing);
                editBtn.setAttribute('data-editing', !isEditing);
                saveBtn.classList.toggle('d-none', isEditing);
                editBtn.textContent = isEditing ? 'Edit' : 'Save';
            });

            saveBtn.addEventListener('click', function() {
                var updatedUserData = {};
                var inputs = sectionElement.querySelectorAll('input');
                inputs.forEach(function(input) {
                    var key = input.name; // Gebruik .name om de sleutel te verkrijgen
                    updatedUserData[key] = input.value;
                });

                saveUser(updatedUserData);

                editSection(sectionElement, false);
                editBtn.setAttribute('data-editing', false);
                saveBtn.classList.add('d-none');
                editBtn.textContent = 'Edit';
            });

            cardBody.appendChild(sectionElement);
        });

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        userList.appendChild(card);
    });
}






/**
 * 
 * 
 */