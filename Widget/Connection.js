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
setInterval(connect, 10000);
async function connect() {
    const client = new MongoClient(uri, {
        useUnifiedTopology: true
    });
    try {
        await client.connect();
        const db = client.db("peliculasdb");

        /* Peliculas */
        const peliculas = db.collection("peliculas");
        const searchCursor = await peliculas.find();
        const result = await searchCursor.toArray();
        var data = "";
        //result.forEach(r => data += r.url + ",");
        result.forEach((r) => {
            //Validar fecha de inicio y vencimiento
            var fecha_inicio = r.fecha_inicio;
            var fecha_vencimiento = r.fecha_vencimiento;
            var fecha_hoy = new Date();
            var day = fecha_hoy.getDate();
            var month = fecha_hoy.getMonth() + 1;
            var year = fecha_hoy.getFullYear();
            var format = month + "/" + day + "/" + year;
            // Fecha Vencimiento (YYYY, MM, DD) 
            var arregloFechaVencimiento = fecha_vencimiento.split("/");
            var vencimiento = new Date(arregloFechaVencimiento[2], arregloFechaVencimiento[0], arregloFechaVencimiento[1]);
            // Fecha Inicio (YYYY, MM, DD)
            var arregloFechaInicio = fecha_inicio.split("/");
            var inicio = new Date(arregloFechaInicio[2], arregloFechaInicio[0], arregloFechaInicio[1]);
            // Fecha Hoy (YYYY, MM, DD)
            var arregloFechaHoy = format.split("/");
            var hoy = new Date(arregloFechaHoy[2], arregloFechaHoy[0], arregloFechaHoy[1]);
            //console.log("Fecha Hoy: " + hoy);
            if (hoy >= inicio && hoy <= vencimiento) {
                data += r.url + ","
            }
            //Asegurarse de Cambiar Fechas!!!!

        });

        /* Patrocinador */
        const patrocinador = db.collection("patrocinador");
        const searchCursorPatrocinador = await patrocinador.findOne();
        var nombrePatrocinador = searchCursorPatrocinador.nombre;
        var logoPatrocinador = searchCursorPatrocinador.logo;
        var colorPatrocinador = searchCursorPatrocinador.color;
        var urlPatrocinador = searchCursorPatrocinador.url;


        io.sockets.on('connection', (socket) => {
            connections.push(socket);
            console.log('Connected: %s sockets connected', connections.length);
            io.sockets.emit('list peliculas', { msg: data });
            io.sockets.emit('patrocinador', { nombre: nombrePatrocinador, logo: logoPatrocinador, color: colorPatrocinador, url: urlPatrocinador });

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