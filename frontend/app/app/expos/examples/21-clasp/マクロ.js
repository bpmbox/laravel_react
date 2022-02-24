


function myFunction1() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E5').activate();
  spreadsheet.getCurrentCell().setValue('fgfgf');
  spreadsheet.getRange('F5').activate();
  spreadsheet.getCurrentCell().setValue('gfgfgfgfg');
  spreadsheet.getRange('G6').activate();
};

function myFunction2() {
  console.log("macro,s myFunnc2")
  var spreadsheet = SpreadsheetApp.getActive();
  //spreadsheet.getRange('E5').activate();
  return spreadsheet.getRange('A1').getValue()
  //spreadsheet.getCurrentCell().setValue('sssss');
  //spreadsheet.getRange('F5').activate();
  //spreadsheet.getCurrentCell().setValue('sssss');
};

function myFunction4() {
  console.log("macro,s myFunnc2")
  var spreadsheet = SpreadsheetApp.getActive();
  //spreadsheet.getRange('E5').activate();
  return spreadsheet.getRange('A4').getValue()
  //spreadsheet.getCurrentCell().setValue('sssss');
  //spreadsheet.getRange('F5').activate();
  //spreadsheet.getCurrentCell().setValue('sssss');
};


function myFunction3() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('D16').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Copy of EC'), true);
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Copy of 撮影関連'), true);
};