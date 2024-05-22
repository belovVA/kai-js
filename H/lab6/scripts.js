let library = [];
let oldBooks = [];

function addBook() {
  const title = $('#title').val();
  const publisher = $('#publisher').val();

  const book = {
    title: title,
    publisher: publisher,
    ownerName: '',
    returnDate: ''
  };

  library.unshift(book);
  displayOldBooks();
  displayBooksByPublisher();
  displayBooksByDate();
  displayBooksByOwnerName();
}

function loadOldBooks() {
  $.getJSON('books.json', function(data) {
    oldBooks = data;

    oldBooks.forEach(book => {
      library.push(book);
    });

    displayOldBooks();
    displayBooksByPublisher();
    displayBooksByDate();
    displayBooksByOwnerName();
  });
}

function displayOldBooks() {
  $('#oldBooksContainer').empty();
  const reversedLibrary = [...library].reverse();

  reversedLibrary.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#oldBooksContainer').append(bookHTML);
  });
}

function loadNewBooks() {
  $('#newBooksContainer').empty();

  library.forEach(book => {
    const bookHTML = getBookHTML(book);
    $('#newBooksContainer').append(bookHTML);
  });
}

function getBookHTML(book) {
  let infoHTML = `<p><strong>Название:</strong> ${book.title}</p>
                  <p><strong>Издательство:</strong> ${book.publisher}</p>`;

  if (book.returnDate !== '') {
    infoHTML += `<p><strong>ФИО владельца:</strong> ${book.ownerName}</p>
                 <p><strong>Дата возврата:</strong> ${book.returnDate}</p>`;
  }

  return `<div class="book">${infoHTML}</div>`;
}

function displayBooksByPublisher() {
  $('#booksByPublisher').empty();

  const publisherMap = new Map();

  library.forEach(book => {
    const publishers = book.publisher.split(',').map(p => p.trim());
    publishers.forEach(publisher => {
      if (!publisherMap.has(publisher)) {
        publisherMap.set(publisher, []);
      }
      publisherMap.get(publisher).push(book);
    });
  });

  publisherMap.forEach((books, publisher) => {
    const publisherGroupHTML = `<div class="book-group">
            <h3>${publisher}</h3>
            <div>${books.map(book => getBookHTML(book)).join('')}</div>
        </div>`;
    $('#booksByPublisher').append(publisherGroupHTML);
  });
}

function displayBooksByDate() {
  $('#booksByDate').empty();

  const booksByReturnDate = {};

  library.forEach(book => {
    const returnDate = book.returnDate;
    const key = returnDate !== '' ? returnDate : 'Свободны';

    if (!booksByReturnDate[key]) {
      booksByReturnDate[key] = [];
    }

    booksByReturnDate[key].push(book);
  });

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

function loadBookOptions() {
  const selectElement = $('#bookSelect');
  selectElement.empty();

  library.forEach(book => {
    const optionHTML = `<option value="${book.title}">${book.title}</option>`;
    selectElement.append(optionHTML);
  });
}

function borrowBook() {
  const ownerName = $('#ownerName').val();
  const bookTitle = $('#bookSelect').val();
  const returnDate = $('#returnDate').val();

  library = library.map(book => {
    if (book.title === bookTitle) {
      return {
        ...book,
        ownerName: ownerName,
        returnDate: returnDate
      };
    }
    return book;
  });

  displayOldBooks();
  displayBooksByPublisher();
  displayBooksByDate();
  displayBooksByOwnerName();
}

function openTab(evt, tabName) {
  $('.tabcontent').hide();
  $('.tablinks').removeClass('active');
  $(`#${tabName}`).show();
  $(evt.currentTarget).addClass('active');

  if (tabName === 'oldBooks') {
    displayOldBooks();
  } else if (tabName === 'newBooks') {
    loadNewBooks();
  } else if (tabName === 'borrow') {
    loadBookOptions();
  } else if (tabName === 'byPublisher') {
    displayBooksByPublisher();
  } else if (tabName === 'ByDate') {
    displayBooksByDate();
  } else if (tabName === 'ByOwnerName') {
    displayBooksByOwnerName();
  }
}

$(document).ready(function() {
  $('.tabcontent').hide();
  $('.tablinks:first').addClass('active');
  $('#borrow').show();
  loadOldBooks();
  loadBookOptions();
});
