function getFirstAnnouncement() {
  var message = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange("A1").getValue();
  return message;
}

function getSecondAnnouncement() {
  var message = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange("A2").getValue();
  return message;
}

function getThirdAnnouncement() {
  var message = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange("A3").getValue();
  return message;
}
