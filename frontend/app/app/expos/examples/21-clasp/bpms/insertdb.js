//https://script.google.com/a/macros/bpm999.com/d/1mVfAz2qj4nQ6Row5-GfluzxDcuZtaT8cbSDk_YnyV5n4VjpWwOIAXC7j/edit?splash=yes

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function soaptest() {
  //var a =  new processmaker(1);
  // var cw = ChatWorkClient.factory({token:1111});
  var dx = scriptlib001001processmaker.factory({
    token: 1111
  });

  data = [{
      "prise": 4000,
      "JPN": 12121,
      "webhook_setting_id": "539",
      "webhook_event_type": "message_created",
      "webhook_event_time": 1519552132,
      "subcontractors": { //grid
        "1": {
          "name": "Smith & Wright",
          "hasContract": "0"
        },
        "2": {
          "name": "A+ Lawn Services",
          "hasContract": "1"
        }
      },
      "webhook_event": {
        "message_id": "1019545259492790272",
        "room_id": 93806631,
        "account_id": 2354879,
        "body": "5759639965a928682885665023994421_8738098865a928682afcdb3048418403",
        "send_time": 1519552132,
        "update_time": 0
      }
            }
           ]
  dx.createCase(2000, data);

  //dx.createCase(2000);
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testCreateCase() {
  // getVariables("7333967525af46fdc3de0a1084780436","宝飾単価21")
  
  createCase("5634222795921ebd8884326071627847", "2831154885921ebda7872e2098677860", "Copy of 全般");
  
  //createCase("宝飾単価21")
}

function batchCreateCase(){
 
  //var sheets = 
  
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testGetVarables() {
  getVariables("7333967525af46fdc3de0a1084780436", "宝飾単価21")
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function testSendVariables() {
  sendVariables("5056480205af479a1240458026915703", "宝飾単価21")
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function sendVariables(caseid, sht) {
  var dx = new ProcessMaker({
    token: 1111
  })


  // This example assumes there is a sheet named "first"
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var first = ss.getSheetByName(sht);

  a1 = first.getRange('a1').getValue();
  b1 = first.getRange('b1').getValue();
  c1 = first.getRange('c1').getValue();

  N1 = first.getRange('N1').getValue();
  P1 = first.getRange('P1').getValue();
  F25 = first.getRange('F25').getValue();
  K80 = first.getRange('K80').getValue();
  F26 = first.getRange('F26').getValue();
  E27 = first.getRange('E27').getValue();
  K27 = first.getRange('K27').getValue();
  K25 = first.getRange('K25').getValue();
  A30 = first.getRange('A30').getValue();
  A31 = first.getRange('A31').getValue();
  A32 = first.getRange('A32').getValue();
  D35 = first.getRange('D35').getValue();
  F35 = first.getRange('F35').getValue();
  M35 = first.getRange('M35').getValue();
  D36 = first.getRange('D36').getValue();
  F36 = first.getRange('F36').getValue();
  J36 = first.getRange('J36').getValue();
  D38 = first.getRange('D38').getValue();
  F38 = first.getRange('F38').getValue();
  D39 = first.getRange('D39').getValue();
  //TIME = first.getRange('TIME').getValue();
  //MONTHLY_REPORT = first.getRange('MONTHLY_REPORT').getValue();
  M39 = first.getRange('M39').getValue();
  D40 = first.getRange('D40').getValue();
  D41 = first.getRange('D41').getValue();
  D42 = first.getRange('D42').getValue();
  D43 = first.getRange('D43').getValue();
  M43 = first.getRange('M43').getValue();
  F43 = first.getRange('F43').getValue();
  D44 = first.getRange('D44').getValue();
  F44 = first.getRange('F44').getValue();
  D45 = first.getRange('D45').getValue();
  M45 = first.getRange('M45').getValue();
  D48 = first.getRange('D48').getValue();
  F48 = first.getRange('F48').getValue();
  D49 = first.getRange('D49').getValue();
  D51 = first.getRange('D51').getValue();
  D52 = first.getRange('D52').getValue();
  K50 = first.getRange('K50').getValue();
  P48 = first.getRange('P48').getValue();
  P49 = first.getRange('P49').getValue();
  P50 = first.getRange('P50').getValue();
  P51 = first.getRange('P51').getValue();
  P52 = first.getRange('P52').getValue();

  var arr = ["", "", "", "", ""];
  var str = "{";

  for (var i = 3; i <= 22; i++) {
    a18 = first.getRange('a' + i).getValue();
    b18 = first.getRange('b' + i).getValue();
    c18 = first.getRange('c' + i).getValue();
    d18 = first.getRange('d' + i).getValue();
    e18 = first.getRange('e' + i).getValue();
    f18 = first.getRange('f' + i).getValue();
    g18 = first.getRange('g' + i).getValue();
    h18 = first.getRange('h' + i).getValue();
    i18 = first.getRange('i' + i).getValue();
    j18 = first.getRange('j' + i).getValue();
    k18 = first.getRange('k' + i).getValue();
    l18 = first.getRange('l' + i).getValue();
    m18 = first.getRange('m' + i).getValue();
    n18 = first.getRange('n' + i).getValue();
    o18 = first.getRange('o' + i).getValue();
    p18 = first.getRange('p' + i).getValue();

    zz = i - 2; //JSONGRIDの内容
    str += ' "' + zz + '": {"A": "' + a18 +
      '","B":"' + b18 +
      '","C":"' + c18 +
      '","D":"' + d18 +
      '","E":"' + e18 +
      '","F":"' + f18 +
      '","G":"' + g18 +
      '","H":"' + h18 +
      '","I":"' + i18 +
      '","J":"' + j18 +
      '","K":"' + k18 +
      '","L":"' + l18 +
      '","M":"' + m18 +
      '","N":"' + n18 +
      '","O":"' + o18 +
      '","P":"' + p18 +
      '"},';
  }

  str += "}";


  //ライブラリーからの登録クラス//https://script.google.com/a/bpm999.com/d/1mVfAz2qj4nQ6Row5-GfluzxDcuZtaT8cbSDk_YnyV5n4VjpWwOIAXC7j/edit
  // var dx = processmaker.factory({token:1111});
  Logger.log("__LINE===========================")
  data = {
    "prise": 400033333,
    "a1": a1,
    "b1": b1,
    "c1": c1,
    "N1": N1,
    "P1": P1,
    "F25": F25,
    "K80": K80,
    "F26": F26,
    "E27": E27,
    "K27": K27,
    "K25": K25,
    'A30': A30,
    'A31': A31,
    'A32': A32,
    'D35': D35,
    'F35': F35,
    'M35': M35,
    'D36': D36,
    'F36': F36,
    'J36': J36,
    'D38': D38,
    'F38': F38,
    'D39': D39,
    'M39': M39,
    'D40': D40,
    'D41': D41,
    'D42': D42,
    'D43': D43,
    'M43': M43,
    'F43': F43,
    'D44': D44,
    'F44': F44,
    'D45': D45,
    'M45': M45,
    'D48': D48,
    'F48': F48,
    'D49': D49,
    'D51': D51,
    'D52': D52,
    'K50': K50,
    'P48': P48,
    'P49': P49,
    'P50': P50,
    'P51': P51,
    'P52': P52,
    'JPN': P52,
    "webhook_setting_id": P52,
    "webhook_event_type": P52,
    "webhook_event_time": 1519552132,
    "gridVar001": JSON.parse(str),
    "webhook_event": {
      "message_id": "1019545259492790272",
      "room_id": 93806631,
      "account_id": 2354879,
      "body": "5759639965a928682885665023994421_8738098865a928682afcdb3048418403",
      "send_time": 1519552132,
      "update_time": 0
    }
  }

  Logger.log(data);
  //fa = dx.restsetVariables(caseid,data);
  try {
    fa = dx.restsetVariables(caseid, data);
  }
  catch (ex) {
    Logger.log(ex)
  }
  //dx.restsetVariables(data);
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function test_routeCase() {
  routeCase("2315828255de20071ea7151063217430")
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function routeCase(caseid) {
  
  var dx = new ProcessMaker({
    token: 1111
  })
  var res = dx.routeCase(caseid);
  Logger.log(dx.ret)
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function getVariables(caseid, sht) {

  //Logger.log(JSON.stringify(processmaker.factory({token:1111})))
  //var dx = processmaker.factory({token:1111});
  var dx = new ProcessMaker({
    token: 1111
  })
  data = [{
        "prise": 4000,
        "JPN": 12121,
        "webhook_setting_id": "539",
        "webhook_event_type": "message_created",
        "webhook_event_time": 1519552132,
        "subcontractors": { //grid
          "1": {
            "name": "Smith & Wright",
            "hasContract": "0"
          },
          "2": {
            "name": "A+ Lawn Services",
            "hasContract": "1"
          }
        },
        "webhook_event": {
          "message_id": "1019545259492790272",
          "room_id": 93806631,
          "account_id": 2354879,
          "body": "5759639965a928682885665023994421_8738098865a928682afcdb3048418403",
          "send_time": 1519552132,
          "update_time": 0
        }
            }
           ]
    //var ss = SpreadsheetApp.getActiveSpreadsheet();
    // var first = ss.getSheetByName("見積書");
    // a = first.getRange('r1').getValue();
  dx.getvariables(caseid);

  Logger.log(dx.ret);
  data = JSON.parse(dx.ret)

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var first = ss.getSheetByName(sht);

  //a = first.getRange('a3').getValue();
  //b = first.getRange('d4').getValue();

  for (key in data) { //JSON PARSE
    Logger.log(key)
    Logger.log(data.hasOwnProperty(key))
    Logger.log(data[key])


    try { //JSONでいいわ
      //     a = first.getRange(key).setValue(data[key]);
      try {
        a = first.getRange(key).setValue(data[key]);
      }
      catch (ex) {

      }
      if (key == "gridVar001") {
        Logger.log("★★★★★★★★★★★★★ｖ");
        ii = 3;
        for (key2 in data["gridVar001"]) {

          Logger.log("★")
          Logger.log(key2)

          for (key3 in data["gridVar001"][key2]) {
            Logger.log(key3)
            Logger.log(data["gridVar001"][key2][key3])
            Logger.log("★★")
            try {
              cell = key3 + ii + '';
              Logger.log("DATA IS " + cell + "=" + data["gridVar001"][key2][key3])
              Logger.log(cell)
              cz = data["gridVar001"][key2][key3]
              first.getRange(cell).setValue(cz);
              //first.getRange(cell).setValue(cell);

            }
            catch (ex) {
              Logger.log(ex)
            }
          }
          ii++;
        }
      }
      //★処理 グリッドの場合
      // Logger.log(JSON.parse(data[key])+"===================")
    }
    catch (ex) {
      Logger.log(ex)
    }
  }
}


// function parseGrid(){

// ]

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function escape (val) {
 if (typeof(val)!="string") return val;
  return val      
        .replace(/[\\]/g, '\\\\')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t')
        .replace(/[\"]/g, '\\"')
        .replace(/\\'/g, "\\'"); 
}

//var myJSONString = JSON.stringify(escape);

//"1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo"


/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名 1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo
*************************************************************************/
function testCreateCase2() {
  // getVariables("7333967525af46fdc3de0a1084780436","宝飾単価21")
  
  
  var first=    SpreadsheetApp.openById("1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo").getSheets()//;.getSheetByName(sheetName)
  
  
    // スプレッドシート内の全シートとスプレッドシートのID
  var sheets = SpreadsheetApp.getActive().getSheets();
  var sheets=    SpreadsheetApp.openById("1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo").getSheets()
  var ssId = SpreadsheetApp.openById("1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo").getId();

  // ハイパーリンク文字列の配列
  var linkList = [[]];

  for(var i=0; i<sheets.length; i++) {
    // シートのIDと名前
    var sheetId = sheets[i].getSheetId();
    var sheetName = sheets[i].getSheetName();
    output.append('<option value="'+sheetName+'">'+sheetName+"</option>")
//<option value="mercedes">Mercedes</option>
    // シートのURLからハイパーリンク文字列を組み立て
    var url = "https://docs.google.com/spreadsheets/d/" + ssId + "/edit#gid=" + sheetId;
    var link = [ '=HYPERLINK("' + url + '","' + sheetName + '")' ];
Logger.log(sheetName)
    // ハイパーリンク文字列を配列に格納
    linkList[i] = link;
  }

  // 選択中のセルにハイパーリンク文字列を入れる
  //var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //var cell = sheet.getActiveCell();
  //var range = sheet.getRange(cell.getRow() , cell.getColumn() ,  linkList.length , 1);
  //range.setValues(linkList);
//}
  
  
  
  
  
  
  
  
  
  //createCase("5634222795921ebd8884326071627847", "2831154885921ebda7872e2098677860", "Copy of 全般","1xvlLbqZCzUsj2YyCTWmO3iBLaEzGEuVyuI6QoVuCFSo");
  
  //createCase("宝飾単価21")
}


function createCase(pid, tid, sht,sid) {
  
 //return true
  // This example assumes there is a sheet named "first"
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  /*
  // テンプレートファイル
  var templateFile = DriveApp.getFileById('12w3Wvhv6P4uzWY6DeegcFNCil88ZttSNSESViZJnxHA');
  // 出力フォルダ
  var OutputFolder = DriveApp.getFolderById('1yxQOj2IKhgGcM54tiNLzT0XaV5kHj-qO');
  // 出力ファイル名
  var OutputFileName = templateFile.getName().replace('_template', '')+'_'+Utilities.formatDate(new Date(), 'JST', 'yyyyMMddHms')
  
  var fileID=templateFile.makeCopy(OutputFileName, OutputFolder);
  
  
  // テンプレートファイル
  var templateFile = DriveApp.getFileById('1H9Z42zSAMZWmRGZc-Y33PKz79ZA6mcMLzZx0fC3G4yQ');
  // 出力フォルダ
  var OutputFolder = DriveApp.getFolderById('1-8SaKYNCu1Rf_UJ-BNJBkFWqvLkrsTPx');
  // 出力ファイル名
  var OutputFileName = templateFile.getName().replace('_template', '')+'_'+Utilities.formatDate(new Date(), 'JST', 'yyyyMM')
  
  var fileID2=templateFile.makeCopy(OutputFileName, OutputFolder);
  */
  
  
  //var first=    SpreadsheetApp.openById(sid).getSheetByName(sht)
//Browser.msgBox(sht+"bpms/insertdb");
 
  var first = ss.getSheetByName(sht);//FOR IN SPREAD SHEET ADDON
  
  var row = first.getLastRow()

  //getfrom database

  a1 = first.getRange('a2').getValue();
  b1 = first.getRange('b2').getValue();
  c1 = first.getRange('c2').getValue();

  a2 = first.getRange('a2').getValue();
  b2 = first.getRange('b2').getValue();
  c2 = first.getRange('c2').getValue();



  a = first.getRange('a3').getValue();
  b = first.getRange('d4').getValue();
  c = first.getRange('n4').getValue();
  d = first.getRange('n3').getValue();
  e = first.getRange('c6').getValue();
  f = first.getRange('k6').getValue();
  g = first.getRange('k7').getValue();
  h = first.getRange('k8').getValue();
  i = first.getRange('k9').getValue();
  j = first.getRange('c10').getValue();
  k = first.getRange('c11').getValue();
  l = first.getRange('c12').getValue();

  N1 = first.getRange('N1').getValue();
  P1 = first.getRange('P1').getValue();
  F25 = first.getRange('F25').getValue();
  K80 = first.getRange('K80').getValue();
  F26 = first.getRange('F26').getValue();
  E27 = first.getRange('E27').getValue();
  K27 = first.getRange('K27').getValue();
  K25 = first.getRange('K25').getValue();
  A30 = first.getRange('A30').getValue();
  A31 = first.getRange('A31').getValue();
  A32 = first.getRange('A32').getValue();
  D35 = first.getRange('D35').getValue();
  F35 = first.getRange('F35').getValue();
  M35 = first.getRange('M35').getValue();
  D36 = first.getRange('D36').getValue();
  F36 = first.getRange('F36').getValue();
  J36 = first.getRange('J36').getValue();
  D38 = first.getRange('D38').getValue();
  F38 = first.getRange('F38').getValue();
  D39 = first.getRange('D39').getValue();
  //TIME = first.getRange('TIME').getValue();
  //MONTHLY_REPORT = first.getRange('MONTHLY_REPORT').getValue();
  M39 = first.getRange('M39').getValue();
  D40 = first.getRange('D40').getValue();
  D41 = first.getRange('D41').getValue();
  D42 = first.getRange('D42').getValue();
  D43 = first.getRange('D43').getValue();
  M43 = first.getRange('M43').getValue();
  F43 = first.getRange('F43').getValue();
  D44 = first.getRange('D44').getValue();
  F44 = first.getRange('F44').getValue();
  D45 = first.getRange('D45').getValue();
  M45 = first.getRange('M45').getValue();
  D48 = first.getRange('D48').getValue();
  F48 = first.getRange('F48').getValue();
  D49 = first.getRange('D49').getValue();
  D51 = first.getRange('D51').getValue();
  D52 = first.getRange('D52').getValue();
  K50 = first.getRange('K50').getValue();
  P48 = first.getRange('P48').getValue();
  P49 = first.getRange('P49').getValue();
  P50 = first.getRange('P50').getValue();
  P51 = first.getRange('P51').getValue();
  P52 = first.getRange('P52').getValue();
  P23 = first.getRange('P23').getValue();


//row = 61
  var arr = ["", "", "", "", ""];
  var str = "{";

  //for(var i=2;i<=52;i++){
  Logger.log("★============================================")
  Logger.log(row)
  for (var i = 1; i <= row; i++) {
    a18 = first.getRange('a' + i).getValue();
    b18 = first.getRange('b' + i).getValue();
    c18 = first.getRange('c' + i).getValue();
    d18 = first.getRange('d' + i).getValue();
    e18 = first.getRange('e' + i).getValue();
    f18 = first.getRange('f' + i).getValue();
    g18 = first.getRange('g' + i).getValue();
    h18 = first.getRange('h' + i).getValue();
    i18 = first.getRange('i' + i).getValue();
    j18 = first.getRange('j' + i).getValue();
    k18 = first.getRange('k' + i).getValue();
    l18 = first.getRange('l' + i).getValue();
    m18 = first.getRange('m' + i).getValue();
    n18 = first.getRange('n' + i).getValue();
    o18 = first.getRange('o' + i).getValue();
    p18 = first.getRange('p' + i).getValue();
    
    
   
    
    
    zz = i; //JSONGRIDの内容
    str += ' "' + escape(zz) +
      '": {"A": "' + escape(a18) +
      '","B": "' + escape(b18)+
      '","C":"' + escape(c18) +
      '","D":"' + escape(d18) +
      '","E":"' + escape(e18) +
      '","F":"' + escape(f18) +
      '","G":"' + escape(g18) +
      '","H":"' + escape(h18) +
      '","I":"' + escape(i18) +
      '","J":"' + escape(j18) +
      '","K":"' + escape(k18) +
      '","L":"' + escape(l18) +
      '","M":"' + escape(m18) +
      '","N":"' + escape(n18) +
      '","O":"' + escape(o18) +
      '","P":"' + escape(p18) +
      '"},';
  }

  str += "}";
  Logger.log("★==========================================================")
  Logger.log(str)


  //ライブラリーからの登録クラス//https://script.google.com/a/bpm999.com/d/1mVfAz2qj4nQ6Row5-GfluzxDcuZtaT8cbSDk_YnyV5n4VjpWwOIAXC7j/edit
  //var dx = processmaker.factory({token:1111});
  var dx = new ProcessMaker({
    token: 1111
  })
  Logger.log("__LINE===========================")
  data = [{
        "prise": 4000,
    "sheetUrl":"fileID01",//fileID.getUrl(),
    "sheetUrl2":"fileID2",//fileID2.getUrl(),
        'a': a,
        "b": b,
        "c": c,
        "d": d,
        "e": e,
        //'APP_UID':APP_UID,
        //'APP_NUMBER':APP_NUMBER,
        //'APP_STATUS':APP_STATUS,
        //'ROW':ROW,
        'a1': a1,
        'b1': b1,
        'c1': c1,
        'a2': a2,
        'b2': b2,
        'c2': c2,
        'N1': N1,
        'P1': P1,
        'F25': F25,
        'K80': K80,
        'F26': F26,
        'E27': E27,
        'K27': K27,
        'K25': K25,
        'A30': A30,
        'A31': A31,
        'A32': A32,
        'D35': D35,
        'F35': F35,
        'M35': M35,
        'D36': D36,
        'F36': F36,
        'J36': J36,
        'D38': D38,
        'F38': F38,
        'D39': D39,
        //'TIME':TIME,
        //'MONTHLY_REPORT':MONTHLY_REPORT,
        'M39': M39,
        'D40': D40,
        'D41': D41,
        'D42': D42,
        'D43': D43,
        'M43': M43,
        'F43': F43,
        'D44': D44,
        'F44': F44,
        'D45': D45,
        'M45': M45,
        'D48': D48,
        'F48': F48,
        'D49': D49,
        'D51': D51,
        'D52': D52,
        'K50': K50,
        'P48': P48,
        'P49': P49,
        'P50': P50,
        'P51': P51,
        'P52': P52,
        'P23': P23,
        'JPN': a,
        "webhook_setting_id": b,
        "webhook_event_type": c,
        "webhook_event_time": 1519552132,
        "gridVar001": JSON.parse(str),
        "webhook_event": {
          "message_id": "1019545259492790272",
          "room_id": 93806631,
          "account_id": 2354879,
          "body": "5759639965a928682885665023994421_8738098865a928682afcdb3048418403",
          "send_time": 1519552132,
          "update_time": 0
        }
            }
           ]
    // return
    // fa = dx.createCase("5634222795921ebd8884326071627847","2831154885921ebda7872e2098677860",2000,data);

  fa = dx.createCase(pid, tid, 2000, data);

  Logger.log(fa)
  Logger.log("==================================")
  Logger.log(dx.caseid);
  Logger.log("==================================")
  routeCase(dx.caseid);
  return dx.caseid;
  fa = dx.createCase(pid, tid, 2000, data);
  //output
  //   Logger.log(str);

}


/******************************************************
シートの内容をデータに登録
マスターに相当する　セルを　データベースに書き込む
*******************************************************/

function updateQuery() {

  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  var stmt = conn.createStatement();
  //   var rs = stmt.execute(sql);
  conn.setAutoCommit(false);
  conn.setAutoCommit(false);
  //var stmt = conn.createStatement();
  $sql = "update PMT_INVOICE_ITEMS set A = ? where APP_UID = 123";
  stmt = conn.prepareStatement($sql);
  stmt.setObject(1, 1111);


  // var userProperties = PropertiesService.getUserProperties();
  //units = 'imperial'; // Only changes local value, not stored value.
  //userProperties.setProperty('DISPLAY_UNITS', units); // Updates stored value.
  //userProperties.setProperty('chatkey', chatkey); // Updates stored value.
  //userProperties.setProperty('chatroomid', chatroomid); // Updates stored value.


  //var units2 = userProperties.getProperty('chatkey');
  //var units4 = userProperties.getProperty('chatroomid');

  //postChatwork(units2,word);


  stmt.addBatch();
  var batch = stmt.executeBatch();
  conn.commit();

}

/*-----------------------------------------------------
| シートデータをデータベースに書き出し
------------------------------------------------------*/
function testmaintfindRowIntoSQL() {
  maintfindRowIntoSQL("Export", "PMT_INVOICE_ITEMS");
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
function maintfindRowIntoSQL(sheetName, tablename) { //string:word
  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  var stmt = conn.createStatement();
  //   var rs = stmt.execute(sql);
  conn.setAutoCommit(false);

  var word = "";
  //var sheet = SpreadsheetApp.openById("1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI").getSheetByName(sheetName);
  //var sheet = SpreadsheetApp.openById("1siNiCNmdMPjRmGWw6R6HIbZoI21cvT6mwPZNv5tBfVw").getSheetByName(sheetName);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
  var head = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"];
  var end = "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  var header = "(";
  var insertVal = "";
  var sql = "insert table (a,b,c) values (?,?,?)";
  var text = "";
  var x;
  for (x in head) {
    Logger.log(head[x])
  }

  N1 = first.getRange('N1').getValue();
  P1 = first.getRange('P1').getValue();
  F25 = first.getRange('F25').getValue();
  K80 = first.getRange('K80').getValue();
  F26 = first.getRange('F26').getValue();
  E27 = first.getRange('E27').getValue();
  K27 = first.getRange('K27').getValue();
  K25 = first.getRange('K25').getValue();
  A30 = first.getRange('A30').getValue();
  A31 = first.getRange('A31').getValue();
  A32 = first.getRange('A32').getValue();
  D35 = first.getRange('D35').getValue();
  F35 = first.getRange('F35').getValue();
  M35 = first.getRange('M35').getValue();
  D36 = first.getRange('D36').getValue();
  F36 = first.getRange('F36').getValue();
  J36 = first.getRange('J36').getValue();
  D38 = first.getRange('D38').getValue();
  F38 = first.getRange('F38').getValue();
  D39 = first.getRange('D39').getValue();

  return

  for (var i = 0; i < dat.length; i++) {
    var stmt = conn.createStatement();

    sql = "insert into " + tablename + " ";
    header = "(";
    insertVal = "(";

    for (var j = 1; j <= dat[i].length; j++) { //シートの内容を取得して返す
      //create sql
      if (j == dat[i].length) { //終了じは　）をつける
        header += head[j - 1] + ")";
        insertVal += "" + "?" + ")";
      }
      else {
        header += head[j - 1] + ",";
        insertVal += "" + "?" + ",";
      }
    }

    Logger.log(sql);
  }
  //  return word;
}

/*-----------------------------------------------------
| シートデータをデータベースに書き出し
------------------------------------------------------*/
/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function testfindRowIntoSQL() {

  // Copy & Paste this
  var date = new Date();

  // UNIXタイムスタンプを取得する (ミリ秒単位)
  var a = date.getTime();
  var b = Math.floor(a / 1000);

  Logger.log(a)

  findRowIntoSQL("宝飾単価VLOOKUP33", "PMT_INVOICE_ITEMS", b);
  var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  return cell.getValue();

}

function testinsert() {
  insert("LINE")
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/
function insert(sheet) {
  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3307/test?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  conn.setAutoCommit(false);

  var stmt = conn.createStatement();
  var start = new Date();

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var first = ss.getSheetByName(sheet);

  /*
  L50 = first.getRange('k50').getValue();
  P48 = first.getRange('P48').getValue();
  P49 = first.getRange('P49').getValue();
  P50 = first.getRange('P50').getValue();
  P51 = first.getRange('P51').getValue();
  P52 = first.getRange('P52').getValue();
  */
  L50 = first.getRange('A1').getValue();
  P48 = first.getRange('A1').getValue();
  P49 = first.getRange('A1').getValue();
  P50 = first.getRange('A1').getValue();
  P51 = first.getRange('A1').getValue();
  P52 = first.getRange('A1').getValue();
  

 /* var ret = stmt.executeUpdate("insert PMT_SPREADMAIN (APP_UID,APP_NUMBER,APP_STATUS,K50,P48,P49,P50,P51,P52) values(" +
    "SUBSTRING(MD5(RAND()), 1, 32)"+"," +
    "11111111111"+","+
    "'aaaaaaa'"+"',"+
    "'"+L50 + "'," +
    "'"+P48 + "'," +
    "'"+P49 + "'," +
    "'"+P50 + "'," +
    "'"+P51 + "'," +
    "'"+P52 +
    "')");
  */
  
  $sql = "insert PMT_SPREADMAIN (APP_UID,APP_NUMBER,APP_STATUS) values(" +
    "SUBSTRING(MD5(RAND()), 1, 31)"+"," +
    "11111111111"+","+
    "'aaaaaaa'"+""+
    ")";
  Logger.log($sql)
  
 // var a = Math.floor( Math.random() * 32 ) ;
  
  // 生成する文字列の長さ
var l = 10;

// 生成する文字列に含める文字セット
var c = "abcdefghijklmnopqrstuvwxyz0123456789";

var cl = c.length;
var r = "";
for(var i=0; i<l; i++){
  r += c[Math.floor(Math.random()*cl)];
}
  
  
  Logger.log(r)
  
  
  
  
  $sql = "insert PMT_SPREADMAIN (APP_UID,APP_NUMBER,APP_STATUS) values(?,?,?)";
  stmt = conn.prepareStatement($sql);
  stmt.setString(1,r)//parameterIndex, x)
  //stmt.setObject(1,r);
  stmt.setObject(2,"11111111111");
  stmt.setObject(3,"aaaaaaa");
  

 //   var userProperties = PropertiesService.getUserProperties();
 //   var units2 = userProperties.getProperty('chatkey');
 //   var units4 = userProperties.getProperty('chatroomid');
    stmt.addBatch();
    var batch = stmt.executeBatch();
    conn.commit();
  return
  var ret = stmt.executeUpdate($sql);

  conn.commit();

  var rst = stmt.executeQuery("select id from PMT_SPREADMAIN ORDER BY id DESC limit 1");
  rst.next()
  var id = rst.getInt("A30");
  Logger.log(String(id))

  var message = "[info]" +
    "[title]" + "店頭での成約となります。買取金額：" + L50.toLocaleString() + "[/title]" +
    "H=" + L50 + "\r\nK=" + P48 + "\r\nD=" + P49 + "\r\nJ=" + P50 + "\r\nW=" + P51 + "\r\nB=" + P52 +
    "[hr]顧客SEQ:" + "ここは本日どうするか　相談　でざこに顧客登録をさせるなど　顧客登録　＊＊＊＊　といれるとデータコピーなど\r\n" +
    "以下URLから登録してください。\r\n" +
    "https://urlounge.co.jp/shop5/Eoc_add.php" + "" +

    "[hr]下記のURLから確認をお願い致します" + "[hr]" +
    "https://chat.bpmboxes.com/phprunner/PMT_SPREADMAIN_list.php" + "[hr]" +
    "USER " + "58835960058e603e3eb05e1088090533" + "[hr]" +
    "PASS " + "2eafe31d784c13c03ce5c958373b7fb6" + "[hr]" +
    "SHEETURL https://docs.google.com/spreadsheets/d/13aoTcCT3fSvb4aF5lykT04zd1A-poPMm8ty8oZFmTdY/edit#gid=50529666" + "[hr]" +
    "ADDONURL https://chrome.google.com/webstore/detail/bpmboxes/flpphdladnemmfboejiclglghloibdij?utm_source=permalink" +
    "[/info]";
  Logger.log(message)

  postChatwork_light("", message)

  //postChatwork_light("",messages);

  var end = new Date();

  stmt.close();
  conn.close();
  // findRowIntoSQL("宝飾単価VLOOKUP33","PMT_INVOICE_ITEMS",id);
  //PMT_SPREADSUB
  findRowIntoSQL(sheet, "PMT_SPREADSUB", String(id));

  Logger.log("Ret = %s", ret);
  return String(id)
    // ExecuteTimeToLog(start, end);
}

/************************************************************************
テーブル内容から　シートにデータの書き出し
@function testWrittoTOSheet
@params データベース名
@params テーブル名
@params シート名
*************************************************************************/

function findRowIntoSQL(sheetName, tablename, a) { //string:word
  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  var stmt = conn.createStatement();
  //   var rs = stmt.execute(sql);
  conn.setAutoCommit(false);

  var word = "";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
  var head = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];
  var header = "(";
  var insertVal = "";
  var sql = "";

  //for (var i = 0; i < dat.length; i++) {

  for (var i = 3; i < 22; i++) {

    var stmt = conn.createStatement();

    sql = "insert into " + tablename + " ";
    header = "(";
    insertVal = "(";

    for (var j = 1; j <= dat[i].length; j++) { //シートの内容を取得して返す

      if (j == dat[i].length) { //終了じは　）をつける
        header += head[j - 1] + ",APP_UID)";
        insertVal += "" + "?" + ",?)";
      }
      else {
        header += head[j - 1] + ",";
        insertVal += "" + "?" + ",";
      }
    }
    Logger.log(sql);

    sql = sql + header + " VALUES " + insertVal;
    Logger.log(sql);

    stmt = conn.prepareStatement(sql);
    var word = "";

    for (var j = 1; j <= dat[i].length; j++) { //シートの内容を取得して返す

      stmt.setObject(j, dat[i][j - 1]);
      word += "," + dat[i][j - 1];

      if (j == dat[i].length) {}
      else {}

    }

    stmt.setObject(17, a);

    var userProperties = PropertiesService.getUserProperties();
    var units2 = userProperties.getProperty('chatkey');
    var units4 = userProperties.getProperty('chatroomid');
    stmt.addBatch();
    var batch = stmt.executeBatch();
    conn.commit();
    Logger.log(sql);
  }
  //  return word;
}
