/**
* @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
*/

var DIALOG_TITLE = 'Dialog';
var SIDEBAR_TITLE = 'INPUT DATA';

var spreadsheetId = '1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI';
//12w3Wvhv6P4uzWY6DeegcFNCil88ZttSNSESViZJnxHA
//var chatworkToken = 'e4fe18a253ca9275067c53abc42171ea'; //TOKEのIDで応答がうる
//bpmboxes.com の方に向いている
var chatworkToken = "d136da12278ea0ba239fe879828e4fa8"
var chatworkroom = "109354026"

var myAccountId = '2354879'; //チャットワークの契約者からの送信は除外　（無限ループになる）
var debug = 1;

var lib = "";
var pw = "";// new ProcessMaker2({token: "f7"});;
var exec = "";
var ress = "";

/**
* ProcessMakerClientの作成
*
* <h3>利用例</h3>
* <pre>
* var cw = ProcessMakerClient.factory({token: xxx});
* cw.sendMessage({room_id: xx, body: xx});
* </pre>
* @param {assoc} config
*/

/**
 * HTML側から呼ばれる関数
 * アクティブシートの最終行に文字列を追加する
 */
function myFunction2() {
  SpreadsheetApp.getActiveSheet().appendRow(["Hello", "GAS", "World!"]);
}

/**
 * Spreadsheetを開いたときに自動的に呼び出される
 * 拡張メニューを追加し、独自サイドバーとダイアログを呼び出せるよう登録する
 */

/*
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("拡張メニュー")
    .addItem("サイドバーで開く", "showSidebar")
    .addItem("ダイアログで開く", "showModalDialog")
    .addToUi();
}
*/

/**
 * GASプロジェクト内にあるファイルをテンプレートとして読み込み、出力可能なhtmlを作成する
 *
 * @param {String} filename
 * @return {Object} HtmlOutput
 *
 * HtmlOutput:
 *   https://developers.google.com/apps-script/reference/html/html-output
 */
function createHtmlOutput(filename) {
  var htmlTemplate = HtmlService.createTemplateFromFile(filename);
  // htmlTemplateに関して
  //   https://developers.google.com/apps-script/reference/html/html-template

  // ここでHTML側に渡す値を登録している
  htmlTemplate.messageFromGAS = "Hello GAS World!";

  // テンプレートを元にサーバーサイド処理を行い、最終的なHtmlOutputを生成する
  // evaluate後の値は上記の"Hello GAS World!"の文字列も埋め込まれている
  return htmlTemplate.evaluate();
}

/**
 * サイドバーを開く
 */
function showSidebar() {
  // プロジェクトに保存されているファイル名の末尾 .html は不要です
  // 下記の場合 index.html が読み込みこまれ、諸々サーバーサイド処理された結果が返される
  var ui = createHtmlOutput("html/vue")
    .setTitle("サイドバー")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}

function reactNative() {
  // プロジェクトに保存されているファイル名の末尾 .html は不要です
  // 下記の場合 index.html が読み込みこまれ、諸々サーバーサイド処理された結果が返される
  var ui = createHtmlOutput("html/reactnative")
    .setTitle("サイドバー")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}

/**
 * ダイアログを開く
 */
function showModalDialog() {
  var ui = createHtmlOutput("index")
    .setWidth(320)
    .setHeight(240)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showModalDialog(ui, "ダイアログ");
}