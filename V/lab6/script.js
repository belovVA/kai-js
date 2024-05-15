let parking = [];
let oldCars = [];
let newCars = [];


function addCar() {
  var licensePlate =
      $('#licensePlate').val().split(',').map(license => license.trim());
  var parkingSpot = $('#parkingSpot').val();
  var parkingDate = $('#parkingDate').val();
  var ownerName = $('#ownerName').val();

  // Проверка на пустые строки в licensePlate и ownerName
  if (licensePlate.length === 0 || ownerName.trim() === '') {
    alert('Пожалуйста, заполните госномер и ФИО владельца.');
    return;  // Прерываем выполнение функции
  }

  // Проверка наличия parkingDate, если parkingSpot не пустой
  if (parkingSpot !== '' && parkingDate.trim() === '' ||
      parkingSpot === '' && parkingDate.trim() !== '') {
    alert('Пожалуйста, укажите дату стоянки.');
    return;  // Прерываем выполнение функции
  }

  const car = {
    licensePlate: licensePlate,
    parkingSpot: parkingSpot,
    parkingDate: parkingDate,
    ownerName: ownerName
  };
  parking.push(car);
  newCars.unshift(car);

  // Очищаем поля формы после успешного добавления
  $('#licensePlate, #parkingSpot, #parkingDate, #ownerName').val('');

  // console.log('Новый автомобиль добавлен:');
  // console.log('Госномер:', car.licensePlate);
  // console.log('Номер парковочного места:', car.parkingSpot);
  // console.log('Дата стоянки:', car.parkingDate);
  // console.log('ФИО владельца:', car.ownerName);
  // console.log('Длина new', newCars.length);
}

function getCarHTML(car) {
  let infoHTML =
      `<p><strong>Госномер:</strong> ${car.licensePlate.join(', ')}</p>
                    <p><strong>Номер парковочного места:</strong> ${
          car.parkingSpot}</p>
                    <p><strong>Дата стоянки:</strong> ${car.parkingDate}</p>
                    <p><strong>ФИО владельца:</strong> ${car.ownerName}</p>`;

  return `<div class="car">${infoHTML}</div>`;
}

// Загрузк старых автомобилей из JSON-файла
function loadOldCars() {
  $.getJSON('cars.json', function(data) {
    console.log(`data`, data.length);

    oldCars = data;
    console.log(`old`, oldCars.length);
    oldCars.forEach(car => {
      console.log(`car`, car);
      parking.push(car);
    })
  });
}

// Отображение старых автомобилей на вкладке "Старые"
function displayOldCars() {
  $('#oldCarsContainer').empty();
  oldCars.forEach(car => {
    const carHTML = getCarHTML(car);
    $('#oldCarsContainer').append(carHTML);
  });
}

function displayNewCars() {
  $('#newCarsContainer').empty();  // Очищаем контейнер для новых книг

  newCars.forEach(car => {
    const carHTML = getCarHTML(car);
    $('#newCarsContainer').append(carHTML);  // Выводим все новые книги заново
  });
}



function openTab(tabName) {
  $('.tabcontent').hide();  // Скрываем все вкладки
  $('#' + tabName).show();  // Отображаем выбранную вкладку

  // При переключении на вкладку "Старые" отображаем старые автомобили
  if (tabName === 'newCars') {
    displayNewCars();
  } else if (tabName === 'oldCars') {
    displayOldCars();
  } else if (tabName == 'groupByLicense') {
    groupByLicense();
  }
  // При переключении на вкладку "По дате" отображаем группировку по дате
  if (tabName === 'groupbyDate') {
    groupByDate();
  }

  // При переключении на вкладку "По ФИО" отображаем группировку по ФИО
  if (tabName === 'groupbyOwner') {
    groupByOwnerName();
  }
}

$('.tablink').click(function() {
  var tabName = $(this).attr('data-tab');
  openTab(tabName);
});



$(document).ready(function() {
  $('#add').show();
  loadOldCars();
  console.log('Количество старых автомобилей:', oldCars.length);
});

function groupByLicense() {
  // Создаем объект для группировки по госномеру
  var groupedByLicense = {};

  // Проходим по каждой машине в массиве parking
  parking.forEach(car => {
    // Получаем все госномера для текущей машины
    var licensePlates = car.licensePlate;

    // Если госномеров несколько (массив), проходим по каждому госномеру
    if (Array.isArray(licensePlates)) {
      licensePlates.forEach(licensePlate => {
        // Добавляем машину в соответствующую группу по госномеру
        if (!groupedByLicense[licensePlate]) {
          groupedByLicense[licensePlate] = [];
        }
        groupedByLicense[licensePlate].push(car);
      });
    } else {
      // Если госномер один (не массив)
      if (!groupedByLicense[licensePlates]) {
        groupedByLicense[licensePlates] = [];
      }
      groupedByLicense[licensePlates].push(car);
    }
  });

  // Очищаем контейнер для результатов группировки
  var groupByLicenseContainer = $('#groupByLicenseContainer');
  groupByLicenseContainer.empty();

  // Выводим результаты группировки по госномеру
  Object.keys(groupedByLicense).forEach(licensePlate => {
    var cars = groupedByLicense[licensePlate];

    // Создаем блок для группы машин с одним госномером
    var groupHtml = '<div class="group-container">' +
        '<h3>Госномер(а): ' + licensePlate + '</h3>';

    // Добавляем информацию о каждой машине в группу
    cars.forEach(car => {
      groupHtml += '<div class="car-container">' +
          '<strong>Номер парковочного места:</strong> ' + car.parkingSpot +
          '<br>' +
          '<strong>Дата стоянки:</strong> ' +
          (car.parkingDate || 'Не стоят на стоянке') + '<br>' +
          '<strong>ФИО владельца:</strong> ' + car.ownerName + '</div>';
    });

    // Закрываем блок для группы машин с одним госномером
    groupHtml += '</div>';

    // Добавляем группу в контейнер
    groupByLicenseContainer.append(groupHtml);
  });
}

function groupByDate() {
  // Создаем объект для группировки по дате
  var groupedByDate = {};

  // Проходим по каждой машине в массиве parking
  parking.forEach(car => {
    var parkingDate = car.parkingDate;

    // Определяем категорию для группировки (по дате)
    var category = parkingDate ? parkingDate : 'Не стоят на стоянке';

    // Добавляем машину в соответствующую группу по дате
    if (!groupedByDate[category]) {
      groupedByDate[category] = [];
    }
    groupedByDate[category].push(car);
  });

  // Очищаем контейнер для результатов группировки по дате
  var groupByDateContainer = $('#groupByDateContainer');
  groupByDateContainer.empty();

  // Выводим результаты группировки по дате
  Object.keys(groupedByDate).forEach(category => {
    var cars = groupedByDate[category];

    // Создаем блок для группы машин по дате
    var groupHtml = '<div class="group-container">' +
        '<h3>Дата стоянки: ' + category + '</h3>';

    // Добавляем информацию о каждой машине в группу
    cars.forEach(car => {
      groupHtml += '<div class="car-container">' +
          '<strong>Госномер:</strong> ' + car.licensePlate + '<br>' +
          '<strong>Номер парковочного места:</strong> ' + car.parkingSpot +
          '<br>' +
          '<strong>ФИО владельца:</strong> ' + car.ownerName + '</div>';
    });

    // Закрываем блок для группы машин по дате
    groupHtml += '</div>';

    // Добавляем группу в контейнер
    groupByDateContainer.append(groupHtml);
  });
}

function groupByOwnerName() {
  // Создаем объект для группировки по ФИО владельца
  var groupedByOwnerName = {};

  // Проходим по каждой машине в массиве parking
  parking.forEach(car => {
    var ownerName = car.ownerName;

    // Определяем категорию для группировки (по ФИО владельца)
    var category = ownerName ? ownerName : 'Не указано ФИО';

    // Добавляем машину в соответствующую группу по ФИО владельца
    if (!groupedByOwnerName[category]) {
      groupedByOwnerName[category] = [];
    }
    groupedByOwnerName[category].push(car);
  });

  // Очищаем контейнер для результатов группировки по ФИО владельца
  var groupByOwnerContainer = $('#groupByOwnerContainer');
  groupByOwnerContainer.empty();

  // Выводим результаты группировки по ФИО владельца
  Object.keys(groupedByOwnerName).forEach(category => {
    var cars = groupedByOwnerName[category];

    // Создаем блок для группы машин по ФИО владельца
    var groupHtml = '<div class="group-container">' +
        '<h3>ФИО владельца: ' + category + '</h3>';

    // Добавляем информацию о каждой машине в группу
    cars.forEach(car => {
      groupHtml += '<div class="car-container">' +
          '<strong>Госномер:</strong> ' + car.licensePlate + '<br>' +
          '<strong>Номер парковочного места:</strong> ' + car.parkingSpot +
          '<br>' +
          '<strong>Дата стоянки:</strong> ' +
          (car.parkingDate || 'Не стоят на стоянке') + '</div>';
    });

    // Закрываем блок для группы машин по ФИО владельца
    groupHtml += '</div>';

    // Добавляем группу в контейнер
    groupByOwnerContainer.append(groupHtml);
  });
}
