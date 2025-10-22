let presupuesto = 0


function actualizarPresupuesto(nuevoValor) {
  if (nuevoValor < 0) {
    console.error("-1");
    return ("error"); 
  }

  presupuesto = nuevoValor;
  
}

function mostrarPresupuesto(){
   document.getElementById("mostrarPresupuesto").textContent =
    "Tu presupuesto actual es de " + presupuesto + " €";
}

function CrearGasto(descripcion, valor) {
  let gasto = {
    descripcion: descripcion,
      valor: (isNaN(valor) || valor < 0) ? 0 : parseFloat(valor),
      mostrarGasto: function() {
        return "Gasto: " + this.descripcion + " - " + this.valor + " €";
      }
    };
    return gasto;
  }
  this.descripcion = descripcion;
  this.valor = valor;

  this.mostrar = function() {
    console.log(`Gasto: "${this.descripcion}" - Valor: ${this.valor} €`);
  };


descripcion = String;
valor = Number;
