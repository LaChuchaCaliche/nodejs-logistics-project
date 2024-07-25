const express = require("express"); // Importamos Express

const app = express(); // Instanciamos Express
const PORT = 3000; // Puerto del servidor en donde se ejecutará la API
const wareHouse = require('./routes/routesWarehouse')
const errorHandler=require('./middleWare/errorHandler')
const shipment = require('./routes/routesShippments')
const driver = require('./routes/routesDrivers')

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON. Tambien conocido como middleware de aplicación.
app.use("/shipments",shipment);
app.use("/wareHouses", wareHouse); // Middleware para manejar las rutas de la API. Tambien conocido como middleware de montaje o de enrutamiento.
app.use(errorHandler); // Middleware para manejar errores.
app.use("/drivers",driver)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});