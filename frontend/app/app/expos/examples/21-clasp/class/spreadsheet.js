function testINPUTCELL() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var doc = doc.getActiveSheet();
  //doc.clear();
  var cell = doc.getRange("a1").setValue(3333333333333333);

  var sheet = SpreadsheetApp.openById("1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI").getSheetByName('LOG');
  //  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('LOG');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  sheet.getActiveCell().setValue('選択セルに値をセット');

  sheet.getActiveSelection().setValue('複数セルに値セット');

  sheet.getRange('A5').setValue('A5に値をセット').setBackgroundColor('#eee');

  sheet.getRange(sheet.getLastRow() + 1, sheet.getLastColumn()).
  setValue('最終列の最終行+1に値をセット');

}


// 特定のシートのメモ化を行う関数
//var getMainSheet = "";
function getMainSheet() {
  //if (getMainSheet.memoSheet) {
  //  return getMainSheet.memoSheet;
  //}

  getMainSheet.memoSheet = SpreadsheetApp.getActive().getSheetByName('メインシート');

  //getMainSheet.memoSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return getMainSheet.memoSheet;
}

// 最初に呼ばれる関数
function firstCalledFunc() {
  var sheet = getMainSheet(); //APIを叩いてシートを取得

  // some code ....
}

// 次に呼ばれる関数
function secondCalledFunc() {
  var sheet = getMainSheet(); //メモ化されたシートを返す

  // some code ....
}

function setup() {
  var dp = PropertiesService.getDocumentProperties();
  dp.setProperty('AAA', 'HOGE');
  dp.setProperty('BBB', 'FUGA');
  var userProperties = PropertiesService.getUserProperties();
  var units = userProperties.getProperty('DISPLAY_UNITS');
  //alert(units);
  units = 'imperial'; // Only changes local value, not stored value.
  userProperties.setProperty('DISPLAY_UNITS', units); // Updates stored value.
}

function dump() {
  var dp = PropertiesService.getDocumentProperties();
  var keyA = dp.getProperty('AAA');
  var keyB = dp.getProperty('BBB');
  var keyC = dp.getProperty('CCC');

  Logger.log('AAA : ' + keyA);
  Logger.log('BBB : ' + keyB);
  Logger.log('CCC : ' + keyC);
}



/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testWrittoTOSheet() {
  WrittoTOSheet("iJBeBNL8Cxm5YGKu", "PMT_BPMS", "Sheet16");
  var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  return cell.getValue();
}


/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function textNext3() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();

  sh.getRange(2, 3).activate();
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testNext2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();
  var range = sh.getActiveRange();
  var value = range.getA1Notation();
  var col = value.replace(/[0-9]/g, "");
  var last_row = sh.getRange(col + ":" + col).getValues().filter(String).length;
  sh.getRange(col + (last_row + 1)).activate();

}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testSP() {
  var selection = SpreadsheetApp.getSelection();
  var currentCell = selection.getCurrentCell();
  Logger.log(currentCell.getA1Notation());

  // var selection = SpreadsheetApp.getSelection();
  // Current cell: B2
  var currentCell = selection.getCurrentCell();

  // Active range: B2:C4
  var activeRange = selection.getActiveRange();
  Logger.log(activeRange.getA1Notation());
  G = activeRange.getLastColumn()
  Logger.log(G)
    // Active range list: [D4, B2:C4]
  var activeRangeList = selection.getActiveRangeList();


  // Logger.log(activeRangeList.getA1Notation());

  //W = selection.getHeight()
  //

}

/**
 * Returns the value in the active cell.
 *
 * @return {String} The value of the active cell.
 */
function getActiveValue() {
  // Retrieve and return the information requested by the sidebar.
  var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  return cell.getValue();
}

/**
 * Replaces the active cell value with the given value.
 *
 * @param {Number} value A reference number to replace with.
 */
function setActiveValue(value) {
  // Use data collected from sidebar to manipulate the sheet.
  var sheet = getMainSheet();
  sheet.appendRow([value, "あとはなんだろうねー", "ベロ"]);
  var cell = sheet.getActiveCell();
  //var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  cell.setValue(value);
  //sample_activate_right_cell()
}

function setActiveValue2(value) {
  // Use data collected from sidebar to manipulate the sheet.
  //  var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  var sheet = getMainSheet();
  var cell = sheet.getActiveCell();
  //var cell = SpreadsheetApp.getActiveSheet().getActiveCell();

  cell.setValue(value);
  sample_activate_right_cell()
}


/**
 * Executes the specified action (create a new sheet, copy the active sheet, or
 * clear the current sheet).
 *
 * @param {String} action An identifier for the action to take.
 */
function modifySheets(action) {
  // Use data collected from dialog to manipulate the spreadsheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var currentSheet = ss.getActiveSheet();
  if (action == "create") {
    ss.insertSheet();
  }
  else if (action == "copy") {
    currentSheet.copyTo(ss);
  }
  else if (action == "clear") {
    currentSheet.clear();
  }
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
//セルの隣のデータを取得
function getNextCellData() {
  var bk = SpreadsheetApp.getActiveSpreadsheet();
  var sh = bk.getActiveSheet();
  var rng = sh.getActiveCell();
  myFunction2();
  var c = rng.offset(0, 1).getValue();
  //rng.offset(0, 2).setValue('getNextCellDeta');
  //rng.offset(0, 2).setValue('getNextCellDeta');
  
  rng.offset(1, 0).activate();
  return c


}
/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function append() {

  $data = ["a man", "a plan", "panama"];
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("all").appendRow(rowContents);
  // var first = ss.getSheetByName("first");

}

function onEdit(e) {
  var sh = SpreadsheetApp.getActiveSheet();
  Logger.log(JSON.stringify(e))
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var answerSheet = spreadSheet.getSheetByName('回答');
    // 変更行
 
  var row = e.range.getRow();
 // var test = Browser.msgBox("row"+row, Browser.Buttons.OK_CANCEL);
 //   Browser.msgBox(test);
  // 変更列
  var col = e.range.getColumn();
  //var test = Browser.msgBox("col"+col, Browser.Buttons.OK_CANCEL);
 //   Browser.msgBox(test);
  // 変更行数 いみをかく　やっぱ、ここらへんはフローで書きたい
  var num = e.range.getValues().length-1;
   // var test = Browser.msgBox("num"+num, Browser.Buttons.OK_CANCEL);
  //  Browser.msgBox(test);
  // 最終行
  var lr = sh.getLastRow();
   //   var test = Browser.msgBox("lr"+lr, Browser.Buttons.OK_CANCEL);
  //  Browser.msgBox(test);
  // 最大行
  var mr = sh.getMaxRows();
  
   //  var test = Browser.msgBox("mr"+mr, Browser.Buttons.OK_CANCEL);
  //  Browser.msgBox(test);
  
  // 行挿入or削除
  if (row > 2) {
    // 行挿入or最終行追加
    if (!sh.getRange(row,5).getFormula()) {
     // sh.getRange(3,5,mr-2,1).setFormula('=R[-1]C+RC[-2]-RC[-1]');
      // 最大行追加なら罫線
     // sh.getRange(lr+1,1,num+1,5).setBorder(true,true,true,true,true,true);
    // 行削除
    } else if (sh.getRange(row,5).getValue() === "#REF!") {
     // sh.getRange(3,5,mr-2,1).setFormula('=R[-1]C+RC[-2]-RC[-1]');
    }
  }
  
  answerSheet.getRange('B1').setValue('Last modsssssssssssssssssssssified: ' + new Date());
  
    var email = 'miyataken999@gmail.com';
  var subject = 'OnChange フォームが送信されました';
  var body = 'こんにちは。\n'+JSON.stringify(event);
  sht= "在庫管理表"
  createCase("4927727605d5aa3756f48d5066347332", "6259085535d5aa43e67d9e5021399520", sht);
  
 // body += 'Googleフォームの「' + e.source.getTitle()　+ '」に回答が送信されました。\n\n';
 // var itemResponses = e.response.getItemResponses();
 /* itemResponses.forEach(function(itemResponse){
    body += '【' + itemResponse.getItem().getTitle() + '】\n'
    body += itemResponse.getResponse() + '\n\n'
  });*/
  GmailApp.sendEmail(email, subject, body);
  
}

function onChange(event) {
  
   var email = 'miyataken999@gmail.com';
  var subject = 'OnChange フォームが送信されました';
  var body = 'こんにちは。\n'+JSON.stringify(event);
  sht= "在庫管理表"
  createCase("4927727605d5aa3756f48d5066347332", "6259085535d5aa43e67d9e5021399520", sht);
  
 // body += 'Googleフォームの「' + e.source.getTitle()　+ '」に回答が送信されました。\n\n';
 // var itemResponses = e.response.getItemResponses();
 /* itemResponses.forEach(function(itemResponse){
    body += '【' + itemResponse.getItem().getTitle() + '】\n'
    body += itemResponse.getResponse() + '\n\n'
  });*/
  GmailApp.sendEmail(email, subject, body);
  
  
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var answerSheet = spreadSheet.getSheetByName('回答');

  answerSheet.getRange('B5').setValue('Last ssssssssss modified: ' + new Date());
}

//var sh = SpreadsheetApp.getActiveSheet();
/*
function onEdit(e) {
var sh = SpreadsheetApp.getActiveSheet();
// 変更行
var row = e.range.getRow();
Logger.log(row)
// 変更列
var col = e.range.getColumn();
Logger.log(col)

// 変更行数
var num = e.range.getValues().length-1;
Logger.log(e.range.getValues())
// 最終行
var lr = sh.getLastRow();
// 最大行
var mr = sh.getMaxRows();
// 行挿入or削除
//////////////////////////////////////
if (row > 2) {
// 行挿入or最終行追加
if (!sh.getRange(row,5).getFormula()) {
sh.getRange(3,5,mr-2,1).setFormula('=R[-1]C+RC[-2]-RC[-1]');
// 最大行追加なら罫線
sh.getRange(lr+1,1,num+1,5).setBorder(true,true,true,true,true,true);
// 行削除
} else if (sh.getRange(row,5).getValue() === "#REF!") {
sh.getRange(3,5,mr-2,1).setFormula('=R[-1]C+RC[-2]-RC[-1]');
}
}
/////////////////////////////////
}
*/

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function setNextRange() {
  var range = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange('C1:D4');
  SpreadsheetApp.setActiveRange(range);
}
//http://www.relief.jp/docs/google-spreadsheet-gas-offset.html
function sample_activate_right_cell() {
  var bk = SpreadsheetApp.getActiveSpreadsheet();
  var sh = bk.getActiveSheet();
  var rng = sh.getActiveCell();

  // show the row & column number of the active cell
  //　Browser.msgBox(rng.getRow());
  //　Browser.msgBox(rng.getColumn());

  //  var cell = {0:1}

  // x = rng.getColumn()
  y = rng.getRow()
    // W = rng.getWidth()
    // N = rng.getA1Notation()
    //Logger.log(N)

  // Logger.log(W)
  // activate the right cell

  var selection = SpreadsheetApp.getSelection();
  // var currentCell = selection.getCurrentCell();
  // Logger.log(currentCell.getA1Notation());

  // var selection = SpreadsheetApp.getSelection();
  // Current cell: B2
  // var currentCell = selection.getCurrentCell();

  // Active range: B2:C4
  var activeRange = selection.getActiveRange();
  //  Logger.log(activeRange.getA1Notation());
  G = activeRange.getLastColumn()
    //Logger.log(G)
    // Active range list: [D4, B2:C4]
    //var activeRangeList = selection.getActiveRangeList();

  sh.getRange(y, G + 1).activate();
  //　rng.offset(0, 1).activate();

}
