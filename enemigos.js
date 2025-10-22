export function Enemigo() {
    this.energia = 10;
}

Enemigo.prototype.mover = function() {
    console.log("El enemigo se mueve.");
};

export function Orco() {
    Enemigo.call(this);
    this.fuerza = 15;
}
Orco.prototype = Object.create(Enemigo.prototype);
Orco.prototype.constructor = Orco;
Orco.prototype.disparar = function() {
    console.log("El orco dispara con el arco.");
};

export function Troll() {
    Enemigo.call(this);
    this.fuerza = 20;
}
Troll.prototype = Object.create(Enemigo.prototype);
Troll.prototype.constructor = Troll;
Troll.prototype.golpear = function() {
    console.log("El troll golpea con el mazo.");
};
