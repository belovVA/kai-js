// Отдельный массив с номиналами карт
const cardRanks =
    ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const cardValuesBySuit = {
  heart: cardRanks.slice(),
  diamond: cardRanks.slice(),
  club: cardRanks.slice(),
  spade: cardRanks.slice()
};

let selectedCards = [];  // Массив для хранения выбранных карт в формате
                         // [[масть, номинал], [масть, номинал], ...]

function loadRanks() {
  const selectedSuit = document.getElementById('suits').value;
  const ranksDropdown = document.getElementById('ranks');

  // Очистить предыдущие опции
  ranksDropdown.innerHTML = '';

  if (selectedSuit) {
    const ranks = cardValuesBySuit[selectedSuit];

    // Добавить новые опции на основе выбранной масти
    ranks.forEach(rank => {
      const option = document.createElement('option');
      option.value = rank;
      option.textContent = rank;
      ranksDropdown.appendChild(option);
    });

    // Сделать второй список доступным
    ranksDropdown.disabled = false;
  } else {
    // Если масть не выбрана, показать сообщение
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Сначала выберите масть';
    ranksDropdown.appendChild(defaultOption);

    // Сделать второй список недоступным
    ranksDropdown.disabled = true;
  }
}

function addCard() {
  if (selectedCards.length >= 5) {
    alert('You already have 5 cards!');
    return;
  }

  const selectedSuit = document.getElementById('suits').value;
  const selectedRank = document.getElementById('ranks').value;

  if (!selectedSuit || !selectedRank) {
    alert('Выбери номинал и масть карты ');

    return;
  }

  // Добавление выбранной карты в массив выбранных карт
  selectedCards.push([selectedSuit, selectedRank]);

  // Создание элемента карты и добавление его в контейнер
  const cardContainer = document.getElementById('cardContainer');
  const cardImage = document.createElement('img');
  cardImage.src = `./cards/40px-Playing_card_${selectedSuit}_${
      selectedRank}.svg.png`;  // Формирование пути к изображению
  cardImage.style.width = '100px';  // Установка ширины изображения
  cardImage.style.height = '150px';  // Установка высоты изображения
  cardImage.style.marginRight =
      '10px';  // Добавление правого отступа между изображениями
  cardContainer.appendChild(cardImage);

  // Очистка выбора в выпадающих списках
  document.getElementById('suits').value = '';
  document.getElementById('ranks').innerHTML =
      '<option value="">Выберите сначала масть</option>';
  document.getElementById('ranks').disabled = true;

  // Удаление выбранного номинала из массива значений словаря
  const index = cardValuesBySuit[selectedSuit].indexOf(selectedRank);
  if (index !== -1) {
    cardValuesBySuit[selectedSuit].splice(index, 1);
  }

  // Проверка количества добавленных карт и блокировка кнопки при достижении 5
  // карт
  if (selectedCards.length === 5) {
    document.getElementById('addCardButton').disabled = true;
    document.getElementById('suits').disabled = true;
    checkOnDobulePair();
  }
}

function checkOnDobulePair() {
    // Получаем все номиналы руки и их индексы в исходном массиве номиналов
    let ranks = selectedCards.map(card => card[1]);
    ranks.sort((a, b) => {
      return cardRanks.indexOf(a) - cardRanks.indexOf(b);
    });
    
  let rankCounts = []
    // Подсчет количества каждого номинала
  for (const rank of ranks) {
    if (rankCounts[rank]) {
      rankCounts[rank]++;
    } else {
      rankCounts[rank] = 1;
    }
  }

  // Подсчет количества пар
  let pairCount = 0;
  const messageElement = document.createElement('p');

  for (const count of Object.values(rankCounts)) {
    if (count === 2) {
      pairCount++;
    }
  }

    if (pairCount == 2) {
      // Преобразуем отсортированный массив ranks в строку с помощью метода join
      

      messageElement.textContent = `Вы собрали Две пары!`;

      const messageContainer = document.getElementById('messageContainer');
      messageContainer.innerHTML = '';  // Очищаем содержимое контейнера
      messageContainer.appendChild(
          messageElement);  // Добавляем сообщение в контейнер
    } else {
      messageElement.textContent = 'В выбранных картах нет двух пар. НЕТ ИГРЫ';

    const messageContainer = document.getElementById('messageContainer');
    messageContainer.appendChild(
        messageElement);  // Добавляем сообщение в контейнер
    throw new Error('В выбранных картах нет двух пар. НЕТ ИГРЫ');
  }
  
    
}
function resetCards() {
  // Сброс выбранных карт и очистка контейнера карт
  selectedCards = [];
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';
  // Очистка сообщения о Каре
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = '';  // Очищаем содержимое сообщения о Каре

  // Сброс выбора масти и ранга
  document.getElementById('suits').value = '';
  document.getElementById('ranks').innerHTML =
      '<option value="">Выберите сначала масть</option>';
  document.getElementById('ranks').disabled = true;

  // Разблокировка кнопки добавления карт и выбора карт из списка
  document.getElementById('suits').disabled = false;
  document.getElementById('addCardButton').disabled = false;

  // Восстановление состояния словаря с номиналами карт с использованием slice()
  cardValuesBySuit.heart = cardRanks.slice();
  cardValuesBySuit.diamond = cardRanks.slice();
  cardValuesBySuit.club = cardRanks.slice();
  cardValuesBySuit.spade = cardRanks.slice();

  // Восстановление выпадающего списка рангов на основе актуальных значений из
  // cardValuesBySuit
  const selectedSuit = document.getElementById('suits').value;
  if (selectedSuit) {
    const ranksDropdown = document.getElementById('ranks');
    ranksDropdown.innerHTML = '';  // Очищаем текущие опции

    const ranks = cardValuesBySuit[selectedSuit];
    ranks.forEach(rank => {
      const option = document.createElement('option');
      option.value = rank;
      option.textContent = rank;
      ranksDropdown.appendChild(option);
    });

    // Сделать второй список доступным
    ranksDropdown.disabled = false;
  }
}
