function addVoucher() {
  var country = $('#country').val();
  var departureDate = $('#departureDate').val();
  var duration = $('#duration').val();
  var stars = $('#stars').val();
  var hotelName = $('#hotelName').val().split(',').map(name => name.trim());

  // Проверка на пустые строки
  if (country.trim() === '' || departureDate.trim() === '' ||
      duration.trim() === 0 || stars.trim() === 0 || hotelName.length == 0) {
    alert('Пожалуйста, заполните все данные');
    return;  // Прерываем выполнение функции
  }

  if (isNaN(parseInt(stars)) || parseInt(stars) > 5 || parseInt(stars) < 0) {
    alert('Звезды отеля должны быть от 0 до 5');
    return;  // Прерываем выполнение функции
  }

  const voucher = {
    country: country,
    departureDate: departureDate,
    duration: duration,
    stars: stars,
    hotelName: hotelName
  };

  // Отправляем AJAX запрос на сервер для добавления путевки
  $.ajax({
    type: 'POST',
    url: '/api/vouchers',
    data: JSON.stringify(voucher),
    contentType: 'application/json',
    success: function(data) {
      // Если добавление прошло успешно, обновляем список путевок на клиенте
      vouchers.unshift(data);
      displayVouchers('newVouchersContainer', 0);
    },
    error: function(xhr, status, error) {
      // Если произошла ошибка при добавлении путевки, выводим сообщение об ошибке
      console.error('Ошибка при добавлении путевки:', error);
      alert('Произошла ошибка при добавлении путевки');
    }
  });

  // Очищаем поля формы после успешного добавления
  $('#country, #departureDate, #duration, #stars, #hotelName').val('');
}

function displayVouchers(containerId, flag) {
  // Отправляем AJAX запрос на сервер для получения списка путевок
  $.ajax({
    type: 'GET',
    url: '/api/vouchers',
    success: function(data) {
      // Если получение списка прошло успешно, отображаем путевки на клиенте
      let vouchers = data;
      if (flag === 1) {
        vouchers = vouchers.reverse();
      }

      const container = $(`#${containerId}`);
      container.empty();  // Очищаем контейнер для путевок

      vouchers.forEach(voucher => {
        const voucherHTML = getVoucherHTML(voucher);
        container.append(voucherHTML);  // Выводим каждую путевку
      });
    },
    error: function(xhr, status, error) {
      // Если произошла ошибка при получении списка путевок, выводим сообщение об ошибке
      console.error('Ошибка при получении списка путевок:', error);
      alert('Произошла ошибка при получении списка путевок');
    }
  });
}

// Остальной код остается без изменений
function getVoucherHTML(voucher) {
  let infoHTML = `<p><strong>Страна:</strong> ${voucher.country}</p>
    <p><strong>Дата вылета:</strong> ${voucher.departureDate}</p>
    <p><strong>Длительность (дней):</strong> ${voucher.duration}</p>
    <p><strong>Количество звёзд:</strong> ${voucher.stars}</p>
    <p><strong>Название(-я) отеля:</strong> ${
      voucher.hotelName.join(', ')}</p>`;

  return `<div class="voucher">${infoHTML}</div>`;
}

function groupByCountry() {
  $.ajax({
    type: 'GET',
    url: '/api/vouchers',
    success: function(data) {
      // Если получение списка прошло успешно, выполняем группировку по странам
      const groupedByCountry = {};

      data.forEach(voucher => {
        const country = voucher.country;

        if (!groupedByCountry[country]) {
          groupedByCountry[country] = [];
        }
        groupedByCountry[country].push(voucher);
      });

  const groupByCountryContainer = $('#groupByCountryContainer');
  groupByCountryContainer.empty();

  Object.keys(groupedByCountry).forEach(country => {
    const vouchers = groupedByCountry[country];
    const groupHtml = `<div class="group-container">
      <h3>Страна: ${country}</h3>
      ${vouchers.map(voucher => getVoucherHTML(voucher)).join('')}
    </div>`;

    groupByCountryContainer.append(groupHtml);
  }); 
},
  error: function(xhr, status, error) {
    // Если произошла ошибка при получении списка путевок, выводим сообщение об ошибке
    console.error('Ошибка при получении списка путевок:', error);
    alert('Произошла ошибка при получении списка путевок');
  }
});
}



$(document).ready(function() {
  // Показываем форму добавления путевки при загрузке страницы
  $('#add').show();

  // Загружаем старые путевки (пример загрузки из JSON-файла)
  $.getJSON('vouchers.json', function(data) {
    oldVouchers = data;
    // console.log('Количество старых путевок:', oldVouchers.length);
    oldVouchers.forEach(voucher => {
      vouchers.push(voucher);
    });
  });
});

$('.tablink').click(function() {
  var tabName = $(this).attr('data-tab');
  $('.tabcontent').hide();  // Скрываем все вкладки
  $('#' + tabName).show();  // Отображаем выбранную вкладку

  if (tabName === 'newVouchers') {
    displayVouchers('newVouchersContainer', 1);
  } else if (tabName === 'oldVouchers') {
    displayVouchers('oldVouchersContainer', 0);
  } else if (tabName === 'groupByCountry') {
    groupByCountry();
  } else if (tabName === 'groupByDate') {
    groupByDepartureDate();
  } else if (tabName === 'groupByHotel') {
    groupByHotel();
  }
});


function groupByDepartureDate() {
  // Отправляем AJAX запрос на сервер для получения списка путевок
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/vouchers',
    success: function(data) {
      // Если получение списка прошло успешно, выполняем группировку по дате вылета
      const groupedByDate = {};

      data.forEach(voucher => {
        const departureDate = voucher.departureDate;

        if (!groupedByDate[departureDate]) {
          groupedByDate[departureDate] = [];
        }
        groupedByDate[departureDate].push(voucher);
      });

      const groupByDateContainer = $('#groupByDateContainer');
      groupByDateContainer.empty();

      Object.keys(groupedByDate).forEach(date => {
        const vouchers = groupedByDate[date];
        const groupHtml = `<div class="group-container">
          <h3>Дата вылета: ${date}</h3>
          ${vouchers.map(voucher => getVoucherHTML(voucher)).join('')}
        </div>`;

        groupByDateContainer.append(groupHtml);
      });
    },
    error: function(xhr, status, error) {
      // Если произошла ошибка при получении списка путевок, выводим сообщение об ошибке
      console.error('Ошибка при получении списка путевок:', error);
      alert('Произошла ошибка при получении списка путевок');
    }
  });
}

function groupByHotel() {
  // Отправляем AJAX запрос на сервер для получения списка путевок
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/vouchers',
    success: function(data) {
      // Если получение списка прошло успешно, выполняем группировку по отелям
      let groupedByHotel = {};

      data.forEach(voucher => {
        let hotelNames = voucher.hotelName;

        hotelNames.forEach(hotelName => {
          if (!groupedByHotel[hotelName]) {
            groupedByHotel[hotelName] = [];
          }
          groupedByHotel[hotelName].push(voucher);
        });
      });

      $('#groupByHotelContainer').empty();  // Очищаем контейнер перед отображением

      Object.keys(groupedByHotel).forEach(hotelName => {
        let vouchersForHotel = groupedByHotel[hotelName];

        let hotelHtml = `
          <div class="hotel-group">
            <h3>Отель(я): ${hotelName}</h3>
            <div class="voucher-list">
        `;

        vouchersForHotel.forEach(voucher => {
          hotelHtml += `
            <div class="voucher">
              <p><strong>Страна:</strong> ${voucher.country}</p>
              <p><strong>Дата вылета:</strong> ${voucher.departureDate}</p>
              <p><strong>Длительность:</strong> ${voucher.duration} дней</p>
              <p><strong>Количество звезд:</strong> ${voucher.stars}</p>
              <p><strong>Название отеля:</strong> ${voucher.hotelName.join(', ')}</p>
            </div>
          `;
        });

        hotelHtml += `</div></div>`;
        $('#groupByHotelContainer').append(hotelHtml);
      });
    },
    error: function(xhr, status, error) {
      // Если произошла ошибка при получении списка путевок, выводим сообщение об ошибке
      console.error('Ошибка при получении списка путевок:', error);
      alert('Произошла ошибка при получении списка путевок');
    }
  });
}
