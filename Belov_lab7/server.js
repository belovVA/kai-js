const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static("./public"));
const books = []
let id = 1;


function findBookIndexById(id){
  for(let i=0; i < books.length; i++){
  if(books[i].id==id) return i;
  }
  return -1;
  }

  app.get("/api/books", function(_, res){
    res.send(books);
  });

  // Загрузка писем из mails.json при запуске сервера
function loadOldBooks() {
  const filePath = path.join(__dirname, 'public', 'books.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading mails.json:', err);
      return;
    }
    const oldBooks = JSON.parse(data);
    oldBooks.forEach(book => {
      book.id = id++;  // Присваиваем уникальный идентификатор
      books.push(book);
    });
    console.log('Old books loaded successfully');
  });
}

// Вызов функции загрузки старых писем при запуске сервера
loadOldBooks();

    // получение одного пользователя по id
  app.get("/api/books/:id", function(req, res){
    const id = req.params.id; // получаем id
    // находим в массиве пользователя по idconst index = findUserIndexById(id);
    // отправляем пользователя
    if(index > -1){
      res.send(books[index]);
    }
    else{
      res.status(404).send("User not found");
    }
  });

    // получение отправленных данных
app.post("/api/books", function (req, res) {
    if(!req.body) return res.sendStatus(400);

    const  title = req.body.title;
    const publisher = req.body.publisher;
    const  year = req.body.year;
    const authors = req.body.authors;
    const ownerName = req.body.ownerName;
    const returnDate = req.body.returnDate;


    const book = {title: title, publisher: publisher, year:year, authors:authors, ownerName:ownerName,returnDate:returnDate  };
    // присваиваем идентификатор из переменной id и увеличиваем ее на единицу
    book.id = id++;
    // добавляем пользователя в массив
    books.push(book);
    res.send(book);
    console.log(book);
  });

app.put("/api/books", function(req, res){
    if(!req.body) return res.sendStatus(400);
    const  title = req.body.title;
    const publisher = req.body.publisher;
    const  year = req.body.year;
    const authors = req.body.authors;
    const ownerName = req.body.ownerName;
    const returnDate = req.body.returnDate;
    const index = findBookIndexById(id);
    
    if(index > -1){
    // изменяем данные у пользователя
      const book = books[index];
      book.title = title;
      book.publisher = publisher;
      book.year = year;
      book.authors = authors;
      book.ownerName = ownerName;
      book.returnDate = returnDate
      res.send(user);
    }
    else{
      res.status(404).send("Book not found");
    }
  });
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
   });

   app.put("/api/books/:id", function (req, res) {
    const bookId = parseInt(req.params.id);
    const index = findBookIndexById(bookId);
  
    if (index === -1) {
      return res.status(404).send("Book not found");
    }
  
    const { title, publisher, year, authors, ownerName, returnDate } = req.body;
    const book = books[index];
    
    book.title = title;
    book.publisher = publisher;
    book.year = year;
    book.authors = authors;
    book.ownerName = ownerName;
    book.returnDate = returnDate;
  
    res.send(book);
  });
  