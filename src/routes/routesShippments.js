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
    const newShipment = {
    id: data.shipments.length + 1, // simulamos un id autoincrementable
    item: req.body.item, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
    quantity: req.body.quantity,
    wareHouseId : req.body.wareHouseId};

    const verifaction = data.wareHouses.find(w =>w.id === newShipment.wareHouseId);
    if(!verifaction){
        throw new Error("The shipment doesnt have a correctly warehouse id")
    }
    else{
    data.shipments.push(newShipment)
    writeData(data)
    res.json({message:"Shipment added",Shipment:newShipment});}}

catch(error){
    throw new Error(error)
}}
);

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.shipments);
  writeData(data)
});

router.get("/:id", (req, res) => {
  const data = readData();
  const shipment = data.shipments.find((w) => w.id === parseInt(req.params.id));
  if (!shipment) {
    return res.status(404).json({ message: "shipment not found",shipment:shipment });
  }
  res.json(shipment);
  writeData(shipment);
});

// Actualizar una Anime por ID
router.put("/:id", (req, res) => {
  const data = readData();
  const shipmentIndex = data.shipments.findIndex((w) => w.id === parseInt(req.params.id));
  if (shipmentIndex === -1) {
    return res.status(404).json({ message: "shipment not found" });
  }
  const updateElement = {
    ...data[shipmentIndex],
    id: parseInt(req.params.id),
    item: req.body.item,
    quantity: req.body.quantity,
    wareHouseId:req.body.wareHouseId
  };
  data.shipments[shipmentIndex] = updateElement;
  writeData(data);
  res.json({ message: "Shipment updated correctly", Warehouse: updateElement });
});


router.delete("/:id", (req, res) => {
  const data = readData();
  const deletedElement = data.shipments.filter((w) => w.id !== parseInt(req.params.id));
  if (data.shipments.length === deletedElement.length) {
    return res.status(404).json({ message: "shipment not found"});
  }

  data.shipments = deletedElement
  writeData(data);
  res.json({ message: "shipment deleted succesfull",shipment:deletedElement });
});

module.exports = router;