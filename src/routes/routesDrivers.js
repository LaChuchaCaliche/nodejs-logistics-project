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
    const newDriver = {
    id: data.drivers.length + 1, // simulamos un id autoincrementable
    name: req.body.name, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
    };
    data.drivers.push(newDriver)
    writeData(data)
    res.json({message:"Driver added",newDriver:newDriver});}

catch(error){
    throw new Error(error)
}}
);

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.drivers);
  writeData(data)
});

router.get("/:id", (req, res) => {
  const data = readData();
  const driver = data.drivers.find((w) => w.id === parseInt(req.params.id));
  if (!driver) {
    return res.status(404).json({ message: "driver not found",driver:driver });
  }
  res.json(driver);
  writeData(driver);
});

// Actualizar una Anime por ID
router.put("/:id", (req, res) => {
  const data = readData();
  const driverIndex = data.drivers.findIndex((w) => w.id === parseInt(req.params.id));
  if (driverIndex === -1) {
    return res.status(404).json({ message: "driver not found" });
  }
  const updateElement = {
    ...data[driverIndex],
    id: parseInt(req.params.id),
    name: req.body.name,
   
  };
  data.drivers[driverIndex] = updateElement;
  writeData(data);
  res.json({ message: "Driver updated correctly", Driver: updateElement });
});


router.delete("/:id", (req, res) => {
  const data = readData();
  const deletedElement = data.drivers.filter((w) => w.id !== parseInt(req.params.id));
  if (data.drivers.length === deletedElement.length) {
    return res.status(404).json({ message: "Driver not found"});
  }

  data.drivers = deletedElement
  writeData(data);
  res.json({ message: "Driver deleted succesfull",DeletedDriver:deletedElement });
});

module.exports = router;