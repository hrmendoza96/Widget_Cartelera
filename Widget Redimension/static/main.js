var socket = io.connect();
var imagenes = [],
    cont = 0;
setEventHandlers();

function setEventHandlers() {
    socket.on('new message', (data) => {
        imagenes = data.msg.split(',');
        imagenes.pop(); //Remove last index
    });
}

function carrusel(contenedor) {
    cont = 0;
    let img = contenedor.querySelector('#img');
    img.src = imagenes[0];
    contenedor.addEventListener('click', e => {
        let atras = contenedor.querySelector('#arrow-left'),
            adelante = contenedor.querySelector('#arrow-right'),
            //btn = contenedor.querySelector('.button'), Incluir funcionalidad en un futuro
            tgt = e.target;
        if (tgt === atras) {
            if (cont > 0) {
                img.src = imagenes[cont - 1];
                cont--;
            } else {
                img.src = imagenes[imagenes.length - 1];
                cont = imagenes.length - 1;
            }
        } else if (tgt === adelante) {
            console.log(adelante);
            if (cont < imagenes.length - 1) {
                img.src = imagenes[cont + 1];
                cont++;
            } else {
                img.src = imagenes[0];
                cont = 0;
            }
        }

    });
}
window.onload = () => {
    let contenedor = document.querySelector('.container');
    setTimeout(() => {
        carrusel(contenedor);
    }, 1000);
}