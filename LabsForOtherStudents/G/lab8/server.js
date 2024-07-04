const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/vouchers", { useNewUrlParser: true, useUnifiedTopology: true });

const voucherSchema = new mongoose.Schema({
  country: String,
  departureDate: String,
  duration: Number,
  stars: Number,
  hotelName: [String]
});

const Voucher = mongoose.model("Voucher", voucherSchema);

// async function loadOldVouchers() {
//   try {
//     const filePath = path.join(__dirname, 'public', 'vouchers.json');
//     const data = fs.readFileSync(filePath, 'utf8');
//     const oldVouchers = JSON.parse(data);
//     const voucherPromises = oldVouchers.map(voucher => new Voucher(voucher).save());
//     await Promise.all(voucherPromises);
//     console.log('Old vouchers loaded successfully');
//   } catch (error) {
//     console.error('Error loading old vouchers:', error);
//   }
// }

// loadOldVouchers();

app.get("/api/vouchers", async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.send(vouchers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/vouchers", async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    res.send(voucher);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/vouchers/:id", async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }
    res.send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/api/vouchers/:id", async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }
    res.send(voucher);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/api/vouchers/:id", async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }
    res.send({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Сервер ожидает подключения...");
});
