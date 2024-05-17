let vouchers = [];
// let oldVouchers = [];
let newVouchers = [];

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

  vouchers.unshift(voucher);
  // newVouchers.unshift(voucher);

  // Очищаем поля формы после успешного добавления
  $('#country, #departureDate, #duration, #stars, #hotelName').val('');

  console.log('Новая путевка добавлена:', voucher);
}

function displayVouchers(containerId, flag) {
  let newtravel;
  if (flag === 1){
    newtravel = [...vouchers].reverse();
  } else{
    newtravel = [...vouchers];
  }

  const container = $(`#${containerId}`);
  container.empty();  // Очищаем контейнер для путевок

  newtravel.forEach(voucher => {
    const voucherHTML = getVoucherHTML(voucher);
    container.append(voucherHTML);  // Выводим каждую путевку
  });
}

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
  const groupedByCountry = {};

  vouchers.forEach(voucher => {
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
}

function groupByDepartureDate() {
  const groupedByDate = {};

  vouchers.forEach(voucher => {
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
    displayVouchers('newVouchersContainer', 0);
  } else if (tabName === 'oldVouchers') {
    displayVouchers('oldVouchersContainer', 1);
  } else if (tabName === 'groupByCountry') {
    groupByCountry();
  } else if (tabName === 'groupByDate') {
    groupByDepartureDate();
  } else if (tabName === 'groupByHotel') {
    groupByHotel();
  }
});


// Функция группировки путевок по отелям (несколько значений отеля)
function groupByHotel() {
  // Создаем объект для группировки по отелям
  let groupedByHotel = {};

  // Проходим по каждой путевке
  vouchers.forEach(voucher => {
    // Получаем массив названий отеля для текущей путевки
    let hotelNames = voucher.hotelName;

    // Обрабатываем каждое название отеля в массиве
    hotelNames.forEach(hotelName => {
      if (!groupedByHotel[hotelName]) {
        groupedByHotel[hotelName] = [];
      }
      groupedByHotel[hotelName].push(voucher);
    });
  });

  // Отображаем результаты группировки по отелям
  $('#groupByHotelContainer').empty();  // Очищаем контейнер перед отображением

  // Выводим каждую группу путевок для каждого уникального отеля
  Object.keys(groupedByHotel).forEach(hotelName => {
    let vouchersForHotel = groupedByHotel[hotelName];

    // Формируем HTML для отображения путевок для текущего отеля
    let hotelHtml = `
      <div class="hotel-group">
        <h3>Отель(я): ${hotelName}</h3>
        <div class="voucher-list">
    `;

    // Добавляем информацию о каждой путевке для данного отеля
    vouchersForHotel.forEach(voucher => {
      hotelHtml += `
        <div class="voucher">
          <p><strong>Страна:</strong> ${voucher.country}</p>
          <p><strong>Дата вылета:</strong> ${voucher.departureDate}</p>
          <p><strong>Длительность:</strong> ${voucher.duration} дней</p>
          <p><strong>Количество звезд:</strong> ${voucher.stars}</p>
          <p><strong>Название отеля:</strong> ${
          voucher.hotelName.join(', ')}</p>
        </div>
      `;
    });

    hotelHtml +=
        `</div></div>`;  // Закрываем блоки HTML для отеля и списка путевок
    $('#groupByHotelContainer')
        .append(hotelHtml);  // Добавляем HTML в контейнер
  });
}
