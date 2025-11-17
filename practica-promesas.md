# Práctica: Programación Asíncrona con Promesas en JavaScript

## 1. Objetivos de la Práctica

Objetivos de esta práctica:

* Comprender el concepto de programación asíncrona y la finalidad de las promesas.
* Identificar los tres estados de una promesa: pendiente, resuelta y rechazada.
* Consumir promesas existentes utilizando los métodos `.then()`, `.catch()` y `.finally()`.
* Crear sus propias promesas utilizando el constructor `new Promise(resolver, rechazar)`.
* Encadenar promesas para ejecutar operaciones asíncronas de forma secuencial.
* Utilizar los métodos estáticos `Promise.all()` y `Promise.race()` para gestionar múltiples promesas.
* Manejar correctamente los errores en flujos asíncronos.

## 2. Teoria

Una **promesa** es un objeto que representa el resultado de una operación asíncrona que puede estar disponible ahora o en el futuro. Su objetivo principal es evitar que el programa se bloquee mientras espera una tarea larga.

* **Estados:** Pendiente (en ejecución), Resuelta (éxito) o Rechazada (error).
* **Métodos clave:**
    * `.then(onFulfilled, onRejected)`: Se ejecuta cuando la promesa se resuelve (éxito).
    * `.catch(onRejected)`: Se ejecuta cuando la promesa se rechaza (error).
    * `.finally(onFinally)`: Se ejecuta siempre, independientemente del resultado (éxito o error).

## 3. Recursos

Para esta práctica, únicamente necesitarás:

* Un editor de código (como Visual Studio Code).
* Un navegador web (como Chrome o Firefox) con acceso a la consola de desarrollador (F12).
* **Documentación oficial (opcional):** Si deseas consultar la sintaxis exacta, puedes visitar la documentación oficial de [MDN Web Docs sobre Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise).

---

## 4. Guía Paso a Paso

### Preparación

1.  Crea una carpeta llamada `practica-promesas`.
2.  Dentro de ella, crea dos archivos: `index.html` y `app.js`.
3.  Edita `index.html` para que cargue tu script. Pega el siguiente contenido:

    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Práctica de Promesas</title>
    </head>
    <body>
        <h1>Práctica de Promesas</h1>
        <p>Abre la consola del desarrollador (F12) para ver los resultados.</p>
        
        <script src="app.js"></script>
    </body>
    </html>
    ```

4.  Abre `app.js`. Aquí escribirás todo tu código JavaScript.
5.  Abre `index.html` en tu navegador.

---

### Parte 1: Consumir Promesas (`.then`, `.catch` y `.finally`)

En la mayoría de los casos (95%), consumirás promesas que otras funciones o APIs devuelven. Vamos a simular esto.

1.  **Copia la siguiente función** en tu `app.js`. Esta función *simula* una petición a un servidor que tarda 2 segundos y devuelve una promesa.

    ```javascript
    /**
     * Función que simula una petición a una API.
     * Devuelve una promesa que se resuelve o rechaza después de 2 segundos.
     * @param {boolean} exito - Si true, la promesa se resuelve. Si false, se rechaza.
     * @returns {Promise<string>}
     */
    function simularPeticionAPI(exito) {
        // Creamos una promesa usando el constructor
        return new Promise((resolver, rechazar) => {
            console.log("Procesando petición...");
            
            // Simulamos el tiempo de espera
            setTimeout(() => {
                if (exito) {
                    // Si la operación fue exitosa, resolvemos la promesa
                    resolver("¡Datos recibidos con éxito!");
                } else {
                    // Si falló, rechazamos la promesa
                    rechazar("Error: No se pudieron obtener los datos.");
                }
            }, 2000); // 2 segundos de espera
        });
    }
    ```

2.  **Lanza el proceso asíncrono** llamando a la función con `true` para simular un caso de éxito. Recuerda que la variable `peticion1` almacena una promesa, no el resultado.

    ```javascript
    console.log("--- Parte 1: Caso de Éxito ---");

    const peticion1 = simularPeticionAPI(true);
    
    // Este mensaje se mostrará antes de que la promesa se resuelva
    console.log("Petición lanzada. Esperando respuesta...");
    ```

3.  **Procesa el resultado** usando `.then()` para el éxito, `.catch()` para el error, y `.finally()` para la limpieza.

    ```javascript
    peticion1.then(
        // Función que se ejecuta si la promesa se RESUELVE
        function(resultado) {
            console.log("THEN:", resultado); // Aquí procesamos el resultado
        }
    ).catch(
        // Función que se ejecuta si la promesa se RECHAZA
        function(error) {
            console.error("CATCH:", error); // Aquí procesamos el error
        }
    ).finally(
        // Función que se ejecuta SIEMPRE
        function() {
            console.log("FINALLY: El proceso ha finalizado, con o sin error.");
        }
    );
    ```

4.  **Recarga la página** en el navegador y observa la consola. Verás los mensajes en este orden:
    1.  `--- Parte 1: Caso de Éxito ---`
    2.  `Procesando petición...`
    3.  `Petición lanzada. Esperando respuesta...`
    4.  (Espera de 2 segundos)
    5.  `THEN: ¡Datos recibidos con éxito!`
    6.  `FINALLY: El proceso ha finalizado...`

5.  **Prueba el caso de error**. Ahora, lanza la petición de nuevo, pero pásale `false` para simular un rechazo.

    ```javascript
    console.log("\n--- Parte 1: Caso de Error ---");

    const peticion2 = simularPeticionAPI(false);

    peticion2.then(
        function(resultado) {
            console.log("THEN:", resultado);
        }
    ).catch(
        function(error) {
            console.error("CATCH:", error); // El error se procesa aquí
        }
    ).finally(
        function() {
            console.log("FINALLY: El proceso ha finalizado, con o sin error.");
        }
    );
    ```

6.  **Recarga y observa**. Ahora verás que el `.then()` se omite y la ejecución salta directamente al `.catch()`.

---

### Parte 2: Crear tus Propias Promesas

Ahora vas a crear una promesa desde cero, similar al ejemplo `temporizador` de los apuntes. Crearás una función que "promisifique" `setTimeout`.

1.  **Define la función `temporizador`**. Esta función recibirá un tiempo en milisegundos y devolverá una promesa.

    ```javascript
    console.log("\n--- Parte 2: Creando Promesas ---");

    /**
     * Devuelve una promesa que se resuelve después de 'tiempo' milisegundos.
     * @param {number} tiempo - Milisegundos a esperar.
     * @returns {Promise<string>}
     */
    function temporizador(tiempo) {
        // Devuelve una nueva promesa
        return new Promise(function(resolver, rechazar) {
            // Se ejecuta el temporizador
            setTimeout(function() {
                // Cuando se agota el tiempo, se resuelve la promesa
                resolver(`Temporizador de ${tiempo}ms terminado`);
            }, tiempo);
        });
    }
    ```

2.  **Utiliza tu nueva promesa**. [cite_start]Lanza dos temporizadores, uno de 1 segundo y otro de 3 segundos [cite: 100-103].

    ```javascript
    const t1 = temporizador(1000);
    const t2 = temporizador(3000);

    // Mensaje que se muestra inmediatamente
    console.log("Temporizadores lanzados. No se espera a que se resuelvan.");

    t1.then((resultado) => {
        console.log(resultado); // Se muestra después de 1 segundo
    });

    t2.then((resultado) => {
        console.log(resultado); // Se muestra después de 3 segundos
    });
    ```

3.  **Recarga y observa**. Verás el mensaje "Temporizadores lanzados..." primero, luego el mensaje de 1000ms, y finalmente el de 3000ms. Esto demuestra la naturaleza asíncrona.

---

### Parte 3: Encadenamiento de Promesas

Las promesas se pueden encadenar, ya que `.then()` siempre devuelve una promesa.

1.  **Encadenar un valor**: Llama a tu `temporizador(1500)`. En el primer `.then()`, procesa el resultado y devuelve un *valor normal* (un número).

    ```javascript
    console.log("\n--- Parte 3: Encadenamiento ---");

    temporizador(1500).then((res1) => {
        console.log("Paso 1:", res1);
        // Devolvemos un valor convencional
        return 50;
    }).then((res2) => {
        // res2 es el valor devuelto por el .then anterior (50)
        console.log("Paso 2:", res2);
    });
    ```

2.  **Encadenar otra promesa**: Ahora, haz que el primer `.then()` devuelva *otra promesa*. El siguiente `.then()` esperará a que esa nueva promesa se resuelva.

    ```javascript
    temporizador(2000) // 2 segundos
    .then((res1) => {
        console.log("Paso A:", res1);
        // Devolvemos una NUEVA promesa
        return temporizador(1000); // 1 segundo extra
    })
    .then((res2) => {
        // res2 es el resultado de la *segunda* promesa
        console.log("Paso B:", res2); // Este mensaje aparecerá a los 3 seg totales
    });
    ```

3.  **Recarga y observa** la diferencia en los tiempos de ejecución entre los dos ejemplos de encadenamiento.

---

### Parte 4: `Promise.all` y `Promise.race`

Vamos a lanzar un conjunto de promesas a la vez usando las funciones del ejercicio 2.

1.  [cite_start]**Define los temporizadores** que usarás [cite: 156-158].

    ```javascript
    console.log("\n--- Parte 4: Métodos Estáticos ---");

    const timer1 = temporizador(1000); // 1 seg
    const timer2 = temporizador(3000); // 3 seg
    const timer3 = temporizador(2000); // 2 seg
    ```

2.  **Usa `Promise.all()`**. Este método espera a que *todas* las promesas se resuelvan.

    ```javascript
    console.log("Lanzando Promise.all()... (Debería tardar 3 segundos)");

    Promise.all([timer1, timer2, timer3])
    .then((resultadosArray) => {
        // Se ejecuta cuando la promesa más lenta (3 seg) termina
        // Devuelve un array con todos los resultados
        console.log("Promise.all() RESUELTO:");
        for (let res of resultadosArray) {
            console.log(" -", res);
        }
    })
    .catch((error) => {
        // Se ejecutaría si CUALQUIERA de las promesas falla
        console.error("Promise.all() RECHAZADO:", error);
    });
    ```

3.  **Usa `Promise.race()`**. Este método espera solo a que la *primera* promesa se resuelva o rechace.

    ```javascript
    console.log("Lanzando Promise.race()... (Debería tardar 1 segundo)");

    Promise.race([timer1, timer2, timer3])
    .then((primerResultado) => {
        // Se ejecuta cuando la promesa más RÁPIDA (1 seg) termina
        // Devuelve solo el resultado de esa promesa
        console.log("Promise.race() RESUELTO:", primerResultado);
    })
    .catch((primerError) => {
        console.error("Promise.race() RECHAZADO:", primerError);
    });
    ```

4.  **Recarga y observa**. `Promise.race()` se resolverá en 1 segundo (el `timer1`), mientras que `Promise.all()` se resolverá en 3 segundos (el `timer2`).

---

### Parte 5: Manejo de Errores Avanzado

Las promesas permiten capturar errores que ocurren dentro de un `.then()`, algo que `try...catch` no puede hacer fácilmente con callbacks asíncronos.

1.  **Crea una cadena de promesas**.

    ```javascript
    console.log("\n--- Parte 5: Manejo de Errores ---");
    
    temporizador(1000)
    .then((resultado) => {
        console.log("Paso 1 (Error):", resultado);
        // Forzamos un error dentro de un .then
        throw new Error("¡Error forzado en el .then!");
        
        // Este código nunca se ejecuta
        console.log("Esto no se verá");
    })
    .then((resultado) => {
        // Este .then() completo se omite debido al error anterior
        console.log("Paso 2 (Omitido):", resultado);
    })
    .catch((error) => {
        // El error es capturado por el .catch() al final de la cadena
        console.error("CATCH (Error): Se ha producido un error ->", error.message);
    });
    ```

2.  **Recarga y observa**. Verás el log del "Paso 1", y luego la ejecución saltará directamente al `.catch()`, omitiendo el segundo `.then()`. Esto demuestra cómo los errores se propagan por la cadena de promesas.

---

## 5. Entrega

Para completar la práctica, entrega tu archivo `app.js` asegurándote de que:

1.  Contiene el código de las 5 partes.
2.  Está comentado, explicando qué hace cada bloque de código y qué resultado esperas ver en la consola, similar a como se ha hecho en esta guía.