const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));
const emails = []
let id = 1;

function findEmailIndexById(id){
  for(let i=0; i < emails.length; i++){
  if(emails[i].id==id) return i;
  }
  return -1;
  }

  app.get("/api/emails", function(_, res){
    res.send(emails);
  });

    // получение одного пользователя по id
  app.get("/api/emails/:id", function(req, res){
    const id = req.params.id; // получаем id
    // находим в массиве пользователя по idconst index = findUserIndexById(id);
    // отправляем пользователя
    if(index > -1){
      res.send(emails[index]);
    }
    else{
      res.status(404).send("User not found");
    }
  });

    // получение отправленных данных
  app.post("/api/emails", function (req, res) {
    if(!req.body) return res.sendStatus(400);

    const  receiveDate = req.body.date;
    const senderer = req.body.sender;
    const  typeEmail = req.body.type;
    const summaryEmail = req.body.summary;
    const recipientsEmail = req.body.recipients;

    const email = {date: receiveDate, sender: senderer, type:typeEmail, summary:summaryEmail, recipients:recipientsEmail };
    // присваиваем идентификатор из переменной id и увеличиваем ее на единицу
    email.id = id++;
    // добавляем пользователя в массив
    emails.push(email);
    res.send(email);
  });

app.put("/api/emails", function(req, res){
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const  receiveDate = req.body.date;
    const senderer = req.body.sender;
    const  typeEmail = req.body.type;
    const summaryEmail = req.body.summary;
    const recipientsEmail = req.body.recipients;
    const index = findUserIndexById(id);
    
    if(index > -1){
    // изменяем данные у пользователя
      const email = emails[index];
      email.date = receiveDate;
      email.sender = senderer;
      email.type = typeEmail;
      email.summary = summaryEmail;
      email.recipients = recipientsEmail;
      res.send(user);
    }
    else{
      res.status(404).send("User not found");
    }
  });