function UntitledMacro() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E19').activate();
  spreadsheet.getCurrentCell().setValue('23');
  spreadsheet.getCurrentCell().getValue();
  spreadsheet.getRange('E18').activate();
};

function UntitledMacro1() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E5').activate();
  spreadsheet.getRange('E4').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  spreadsheet.getRange('E6').activate();
  spreadsheet.getRange('E4').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
};

function UntitledMacro2() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('A2').activate();
};

function UntitledMacro3(aaaa) {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('I7').activate();
  spreadsheet.getCurrentCell().setValue(aaaa);
};

function UntitledMacro31(aaaa) {
  var spreadsheet = SpreadsheetApp.getActive();
  //spreadsheet.getRange('I7').activate();
  return spreadsheet.getCurrentCell().getValue()
};

function UntitledMacro44() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('H10').activate();
  spreadsheet.getRange('G10').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  spreadsheet.getRange('G11').activate();
  spreadsheet.getCurrentCell().setValue('12022');
  spreadsheet.getRange('H11').activate();
  spreadsheet.getCurrentCell().setValue('900022');
  spreadsheet.getRange('H12').activate();
};

function UntitledMacro55() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('G8').activate();
  spreadsheet.getRange('G7').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
};