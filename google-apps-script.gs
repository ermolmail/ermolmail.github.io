// Вставьте этот код в Google Таблицу: Расширения → Apps Script.
// Затем: Развернуть → Новое развертывание → Веб-приложение →
// «Выполнять от имени: Я», «Доступ: Все» → скопировать URL в index.html (RSVP_URL).
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Ответы') || ss.insertSheet('Ответы');
  if (sheet.getLastRow() === 0) sheet.appendRow(['Время', 'Имя', 'Ответ', 'Гостей', 'Комментарий']);
  const p = e.parameter;
  sheet.appendRow([new Date(), p.name, p.answer, p.guests, p.comment]);
  return ContentService.createTextOutput('ok');
}
