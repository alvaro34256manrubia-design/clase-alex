function Enemigo() {
  this.energia = 10;
}

Enemigo.prototype.mover = function() {}

function Orco() {
  Enemigo.call(this); 
  this.fuerza = 15;
}

Orco.prototype = Object.create(Enemigo.prototype);
Orco.prototype.constructor = Orco;

Orco.prototype.disparar = function() {
};

function Trol() {
  Enemigo.call(this); 
  this.fuerza = 20;
}

Trol.prototype = Object.create(Enemigo.prototype);
Trol.prototype.constructor = Trol;

Trol.prototype.golpear = function() {
  
};


const enemigo = new Enemigo();
enemigo.mover();

const orco = new Orco();
orco.mover();
orco.disparar();

const trol = new Trol();
trol.mover();
trol.golpear();
