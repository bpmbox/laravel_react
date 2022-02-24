function testLogin3() {
  var dx = new ProcessMaker({
    token: 1111
  });
  Logger.log(dx.processmakerLogin());
}


function test3() {

  //var a =  new processmaker(1);
  // var cw = ChatWorkClient.factory({token:1111});
  var dx = new ProcessMaker({
    token: 1111
  });

  data = [{
      "prise": 4000,
      "JPN": 1212121212121,
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
  dx.restsetVariables(dx.caseid);
  var res = dx.getvariables(dx.caseid);
  //JSON.stringify(res)
  Logger.log(dx.ret);
}

function factory(config) {
  return new ProcessMaker(config);
};

function testfactory() {
  dx = factory({
    token: 11111
  });
  data = [{
        "prise": 4000,
        "JPN": 1212121212121,
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
    //  fa = dx.createCase("5634222795921ebd8884326071627847","2831154885921ebda7872e2098677860",2000,data);

  //  fa = dx.createCase("41152215356f300165c6188021810386","56791397856f313bd4ee169037912477",2000,data);

  fa = dx.createCase("4927727605d5aa3756f48d5066347332", "6259085535d5aa43e67d9e5021399520", 2000, data);

}

function testsetVariables2() {
  dx = factory({
    token: 11111
  });
  data = {
    "prise": 400555550,
    "JPN": 566666,
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

  try {
    fa = dx.restsetVariables("2513672735af3b37b0ffc94069998572", data);
  }
  catch (ex) {
    Logger.log(ex)
  }
}

function testgetvariables2() {




  dx = factory({
    token: 11111
  });
  data = [{
      "prise": 4000,
      "JPN": 1212121212121,
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
  try {
    fa = dx.getvariables("4828220975d9f0d0e831bc9065464303", data);
  }
  catch (ex) {
    Logger.log(ex)
  }
}

function testRoute() {

  dx = factory({
    token: 11111
  });
  data = [{
      "prise": 4000,
      "JPN": 1212121212121,
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
  try {
    data = "";
    fa = dx.routeCase("1955507235d4f829362bfe8012152928", data);
  }
  catch (ex) {
    Logger.log(ex)
  }
}


//getvariables


var processmaker = "";

function required(ss) {
  const str = "return new ProcessMaker(config)";
  eval(str);
}
/*
function restsetVariables(caseid){
}

function getvariables(caseid){
}
*/
/*
* ===================================================================================================================
* BPMとの通信
Your application "gas" was registered successfully!

Application Credentials

  * Client ID: ZFEXZLNLZOSERAJCAVBHCTLHEAQYFMEE
  * Client Secret: 6771303035af088c1420d63077845139

Next Steps

  * Make authorize requests
  * Get access tokens
*/

(function (global) {
  var ProcessMaker = (function () {

    //{token:"aaa"} などのオブジェクトが引数
    function ProcessMaker(config) {
      //this.admin = "admin";
      //this.pass = "1qa2wsx3edc@@@AAA";
      this.message = "";
      this.base_url = 'https://api.ProcessMaker.com/v2';
      this.headers = {
        'X-ProcessMakerToken': config.token
      };
      this.caseId = "";
      this.session = "";
      this.result = "";
      this.soapendpoint = "http://dev.bpmboxes.com/sysworkflow/en/neoclassic/services/soap2";
      this.ret = "";
      //this.restUrl = "https://trial32.processmaker.com/bpmchat0001/oauth2/token";
      this.restUrl = "https://bpms.bpmboxes.com/workflow/oauth2/token";
      //this.restUrl = "https://trial32.processmaker.com/bpmboxes0002/oauth2/token";


      this.$clientSecret = "5547816325d6a96718ec001044926301"; //bpmboxes
      //this.$clientSecret="6330544525b1528ac9e9da7002123465";


      //this.$username="admin";
      //this.$password="1qaz2wsx3edc@@@AAA";

      this.$username = "admin";
      this.$password = "1qaz2wsx3edc@@@AAA";


      this.$clientId = "TLYINPMNGNSLMBWYJSGMFMKKRHQMWDIQ";
      //this.$clientId="WWWZTKTEXJTRDRJYAAMHFQMFBFTDAUKW";


      this.url = "https://bpms.bpmboxes.com"; //PMREQUESTで使う値
      //this.url = "https://trial32.processmaker.com";//PMREQUESTで使う値


      this.worksplace = "workflow";

      //this.worksplace = "bpmboxes0002";


      this.caseid = "";
      this.ret = "";
      this.database = new database();

      this.pro_uid = '4927727605d5aa3756f48d5066347332';
      this.tas_uid = '6259085535d5aa43e67d9e5021399520';

    };


    /**
     * ログイン
     */
    ProcessMaker.prototype.processmakerLogin = function () {
      var $clientSecret = this.$clientSecret; //"7513856995a86383fab0789058808604";
      var $username = this.$username; //"admin";
      var $password = this.$password; //"1qaz2wsx3edc@@@";
      var $clientId = this.$clientId; //"MRXOPOTDZAKFNUOQJSHCNIZHQFSPBBFO";
      var $restUrl = this.restUrl;
      var $ret = "";
      const payload = {
        "grant_type": 'password',
        "scope": '*',
        "client_id": $clientId,
        "client_secret": $clientSecret,
        "username": $username,
        "password": $password
      };

      var headers = {
        "Accept": "application/json",
      };

      var options = {
        "method": "post",
        "payload": payload,
        "headers": headers,
        "muteHttpExceptions": true
      };
      Logger.log(options);
      try {
        $ret = UrlFetchApp.fetch(this.restUrl, options);
        Logger.log($ret);
        //$ret = $ret.getContentText();
        //$ret = $ret.getContent();
        $ret = JSON.parse($ret);

        Logger.log($ret["access_token"]);
        return $ret["access_token"];
      }
      catch (ex) {
        Logger.log(ex);
      }
    }

    //  function createCase(number){

    ProcessMaker.prototype.createCase = function (pid, tid, number, data) {
      var $token = this.processmakerLogin();

      const payload2 = data


      //ECCUBE
      var $datas1 = {
        'pro_uid': this.pro_uid,
        'tas_uid': this.tas_uid,
        'variables': payload2
      };

      var $datas = {
        'pro_uid': pid,
        'tas_uid': tid,
        'variables': payload2
      };


      var scriptProperties = PropertiesService.getScriptProperties();
      scriptProperties.setProperty('del_index', 1);
      $ret = this.pmRestRequest("/api/1.0/" + this.worksplace + "/cases", 'POST', $token, $datas);
      return $ret;
    }

    ProcessMaker.prototype.getResponse = function () {
      return this.ret;
    }

    //  function setVariables(name){
    ProcessMaker.prototype.restsetVariables = function (caseid, $datas) {
      var $token = this.processmakerLogin();
      // スクリプトプロパティ
      var scriptProperties = PropertiesService.getScriptProperties();
      // スクリプトプロパティからサイトの死活状態を取得
      var caseid = caseid; //scriptProperties.getProperty('caseid');

      const payload2 = [{
          "grant_type": 'passwordまじでたのむわ',
          "scope": '*',
      }]
        /*
        var $datas = {
          "JPN"      : 1,      //textbox with string variabl
          "clientName"      : 1,      //textbox with string variable
          "quantity"        : 56789,              //textbox with integer variable
          "amount"          : 12249.99,           //textbox with floating point variable
          "makeContact"     : ["1"],              //checkbox with boolean variable
          "howContact"      : ["email", "fax"],   //checkbox group with string variable
          "howContact_label": '["E-mail", "Fax"]',//labels of selected options in JSON string
          "payNow"          : "0",                //dropdown with boolean variable
          "howPay"          : "credit_card",      //dropdown with string variable
          "howPay_label"    : "Credit Card",      //label of selected option in dropdown
          "serviceDue"      : "2015-12-31",       //datetime
          "subcontractors"  : {                   //grid
            "1": {"name": "Smith & Wright",   "hasContract": "0"},
            "2": {"name": "A+ Lawn Services", "hasContract": "1"}
          }
        };*/

      // スクリプトプロパティ
      // var scriptProperties = PropertiesService.getScriptProperties();
      // スクリプトプロパティからサイトの死活状態を取得
      // var caseid =  scriptProperties.getProperty('caseid');


      this.pmRestRequest("/api/1.0/" + this.worksplace + "/cases/" + caseid + "/variable", 'PUT', $token, $datas);

    }

    /**
     * ROUTECASE del_index is pararel task,s route paramete that,s why standard version dose not needed
     */
    ProcessMaker.prototype.routeCase = function (caseid) {

      var $token = this.processmakerLogin();
      // スクリプトプロパティ
      //var scriptProperties = PropertiesService.getScriptProperties();
      // スクリプトプロパティからサイトの死活状態を取得
      //var caseid =  scriptProperties.getProperty('caseid');

      //var scriptProperties = PropertiesService.getScriptProperties();
      //var $del_index = scriptProperties.getProperty('del_index');

      var $datas = "";
      //scriptProperties.setProperty('del_index',parseInt($del_index)+1);

      return this.pmRestRequest("/api/1.0/" + this.worksplace + "/cases/" + caseid + "/route-case", 'PUT', $token, $datas);
    }


    //  function getvariables(){
    ProcessMaker.prototype.getvariables = function (caseid) {
      var $token = this.processmakerLogin();
      Logger.log("TOKEN is "+$token);
      
      // スクリプトプロパティ
      // var scriptProperties = PropertiesService.getScriptProperties();
      // スクリプトプロパティからサイトの死活状態を取得
      var caseid = caseid; //scriptProperties.getProperty('caseid');

      const payload2 = [{
        "grant_type": '',
        "scope": '*',
      }]

      var $datas = {
        "clientName": "Kelly Cline", //textbox with string variable
        "quantity": 56789, //textbox with integer variable
        "amount": 12249.99, //textbox with floating point variable
        "makeContact": ["1"], //checkbox with boolean variable
        "howContact": ["email", "fax"], //checkbox group with string variable
        "howContact_label": '["E-mail", "Fax"]', //labels of selected options in JSON string
        "payNow": "0", //dropdown with boolean variable
        "howPay": "credit_card", //dropdown with string variable
        "howPay_label": "Credit Card", //label of selected option in dropdown
        "serviceDue": "2015-12-31", //datetime
        "subcontractors": { //grid
          "1": {
            "name": "Smith & Wright",
            "hasContract": "0"
          },
          "2": {
            "name": "A+ Lawn Services",
            "hasContract": "1"
          }
        }
      };

      $datas = "";
      //caseid = "4991545635aa2c132aaa5f5047207487";
      

     this.pmRestRequest("/api/1.0/" + this.worksplace + "/cases/" + caseid + "/variables", 'GET', $token, $datas, "getvar");
   //this.pmRestRequest("/extrarest/cases/" + caseid + "/variables", 'GET', $token, $datas, "getvar");

    }



    /**
    BPMでのROUTECACE

    チャットワークに送信
    ＠var roomId
    @var message
    */
    ProcessMaker.prototype.postChatwork = function (roomId, message) {
      var payload = {
        "body": message
      };

      var headers = {
        "X-ChatWorkToken": chatworkToken
      };

      var options = {
        "method": "post",
        "payload": payload,
        "headers": headers
      };
      sendgitter(message);
      return UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
    }


    /**
    GOOGLE parameter BPM
    */
    ProcessMaker.prototype.blogger = function (title, message, url) {
      // ウェブ上の画像を取得する
      var image = UrlFetchApp.fetch('http://www.gochiusa.com/core_sys/images/contents/00000025/base/001.jpg');

      // Googleドライブ上の画像を取得する
      //var driveImage = DriveApp.getFilesByName("bluemountain.jpg").next();

      // インライン画像を表示する
      MailApp.sendEmail({
        to: 'miyataken9991.bpm999@blogger.com ',
        subject: title,
        htmlBody: message + '<iframe src="' + url + '"></iframe>',
        inlineImages: {
          千夜: image.getBlob(),
          //青山: driveImage.getBlob()
        }
      });
    }



    ProcessMaker.prototype.login = function () {
      xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
        '<soap:Header/>' +
        '<soap:Body>' +
        '<proc:login>' +
        '<proc:userid>admin</proc:userid>' +
        '<proc:password>1qaz2wsx3edc@@@</proc:password>' +
        '</proc:login>' +
        '</soap:Body>' +
        '</soap:Envelope>';

      var options = {
        "method": "post",
        "contentType": "text/xml",
        "payload": xml
      };

      var result = UrlFetchApp.fetch("http://chat.bpmboxes.com/sysworkflow/en/neoclassic/services/soap2", options);
      Logger.log(result);

      //あたいの取得
      var myRegexp = /message>([\s\S]*?)<\/ns1:message>/i;
      var match = myRegexp.exec(result);
      var title = match[1];
      this.session = match[1];
      // title = title.replace(/(^\s+)|(\s+$)/g, "");
      Logger.log(title);
      return this.session;

    }



    ProcessMaker.prototype.BPMROUTE = function (message) {
      xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
        '<soap:Header/>' +
        '<soap:Body>' +
        '<proc:login>' +
        '<proc:userid>admin</proc:userid>' +
        '<proc:password>1qaz2wsx3edc@@@</proc:password>' +
        '</proc:login>' +
        '</soap:Body>' +
        '</soap:Envelope>';

      var options = {
        "method": "post",
        "contentType": "text/xml",
        "payload": xml
      };

      var result = UrlFetchApp.fetch("http://chat.bpmboxes.com/sysworkflow/en/neoclassic/services/soap2", options);
      Logger.log(result);

      //あたいの取得
      var myRegexp = /message>([\s\S]*?)<\/ns1:message>/i;
      var match = myRegexp.exec(result);
      var title = match[1];
      this.session = match[1];
      // title = title.replace(/(^\s+)|(\s+$)/g, "");
      Logger.log(title);

      this.BPMROUTECASE(title, title, message);
      return this;

    }


    /*
    THiS IS ROUTE CASE
    */
    ProcessMaker.prototype.BPMROUTECASE = function (title, issue_user, message) {
        //ＲＯＵＴＥＣＡＳＥ
        var sessionid = this.login();
        xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
          '<soap:Header/>' +
          '<soap:Body>' +
          '<proc:newCaseRequest>' +
          '<proc:sessionId>' + sessionid + '</proc:sessionId>' +
          '<proc:processId>56068788759210c33c195e0057017114</proc:processId>' +
          '<proc:taskId>355017472593cc950ab8315004524271</proc:taskId>' +
          '<proc:variables>' +
          '<proc:name>routeIT</proc:name>' +
          '<proc:value>' + message + '</proc:value>' +
          '</proc:variables>' +
          '<proc:variables>' +
          '<proc:name>routeAssets</proc:name>' +
          '<proc:value>' + '1' + '</proc:value>' +
          '</proc:variables>' +
          '</proc:newCaseRequest>' +
          '</soap:Body>' +
          '</soap:Envelope>';

        Logger.log(xml);

        var options = {
          "method": "post",
          "contentType": "text/xml",
          "payload": xml
        };
        //https://trial32.processmaker.com/sysbpmboxes
        var result = UrlFetchApp.fetch("http://chat.bpmboxes.com/sysworkflow/en/neoclassic/services/soap2", options);
        Logger.log(result);
        var value = result.getContentText(); // 置換対象の文字列
        postChatwork("93806631", value);

        var before = "ns1:"; // 置換前の文字 (変数に代入
        var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
        var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
        var before = "env:"; // 置換前の文字 (変数に代入)
        var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
        var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
        Logger.log(value);
        var document = XmlService.parse(value); //result);//.getContentText());
        var items = document.getRootElement().getChildren('Body')[0].getChildren('newCaseResponse');
        var total = 0;
        var caseId = "";

        for (var i = 0; i < items.length; i++) {
          Logger.log(items);
          Logger.log("" + items[i].getText());
          var title = items[i].getChild("timestamp").getText();
          Logger.log(title);
          var title = items[i].getChild("message").getText();
          Logger.log(title);
          var caseId = items[i].getChild("caseId").getText();
          Logger.log(caseId);


          total += Number(items[i].getText());
        }
        var totalElement = XmlService.createElement('total').setText(total);
        //root.addContent(totalElement);
        xml = XmlService.getPrettyFormat().format(document);
        Logger.log(xml);
        this.result = value;
        //Logger.log(result);
        //作業をすすめる
        this.sendVariables(sessionid, caseId, message);
        this.routeCase(sessionid, caseId);
        return this;

      }
      /**
      データ送信
      @params sessioin
      @params caseId
      @pramase message 送信内容
      */

    ProcessMaker.prototype.sendVariables = function (session, caseId, message) {
      //ＲＯＵＴＥＣＡＳＥ
      var sessionid = session;
      //sessionid = this.login();
      xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
        '<soap:Header/>' +
        '<soap:Body>' +
        '<proc:sendVariablesRequest>' +
        '<proc:sessionId>' + sessionid + '</proc:sessionId>' +
        '<proc:caseId>' + caseId + '</proc:caseId>' +
        '<proc:variables>' +
        '<proc:name>aaaaaaaaaaaaaaaa</proc:name>' +
        '<proc:value>' + message + '</proc:value>' +
        '</proc:variables>' +
        '</proc:sendVariablesRequest>' +
        '</soap:Body>' +
        '</soap:Envelope>';

      Logger.log(xml);

      var options = {
        "method": "post",
        "contentType": "text/xml",
        "payload": xml
      };
      //https://trial32.processmaker.com/sysbpmboxes
      var result = UrlFetchApp.fetch("http://chat.bpmboxes.com/sysworkflow/en/neoclassic/services/soap2", options);
      Logger.log(result);

      var value = result.getContentText(); // 置換対象の文字列
      var before = "ns1:"; // 置換前の文字 (変数に代入
      var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
      var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
      var before = "env:"; // 置換前の文字 (変数に代入)
      var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
      var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
      Logger.log(value);
      var document = XmlService.parse(value); //result);//.getContentText());
      Logger.log(value);
      var items = document.getRootElement().getChildren('Body')[0].getChildren('pmResponse')[0];
      /* 修正箇所 B ここまで */
      var text
        // 取得した記事データをループさせる
      for (var i = 0; i < items.length; i++) {
        /* 修正箇所 C */
        // 記事のタイトル
        var title = items[i].getChild("message").getText();
        // テキストをつくる
        text = text + title; // + ' ' + url;
        // ログに吐く

      }
      Logger.log(text);
    }


    ProcessMaker.prototype.processList = function (session, caseId) {
      //ＲＯＵＴＥＣＡＳＥ
      var sessionid = session;
      sessionid = this.login();
      xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
        '<soap:Header/>' +
        '<soap:Body>' +
        '<proc:processListRequest>' +
        '<proc:sessionId>' + sessionid + '</proc:sessionId>' +
        '</proc:processListRequest>' +
        '</soap:Body>' +
        '</soap:Envelope>';

      Logger.log(xml);

      var options = {
        "method": "post",
        "contentType": "text/xml",
        "payload": xml
      };
      //https://trial32.processmaker.com/sysbpmboxes
      var result = UrlFetchApp.fetch(this.soapendpoint, options);
      Logger.log(result);

      var value = result.getContentText(); // 置換対象の文字列
      var before = "ns1:"; // 置換前の文字 (変数に代入
      var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
      var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
      var before = "env:"; // 置換前の文字 (変数に代入)
      var regExp = new RegExp(before, "g"); // 変数でRegExpオブジェクトを作成
      var value = value.replace(regExp, ""); // 置換を実行 ( → あいくえおあいくえお )
      Logger.log(value);
      var document = XmlService.parse(value); //result);//.getContentText());
      var items = document.getRootElement().getChildren('Body')[0].getChildren('processListResponse')[0].getChildren('processes');
      /* 修正箇所 B ここまで */
      var text
        // 取得した記事データをループさせる
      for (var i = 0; i < items.length; i++) {
        /* 修正箇所 C */
        // 記事のタイトル
        var title = items[i].getChild("guid").getText();
        // テキストをつくる
        text = text + title; // + ' ' + url;
        // ログに吐く

      }
      Logger.log(text);
    }


    ProcessMaker.prototype.SOAProuteCase = function (session, caseId) {
        //ＲＯＵＴＥＣＡＳＥ
        postChatwork("93806631", session + "_" + caseId);
        //var sessionid = this.login();
        xml = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:proc="http://www.processmaker.com">' +
          '<soap:Header/>' +
          '<soap:Body>' +
          '<proc:routeCaseRequest>' +
          '<proc:sessionId>' + session + '</proc:sessionId>' +
          '<proc:caseId>' + caseId + '</proc:caseId>' +
          '<proc:delIndex>1</proc:delIndex>' +
          '</proc:routeCaseRequest>' +
          '</soap:Body>' +
          '</soap:Envelope>';

        Logger.log(xml);

        var options = {
          "method": "post",
          "contentType": "text/xml",
          "payload": xml
        };
        //https://trial32.processmaker.com/sysbpmboxes
        var result = UrlFetchApp.fetch(this.soapendpoint, options);
        //postChatwork("93806631",this.soapendpoint);


        // 置換対象の文字列
        var value = result.getContentText();

        //postChatwork("93806631",value);

        // 置換前の文字 (変数に代入)
        var before = "ns1:";
        // 変数でRegExpオブジェクトを作成
        var regExp = new RegExp(before, "g");
        // 置換を実行 ( → あいくえおあいくえお )
        var value = value.replace(regExp, "");
        // 置換前の文字 (変数に代入)
        var before = "env:";
        // 変数でRegExpオブジェクトを作成
        var regExp = new RegExp(before, "g");
        // 置換を実行 ( → あいくえおあいくえお )
        var value = value.replace(regExp, "");
        Logger.log(value);
        var document = XmlService.parse(value); //result);//.getContentText());
        var items = document.getRootElement().getChildren('Body')[0].getChildren('routeCaseResponse')[0].getChildren("routing");
        var total = 0;
        var caseId = "";

        for (var i = 0; i < items.length; i++) {
          Logger.log(items);
          Logger.log("processmakr line 642" + items[i].getText());
          //  var title = items[i].getChild("timestamp").getText();
          //  Logger.log(title);
          //  var title = items[i].getChild("message").getText();
          // Logger.log(title);
          var caseId = items[i].getChild("taskId").getText();
          Logger.log(caseId);


          total += Number(items[i].getText());
        }
        this.result = result;
        Logger.log(result);
      }
      /**
       * 自分のルーム一覧を取得
       */
    ProcessMaker.prototype.getRooms = function () {
      return this.get('/rooms');
    };


    ProcessMaker.prototype.getResult = function () {
        return this.result;
      }
      /**
       * 自分のルーム一覧を取得
       */
    ProcessMaker.prototype.getRooms = function () {
      return this.get('/rooms');
    };

    /**
     * メッセージ送信
     */
    ProcessMaker.prototype.sendMessage = function (params) {
      var post_data = {
        'body': params.body
      }

      return this.post('/rooms/' + params.room_id + '/messages', post_data);
    };

    /**
     * マイチャットへのメッセージを送信
     */
    ProcessMaker.prototype.sendMessageToMyChat = function (message) {
      var mydata = this.get('/me');

      return this.sendMessage({
        'body': message,
        'room_id': mydata.room_id
      });
    };

    /**
     * タスク追加
     */
    ProcessMaker.prototype.sendTask = function (params) {
      var to_ids = params.to_id_list.join(',');
      var post_data = {
        'body': params.body,
        'to_ids': to_ids,
        'limit': (new Number(params.limit)).toFixed() // 指数表記で来ることがあるので、intにする
      };

      return this.post('/rooms/' + params.room_id + '/tasks', post_data);
    };

    /**
     * 指定したチャットのタスク一覧を取得
     */
    ProcessMaker.prototype.getRoomTasks = function (room_id, params) {
      Logger.log(room_id + "=" + params);
      return this.get('/rooms/' + room_id + '/tasks', params);
    };

    /**
     * 自分のタスク一覧を取得
     */
    ProcessMaker.prototype.getMyTasks = function (params) {
      return this.get('/my/tasks', params);
    };


    ProcessMaker.prototype._sendRequest = function (params) {

      Logger.log(params);
      var url = this.base_url + params.path;
      var options = {
        'method': params.method,
        'headers': this.headers,
        'payload': params.payload || {}
      };
      result = UrlFetchApp.fetch(url, options);
      Logger.log(result);
      // リクエストに成功していたら結果を解析して返す
      if (result.getResponseCode() == 200) {
        return JSON.parse(result.getContentText())
      }

      return false;
    };

    ProcessMaker.prototype.post = function (endpoint, post_data) {
      return this._sendRequest({
        'method': 'post',
        'path': endpoint,
        'payload': post_data
      });
    };

    ProcessMaker.prototype.put = function (endpoint, put_data) {
      return this._sendRequest({
        'method': 'put',
        'path': endpoint,
        'payload': put_data
      });
    };

    ProcessMaker.prototype.get = function (endpoint, get_data) {
      get_data = get_data || {};

      var path = endpoint

      // get_dataがあればクエリーを生成する
      // かなり簡易的なので必要に応じて拡張する
      var query_string_list = [];
      for (var key in get_data) {
        query_string_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(get_data[key]));
      }

      if (query_string_list.length > 0) {
        path += '?' + query_string_list.join('&');
      }

      return this._sendRequest({
        'method': 'get',
        'path': path
      });
    };


    // function pmRestRequest(uri,type,token,data){
    ProcessMaker.prototype.pmRestRequest = function (uri, type, token, data, fntype) {
      Logger.log("Request" + " " + uri + type + token + data + fntype + " ");
      /*
      const $clientSecret="7513856995a86383fab0789058808604";
      const $username="admin";
      const $password="1qaz2wsx3edc@@@";
      const $clientId="MRXOPOTDZAKFNUOQJSHCNIZHQFSPBBFO";
      const $url = "http://chat.bpmboxes.com";
      */
      /* 初期化 */
      var $clientSecret = this.$clientSecret; //"7513856995a86383fab0789058808604";
      var $username = this.$username; //"admin";
      var $password = this.$password; //"1qaz2wsx3edc@@@";
      var $clientId = this.$clientId; //"MRXOPOTDZAKFNUOQJSHCNIZHQFSPBBFO";
      var $url = this.url; //this.restUrl;

      const $debug = 0;
      var $respons = [];
      // スクリプトプロパティ
      var scriptProperties = PropertiesService.getScriptProperties();
      var result2 = "";
      var result = "";
      var $ret = "";
      var headers = {
        //  "Accept": "application/json",
        'Content-type': 'application/json; charset=utf-8',
        "Authorization": " Bearer " + token
      };

      if (data != "") //dataがなかったら
        data = JSON.stringify(data);
      //postChatwork("93806631",data);
      var options = {
        "method": type,
        "payload": data,
        "headers": headers,
        "muteHttpExceptions": true
      };

      try {
        //postChatwork("93806631",options);
        Logger.log($url+uri)
        $ret = UrlFetchApp.fetch($url + uri, options); //文字列でかえってくる

        Logger.log(JSON.stringify($ret))
        Logger.log("=====================================")

        // if(fntype=="getvar")
        this.ret = $ret.getContentText();
        Logger.log(this.ret);

        Logger.log($ret);
        this.postChatwork("93806631", "結果 LINE 442" + $ret);

        result2 = $ret;
        //$ret = $ret.getContentText();
        //$ret = $ret.getContent();
        if ($debug == 1) //ＡＰＩＵＲＬ
          this.postChatwork("93806631", "[info][title]LINE rest program 443 process[/title] " + uri + "[/info]");
        /* JSON データがあればパースして表示 */
        try {
          var $ret2 = JSON.parse($ret); //OBJECTにする
          result = "[info][title]" + uri + "[/title]";
          var key = "";

          for (var key in $ret2) {
            result += key + ': ' + $ret2[key] + "\r\n";
            //postChatwork("93806631",key + ': ' + $ret2[key]);
            if (key == "current_task") {
              for (i = 0; i < $ret2[key].length; i++) {
                result += $ret2[key][i]["delStatus"] + "============";
                //$ret23 = JSON.parse($ret2[key]);//オブジェストにする
                //result = "[info][title]"+uri+"[/title]";
                for (var key2 in $ret2[key][i])
                  result += key2 + ': ' + $ret2["current_task"][i][key2] + "\r\n";
              }
            }
          }

          result += "[/info]";
          //if($debug==1)
          this.postChatwork("93806631", "[info][title]REST 464 作業情報[/title]REST 464" + result + "[/info]"); //データを整形して送信

        }
        catch (e) {
          //if($debug==1)
          this.postChatwork("93806631", "[info][title]作業内容[/title]REST 464 error " + e + "[/info]"); //データを整形して送信

        }

        //オブジェクトデータ送信
        //postChatwork("93806631","rest line 404"+$ret+"SEND");
        //Logger.log("LINE301 "+uri+$ret);
        scriptProperties.setProperty('ps', $ret); //スクリプトデータにプロセスの登録

        if ($debug == 1)
          this.postChatwork("93806631", "[info][title]プロセスＩＤの設定[/title]scriptProperties.setProperty('ps', $ret)[/info]");

        this.postChatwork("93806631", "結果は" + $ret);

        if ($ret != "") {
          $ret = JSON.parse($ret);
          //Logger.log($ret.app_uid);

          // スクリプトプロパティからサイトの状態を取得
          //var siteStat =  scriptProperties.getProperty('SITE_STAT');
          if ($ret.app_uid != undefined) {
            /* 現在のケースIDを設定 */
            scriptProperties.setProperty('caseid', $ret.app_uid);
            this.caseid = $ret.app_uid;
            /* Spread sheet に　データの登録 */
            //SpreadsheetApp.openById(spreadsheetId).getSheetByName('BPMS').getRange(3,4).setValue($ret.app_uid);
          }

          //return $ret.app_uid;
        }

        this.postChatwork("93806631", "結果は" + JSON.stringify($ret));
        var scriptProperties = PropertiesService.getScriptProperties();

        // スクリプトプロパティからサイトのCASEIDを取得

        var caseid = scriptProperties.getProperty('caseid');

        return '' + caseid + '';

      }
      catch (ex) {
        this.postChatwork("93806631", ex);
        Logger.log(ex);
      }
    }

    /**
    チャットワークに送信
    ＠var roomId
    @var message
    */
    ProcessMaker.prototype.postChatwork = function (roomId, message) {
        var payload = {
          "body": message
        };

        var headers = {
          "X-ChatWorkToken": chatworkToken
        };

        var options = {
          "method": "post",
          "payload": payload,
          "headers": headers
        };

        //curl -X POST -H "X-ChatWorkToken: 自分のAPIトークン" -d "
        //body=Buy+milk&limit=1385996399&to_ids=1%2C3%2C6" "https://api.chatwork.com/v2/rooms/{room_id}/tasks"

        //appendRow(["a man", e.postData, "panama"]);//

        //  SpreadsheetApp.openById(spreadsheetId).getSheetByName('作業ログ').appendRow(["作業ログ",message, "panam"]);


        try {
          //$ret = createCase(message);
          /* database に登録 */
          //this.exec_Mysql("insert into WEBSOCKET (WORD) VALUES ('"+message+"')");
          UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + chatworkroom + "/messages", options);
          this.sendgitter(message);
          return "chatwork 38"; //UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
        }
        catch (ex) {
          console.log(ex);
        }


      }
      /* データベース登録 */
    ProcessMaker.prototype.exec_Mysql = function (sql) {
      /* phpの場合も書いておけばいい

      */
      // #information_Schema
      //select * from `COLUMNS` where TABLE_NAME = "Eoc"
      var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow', 'admin', '1qaz2wsx3edc@@@');
      var stmt = conn.createStatement();
      var rs = stmt.execute(sql);

      stmt.close();
      conn.close();
      var end = new Date();
      return end;
      //Logger.log('Time elapsed: ' + (end.getTime() - start.getTime()));
    }

    /* セルにデータ設定 */

    ProcessMaker.prototype.SHEET_InputCell = function () {
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      var doc = doc.getActiveSheet();
      //doc.clear();
      var cell = doc.getRange("a1").setValue(3333333333333333);


      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      sheet.getActiveCell().setValue('選択セルに値をセット');

      sheet.getActiveSelection().setValue('複数セルに値セット');

      sheet.getRange('A5').setValue('A5に値をセット').setBackgroundColor('#eee');

      sheet.getRange(sheet.getLastRow() + 1, sheet.getLastColumn()).
      setValue('最終列の最終行+1に値をセット');

    }

    ProcessMaker.prototype.insertRecord = function () {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      Logger.log("==================================")
      var first = ss.getSheetByName("見積書");

      a = first.getRange('r1').setValue(fa);


      $sql = "insert into (A,B,C,D,E,F,G) VALUES ()";



      //'jdbc:mysql://[ホスト名(IPアドレス)]:[ポート番号]/[DB名]';
      var con_str = 'jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow';
      var user_id = 'admin';
      var user_pass = '1qaz2wsx3edc@@@';

      var conn = Jdbc.getConnection(con_str, user_id, user_pass);
      var stmt = conn.createStatement();
      stmt.setMaxRows(100);






      rowContents = ["=ROW()", a, b, c, d, e, f, g, h, h, j, k, l];
      var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("all").appendRow(rowContents);

      var data = SpreadsheetApp
        .getActiveSpreadsheet()
        // .openById('1234567890abcdefghijklmnopqrstuvwxyz')
        .getSheetByName("見積書")
        .getDataRange()
        .getValues();

      for (var i = 17; i < 29; i++) {
        var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("all").appendRow(data[i]);
      }
      /*?>
      <table>
      <? for (var i = 0; i < data.length; i++) { ?>
      <tr>
      <? for (var j = 0; j < data[i].length; j++) { ?>
      <td><?= data[i][j] ?></td>
      <? } ?>
      </tr>
      <? } ?>*/

      var stmt2 = conn.prepareStatement('insert into PMT_SITE_REGISTRATION (A,B,C,D,E,F,G,H,I,J,K,L)' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
      stmt2.setString(1, a);
      stmt2.setString(2, b);
      stmt2.setString(3, c);
      stmt2.setString(4, d);
      stmt2.setString(5, e);
      stmt2.setString(6, f);
      stmt2.setString(7, g);
      stmt2.setString(8, h);
      stmt2.setString(9, i);
      stmt2.setString(10, j);
      stmt2.setString(11, k);
      stmt2.setString(12, l);

      stmt2.execute();



      //クエリを記載
      var str_query = 'select * from BPMBOXTEST;';

      var rs = stmt.executeQuery(str_query);
      var row = 1;
      var str = '';

      while (rs.next()) {
        //getStringで列名を指定して取得
        str += rs.getString('TIME');
        str += '\n';
        row++;
      }
      rs.close();
      stmt.close();
      conn.close();
    }

    /*
    GITTERに送信
    ＠var roomId
    @var message
    */
    ProcessMaker.prototype.sendgitter = function (word) {
      var payload = {
        "text": "```\r\n" + word + "```\r\n"
      };

      var headers = {
        "Accept": "application/json",
        "Authorization": "Bearer 3feaeeffcf6ab2c8961703fa2bc0f4900803a88f",
      };

      var options = {
        "method": "post",
        "payload": payload,
        "headers": headers
      };
      try {
        //  return UrlFetchApp.fetch("https://api.gitter.im/v1/rooms/5a68bae1d73408ce4f89f15c/chatMessages", options);

      }
      catch (ex) {
        Logger.log(ex);
      }

    }




    return ProcessMaker;
  })();
  global.ProcessMaker = ProcessMaker;
})(this)
