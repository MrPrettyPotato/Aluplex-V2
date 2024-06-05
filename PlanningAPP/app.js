const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const path = require('path');
const dataPath = path.join(process.cwd(), 'data.json');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//testeeeeeeeeeesssssss
const orders = [];

// Functie om data in te laden vanuit data.json bij het starten van de server
function loadDataFromFile() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(data);
        orders.push(...parsedData);
        io.emit('updateOrders', orders);
    } catch (error) {
        console.error('Error loading data from file:', error.message);
    }
}

// Roep de functie aan om data in te laden bij het starten van de server
loadDataFromFile();

// Functie om gegevens op te slaan in data.json
function saveDataToFile() {
    const jsonData = JSON.stringify(orders, null, 2);
    fs.writeFileSync(dataPath, jsonData);
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Admin.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/Admin.html');
});

app.post('/addOrder', (req, res) => {
    let newOrder = req.body;
    newOrder.id = uuid();
    orders.push(newOrder);

    // Na het toevoegen van een order, sla de gegevens op in data.json
    saveDataToFile();

    io.emit('updateOrders', orders);
    res.send('Order added successfully');
});
function loadOrdersByLeverancier(leverancier, socket, room) {
    let filteredOrders = orders;
    let sortedOrder = orders

    if (leverancier && leverancier !== 'Algemeen') {
        // Voer logica uit om specifieke orders op te halen op basis van de leverancier
        filteredOrders = orders.filter(order => order.leverancier === leverancier);
    }

    // Sorteer de orders op leverdatum (dd/mm/jjjj formaat)
    filteredOrders.sort((a, b) => {
        const dateA = new Date(a.leverdatum.split('/').reverse().join('/'));
        const dateB = new Date(b.leverdatum.split('/').reverse().join('/'));
        return dateA - dateB;
    });
    sortedOrder.sort((a, b) => {
        const dateA = new Date(a.leverdatum.split('/').reverse().join('/'));
        const dateB = new Date(b.leverdatum.split('/').reverse().join('/'));
        return dateA - dateB;
    });

    
    // Verzend de gesorteerde orders naar de huidige room
    io.to(leverancier).emit('updateOrders', filteredOrders);
    io.to('Algemeen').emit('updateOrders', sortedOrder);
}

io.on('connection', (socket) => {
    // Bij elke nieuwe verbinding, voeg de client toe aan een standaard room met zijn ID
    socket.join('Algemeen');

    // Functie om orders te laden bij het aansluiten van een client
    function loadOrdersOnConnect(leverancier, room) {
        loadOrdersByLeverancier(leverancier, socket, room);
    }

    socket.on('loadOrders', (leverancier) => {
        // Roep de functie aan om orders te laden op basis van de leverancier
        const currentRoom = Array.from(socket.rooms)[1]; // Haal de huidige room op
        loadOrdersByLeverancier(leverancier, socket, currentRoom);
    });

    socket.on('joinRoom', (room) => {
        // Verlaat alle vorige rooms en voeg de client toe aan de nieuwe room
        socket.rooms.forEach(roomId => {
            if (roomId !== socket.id) {
                socket.leave(roomId);
            }
        });
        socket.join(room);

        // Laad orders bij het aansluiten van de client op basis van de huidige leverancier
        loadOrdersOnConnect(room, room);
    });

    // Voeg het volgende blok toe voor het behandelen van het 'updateOrderStatus'-bericht
    socket.on('updateOrderStatus', ({ orderId, newStatus,newLocation }) => {
        // Zoek de order op basis van orderId en werk de orderstatus bij
        const orderToUpdate = orders.find(order => order.id === orderId);
        if (orderToUpdate) {
            orderToUpdate.orderstatus = newStatus;
            saveDataToFile(); // Sla de geüpdatete data op naar het JSON-bestand

            // Roep de functie aan om orders te laden op basis van de leverancier
            const currentRoom = Array.from(socket.rooms)[1]; // Haal de huidige room op
            loadOrdersByLeverancier(orderToUpdate.leverancier, socket, currentRoom);
        }
    });
    // Voeg deze code toe om een veld bij te werken
socket.on('updateOrderField', ({ orderId, fieldName, newValue,newLocation }) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (orderToUpdate) {
        orderToUpdate[fieldName] = newValue;
        saveDataToFile(); // Sla de geüpdatete data op naar het JSON-bestand
        // Roep de functie aan om orders te laden op basis van de leverancier
        const currentRoom = Array.from(socket.rooms)[1]; // Haal de huidige room op
        loadOrdersByLeverancier(orderToUpdate.leverancier, socket, currentRoom);
    }
});

// Voeg deze code toe om een rij te verwijderen
socket.on('deleteOrder', (orderId,newLocation) => {
    const indexToDelete = orders.findIndex(order => order.id === orderId);
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (indexToDelete !== -1) {
        orders.splice(indexToDelete, 1);
        saveDataToFile(); // Sla de geüpdatete data op naar het JSON-bestand

        // Roep de functie aan om orders te laden op basis van de leverancier
        const currentRoom = Array.from(socket.rooms)[1]; // Haal de huidige room op
        loadOrdersByLeverancier(orderToUpdate.leverancier, socket, currentRoom);
    }
});
    // Laad orders bij het aansluiten van de client zonder een specifieke leverancier
    loadOrdersOnConnect('Algemeen', socket.id);
});

function getRoom(socket) {
    const rooms = Object.keys(socket.rooms);
    return rooms.find(room => room !== socket.id);
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
