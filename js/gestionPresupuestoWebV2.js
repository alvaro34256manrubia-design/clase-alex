import {
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    sobrescribirGastos,
} from './gestionPresupuesto.js';

const NOMBRE_CLAVE="mi_gestor_gastos";

document.getElementById('guardar-gastos').addEventListener('click', () => {
    const lista = listarGastos(); 
    localStorage.setItem(NOMBRE_CLAVE, JSON.stringify(lista)); //guarda el listado de gastos y convierte la lista a textoJSON 
    alert('Gastos guardados en localStorage');
});

document.getElementById('recuperar-gastos').addEventListener('click', () => {
    const datos = localStorage.getItem(NOMBRE_CLAVE);
    if (!datos){
        alert('No hay gastos guardados.');
        return;
    }

    const arrayGastos = JSON.parse(datos); //convierte el textoJSON a un array de objetos
    sobrescribirGastos(arrayGastos);
    pintarTotal();
    pintarListado();
    alert('Gastos recuperados desde localStorage');
});

const templateGasto = document.createElement('template');
templateGasto.innerHTML = `
    <style>
        div{ margin-bottom:4px;}
        button{ margin-left:8px; }
    </style>
    <div class="capa_descripcion"></div>
    <div class="capa_valor"></div>
    <div class="capa_fecha"></div>
    <div class="capa_etiquetas"></div>

    <button class="btn_borrar"> borrar </button>
    <button class="btn_editar"> editar </button>

    <form class="form_editar" style="display:none;">
        <label> Descripcion: <input name="descripcion"></label>
        <label> Valor: <input name="valor" type="number" step="0.01"></label>
        <button type="submit"> Enviar </button>
        <button type="button" class="cancelar"> Cancelar </button>
        </form>
    `;

class MiGasto extends HTMLElement {
    set gasto(obj){
        this._gasto = obj;

        if (this.$desc){ //Si los elementos del shadowDOM existen, pinta los datos.
            this._pintar();
        }
        
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(templateGasto.content.cloneNode(true));

        this.$desc = shadow.querySelector('.capa_descripcion');
        this.$valor = shadow.querySelector('.capa_valor');
        this.$fecha = shadow.querySelector('.capa_fecha');
        this.$btnBorrar = shadow.querySelector('.btn_borrar');
        this.$btnEditar = shadow.querySelector('.btn_editar');
        this.$form = shadow.querySelector('.form_editar');
        this.$etiquetas = shadow.querySelector('.capa_etiquetas');

        this.$inputDesc = this.$form.descripcion;
        this.$inputValor = this.$form.valor;

        this.$btnBorrar.addEventListener('click', () => {
            if (confirm("Estas seguro de borrar este gasto?")){
                borrarGasto(this._gasto.id);
                pintarTotal();
                pintarListado();
            }
        });

        this.$btnEditar.addEventListener('click', () => {
            this.$form.style.display = this.$form.style.display === 'none' ? 'block' : 'none'; //toggle display
            this.$inputDesc.value = this._gasto.descripcion; //actualiamos
            this.$inputValor.value = this._gasto.valor;
        });

        this.$form.addEventListener('submit', (e) => { //Evento al enviar el formulario de edicion
            e.preventDefault();
            this._gasto.descripcion = this.$inputDesc.value;
            this._gasto.valor = parseFloat(this.$inputValor.value);
            this.$form.style.display = 'none';
            pintarTotal();
            pintarListado();
        });

        this.$form.querySelector('.cancelar').addEventListener('click', () => {
            this.$form.style.display = 'none';
        });
        
        if (this._gasto) this._pintar(); //Si el gasto ya estaba asignado antes de conectarse, pinta los datos., pinramos los datos
    }

    _pintar(){
        if (!this.$desc) return;
        this.$desc.textContent = this._gasto.descripcion;
        this.$valor.textContent = this._gasto.valor;
        this.$fecha.textContent = new Date(this._gasto.fecha).toLocaleString();
        this.$etiquetas.textContent = this._gasto.etiquetas && this._gasto.etiquetas.length
            ? 'Etiquetas: ' + this._gasto.etiquetas.join(', ')
            : 'Sin etiquetas'; 
    }
}

customElements.define('mi-gasto', MiGasto); //registramos el componente 


//copy del web1
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

    const labelEtiquetas = document.createElement('label');
    labelEtiquetas.textContent = 'Etiquetas (separadas por coma): ';
    const inputEtiquetas = document.createElement('input');
    inputEtiquetas.type = 'text';
    inputEtiquetas.name = 'etiquetas';

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
    div.appendChild(labelEtiquetas);
    div.appendChild(inputEtiquetas);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(btn);

    form.appendChild(div); //Contenedor con todos los datos de mi formulario

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
        const cantidad = parseFloat(inputCantidad.value);
        if (!nombre || Number.isNaN(cantidad)) return;

        const etiquetasStr = inputEtiquetas.value || "";
        const etiquetas = etiquetasStr
            .split(',')
            .map(et => et.trim())
            .filter(Boolean);

        anyadirGasto({descripcion: nombre, valor: cantidad, fecha:Date.now(), etiquetas: etiquetas});

        pintarTotal();
        pintarListado();

        form.reset();
        inputNombre.focus();
    });
    $formulario.replaceChildren(form);

}
//fin copy web1

function pintarListado(){
    const lista = listarGastos();
    $listado.innerHTML = ''; //Vaciamos el listado antes de pintar

    lista.forEach(g => {
        const item = document.createElement('mi-gasto');//creamos un componente
        item.gasto = g;                          //le asignamos el gasto (setter)
        $listado.appendChild(item);             //lo añadimos al DOM
    });
}


construirFormulario();
pintarTotal();
pintarListado();