/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('html/Sidebar')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function html() {
  var ui = HtmlService.createTemplateFromFile('html/html')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function react() {
  var ui = HtmlService.createTemplateFromFile('html/react')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}


function showBPMS() {
  var ui = HtmlService.createTemplateFromFile('html/BPMS')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function vue() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('html/vue')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function script() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('html/script')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function camera() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('public/html/camera')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function spreact() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('src/index')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function ckeditor() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('html/camera')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function dhtmlx() {
  
  // ここでHTML側に渡す値を登録している
  //htmlTemplate.messageFromGAS = "Hello GAS World!";
  var ui = HtmlService.createTemplateFromFile('html/dhtmlx')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//    ui.messageFromGAS = "Hello GAS World!";
  SpreadsheetApp.getUi().showSidebar(ui);
}

function chat() {
  var ui = HtmlService.createTemplateFromFile('html/chat')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function camera() {
  var ui = HtmlService.createTemplateFromFile('public/html/camera')
    .evaluate()
    .setTitle(SIDEBAR_TITLE)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * Opens a dialog. The dialog structure is described in the Dialog.html
 * project file.
 */
function showDialog() {
  var ui = HtmlService.createTemplateFromFile('Dialog')
    .evaluate()
    .setWidth(400)
    .setHeight(190)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(ui, DIALOG_TITLE);
}
