import {
    anyadirGasto,
    listarGastos,
    borrarGasto,
    calcularTotalGastos,
    CrearGasto
} from './gestionPresupuesto.js';

const $total = document.getElementById('total');
const $formulario = document.getElementById('formulario');
const $listado = document.getElementById('listado');


function construirFormulario() {
    const form = document.createElement('form');

    form.innerHTML = `
        <label>Nombre: <input name="name" required></label>
        <label>Cantidad: <input name="cantidad" type="number" step="0.01" required></label>
        <button type="submit">Añadir gasto</button>
    `;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = form.name.value.trim();
        const cantidad = parseFloat(form.cantidad.value);
        if (!nombre || isNaN(cantidad)) return;

        const gasto = new CrearGasto(nombre, cantidad);
        anyadirGasto(gasto);

        pintarTotal();
        pintarListado();

        form.reset();
        form.name.focus();
    });

    $formulario.replaceChildren(form);
}

function pintarTotal() {
    $total.textContent = `Total: ${calcularTotalGastos()} €`;
}


class MiGasto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.getElementById('gasto-template');
        const content = template.content.cloneNode(true);
        this.shadowRoot.appendChild(content);

        this.gasto = null;
    }

    set data(gasto) {
        this.gasto = gasto;
        this.render();
    }

    render() {
        if (!this.gasto) return;

        const s = this.shadowRoot;
        s.querySelector('.descripcion').textContent = `Descripción: ${this.gasto.descripcion}`;
        s.querySelector('.valor').textContent = `Valor: ${this.gasto.valor} €`;
        s.querySelector('.fecha').textContent = `Fecha: ${new Date(this.gasto.fecha).toLocaleDateString()}`;
        s.querySelector('.etiquetas').textContent = `Etiquetas: ${this.gasto.etiquetas.join(', ')}`;

        s.querySelector('.btn-borrar').onclick = () => {
            const ok = confirm(`¿Borrar "${this.gasto.descripcion}"?`);
            if (!ok) return;
            borrarGasto(this.gasto.id);
            pintarListado();
            pintarTotal();
        };

        const form = s.querySelector('.editar-form');
        s.querySelector('.btn-editar').onclick = () => {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';

            form.descripcion.value = this.gasto.descripcion;
            form.valor.value = this.gasto.valor;
            form.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0, 10);
            form.etiquetas.value = this.gasto.etiquetas.join(', ');
        };

        form.onsubmit = (e) => {
            e.preventDefault();
            this.gasto.descripcion = form.descripcion.value.trim();
            this.gasto.valor = parseFloat(form.valor.value);
            this.gasto.fecha = Date.parse(form.fecha.value);
            this.gasto.etiquetas = form.etiquetas.value
                .split(',')
                .map(e => e.trim())
                .filter(e => e);

            form.style.display = 'none';
            render();
            pintarTotal();
            pintarListado();
        };

        form.querySelector('.cancelar').onclick = () => {
            form.style.display = 'none';
        };
    }
}

customElements.define('mi-gasto', MiGasto);


function pintarListado() {
    const lista = listarGastos();
    $listado.textContent = '';

    lista.forEach(g => {
        const item = document.createElement('mi-gasto');
        item.data = g;
        $listado.appendChild(item);
    });
}

construirFormulario();
pintarTotal();
pintarListado();
