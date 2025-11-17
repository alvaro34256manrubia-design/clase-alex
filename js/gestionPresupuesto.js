let presupuesto = 0;
let gastos = [];
let idGasto = 0;




function actualizarPresupuesto(valor) {
  
  if (typeof valor === "number" && valor >= 0) {
    presupuesto = valor;
    return presupuesto;
  } else {
    
    console.log("el valor debe ser un numero no negativo");
    return -1;
  }
}

function mostrarPresupuesto() {
    return "Tu presupuesto actual es de " + presupuesto + " €";

}

function CrearGasto(descripcion, valor, fechaStr) {
    if (typeof valor !== "number" || valor < 0 ){
        valor = 0
    }
  
    this.descripcion = descripcion;
    this.valor = valor;

    let timestamp;
    if (typeof fechaStr === "string") {
      const parsed = Date.parse(fechaStr);
      if (!isNaN(parsed)) {
        timestamp = parsed
      } else{
        timestamp = Date.now();
      } 
    } else {
      timestamp = Date.now();
    }

    this.fecha = timestamp;

    this.etiquetas = [];

    this.mostrarGasto = function(){
      return "Gasto correspondiente a " + this.descripcion + " con valor " + this.valor + " €";
    };

    this.actualizarDescripcion = function(nuevaDescripcion){
      this.descripcion = nuevaDescripcion;
    };
    
    this.actualizarValor = function(nuevoValor){
      if (typeof nuevoValor === "number" && nuevoValor >= 0){
        this.valor = nuevoValor;
      } else {
        console.log("el valor debe ser un numero negativo.")
      }
    };

    this.mostrarGastoCompleto = function(){
     const fechaLocal = new Date(this.fecha).toLocaleString();
     let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;
     texto += `Fecha: ${fechaLocal}\n`;

    if (this.etiquetas.length > 0) {
      texto += "Etiquetas:\n";
      for (let et of this.etiquetas) {
        texto += `- ${et}\n`;
      }
    }
      return texto;
   };

    this.actualizarFecha = function(nuevaFechaStr){
      const parsed = Date.parse(nuevaFechaStr);
      if (!isNaN(parsed)) {
        this.fecha = parsed;
      }
    };

    this.anyadirEtiquetas = function(){
      for (let i = 0; i < arguments.length; i++){
        const et = arguments[i];
        if (this.etiquetas.indexOf(et) === -1){
          this.etiquetas.push(et);
        }
      }
    };

    this.borrarEtiquetas = function(etiqueta){
      for (let i = 0; i < arguments.length; i++){
        const et = arguments[i];
        const index = this.etiquetas.indexOf(et);
        if (index !== -1){
          this.etiquetas.splice(index, 1);
        }
      }

      if (this.etiquetas.length === 0){
        this.etiquetas = [];
      }
    };

    if (arguments.length > 3){
      const extras = [];
      for (let i = 3; i < arguments.length; i++){
        extras.push(arguments[i]);
      }
      this.anyadirEtiquetas.apply(this, extras);
  }

  this.obtenerPeriodoAgrupacion = function(periodo){
    const fechaObj = new Date(this.fecha);
    const year = fechaObj.getFullYear();
    const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaObj.getDate().toString().padStart(2, '0');

    if (periodo === "dia"){
      return `${year}-${month}-${day}`;
    } else if (periodo === "mes"){
      return `${year}-${month}`;
    }else if (periodo === "anyo"){
      return `${year}`;
    } else {
      return "";
    }
  }
}

function filtrarGastos(filtros){
  return gastos.filter(gasto => {
    if (filtros.fechaDesde){
      const fechaDesdeTs = Date.parse(filtros.fechaDesde);
      if (gasto.fecha < fechaDesdeTs) return false;
    }

    if (filtros.fechaHasta){
      const fechaHastaTs = Date.parse(filtros.fechaHasta);
      if (gasto.fecha > fechaHastaTs) return false;
    }
    
    if (typeof filtros.valorMinimo === "number"){
      if (gasto.valor < filtros.valorMinimo) return false;
    }

    if (typeof filtros.valorMaximo === "number"){
      if (gasto.valor > filtros.valorMaximo) return false;
    }

    if (filtros.descripcionContiene){
      if(!gasto.descripcion.toLowerCase().includes(filtros.descripcionContiene.toLowerCase())) return false;
    }

    if (Array.isArray(filtros.etiquetasTiene) && filtros.etiquetasTiene.length > 0){
      const etiquetasFiltro = filtros.etiquetasTiene.map(et => et.toLowerCase());
      const etiquetasGasto = gasto.etiquetas.map(et => et.toLowerCase());
      if (!etiquetasGasto.some(et => etiquetasFiltro.includes(et))) return false;
    }

    return true;
  });

}

function agruparGastos(periodo = "mes", etiquetas = [], fechaDesde, fechaHasta){
  let gastosFiltrados = gastos;

  if(fechaDesde || fechaHasta || (etiquetas && etiquetas.length > 0)){
    gastosFiltrados = filtrarGastos({
      fechaDesde,
      fechaHasta,
      etiquetasTiene: etiquetas
    });
  }

  return gastosFiltrados.reduce((acc, gasto) => {
    const clave = gasto.obtenerPeriodoAgrupacion(periodo);
    if (!acc[clave]) acc[clave] = 0;
    acc[clave] += gasto.valor;
    return acc;
  }, {});
}


function listarGastos(){
  return gastos;
}

function anyadirGasto(gasto){
  gasto.id = idGasto;
  idGasto = idGasto + 1;
  gastos.push(gasto);
}

function borrarGasto(id){
  for (let i = 0; i < gastos.length; i++){
    if (gastos[i].id === id) {
      gastos.splice(i, 1);
      break;
    }
  }
}

function calcularTotalGastos(){
  let total = 0;
  for (let i= 0; i< gastos.length; i++){
    total += gastos[i].valor;
  }
  return total;
}

function calcularBalance(){
  return presupuesto - calcularTotalGastos();
}


export function sobrescribirGastos(nuevaLista) {
gastos = nuevaLista;
idGasto = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 0;
}


export {
mostrarPresupuesto,
actualizarPresupuesto,
CrearGasto,
listarGastos,
anyadirGasto,
borrarGasto,
calcularTotalGastos,
calcularBalance,
filtrarGastos,
agruparGastos,
sobrescribirGastos
};

