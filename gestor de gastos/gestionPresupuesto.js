let presupuesto = 0;
let gastos = [];

// TODO: Funciones adicionales


function actualizarPresupuesto(valor) {
let numero = parseFloat(valor);
  if (isNaN(numero) || numero < 0) {
    alert("Por favor introduce un número válido.");
    return -1;
  }
  presupuesto = numero;
  localStorage.setItem("presupuesto", presupuesto);
  mostrarPresupuesto();
  return presupuesto;}

function mostrarPresupuesto() {
document.getElementById("mostrarPresupuesto").textContent =
    "Tu presupuesto actual es de " + presupuesto + " €";}

function CrearGasto(descripcion, valor) {
let gasto = {
    descripcion: descripcion,
    valor: (isNaN(valor) || valor < 0) ? 0 : parseFloat(valor),
    mostrarGasto: function() {
      return "Gasto: " + this.descripcion + " - " + this.valor + " €";
    }
  };
  return gasto;}

// Exportación de funciones
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto
}

