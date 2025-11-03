import {
    anyadirGasto,
    listarGastos,
    borrarGasto,
    calcularTotalGastos,
} from './gestionPresupuesto.js'

const $total = document.getElementById('total');
const $formulario = document.getElementById('formulario');
const $listado = document.getElementById('listado');

function pintarTotal(){
    const total= calcularTotalGastos();
    $total.textContent = `Total: ${total}`; 
}

function construirFormulario(){
    const form = document.createElement('form');
    form.setAttribute('aria-label', 'Crear Gasto');

    const labelNombre = document.createElement('label');
    labelNombre.textContent = 'Nombre: ';
    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.name = 'name';
    inputNombre.required = 'true';

    const labelCantidad = document.createElement('label');
    labelCantidad.textContent = 'Cantidad: ';
    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.name = 'cantidad';
    inputCantidad.step = '0.01';
    inputCantidad.required = true;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Añadir gasto';

    const div = document.createElement('div');
    div.appendChild(labelNombre);
    div.appendChild(inputNombre);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(labelCantidad);
    div.appendChild(inputCantidad);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(btn);

    form.appendChild(div); //Contenedor con todos los datos de mi formulario

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
        const cantidad = parseFloat(inputCantidad.value);
        if (!nombre || Number.isNaN(cantidad)) return;

        anyadirGasto({descripcion: nombre, valor: cantidad});

        pintarTotal();
        pintarListado();

        form.reset();
        inputNombre.focus();
    });
    $formulario.replaceChildren(form);

}

function pintarListado() {
    const gastos = listarGastos();

    const ul= document.createElement('ul');

    gastos.forEach((g) => {
        const li = document.createElement('li');
        li.textContent = `${g.descripcion}: ${g.valor}`;

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.textContent = 'Borrar';
        btnBorrar.addEventListener('click', ()=>{
            const ok = confirm(`Borrar "${g.descripcion}" por ${g.valor}?`);
            if (!ok) return;

            borrarGasto(g.id);

            pintarTotal();
            pintarListado();
        });
        li.appendChild(btnBorrar);
        ul.appendChild(li);

    });
    $listado.replaceChildren(ul);
}

construirFormulario();
pintarTotal();
pintarListado();