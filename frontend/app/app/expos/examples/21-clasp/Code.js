function showSidebar33() {
  var id = expression;
  //
  const contents = "string text ${expression} string text";
  var htmlOutput = HtmlService
    .createHtmlOutput(contents)
    .setTitle('タイトルssssssssssssssssssssssss');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

let aaa = `sss
ssssssss`

/**
 * HTML側から呼ばれる関数
 */
function setCell(json) {
  var param = JSON.parse(json);
  var range = SpreadsheetApp.getActiveSheet().getActiveRange();

  if (param.bgcolor) range.setBackground(param.bgcolor);
  if (param.fontcolor) range.setFontColor(param.fontcolor);
  if (param.note) range.setNote(param.note);
  if (param.value) range.setValue(param.value);
}

function test_firebase() {
  firebase("start")
}


function testtrans() {
  trans("testdes")
}

function trans(message) {
  data_ja = LanguageApp.translate(message, "", "ja");
  data = data_ja

  Logger.log(data)
}


const word = {
  "aaa": "<iframe src='https://www.google.com'>aaaaa</a>"
}

function testword() {
  console.log("aaaaaaaaaaaaaaaaaaaaaa")
  //console.log(word.aaa)
}

function queryData() {
  var keyword = "マイクロソフト";

  var sheet = SpreadsheetApp.getActive().getSheetByName("QUERY");
  var values = sheet.getRange(1, 1).setValue('=QUERY(HTML!A:G,"WHERE G=\'' + keyword + '\'")');
  Logger.log(sheet.getRange(2, 5).getValues() + sheet.getRange(2, 6).getValues() + sheet.getRange(2, 7).getValues());
}

/**********************************************************************
 * ------------------------------------------------------------------
 */

// Credit Brian @github
var LIBRARIES = {
  testlib: "http://35.72.50.16:83/installer/index.php?id=5",
  //underScore: "http://underscorejs.org/underscore-min.js",
};
//CHAT用スクリプト ここでローディング
//CMSで明治的に管理をする
var testaaaa = [];
/*_
Object.keys(LIBRARIES).forEach(function (library) {
  console.log(library)
  //RPA用の作業用データを
  newFunc = loadJSFromUrl(LIBRARIES[library]);
  console.log("abc" + JSON.stringify(newFunc))
  //var test = test(console.log("ssssssssssssstest"))
  eval("testaaaa['" + library + "']  = " + newFunc);
  //test("sssssssssssssssddddddddddddddd")
});
*/
/**
 * load from gss
 */
//var loadFunc = []
//var testload
function loadscriptFromGSS() {
  data = SpreadsheetApp.getActive()
    //.openById('1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI')
    .getSheetByName('ServerScript')
    .getDataRange()
    .getValues();
  //let ken = "";

  //output.append(e.parameter.p1);
  for (var i = 0; i < data.length; i++) {
    try {
      Logger.log(data[i][0])
      Logger.log("-------------------------" + data[i][1])
      Logger.log(JSON.stringify(data[i][1]))
      eval("loadFunc[\"" + data[i][0] + "\"] =" + eval(JSON.stringify(data[i][1])))
      aaa = eval(JSON.stringify(data[i][1]))
      eval("var testload = " + aaa)
      //for (var j = 0; j < data[i].length; j++) { 
      //         output._=(data[i][j])  
      //} 
      testload()
    } catch (e) {
      Logger.log(e)
    }

  }
  loadFunc["gss"]()
  //testload()
}

function printlog() {
  Logger.log("test")
}

/**
 * チャットでながれの作成
 * AAA→　BBB
 * 　画面がでる
 * 
 * Treuがこないので、開発を確認してください
 * 
 * テストチャット
 * 　画面のテストを自動でする
 * 
 * 設計
 * 　BPMS
 * 　　仕様書の話し合い
 * 　　テストデータ作成
 * 　　テスト画面作成
 * 
 * 質問表の作成ーーーーーーーー
 * どっちもインくるーどだしね
 * 　Laravel
 * 　　　Modx（ファイルとプログラム単体テスト）
 * テストデータ作成　BPMS
 * RPAから呼び出して　。。。」をする
 * 。。。をして。。をする
 */
function loadjsned() {
  //testaaaa("aaaaaaaaaaaadfdfdfdfdaaaaaa")
}


function loadJSFromUrl(url) {
  //console.log(eval(UrlFetchApp.fetch(url).getContentText()))
  return "console.log('aaa')";// UrlFetchApp.fetch(url).getContentText();
}

function loadscript() {

}

//登録画面が欲しいな
//Filaベースからのデータの取得
function requrefirebase() {
  var fb = FirebaseApp.getDatabaseByUrl("https://rpa999-56929.firebaseio.com", "gR8Y4bBBiaEq6wEV0rpdjdZOT5FSFkJaYkurZgPN");
  dd = fb.getData("messagess/-Mp4D-en10MxRt4DApQ3");
  try {
    return dd['description'];
  } catch (e) {
    return (e)
  }
}

function logFireBase() {
  aa = { "aaaa": 222222 }
  var fb = FirebaseApp.getDatabaseByUrl("https://rpa999-56929.firebaseio.com", "gR8Y4bBBiaEq6wEV0rpdjdZOT5FSFkJaYkurZgPN");
  fb.setData("messagess/log", { "name": "rpa", "text": aa.aaaa, "body": aa.aaaa });
}

function firebase(data) {
  data = data;//"rpssssssssssssssa";
  //var token = ScriptApp.getOAuthToken();
  //Logger.log(token);
  var fb = FirebaseApp.getDatabaseByUrl("https://rpa999-56929.firebaseio.com", "gR8Y4bBBiaEq6wEV0rpdjdZOT5FSFkJaYkurZgPN");
  var rand = Math.floor(Math.random() * Math.floor(1000));
  //data= "aaaaaaaa aaaaaaaaaaa"
  //data = "wwwwwwwwwwwwwwwwww"
  rowContents = ["=ROW()", data];
  //var ss = SpreadsheetApp.openById("12w3Wvhv6P4uzWY6DeegcFNCil88ZttSNSESViZJnxHA").getSheetByName("Sheet1").appendRow(rowContents);
  //fb.setData("messages/999/" + rand, { "name": "rpa", "body": "BPMSRPA開始" + data });
  //fb.setData("messages/999/" + rand, { "name": "rpa","text": "rpa", "body": data,"aaaaa":{"aaaaaa":"sssssssssssssss"} });
  data = data + `<input>aaaaaaaaaaaaaaaaa</input>
    <pre>
ドライブファイルの一覧の取得
　→
<script>

</script>
  ソースコード
  ここにソースを各

https://docs.google.com/forms/u/0/d/e/1FAIpQLScw-tRhnwDePkqxDggsRLWx0gJtQ9Tep7wH0WTVMfOGDr5vXg/formResponse
https://docs.google.com/forms/d/1APGXK8tTPU5DuYdMyY_wmqLzuX__fc9CcjVl8-GNSgg/edit


1,サーバーサイドのコードをいれてください

2,フロントサイドのコードをいれてください


  １，なにが必要ですか
  ２，GITHUB
  ３，GOOGLE
  ４，ああああ
    fb.setData("messagess/"+rand, { "name": "rpa","text": data, "body": data });
  <a href="aaaaa>aaaaa</a>
  <a href="aaaaa>aaaaa</a>
  <a href="aaaaa>aaaaa</a>
  <a href="aaaaa>aaaaa</a>
  <a href="aaaaa>aaaaa</a>
  
    </pre>
    `
  dd = fb.getData("messagess");
  try {
    Logger.log(dd['description'])
    Logger.log("dd====7777")
  } catch (e) {
    Logger.log(e)
  }
  // Logger.log(dd[7])
  //ddf = JSON.parse(dd)
  // こうすればOK
  //https://sites.google.com/site/scriptsexamples/new-connectors-to-google-services/firebase/reference?authuser=0
  Object.keys(dd).forEach(function (key) {
    console.log("-------------------------------------" + key + "は" + dd[key] + "と鳴いた！");
    Object.keys(dd[key]).forEach(function (keys) {
      //console.log(keys + "は" + dd[key][keys] + "と鳴いた！");
      console.log(keys + "は" + dd[key][keys] + "と鳴いた！");

    })
  });
  //   dd.forEach(function(element){
  // console.log(element);
  // Logger.log(element)
  //});
  //foreach aa in dd{

  //}
  // Logger.log(ddf)
  //  fb.setData("messagess/"+rand, { "name": "rpa","text": data, "body": data });

  fb.setData("messagess/" + rand, { "name": "rpa", "text": data, "body": data });

  // testProcessmakerCreateCase(data);
  //fb.update("messages/"+rand,{"name":"rpa","body":data})//updates);

  return data
}

//execGAS
function sendMail() {

  GmailApp.sendEmail("miyataken999@gmail.com", "test", "test");
}
/**
 * excute script from frontend
 */
function execGAS(flag, func) {
  // func()
  flag = 1;
  if (flag === 1)
    return eval(func)
  // func2()
  else
    return "処理終了"
}
//FormApp.getActiveForm();
function onFormSubmit11(e) {
  test_firebase()
  Logger.log("log stssssssssssssart")
  FormApp.getActiveForm();
  var email = 'miyataken999@gmail.com';
  var subject = 'フォームが送信されました';
  var body = 'こんにちは。\n' + JSON.stringify(e);
  sht = "在庫管理表"
  createCase("4927727605d5aa3756f48d5066347332", "6259085535d5aa43e67d9e5021399520", sht);

  // body += 'Googleフォームの「' + e.source.getTitle()　+ '」に回答が送信されました。\n\n';
  // var itemResponses = e.response.getItemResponses();
  /* itemResponses.forEach(function(itemResponse){
     body += '【' + itemResponse.getItem().getTitle() + '】\n'
     body += itemResponse.getResponse() + '\n\n'
   });*/
  GmailApp.sendEmail(email, subject, body);
}

/*
function onEdit(event) {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var answerSheet = spreadSheet.getSheetByName('回答');
  
  answerSheet.getRange('B1').setValue('Last modified: ' + new Date());
}

function onChange(event) {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var answerSheet = spreadSheet.getSheetByName('回答');

  answerSheet.getRange('B2').setValue('Last modified: ' + new Date());
}
*/
function writeTrends() {
  var URL = 'https://us-central1-praxis-citron-246515.cloudfunctions.net/function-1';

  var sheet = SpreadsheetApp.getActiveSheet();
  var response = UrlFetchApp.fetch(URL).getContentText();
  var articles = JSON.parse(response);
  var values = articles.map(function (article) {
    return Object.keys(article).map(function (key) {
      return article[key];
    });
  });

  var range = sheet.getRange(1, 1, values.length, values[0].length);
  range.setValues(values);
}


function searchMail() {

  // Gmailから特定条件のスレッドを検索しメールを取り出す
  //受信日時指定
  const date = new Date();//現在時刻を取得
  const unixTime = date.getTime();//UNIX TIMEに変換
  const now = Math.floor(unixTime / 1000); //ミリ秒を秒に変換
  const term = now - 300; //現在時刻から5分（300秒）前
  const termStr = term.toString(); //検索期間を文字列に変換
  //検索条件指定
  const srchCondition = [ //検索条件を配列で格納
    '（検索条件その1）',
    '（検索条件その2）'
  ].join("\u0020"); //半角スペースで連結

  const strTerms = 'after:' + term + ' ' + srchCon; //検索条件：termの期間に、srchConの条件に合致するメール
  const myThreads = GmailApp.search(strTerms, 0, 30); //条件にマッチしたスレッドを取得
  const myMsgs = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得する

  /**
  あとは取得した情報を煮るなり焼くなりする。
  **/
}




//function saveMail(){
var FOLDER_ID = '0B-8_rL6s3eTwNmtEQTNRTlU3ems'; //保存するフォルダ
var SEARCH_TERM = 'エラーが起こりました';

function fetchFile() {
  // Gmailから特定条件のスレッドを検索しメールを取り出す
  //受信日時指定
  /*
  const date = new Date() ;//現在時刻を取得
  const unixTime = date.getTime();//UNIX TIMEに変換
  const now = Math.floor(unixTime/1000); //ミリ秒を秒に変換
  const term = now - 300; //現在時刻から5分（300秒）前
  const termStr = term.toString(); //検索期間を文字列に変換
   //検索条件指定
  const srchCondition = [ //検索条件を配列で格納
  '（検索条件その1）',
  '（検索条件その2）'  
  ].join("\u0020"); //半角スペースで連結
 
  const strTerms = 'after:'+ term +' '+ srchCon; //検索条件：termの期間に、srchConの条件に合致するメール
  var myFolder = DriveApp.getFolderById(FOLDER_ID); //フォルダを取得
  var myThreads = GmailApp.search(SEARCH_TERM, 0, 30); //条件にマッチしたスレッドを検索して取得
  var myMessages = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得し二次元配列で格納
 
  for(var i in myMessages){
    for(var j in myMessages[i]){
 Logger.log("wwww")
      var attachments = myMessages[i][j].getAttachments(); //添付ファイルを取得
      for(var k in attachments){
        myFolder.createFile(attachments[k]); //ドライブに添付ファイルを保存
      }
    }
  }
  */
}
//}
// Replace the variables in this block with real values.
var address = '34.68.236.236:1433;databaseName=TestDB;';
var user = 'SA'; // User
var userPwd = '1qaz2wsx3edc@@@AAA';

var dbUrl = 'jdbc:sqlserver://' + address;

// Read up to 1000 rows of data from the table and log them.
function readFromTable() {
  var conn = Jdbc.getConnection(dbUrl, user, userPwd);

  var start = new Date();
  var stmt = conn.createStatement();
  stmt.setMaxRows(1000);
  var results = stmt.executeQuery('SELECT * FROM _M_CONFIG');
  var numCols = results.getMetaData().getColumnCount();

  while (results.next()) {
    var rowString = '';
    for (var col = 0; col < numCols; col++) {
      rowString += results.getString(col + 1) + '\t';
    }
    Logger.log(rowString)
  }

  results.close();
  stmt.close();

  var end = new Date();
  Logger.log('Time elapsed: %sms', end - start);
}



//
function doGet(e) {

  if (e.parameter.page) {
    var pageName = e.parameter.page.trim().toLowerCase();
    if (pageName !== "home") {
      var template = HtmlService.createTemplateFromFile(pageName);
      template.url = getPageUrl();
      return template.evaluate();
    } else {
      return homePage();
    }
  } else {
    return homePage();
  }

  //var html = UrlFetchApp.fetch('https://brandkaimasu.com/campaign/').getContentText();
  //var doc = XmlService.parse(html);
  //var html = doc.getRootElement();
  //var menu = getElementsByClassName(html, 'body > div.main > div > div.section_01 > div > div.ttl_area')[0];
  //var output = XmlService.getRawFormat().format(html);
  //return HtmlService.createHtmlOutput(html);

  // return HtmlService.createTemplateFromFile("hello").evaluate();
}

/**
POST 値をとる
chatwork format
初期化ＧＳで初期化

いつもつかう関数
4_9PlqR2nb=/iJ@
https://script.google.com/d/1Ep3pHZ-WQJWNGXEBqsSGtyy8UmOi7Zp29G8DzNH7QhUmXm612TO-Je3t/edit
*/
function homePage() {
  var pages = ["react2", "chat", "page1", "page2", "page3", "camera", "ch04/index"];
  var urls = pages.map(function (name) {
    return getPageUrl(name);
  });
  var template = HtmlService.createTemplateFromFile("public/html/camera");
  template.title = pages;
  template.urls = urls;
  return template.evaluate();
}

function getPagetitle(name) {
}

function getPageUrl(name) {
  if (name) {
    var url = ScriptApp.getService().getUrl();
    return url + "?page=html/" + name;
  } else {
    return ScriptApp.getService().getUrl();
  }
}


function doPost(e) {




  execGAS(1, "test");
  line(e)

}


function set_catalog_list() {

  // スプレッドシートの情報を取得
  var rng = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet()
    .setActiveSelection("A1");

  var con_str = 'jdbc:mysql://サーバーのIPアドレス:3306/DB名';
  var user_id = 'DBユーザー名';
  var user_pass = 'DBパスワード';

  // DBに接続
  var conn = Jdbc.getConnection(con_str, user_id, user_pass);
  var stmt = conn.createStatement();
  stmt.setMaxRows(100);

  //クエリを記載
  var str_query = 'select * from cataloglists;';
  // クエリを実行
  var rs = stmt.executeQuery(str_query);

  while (rs.next()) {
    //getStringで列名を指定して取得
    result.push(rs.getString("listname"));
  }

  rs.close();
  stmt.close();
  conn.close();

  // 取得した情報をスプレットシート上にプルダウンとして出力 
  //　var rule = SpreadsheetApp
  //　　.newDataValidation()
  //　.requireValueInList(result, true)
  //　.build();

  //　rng.setDataValidation(rule);

}


function test432() {

  var activeSheet = SpreadsheetApp.getActiveSheet();
  var rangeList = activeSheet.getRangeList(['A1:B4', 'D1:E4']);
  rangeList.activate();

  var selection = activeSheet.getSelection();
  // Current Cell: D1
  Logger.log('Current Cell: ' + selection.getCurrentCell().getA1Notation());
  // Active Range: D1:E4
  Logger.log('Active Range: ' + selection.getActiveRange().getA1Notation());
  // Active Ranges: A1:B4, D1:E4
  var ranges = selection.getActiveRangeList().getRanges();
  for (var i = 0; i < ranges.length; i++) {
    Logger.log('Active Ranges: ' + ranges[i].getA1Notation());
  }
  Logger.log('Active Sheet: ' + selection.getActiveSheet().getName());

  var sheet = SpreadsheetApp.getActiveSheet();
  var rangeList = sheet.getRangeList(['A2:B4', 'C1:D4']);
  // Sets borders on the top and bottom of the ranges A2:B4 and C1:D4, but leaves the left and
  // right unchanged.
  rangeList.setBorder(true, null, true, null, false, false);
  var sheet = SpreadsheetApp.getActiveSheet();
  var rangeList = sheet.getRangeList(['D4', 'B2:C4']);
  rangeList.activate();

  var selection = sheet.getSelection();
  // Current cell: B2
  var currentCell = selection.getCurrentCell();
  // Active range: B2:C4
  var activeRange = selection.getActiveRange();
  // Active range list: [D4, B2:C4]
  var activeRangeList = selection.getActiveRangeList();
}

function test2() {
  // Sets all cells in range B2:D4 to have the text "Hello world", with "Hello" bolded.
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("B2:D4");
  var bold = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .build();
  var richText = SpreadsheetApp.newRichTextValue()
    .setText("Hello world")
    .setTextStyle(0, 5, bold)
    .build();
  range.setRichTextValue(richText);
}

function onClickItem1() {
  Browser.msgBox('アイテム1がクリックされました。');
}

function onOpen(e) {

  /*
    var ui = SpreadsheetApp.getUi();           // Uiクラスを取得する
  var menu = ui.createMenu()
    .addItem('DATABASE連携', 'showSidebar')
    .addItem('BPMS連携', 'showBPMS')
    .addItem('html', 'html')
    // .addItem('GSS操作', 'showDialog')
    .addItem('音声入力登録（セル移動）', 'chat')
    .addItem('3D','showSidebar')
    //  .addItem("スクリプト",'myFunction')
    //.addItem("カメラ撮影",'camera')
    .addToUi();*/
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('reactNative', 'reactNative')
    .addItem('react', 'react')
    .addItem('DATABASE連携', 'showSidebar')
    .addItem('BPMS連携', 'showBPMS')
    .addItem('html', 'html')
    // .addItem('GSS操作', 'showDialog')
    .addItem('音声入力登録（セル移動）', 'chat')
    .addItem('3D', 'showSidebar')
    .addItem('vue', 'vue')
    .addItem('script', 'script')
    .addItem('ckeditor', 'ckeditor')
    .addItem('dhtmlx', 'dhtmlx')
    .addItem('camera', 'camera')
    .addItem('reactjs', 'spreact')
    //  .addItem("スクリプト",'myFunction')
    //.addItem("カメラ撮影",'camera')
    .addToUi();

  showBPMS()
  /*
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('追加したメニュー')
  .addItem('データ登録', 'myFunction2')
  .addItem('データ更新', 'showDialog')
  .addItem('次の作業へ進む', 'showDialog')
  .addSeparator()
  .addSubMenu(
  ui.createMenu("サブメニュー")
  .addItem("サブアイテム1", "chat")
  )
  .addToUi();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('追加したメニュー2')
  .addItem('アイテム1', 'showSidebar')
  .addItem('アイテム2', 'showDialog')
  .addSeparator()
  .addSubMenu(
  ui.createMenu("サブメニュー")
  .addItem("サブアイテム1", "chat")
  )
  .addToUi();*/
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
  //  chat();
}


function sheetcopy() {
  processmaker.sheetcopy();
}




/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */

function require(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
チャットワークに送信
＠var roomId
@var message
*/
function postCamera(data) {
  var payload = {
    "img": data
  };

  var headers = {
    "aplication": "json"
  };

  var options = {
    "method": "post",
    "payload": payload,
    "headers": headers
  };



  //appendRow(["a man", e.postData, "panama"]);//

  //SpreadsheetApp.openById(spreadsheetId).getSheetByName('作業ログ').appendRow(["作業ログ",message, "panam"]);


  try {
    //$ret = createCase(message);
    //exec_Mysql("insert into WEBSOCKET (WORD) VALUES ('"+message+"')");
    //sendgitter(message);
    return UrlFetchApp.fetch("https://chat.bpmboxes.com/MachineL/webcam/save.php", options);
  }
  catch (ex) {
    console.log(ex);
  }

}
