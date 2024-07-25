const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const wareHouseFile = path.join(__dirname,"../../data/logisticData.json");


const readData = () => {
  const wareHouseData = fs.readFileSync(wareHouseFile,"utf8"); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(wareHouseData); // Retornar los datos en formato JSON.
};

const writeData = (warehouses) => {
  fs.writeFileSync(wareHouseFile, JSON.stringify(warehouses, null, 2),"utf8"); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};


router.post("/", (req, res) => {
  const data = readData();

  const newWareHouse = {
    id: data.wareHouses.length + 1, // simulamos un id autoincrementable
    name: req.body.name, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
    location: req.body.location
  };
  data.wareHouses.push(newWareHouse)
  writeData(data)
  res.json({message:"Warehouse added",WareHouse:newWareHouse});
});

router.get("/", (req, res) => {
  const data = readData();
  res.json(data.wareHouses);
  writeData(data)
});

router.get("/:id", (req, res) => {
  const data = readData();
  const wareHouse = data.wareHouses.find((w) => w.id === parseInt(req.params.id));
  if (!wareHouse) {
    return res.status(404).json({ message: "Warehouse not found",wareHouse:wareHouse });
  }
  res.json(wareHouse);
  writeData(wareHouse);
});

// Actualizar una Anime por ID
router.put("/:id", (req, res) => {
  const data = readData();
  const wareHouseIndex = data.wareHouses.findIndex((w) => w.id === parseInt(req.params.id));
  if (wareHouseIndex === -1) {
    return res.status(404).json({ message: "Warehouse not found" });
  }
  const updateElement = {
    ...data[wareHouseIndex],
    id: parseInt(req.params.id),
    name: req.body.name,
    location:req.body.location
  };
  data.wareHouses[wareHouseIndex] = updateElement;
  writeData(data);
  res.json({ message: "Warehouse updated correctly", Warehouse: updateElement });
});


router.delete("/:id", (req, res) => {
  const data = readData();
  const deletedElement = data.wareHouses.filter((w) => w.id !== parseInt(req.params.id));
  if (data.wareHouses.length === deletedElement.length) {
    return res.status(404).json({ message: "Warehouse not found"});
  }

  data.wareHouses = deletedElement
  writeData(data);
  res.json({ message: "Warehouse deleted succesfull",wareHouse:deletedElement });
});

module.exports = router;