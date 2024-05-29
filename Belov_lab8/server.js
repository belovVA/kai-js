const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/library", { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
  title: String,
  publisher: String,
  year: Number,
  authors: [String],
  ownerName: String,
  returnDate: String
});

const Book = mongoose.model("Book", bookSchema);

// function loadOldBooks() {
//   const filePath = path.join(__dirname, 'public', 'books.json');
//   fs.readFile(filePath, 'utf8', async (err, data) => {
//     if (err) {
//       console.error('Error reading books.json:', err);
//       return;
//     }
//     try {
//       const oldBooks = JSON.parse(data);
//       const bookPromises = oldBooks.map(book => new Book(book).save());
//       await Promise.all(bookPromises);
//       console.log('Old books loaded successfully');
//     } catch (error) {
//       console.error('Error loading old books:', error);
//     }
//   });
// }

// loadOldBooks();

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Сервер ожидает подключения...");
});
