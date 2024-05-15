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
  console.log(`kolvo`, newBooks.length);
  // Display new book in respective tabs
  // displayBooks();
  // loadOldBooks();
  displayOldBooks();
  displayBooksByAuthor();
  displaybooksByDate();
  displayBooksByOwnerName();
}

function loadOldBooks() {
  $.getJSON('books.json', function(data) {
    oldBooks = data;

    // Добавляем каждую старую книгу в основную библиотеку
    oldBooks.forEach(book => {
      library.push(book);
    });
  });
}
function displayOldBooks() {
  $('#oldBooksContainer').empty();
  // Обновляем отображение после загрузки старых книг
  oldBooks.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#oldBooksContainer').append(bookHTML);
  });
}



function loadNewBooks() {
  $('#newBooksContainer').empty();  // Очищаем контейнер для новых книг

  newBooks.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#newBooksContainer').append(bookHTML);  // Выводим все новые книги заново
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

function displaybooksByDate() {
  $('#booksByDate')
      .empty();  // Очищаем контейнер для группировки по дате возврата

  const booksByReturnDate = {};  // Объект для хранения книг по дате возврата

  // Группировка книг по дате возврата
  library.forEach(book => {
    const returnDate = book.returnDate;
    const key = returnDate !== '' ? returnDate : 'Свободны';

    if (!booksByReturnDate[key]) {
      booksByReturnDate[key] = [];
    }

    booksByReturnDate[key].push(book);
  });

  // Отображение книг по группам даты возврата
  Object.keys(booksByReturnDate).forEach(date => {
    const books = booksByReturnDate[date];

    const returnDateGroupHTML = `<div class="book-group">
        <h3>${date}</h3>
        <div>${books.map(book => getBookHTML(book)).join('')}</div>
      </div>`;

    $('#booksByDate').append(returnDateGroupHTML);
  });
}

function displayBooksByOwnerName() {
  $('#booksByOwnerName')
      .empty();  // Очищаем контейнер для группировки по ФИО владельца

  const ownersMap = {};  // Объект для хранения книг по ФИО владельца

  // Группировка книг по ФИО владельца
  library.forEach(book => {
    const ownerName = book.ownerName ||
        'Свободны';  // Если ФИО владельца пусто, используем "Свободны"

    if (!ownersMap[ownerName]) {
      ownersMap[ownerName] = [];
    }

    ownersMap[ownerName].push(book);
  });

  // Отображение книг по группам ФИО владельца
  Object.keys(ownersMap).forEach(ownerName => {
    const books = ownersMap[ownerName];

    const ownerNameGroupHTML = `<div class="book-group">
        <h3>${ownerName}</h3>
        <div>${books.map(book => getBookHTML(book)).join('')}</div>
      </div>`;

    $('#booksByOwnerName').append(ownerNameGroupHTML);
  });
}



function openTab(evt, tabName) {
  $('.tabcontent').hide();  // Hide all tab content
  $('.tablinks')
      .removeClass('active');  // Remove 'active' class from all tab links
  $('#' + tabName).show();     // Show the selected tab
  $(evt.target)
      .addClass('active');  // Add 'active' class to the clicked tab link
  if (tabName == 'newBooks') {
    loadNewBooks();
  }
  if (tabName == 'oldBooks') {
    displayOldBooks();
  } else if (tabName === 'borrow') {
    loadAvailableBooks();
  }

  else if (tabName === 'byAuthor') {
    displayBooksByAuthor();
  } else if (tabName === 'ByDate') {
    displaybooksByDate();
  } else if (tabName === 'ByOwnerName') {
    displayBooksByOwnerName();
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
      displaybooksByDate();
      displayBooksByOwnerName();

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