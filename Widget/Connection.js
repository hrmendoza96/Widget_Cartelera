const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = 4000;
const io = require('socket.io').listen(server);
connections = [];

app.use("/static", express.static('./static/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
server.listen(port, () => {
    console.log(`Server Running. Listening on port: ${port}`);
});


const uri = "mongodb://localhost:27017";
connect();
setInterval(connect, 1000);
async function connect() {
    const client = new MongoClient(uri, {
        useUnifiedTopology: true
    });
    try {
        await client.connect();
        const db = client.db("peliculasdb");
        console.log('Conectado a: ' + db.databaseName);
        const peliculas = db.collection("peliculas");
        const searchCursor = await peliculas.find();
        const result = await searchCursor.toArray();
        //console.table(result);
        var data = "";
        //result.forEach(r => console.log(r.url));
        result.forEach(r => data += r.url + ",");
        //console.log('data:\n' + data);
        // while (await searchCursor.hasNext()) {
        //     console.log(await searchCursor.next());
        // }

        io.sockets.on('connection', (socket) => {
            connections.push(socket);
            console.log('Connected: %s sockets connected', connections.length);
            io.sockets.emit('new message', { msg: data });

        });

        //Disconnect
        io.sockets.on('disconnect', (socket) => {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected:  %s sockets connected', connections.length);
        });



    } catch (ex) {
        console.error("Error en Conexión a Base de Datos" + ex);
    } finally {
        client.close();
    }
}