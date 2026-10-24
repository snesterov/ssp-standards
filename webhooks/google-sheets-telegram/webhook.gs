/**
 * УНИВЕРСАЛЬНЫЙ ВЕБХУК ДЛЯ ЛЮБОГО САЙТА (SSP-AGENCY)
 * 1. Записывает лид в Google Таблицу (вечная бесплатная CRM)
 * 2. Моментально отправляет форматированное уведомление в Telegram
 * 3. Не засыпает, не требует хостинга, работает 24/7/365 бесплатно
 */

const TELEGRAM_BOT_TOKEN = "ВАШ_ТОКЕН_БОТА";
const TELEGRAM_CHAT_ID = "ВАШ_CHAT_ID";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const date = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    const name = data.name || "Не указано";
    const phone = data.phone || "Не указан";
    const method = data.method || "Телефон";
    const comment = data.comment || "";
    const utm = data.utm || "";
    const source = data.source || "Сайт";

    // 1. Запись в Google Таблицу
    sheet.appendRow([date, name, phone, method, comment, utm, source]);

    // 2. Отправка в Telegram
    const text = "🔥 *НОВАЯ ЗАЯВКА С САЙТА!*\n\n" +
      "👤 *Имя:* " + name + "\n" +
      "📞 *Телефон:* " + phone + "\n" +
      "💬 *Канал связи:* " + method + "\n" +
      "📝 *Комментарий:* " + comment + "\n" +
      "📊 *UTM:* " + utm + "\n" +
      "⏰ *Время (МСК):* " + date;

    sendTelegram(text);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegram(text) {
  const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "Markdown"
  };
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
