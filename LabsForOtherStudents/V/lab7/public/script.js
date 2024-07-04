let parking = [];
let oldCars = [];

function addCar() {
  const licensePlate = $('#licensePlate').val().split(',').map(license => license.trim());
  const parkingSpot = $('#parkingSpot').val();
  const parkingDate = $('#parkingDate').val();
  const ownerName = $('#ownerName').val();

  if (licensePlate.length === 0 || ownerName.trim() === '') {
    alert('Пожалуйста, заполните госномер и ФИО владельца.');
    return;
  }

  if ((parkingSpot !== '' && parkingDate.trim() === '') || (parkingSpot === '' && parkingDate.trim() !== '')) {
    alert('Пожалуйста, укажите дату стоянки.');
    return;
  }

  const car = {
    licensePlate: licensePlate,
    parkingSpot: parkingSpot,
    parkingDate: parkingDate,
    ownerName: ownerName
  };

  $.ajax({
    url: '/api/cars',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(car),
    success: function() {
      loadCars();
    },
    error: function(error) {
      console.error('Error adding car:', error);
    }
  });

  $('#licensePlate, #parkingSpot, #parkingDate, #ownerName').val('');
}

function getCarHTML(car) {
  let infoHTML = `<p><strong>Госномер:</strong> ${car.licensePlate.join(', ')}</p>
                  <p><strong>Номер парковочного места:</strong> ${car.parkingSpot}</p>
                  <p><strong>Дата стоянки:</strong> ${car.parkingDate}</p>
                  <p><strong>ФИО владельца:</strong> ${car.ownerName}</p>`;

  return `<div class="car">${infoHTML}</div>`;
}

// function loadOldCars() {
//   $.ajax({
//     url: '/api/oldCars',
//     type: 'GET',
//     success: function(data) {
//       oldCars = data;
//       oldCars.forEach(car => {
//         parking.push(car);
//       });
//       displayOldCars();
//     },
//     error: function(error) {
//       console.error('Error loading old cars:', error);
//     }
//   });
// }

function loadCars() {
  $.ajax({
    url: '/api/cars',
    type: 'GET',
    success: function(data) {
      parking = data;
      displayNewCars();
      displayOldCars();
    },
    error: function(error) {
      console.error('Error loading cars:', error);
    }
  });
}

function displayOldCars() {
    $.ajax({
      url: '/api/cars',
      type: 'GET',
      success: function(cars) {
        $('#oldCarsContainer').empty();
        const reversedCars = cars.reverse();
        reversedCars.forEach(car => {
          const carHTML = getCarHTML(car);
          $('#oldCarsContainer').append(carHTML);
        });
      },
      error: function(error) {
        console.error('Error fetching old car:', error);
      }
    });
  }
  
  function displayNewCars() {
    $.ajax({
      url: '/api/cars',
      type: 'GET',
      success: function(cars) {
        $('#newCarsContainer').empty();
        cars.forEach(car => {
          const carHTML = getCarHTML(car);
          $('#newCarsContainer').append(carHTML);
        });
      },
      error: function(error) {
        console.error('Error fetching new car:', error);
      }
    });
  }
  

function openTab(tabName) {
  $('.tabcontent').hide();
  $('#' + tabName).show();

  if (tabName === 'newCars') {
    displayNewCars();
  } else if (tabName === 'oldCars') {
    displayOldCars();
  } else if (tabName == 'groupByLicense') {
    groupByLicense();
  }

  if (tabName === 'groupbyDate') {
    groupByDate();
  }

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
  // loadOldCars();
});

function groupByLicense() {
  $.ajax({
    url: '/api/cars',
    type: 'GET',
    success: function(cars) {
      var groupedByLicense = {};

      cars.forEach(car => {
        var licensePlates = car.licensePlate;

        if (Array.isArray(licensePlates)) {
          licensePlates.forEach(licensePlate => {
            if (!groupedByLicense[licensePlate]) {
              groupedByLicense[licensePlate] = [];
            }
            groupedByLicense[licensePlate].push(car);
          });
        } else {
          if (!groupedByLicense[licensePlates]) {
            groupedByLicense[licensePlates] = [];
          }
          groupedByLicense[licensePlates].push(car);
        }
      });

      var groupByLicenseContainer = $('#groupByLicenseContainer');
      groupByLicenseContainer.empty();

      Object.keys(groupedByLicense).forEach(licensePlate => {
        var cars = groupedByLicense[licensePlate];

        var groupHtml = '<div class="group-container">' +
            '<h3>Госномер(а): ' + licensePlate + '</h3>';

        cars.forEach(car => {
          groupHtml += '<div class="car-container">' +
              '<strong>Номер парковочного места:</strong> ' + car.parkingSpot + '<br>' +
              '<strong>Дата стоянки:</strong> ' + (car.parkingDate || 'Не стоят на стоянке') + '<br>' +
              '<strong>ФИО владельца:</strong> ' + car.ownerName + '</div>';
        });

        groupHtml += '</div>';

        groupByLicenseContainer.append(groupHtml);
      });
    },
    error: function(error) {
      console.error('Error grouping cars by license:', error);
    }
  });
}

function groupByDate() {
  $.ajax({
    url: '/api/cars',
    type: 'GET',
    success: function(cars) {
      var groupedByDate = {};

      cars.forEach(car => {
        var parkingDate = car.parkingDate;

        var category = parkingDate ? parkingDate : 'Не стоят на стоянке';

        if (!groupedByDate[category]) {
          groupedByDate[category] = [];
        }
        groupedByDate[category].push(car);
      });

      var groupByDateContainer = $('#groupByDateContainer');
      groupByDateContainer.empty();

      Object.keys(groupedByDate).forEach(category => {
        var cars = groupedByDate[category];

        var groupHtml = '<div class="group-container">' +
            '<h3>Дата стоянки: ' + category + '</h3>';

        cars.forEach(car => {
          groupHtml += '<div class="car-container">' +
              '<strong>Госномер:</strong> ' + car.licensePlate + '<br>' +
              '<strong>Номер парковочного места:</strong> ' + car.parkingSpot + '<br>' +
              '<strong>ФИО владельца:</strong> ' + car.ownerName + '</div>';
        });

        groupHtml += '</div>';

        groupByDateContainer.append(groupHtml);
      });
    },
    error: function(error) {
      console.error('Error grouping cars by date:', error);
    }
  });
}

function groupByOwnerName() {
  $.ajax({
    url: '/api/cars',
    type: 'GET',
    success: function(cars) {
      var groupedByOwnerName = {};

      cars.forEach(car => {
        var ownerName = car.ownerName;

        var category = ownerName ? ownerName : 'Не указано ФИО';

        if (!groupedByOwnerName[category]) {
          groupedByOwnerName[category] = [];
        }
        groupedByOwnerName[category].push(car);
      });

      var groupByOwnerContainer = $('#groupByOwnerContainer');
      groupByOwnerContainer.empty();

      Object.keys(groupedByOwnerName).forEach(category => {
        var cars = groupedByOwnerName[category];

        var groupHtml = '<div class="group-container">' +
            '<h3>ФИО владельца: ' + category + '</h3>';

        cars.forEach(car => {
          groupHtml += '<div class="car-container">' +
              '<strong>Госномер:</strong> ' + car.licensePlate + '<br>' +
              '<strong>Номер парковочного места:</strong> ' + car.parkingSpot + '<br>' +
              '<strong>Дата стоянки:</strong> ' + (car.parkingDate || 'Не стоят на стоянке') + '</div>';
        });

        groupHtml += '</div>';

        groupByOwnerContainer.append(groupHtml);
      });
    },
    error: function(error) {
      console.error('Error grouping cars by owner name:', error);
    }
  });
}
