let presupuesto = 0


function actualizarPresupuesto(nuevoValor) {
  if (nuevoValor < 0) {
    console.error("-1");
    return ("error"); 
  }

  presupuesto = nuevoValor;
  
}

function mostrarPresupuesto(){
    console.log("Presupuessto",presupuesto,"€")
}

function Gasto(descripcion, valor) {
  if (valor < 0) {
    console.error(presupuesto = 0);
    
  }

  this.descripcion = descripcion;
  this.valor = valor;

  this.mostrar = function() {
    console.log(`Gasto: "${this.descripcion}" - Valor: ${this.valor} €`);
  };
}

descripcion = String;
valor = Number;
