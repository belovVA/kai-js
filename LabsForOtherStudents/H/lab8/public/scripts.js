function addBook() {
  const title = $('#title').val();
  const publisher = $('#publisher').val();
  const authors = $('#authors').val();

  const book = {
    title: title,
    publisher: publisher,
    authors: authors,
    ownerName: '',  // ФИО владельца
    returnDate: ''  // Добавляем дату добавления книги
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
  displayBooksByPublisher();
  displaybooksByDate();
  displayBooksByOwnerName();
}


function displayOldBooks() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function(books) {
      $('#oldBooksContainer').empty();
      books.forEach(book => {
        const bookHTML = getBookHTML(book);
        $('#oldBooksContainer').append(bookHTML);
      });
    },
    error: function(error) {
      console.error('Error fetching new book:', error);
    }
  });
}



function loadNewBooks() {
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function(books) {
      $('#newBooksContainer').empty();
      const reversedBooks = books.reverse();
      reversedBooks.forEach(book => {
        const bookHTML = getBookHTML(book);
        $('#newBooksContainer').append(bookHTML);
      });
    },
    error: function(error) {
      console.error('Error fetching old book:', error);
    }
  });
}


function getBookHTML(book) {
  let infoHTML = `<p><strong>Название:</strong> ${book.title}</p>
                  <p><strong>Издательство:</strong> ${book.publisher}</p>
                  <p><strong>Авторы:</strong> ${book.authors}</p>`;

  if (book.returnDate !== '') {
    infoHTML += `<p><strong>ФИО владельца:</strong> ${book.ownerName}</p>
                 <p><strong>Дата возврата:</strong> ${book.returnDate}</p>`;
  }

  return `<div class="book">${infoHTML}</div>`;
}

function displayBooksByPublisher() {
  $('#booksByPublisher').empty();

  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function (library) {
      $('#booksByAuthor').empty();
      const publisherMap = new Map();


      library.forEach(book => {
        console.log(book);
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
},
error: function (error) {
  console.error('Error fetching books by publisher:', error);
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
            <div>${books.map(book => getBookHTML(book)).join('')}</div>
          </div>`;
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
            <div>${books.map(book => getBookHTML(book)).join('')}</div>
          </div>`;
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

  else if (tabName === 'byPublisher') {
    displayBooksByPublisher();
  } else if (tabName === 'ByDate') {
    displaybooksByDate();
  } else if (tabName === 'ByOwnerName') {
    displayBooksByOwnerName();
  } else if (tabName === 'manageBooks') {
    loadManageBooks();
  } else if (tabName === 'editBook'){
    loadEditBooks();
  }
}

$(document).ready(function() {
  // Загрузить старые книги при загрузке страницы
  // По умолчанию открыть вкладку 'Добавить' при загрузке страницы
  // $('#oldBooks').removeClass('active');
  // $('#newBooks').removeClass('active');
  // loadOldBooks();
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
        console.log(book);
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
    // Получаем все книги, чтобы найти ID по названию
    $.ajax({
      url: '/api/books',
      type: 'GET',
      success: function (library) {
        const selectedBook = library.find(book => book.title === selectedBookTitle && book.returnDate === '');
        
        if (selectedBook) {
          // Отправляем PUT-запрос на сервер для обновления информации о книге
          console.log(selectedBook);
          $.ajax({
            url: `/api/books/${selectedBook._id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
              title: selectedBook.title,
              publisher: selectedBook.publisher,
              authors: selectedBook.authors,
              ownerName: ownerName,
              returnDate: currentDate
            }),
            success: function () {
              // Перерисовываем отображение книг
              displayOldBooks();
              displayBooksByPublisher();
              displaybooksByDate();
              displayBooksByOwnerName();

              // Очищаем поля формы
              $('#ownerName').val('');
              $('#bookSelect').val('');
              $('#returnDate').val('');

              // Переключаемся на вкладку "Новые книги"
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

function loadManageBooks() {
  $('#manageBookSelect').empty();
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function(books) {
      books.forEach(book => {
        const option = `<option value="${book._id}">${book.title}</option>`;
        $('#manageBookSelect').append(option);
      });
    },
    error: function(error) {
      console.error('Error fetching books:', error);
    }
  });
}

function returnBook() {
  const bookId = $('#manageBookSelect').val();
  if (bookId) {
    $.ajax({
      url: `/api/books/${bookId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ ownerName: '', returnDate: '' }),
      success: function() {
        alert('Книга успешно возвращена.');
        loadManageBooks();
      },
      error: function(error) {
        console.error('Error returning book:', error);
      }
    });
  } else {
    alert('Выберите книгу для возврата.');
  }
}

function deleteBook() {
  const bookId = $('#manageBookSelect').val();
  if (bookId) {
    $.ajax({
      url: `/api/books/${bookId}`,
      type: 'DELETE',
      success: function() {
        alert('Книга успешно удалена.');
        loadManageBooks();
      },
      error: function(error) {
        console.error('Error deleting book:', error);
      }
    });
  } else {
    alert('Выберите книгу для удаления.');
  }
}

// Функция загрузки книг для редактирования
function loadEditBooks() {
  $('#editBookSelect').empty();
  $.ajax({
    url: '/api/books',
    type: 'GET',
    success: function(books) {
      books.forEach(book => {
        const option = `<option value="${book._id}">${book.title}</option>`;
        $('#editBookSelect').append(option);
      });
    },
    error: function(error) {
      console.error('Error fetching books:', error);
    }
  });
}

// Функция загрузки деталей книги в форму редактирования
function loadBookDetails() {
  const bookId = $('#editBookSelect').val();
  if (bookId) {
    $.ajax({
      url: `/api/books/${bookId}`,
      type: 'GET',
      success: function(book) {
        $('#editTitle').val(book.title);
        $('#editPublisher').val(book.publisher);
        $('#editAuthors').val(book.authors);
      },
      error: function(error) {
        console.error('Error fetching book details:', error);
      }
    });
  }
}

// Функция редактирования книги
function editBook() {
  const bookId = $('#editBookSelect').val();
  const updatedBook = {
    title: $('#editTitle').val(),
    publisher: $('#editPublisher').val(),
    authors: $('#editAuthors').val()
  };

  if (bookId) {
    $.ajax({
      url: `/api/books/${bookId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(updatedBook),
      success: function() {
        alert('Данные книги успешно обновлены.');
        loadEditBooks();
      },
      error: function(error) {
        console.error('Error updating book:', error);
      }
    });
  } else {
    alert('Выберите книгу для редактирования.');
  }
}
