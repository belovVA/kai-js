let library = [];
let newBooks = [];
let oldBooks = [];

function addBook() {
  const title = $('#title').val();
  const publisher = $('#publisher').val();
  const year = $('#year').val();
  const authors = $('#authors').val().split(',').map(author => author.trim());

  const book = {
    title: title,
    publisher: publisher,
    year: year,
    authors: authors,
    ownerName: '',  // ФИО владельца
    returnDate: ''  // Добавляем дату добавления книги
  };

  library.push(book);
  newBooks.unshift(book);  // Добавляем книгу в начало списка новых книг

  // Display new book in respective tabs
  // displayBooks();
  // loadOldBooks();
  displayOldBooks();
  displayBooksByAuthor();
  displayBooksByPublisher();
  displayBooksByYear();
}

function loadOldBooks() {
  $.getJSON('books.json', function(data) {
    oldBooks = data;

    // Добавляем каждую старую книгу в основную библиотеку
    oldBooks.forEach(book => {
      library.push(book);
    });
    // displayOldBooks();
  });
}
function displayOldBooks() {
  // Обновляем отображение после загрузки старых книг
  oldBooks.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#oldBooks').append(bookHTML);
  });
}



function loadNewBooks() {
  $('#newBooks').empty();  // Очищаем контейнер для новых книг

  newBooks.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#newBooks').append(bookHTML);  // Выводим все новые книги заново
  });
}


function getBookHTML(book) {
  let infoHTML = `<p><strong>Название:</strong> ${book.title}</p>
                  <p><strong>Издательство:</strong> ${book.publisher}</p>
                  <p><strong>Год издания:</strong> ${book.year}</p>
                  <p><strong>Авторы:</strong> ${book.authors.join(', ')}</p>`;

  if (book.returnDate !== '') {
    infoHTML += `<p><strong>ФИО владельца:</strong> ${book.ownerName}</p>
                 <p><strong>Дата возврата:</strong> ${book.returnDate}</p>`;
  }

  return `<div class="book">${infoHTML}</div>`;
}


function displayBooksByAuthor() {
  $('#booksByAuthor').empty();

  const authorsMap = new Map();

  library.forEach(book => {
    book.authors.forEach(author => {
      if (!authorsMap.has(author)) {
        authorsMap.set(author, []);
      }
      authorsMap.get(author).push(book);
    });
  });

  authorsMap.forEach((books, author) => {
    const authorGroupHTML = `<div class="book-group">
            <h3>${author}</h3>
            <div>${books.map(book => getBookHTML(book)).join('')}</div>
        </div>`;
    $('#booksByAuthor').append(authorGroupHTML);
  });
}

function displayBooksByPublisher() {
  $('#booksByPublisher').empty();

  const publishersMap = new Map();

  library.forEach(book => {
    const publisher = book.publisher;
    if (!publishersMap.has(publisher)) {
      publishersMap.set(publisher, []);
    }
    publishersMap.get(publisher).push(book);
  });

  publishersMap.forEach((books, publisher) => {
    const publisherGroupHTML = `<div class="book-group">
            <h3>${publisher}</h3>
            <div>${books.map(book => getBookHTML(book)).join('')}</div>
        </div>`;
    $('#booksByPublisher').append(publisherGroupHTML);
  });
}

function displayBooksByYear() {
  $('#booksByYear').empty();

  const yearsMap = {};  // Объект для хранения книг по годам

  library.forEach(book => {
    const year = book.year.toString();  // Преобразуем год в строку для
                                        // использования в качестве ключа

    if (!yearsMap[year]) {
      yearsMap[year] =
          [];  // Создаем новый массив для данного года, если его еще нет
    }

    yearsMap[year].push(book);  // Добавляем книгу в массив для данного года
  });

  // Теперь отображаем книги по годам из объекта yearsMap
  Object.keys(yearsMap).forEach(year => {
    const books = yearsMap[year];  // Получаем массив книг для данного года

    const yearGroupHTML = `<div class="book-group">
          <h3>${year}</h3>
          <div>${books.map(book => getBookHTML(book)).join('')}</div>
      </div>`;

    $('#booksByYear').append(yearGroupHTML);
  });
}


function openTab(evt, tabName) {
  $('.tabcontent').hide();  // Hide all tab content
  $('.tablinks')
      .removeClass('active');  // Remove 'active' class from all tab links
  $('#' + tabName).show();     // Show the selected tab
  $(evt.target)
      .addClass('active');  // Add 'active' class to the clicked tab link
  if (tabName == 'oldBooks') {
    displayOldBooks();
  } else if (tabName === 'borrow') {
    loadAvailableBooks();
  }

  else if (tabName === 'byAuthor') {
    displayBooksByAuthor();
  } else if (tabName === 'byPublisher') {
    displayBooksByPublisher();
  } else if (tabName === 'byYear') {
    displayBooksByYear();
  }
}

$(document).ready(function() {
  // Загрузить старые книги при загрузке страницы
  // По умолчанию открыть вкладку 'Добавить' при загрузке страницы
  // $('#oldBooks').removeClass('active');
  // $('#newBooks').removeClass('active');
  loadOldBooks();
  $('#newBooks').hide();
  $('#oldBooks').hide();
  $('#add').show();
  $('.tablinks:first').addClass('active');
});

function loadAvailableBooks() {
  $('#bookSelect').empty();

  library.forEach(book => {
    if (book.returnDate === '') {
      const option = `<option value="${book.title}">${book.title}</option>`;
      $('#bookSelect').append(option);
    }
  });
}

function borrowBook() {
  const ownerName = $('#ownerName').val();
  const selectedBookTitle = $('#bookSelect').val();
  const currentDate = $('#returnDate').val()

  const selectedBook = library.find(
      book => book.title === selectedBookTitle && book.returnDate === '');
  if (ownerName !== '' && currentDate != '') {
    if (selectedBook) {
      selectedBook.ownerName = ownerName;


      selectedBook.returnDate = currentDate;

      // Обновляем oldBooks, если книга присутствует там
      const oldBookIndex =
          oldBooks.findIndex(book => book.title === selectedBook.title);
      if (oldBookIndex !== -1) {
        // Обновляем информацию о книге в oldBooks по индексу
        oldBooks[oldBookIndex].ownerName = ownerName;
        oldBooks[oldBookIndex].returnDate = formattedDate;
      }
      // alert();
      // Перерисовываем отображение книг
      // loadOldBooks();
      displayOldBooks();
      loadNewBooks();
      displayBooksByAuthor();
      displayBooksByPublisher();
      displayBooksByYear();

      // Очищаем поля формы
      $('#ownerName').val('');
      $('#bookSelect').val('');  // Сбрасываем выбор книги
      $('#returnDate').val('');


      // Переключаемся на вкладку "Новые книги"
      openTab(event, 'borrow');
    } else {
      alert('Выбранная книга недоступна для взятия.');
    }
  } else {
    alert('Заполните ФИО и дату');
  }
}