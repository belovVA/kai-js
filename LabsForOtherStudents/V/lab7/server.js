const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let cars = [];  // Массив для хранения данных о машинах

// Функция для загрузки старых автомобилей из JSON-файла при запуске сервера
function loadOldCars() {
  const filePath = path.join(__dirname, 'public', 'cars.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading cars.json:', err);
      return;
    }
    const oldCars = JSON.parse(data);
    oldCars.forEach(car => {
      cars.push(car);
      console.log(car);
    });
    console.log('Old cars loaded successfully');
  });
}

// Вызов функции загрузки старых автомобилей при запуске сервера
loadOldCars();

// Маршрут для получения всех машин
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// Маршрут для добавления новой машины
app.post('/api/cars', (req, res) => {
  const car = req.body;
  cars.unshift(car);
  res.status(201).json(car);
});

// Маршрут для обновления информации о машине
app.put('/api/cars/:licensePlate', (req, res) => {
  const licensePlate = req.params.licensePlate;
  const carIndex = cars.findIndex(car => car.licensePlate.includes(licensePlate));

  if (carIndex !== -1) {
    cars[carIndex] = req.body;
    res.status(200).json(cars[carIndex]);
  } else {
    res.status(404).send('Car not found');
  }
});

// Маршрут для загрузки старых машин из JSON-файла
app.get('/api/oldCars', (req, res) => {
  // Загрузка данных из файла cars.json
  const fs = require('fs');
  fs.readFile('cars.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
    } else {
      oldCars = JSON.parse(data);
      res.json(oldCars);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
