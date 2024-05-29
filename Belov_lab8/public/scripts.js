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
    returnDate: ''  // Дата возврата
  };

  $.ajax({
    url: '/api/books',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(book),
    success: function () {
      loadNewBooks();
    },
    error: function (error) {
      console.error('Error adding book:', error);
    }
  });

  displayOldBooks();
  displayBooksByAuthor();
  displaybooksByDate();
  displayBooksByOwnerName();
}

function displayOldBooks() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (books) {
      $('#oldBooksContainer').empty();
      books.forEach(book => {
        const bookHTML = getBookHTML(book);
        $('#oldBooksContainer').append(bookHTML);
      });
    },
    error: function (error) {
      console.error('Error fetching old books:', error);
    }
  });
}

function loadNewBooks() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (books) {
      $('#newBooksContainer').empty();
      const reversedBooks = books.reverse();
      reversedBooks.forEach(book => {
        const bookHTML = getBookHTML(book);
        $('#newBooksContainer').append(bookHTML);
      });
    },
    error: function (error) {
      console.error('Error fetching new books:', error);
    }
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
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (library) {
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
    },
    error: function (error) {
      console.error('Error fetching books by author:', error);
    }
  });
}

function displaybooksByDate() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (library) {
      $('#booksByDate').empty();
      const booksByReturnDate = {};

      library.forEach(book => {
        const returnDate = book.returnDate || 'Свободны';
        if (!booksByReturnDate[returnDate]) {
          booksByReturnDate[returnDate] = [];
        }
        booksByReturnDate[returnDate].push(book);
      });

      Object.keys(booksByReturnDate).forEach(date => {
        const books = booksByReturnDate[date];
        const returnDateGroupHTML = `<div class="book-group">
            <h3>${date}</h3>
            <div>${books.map(book => getBookHTML(book)).join('')}</div>`;
        $('#booksByDate').append(returnDateGroupHTML);
      });
    },
    error: function (error) {
      console.error('Error fetching books by date:', error);
    }
  });
}

function displayBooksByOwnerName() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (library) {
      $('#booksByOwnerName').empty();
      const ownersMap = {};

      library.forEach(book => {
        const ownerName = book.ownerName || 'Свободны';
        if (!ownersMap[ownerName]) {
          ownersMap[ownerName] = [];
        }
        ownersMap[ownerName].push(book);
      });

      Object.keys(ownersMap).forEach(ownerName => {
        const books = ownersMap[ownerName];
        const ownerNameGroupHTML = `<div class="book-group">
            <h3>${ownerName}</h3>
            <div>${books.map(book => getBookHTML(book)).join('')}</div>`;
        $('#booksByOwnerName').append(ownerNameGroupHTML);
      });
    },
    error: function (error) {
      console.error('Error fetching books by owner name:', error);
    }
  });
}

function openTab(evt, tabName) {
  $('.tabcontent').hide();  // Hide all tab content
  $('.tablinks').removeClass('active');  // Remove 'active' class from all tab links
  $('#' + tabName).show();  // Show the selected tab
  $(evt.target).addClass('active');  // Add 'active' class to the clicked tab link
  if (tabName == 'newBooks') {
    loadNewBooks();
  } else if (tabName == 'oldBooks') {
    displayOldBooks();
  } else if (tabName === 'borrow') {
    loadAvailableBooks();
  } else if (tabName === 'byAuthor') {
    displayBooksByAuthor();
  } else if (tabName === 'ByDate') {
    displaybooksByDate();
  } else if (tabName === 'ByOwnerName') {
    displayBooksByOwnerName();
  }
}

$(document).ready(function () {
  // Загрузить старые книги при загрузке страницы
  $('#newBooks').hide();
  $('#oldBooks').hide();
  $('#add').show();
  $('.tablinks:first').addClass('active');
});

function loadAvailableBooks() {
  $('#bookSelect').empty();

  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (library) {
      library.forEach(book => {
        if (book.returnDate === '') {
          const option = `<option value="${book.title}">${book.title}</option>`;
          $('#bookSelect').append(option);
        }
      });
    },
    error: function (error) {
      console.error('Error fetching books:', error);
    }
  });
}

function borrowBook() {
  const ownerName = $('#ownerName').val();
  const selectedBookTitle = $('#bookSelect').val();
  const currentDate = $('#returnDate').val();

  if (ownerName !== '' && currentDate !== '') {
    $.ajax({
      url: '/api/books',
      type: 'GET',
      success: function (library) {
        const selectedBook = library.find(book => book.title === selectedBookTitle && book.returnDate === '');
        
        if (selectedBook) {
          $.ajax({
            url: `/api/books/${selectedBook._id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
              title: selectedBook.title,
              publisher: selectedBook.publisher,
              year: selectedBook.year,
              authors: selectedBook.authors,
              ownerName: ownerName,
              returnDate: currentDate
            }),
            success: function () {
              displayOldBooks();
              displayBooksByAuthor();
              displaybooksByDate();
              displayBooksByOwnerName();

              $('#ownerName').val('');
              $('#bookSelect').val('');
              $('#returnDate').val('');

              openTab(event, 'borrow');
            },
            error: function (error) {
              alert('Ошибка при обновлении информации о книге.');
              console.error('Error updating book:', error);
            }
          });
        } else {
          alert('Выбранная книга недоступна для взятия.');
        }
      },
      error: function (error) {
        console.error('Error fetching books:', error);
      }
    });
  } else {
    alert('Заполните ФИО и дату');
  }
}
