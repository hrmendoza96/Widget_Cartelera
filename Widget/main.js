var imagenes = ['https://cinemarkmedia.modyocdn.com/ca/300x400/213041.jpg?version=1572022800000',
        'https://cinemarkmedia.modyocdn.com/ca/300x400/217797.jpg?version=1572022800000',
        'https://cinemarkmedia.modyocdn.com/ca/300x400/218194.jpg?version=1572022800000',
        'https://cinemarkmedia.modyocdn.com/ca/300x400/212923.jpg?version=1572022800000',
        'https://cinemarkmedia.modyocdn.com/ca/300x400/212783.jpg?version=1572022800000'
    ],
    cont = 0;

function carrusel(contenedor) {
    contenedor.addEventListener('click', e => {
        let atras = contenedor.querySelector('#arrow-left'),
            adelante = contenedor.querySelector('#arrow-right'),
            img = contenedor.querySelector('#img'),
            btn = contenedor.querySelector('.button'),
            tgt = e.target;

        if (tgt = atras) {
            if (cont > 0) {
                img.src = imagenes[cont - 1];
                cont--;
            } else {
                img.src = imagenes[imagenes.length - 1];
                cont = imagenes.length - 1;
            }
        } else if (tgt = adelante) {
            if (cont < imagenes - 1) {
                img.src = imagenes[cont + 1];
                cont++;
            } else {
                img.src = imagenes[0];
                cont = 0;
            }
        }

    });
}

document.addEventListener("DOMContentLoaded", () => {
    let contenedor = document.querySelector('.container');
    carrusel(contenedor);
});