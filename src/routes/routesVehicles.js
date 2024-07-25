const { error } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const dataFile = path.join(__dirname,"../../data/logisticData.json");


const readData = () => {
  const data= fs.readFileSync(dataFile,"utf8"); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(data); // Retornar los datos en formato JSON.
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2),"utf8"); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};


router.post("/", (req, res) => {
  const data = readData();
  try{
    const newVehicle = {
    id: data.vehicles.length + 1, // simulamos un id autoincrementable
    type: req.body.type, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
    model: req.body.model,
    driverId : req.body.driverId};

    const verifaction = data.drivers.find(w =>w.id === newVehicle.driverId);
    if(!verifaction){
        throw new Error("The driver doesn't have a correctly  id")
    }
    else{
    data.vehicles.push(newVehicle)
    writeData(data)
    res.json({message:"Vehicle added",vehicle:newVehicle});}}

catch(error){
    throw new Error(error)
}}
);

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.vehicles);
  writeData(data)
});

router.get("/:id", (req, res) => {
  const data = readData();
  const vehicle = data.vehicles.find((w) => w.id === parseInt(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ message: "vehicle not found",vehicle:vehicle });
  }
  res.json(vehicle);
  writeData(vehicle);
});

// Actualizar una Anime por ID
router.put("/:id", (req, res) => {
  const data = readData();
  const vehicleIndex = data.vehicles.findIndex((w) => w.id === parseInt(req.params.id));
  if (vehicleIndex === -1) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  const updateElement = {
    ...data[vehicleIndex],
    id: parseInt(req.params.id),
    item: req.body.item,
    quantity: req.body.quantity,
    wareHouseId:req.body.wareHouseId
  };
  data.vehicles[vehicleIndex] = updateElement;
  writeData(data);
  res.json({ message: "vehicle updated correctly", vehicle: updateElement });
});


router.delete("/:id", (req, res) => {
  const data = readData();
  const deletedElement = data.vehicles.filter((w) => w.id !== parseInt(req.params.id));
  if (data.vehicles.length === deletedElement.length) {
    return res.status(404).json({ message: "vehicle not found"});
  }

  data.vehicles = deletedElement
  writeData(data);
  res.json({ message: "vehicle deleted succesfull",vehicle:deletedElement });
});

module.exports = router;