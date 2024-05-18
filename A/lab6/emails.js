let mails = [];
let oldMails = [];

function addMail() {
  let receiveDate = $('#receiveDate').val();
  let sender = $('#sender').val();
  let type = $('#type').val();
  let summary = $('#summary').val();
  let recipients = $('#recipients').val().split(',').map(r => r.trim());

  const mail = {
    receiveDate: receiveDate,
    sender: sender,
    type: type,
    summary: summary,
    recipients: recipients
  };

  mails.unshift(mail);

  $('#receiveDate, #sender, #type, #summary, #recipients').val('');
}

function getMailHTML(mail) {
  return `<div class="mail">
            <p><strong>Дата получения:</strong> ${mail.receiveDate}</p>
            <p><strong>Организация отправитель:</strong> ${mail.sender}</p>
            <p><strong>Тип:</strong> ${mail.type}</p>
            <p><strong>Краткое содержание:</strong> ${mail.summary}</p>
            <p><strong>Адресаты:</strong> ${mail.recipients.join(', ')}</p>
          </div>`;
}

function loadOldMails() {
  $.getJSON('mails.json', function(data) {
    oldMails = data;
    oldMails.forEach(mail => {
      mails.push(mail);
    });
    displayOldMails();
  });
}

function displayOldMails() {
  $('#oldMailsContainer').empty();
  const reversedMails = [...mails].reverse();
  reversedMails.forEach(mail => {
    const mailHTML = getMailHTML(mail);
    $('#oldMailsContainer').append(mailHTML);
  });
}

function displayNewMails() {
  $('#newMailsContainer').empty();
  mails.forEach(mail => {
    const mailHTML = getMailHTML(mail);
    $('#newMailsContainer').append(mailHTML);
  });
}

function groupByRecipient() {
  let groupedByRecipient = {};
  mails.forEach(mail => {
    mail.recipients.forEach(recipient => {
      if (!groupedByRecipient[recipient]) {
        groupedByRecipient[recipient] = [];
      }
      groupedByRecipient[recipient].push(mail);
    });
  });

  let groupByRecipientContainer = $('#groupByRecipientContainer');
  groupByRecipientContainer.empty();
  Object.keys(groupedByRecipient).forEach(recipient => {
    let mails = groupedByRecipient[recipient];
    let groupHtml = `<div class="group-container">
                      <h3>Адресат: ${recipient}</h3>`;
    mails.forEach(mail => {
      groupHtml += getMailHTML(mail);
    });
    groupHtml += '</div>';
    groupByRecipientContainer.append(groupHtml);
  });
}

function groupByDate() {
  let groupedByDate = {};
  mails.forEach(mail => {
    let date = mail.receiveDate || 'Дата не указана';
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(mail);
  });

  let groupByDateContainer = $('#groupByDateContainer');
  groupByDateContainer.empty();
  Object.keys(groupedByDate).forEach(date => {
    let mails = groupedByDate[date];
    let groupHtml = `<div class="group-container">
                      <h3>Дата получения: ${date}</h3>`;
    mails.forEach(mail => {
      groupHtml += getMailHTML(mail);
    });
    groupHtml += '</div>';
    groupByDateContainer.append(groupHtml);
  });
}

function groupBySender() {
  let groupedBySender = {};
  mails.forEach(mail => {
    let sender = mail.sender || 'Организация не указана';
    if (!groupedBySender[sender]) {
      groupedBySender[sender] = [];
    }
    groupedBySender[sender].push(mail);
  });

  let groupBySenderContainer = $('#groupBySenderContainer');
  groupBySenderContainer.empty();
  Object.keys(groupedBySender).forEach(sender => {
    let mails = groupedBySender[sender];
    let groupHtml = `<div class="group-container">
                      <h3>Организация отправитель: ${sender}</h3>`;
    mails.forEach(mail => {
      groupHtml += getMailHTML(mail);
    });
    groupHtml += '</div>';
    groupBySenderContainer.append(groupHtml);
  });
}

function openTab(tabName) {
  $('.tabcontent').hide();
  $('#' + tabName).show();

  if (tabName === 'newMails') {
    displayNewMails();
  } else if (tabName === 'oldMails') {
    displayOldMails();
  } else if (tabName === 'groupByRecipient') {
    groupByRecipient();
  } else if (tabName === 'groupByDate') {
    groupByDate();
  } else if (tabName === 'groupBySender') {
    groupBySender();
  }
}

$('.tablink').click(function() {
  var tabName = $(this).attr('data-tab');
  openTab(tabName);
});

$(document).ready(function() {
  $('#add').show();
  loadOldMails();
});
