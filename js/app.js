//Constructores
function Seguro (clase, peso, tipo) {
    this.clase = clase;
    this.peso = peso;
    this.tipo = tipo;
}
//No se utiliza arrow function por que hay que acceder a los datos del objeto
Seguro.prototype.cotizarSeguro = function () {
    let cantidad;
    const base = 10;
    switch (this.clase) {
        case '1':
            cantidad = base * 1.05;
            break;
        case '2':
            cantidad = base * 1.25;
            break;
        case '3':
            cantidad = base * 2.25;
            break;
        default:
            break;
    }

    cantidad = cantidad * ((parseInt(this.peso) * 25) / 100);

    if (this.tipo === 'completo') {
        cantidad *= 1.30;
    }

    return cantidad;
}

function UI () {}

//Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = 200, min = 5;
    const selectPeso = document.querySelector("#peso");
    for (let i = min; i <= max; i += 5) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectPeso.appendChild(option);
    }
}
//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement("div");
    if (tipo === 'error') {
        div.classList.add("error");

    } else {
        div.classList.add("correcto");
    }
    div.classList.add("mensaje", 'mt-10');
    div.textContent = mensaje;
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado"));

    setTimeout(() => {
        div.remove();
    }, 3000)
}
UI.prototype.mostrarResultado = (seguro, total) => {
    const {clase,peso,tipo} = seguro;
    let distancia;
    switch (clase) {
        case '1':
            distancia = 'Provincial';
            break;
        case '2':
            distancia = 'Nacional';
            break;
        case '3':
            distancia = 'Europea';
            break;
        default:
            break;
    }
    let tipoPre = tipo === 'basico'? "Básico" : "Completo";

    const div = document.createElement('div');
    div.classList.add("mt-10");
    div.innerHTML = `
        <p class="header">Resumen del envío</p>
        <p class= "font-bold">Envío: <span class=font-normal">${distancia} </span></p>
        <p class= "font-bold">Peso: <span class=font-normal">${peso} Kg</span></p>
        <p class= "font-bold">Seguro: <span class=font-normal">${tipoPre} </span></p>
        <p class= "font-bold">Total: <span class=font-normal"> ${total.toFixed(2)} €</span></p>
    `;
    const resultadoDiv = document.querySelector("#resultado");
    
    //Mostrar el spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    },3000)
}
//instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
    ui.llenarOpciones();
})

evenListeners();
function evenListeners () {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}
function cotizarSeguro (e) {
    e.preventDefault();
    //leer los campos para verificar que todo esté relleno
    const clase = document.querySelector("#clase").value;
    const peso = document.querySelector("#peso").value;
    const tipo = document.querySelector('input[name= "tipo"]:checked').value;
    if (clase === '' || peso === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    ui.mostrarMensaje('Buscando el mejor precio...', 'correcto');

    //Ocultar los presupuestos previos
    const resultados = document.querySelector("#resultado div");
    if (resultados != null) {
        resultados.remove();
    }

    const seguro = new Seguro(clase, peso, tipo);
    const total = seguro.cotizarSeguro();
    ui.mostrarResultado(seguro, total);
}