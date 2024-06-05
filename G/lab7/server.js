const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static("./public"));
const vouchers = [];
let id = 1;

function findVoucherIndexById(id) {
  for (let i = 0; i < vouchers.length; i++) {
    if (vouchers[i].id == id) return i;
  }
  return -1;
}

app.get("/api/vouchers", function (_, res) {
  res.send(vouchers);
});

// Загрузка путевок из vouchers.json при запуске сервера
function loadOldVouchers() {
  const filePath = path.join(__dirname, 'public', 'vouchers.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading vouchers.json:', err);
      return;
    }
    const oldVouchers = JSON.parse(data);
    oldVouchers.forEach(voucher => {
      voucher.id = id++; // Присваиваем уникальный идентификатор
      vouchers.push(voucher);
    });
    console.log('Old vouchers loaded successfully');
  });
}

// Вызов функции загрузки старых путевок при запуске сервера
loadOldVouchers();

app.get("/api/vouchers/:id", function (req, res) {
  const id = req.params.id;
  const index = findVoucherIndexById(id);
  if (index > -1) {
    res.send(vouchers[index]);
  } else {
    res.status(404).send("Voucher not found");
  }
});

app.post("/api/vouchers", function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const country = req.body.country;
  const departureDate = req.body.departureDate;
  const duration = req.body.duration;
  const stars = req.body.stars;
  const hotelName = req.body.hotelName;

  const voucher = {
    country: country,
    departureDate: departureDate,
    duration: duration,
    stars: stars,
    hotelName: hotelName
  };

  voucher.id = id++;
  vouchers.push(voucher);
  res.send(voucher);
});

app.put("/api/vouchers/:id", function (req, res) {
  const voucherId = parseInt(req.params.id);
  const index = findVoucherIndexById(voucherId);

  if (index === -1) {
    return res.status(404).send("Voucher not found");
  }

  const { country, departureDate, duration, stars, hotelName } = req.body;
  const voucher = vouchers[index];
  
  voucher.country = country;
  voucher.departureDate = departureDate;
  voucher.duration = duration;
  voucher.stars = stars;
  voucher.hotelName = hotelName;

  res.send(voucher);
});

app.listen(3000, function () {
  console.log("Server is running...");
});
