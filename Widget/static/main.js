var socket = io.connect();
var imagenes = [],
    cont = 0;
var nombrePatrocinador = "",
    logoPatrocinador = "",
    colorPatrocinador = "",
    urlPatrocinador = "";

setEventHandlers();


function setEventHandlers() {
    socket.on('list peliculas', (data) => {
        imagenes = data.msg.split(',');
        imagenes.pop(); //Remove last index
    });
    socket.on('patrocinador', (data) => {
        nombrePatrocinador = data.nombre;
        logoPatrocinador = data.logo;
        colorPatrocinador = data.color;
        urlPatrocinador = data.url;
    });

}

function setPatrocinador() {
    document.querySelector('.button').style.background = colorPatrocinador;
    document.querySelector('#logo').src = logoPatrocinador;
}

function cambioColorLeft() {
    document.querySelector('#arrow-left').style.color = colorPatrocinador;
}

function resetColorLeft() {
    document.querySelector('#arrow-left').style.color = "#000";
}

function cambioColorRight() {
    document.querySelector('#arrow-right').style.color = colorPatrocinador;
}

function resetColorRight() {
    document.querySelector('#arrow-right').style.color = "#000";
}

function changeURL() {
    window.open(urlPatrocinador);
}



function cambioImagen() {
    let img = document.querySelector('#img');
    img.src = imagenes[cont];
    if (cont < imagenes.length - 1) {
        cont++;
    } else {
        cont = 0;
    }

    setTimeout(cambioImagen, 5000);
}

function carrusel(contenedor) {
    cont = 0;
    let img = contenedor.querySelector('#img');
    img.src = imagenes[0];
    setPatrocinador();
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
    cambioImagen();

}