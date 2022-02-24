/**
シートから取得する
*/
function setProperty() {
  getPropertyStore_().setProperties({
    "spreadsheetId": "1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI",
    "chatworkToken": "ed472827b8dda0ba81ba586c8b0e4bd9",
    "line_reply_url": "https://notify-api.line.me/api/notify"
  });
  Logger.log(JSON.stringify(PropertiesService.getUserProperties().getProperties()));
}
/**
Propertyから取得する
*/
function getProperty() {
  var schema = PropertiesService.getScriptProperties().getProperty("test");
}

//message
function translater(message, url) {
  //ここにAIをいれて　フロントで表示しよう
  //Firabase search はバックエンドでやろう
  return LanguageApp.translate(message, "", "en");
  return message+"chat 21<a href='aaaa'>ddd</a>"
  //(message)
  if (message.length > 10000000)
    return "100文字以内で質問してください";
  if (message.length > 10000000) {
    //  sendblog("１００文字以内です", "１００文字以内です", "１００文字以内です");
    return false;
  }
  /*
      アクセス回数の記録
      */
  setPropertyCount("count");
  count = getPropertyCount();
  if (count > 2000)
    return count;
  //keitaisoJC = LanguageApp.translate(message,"en", "ja");
  try {
    var keitaisoJA = LanguageApp.translate(message, "", "en");
    //      postChatwork("d93806631", message);
    //       postChatwork("d93806631", keitaisoJA);
    /*
    postChatwork("93806631","CODE 318 start trans")
 
    postChatwork("93806631",message)
    postChatwork("93806631",keitaisoJA)
 
    postBpmchat("93806631",message + "" + keitaisoJA,url)
    //postChatwork("93806631",message + " " + keitaisoJA)
    postChatwork("93806631","CODE 320 end trans ")
    //postBpmchat("93806631",message,url)
    //postBpmchat("93806631",keitaisoJA,url)
    //postBpmchat("93806631",keitaisoJA,url)
    */
  }
  catch (ex) {
    //  postChatwork(ex);
  }
  return keitaisoJA;
}

function getLKKBTC() {
  var url = 'https://www.lykke.com/exchange';
  var html = UrlFetchApp.fetch(url).getContentText();
  var searchstring = '<td class="ask_BTCLKK">';
  var index = html.search(searchstring);
  if (index >= 0) {
    var pos = index + searchstring.length
    var rate = html.substring(pos, pos + 6);
    rate = parseFloat(rate)
    rate = 1 / rate
    return parseFloat(rate);
  }
  throw "Failed to fetch/parse data from " + url;
}

function getElementById(element, idToFind) {
  var descendants = element.getDescendants();
  for (i in descendants) {
    var elt = descendants[i].asElement();
    if (elt != null) {
      var id = elt.getAttribute('id');
      if (id != null && id.getValue() == idToFind) return elt;
    }
  }
}

function getElementsByClassName(element, classToFind) {
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);
  for (i in descendants) {
    var elt = descendants[i].asElement();
    if (elt != null) {
      var classes = elt.getAttribute('class');
      if (classes != null) {
        classes = classes.getValue();
        if (classes == classToFind) data.push(elt);
        else {
          classes = classes.split(' ');
          for (j in classes) {
            if (classes[j] == classToFind) {
              data.push(elt);
              break;
            }
          }
        }
      }
    }
  }
  return data;
}

function getElementsByTagName(element, tagName) {
  var data = [];
  var descendants = element.getDescendants();
  for (i in descendants) {
    var elt = descendants[i].asElement();
    if (elt != null && elt.getName() == tagName) data.push(elt);
  }
  return data;
}


function testChat() {
  // postChatwork("93850451","test");
  // postChatwork("93807357","test");
  postChatwork("109354026", "test");
}

/**
チャットワークに送信
＠var roomId
@var message
*/
function postChatwork(roomId, message) {
  //var chatworkToken = 'e4fe18a253ca9275067c53abc42171ea'; //TOKEのIDで応答がうる
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

  //SpreadsheetApp.openById(spreadsheetId).getSheetByName('作業ログ').appendRow(["作業ログ",message, "panam"]);


  try {
    //$ret = createCase(message);
    //exec_Mysql("insert into WEBSOCKET (WORD) VALUES ('"+message+"')");
    //sendgitter(message);
    UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
    return "chatwork 38"; //UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
  }
  catch (ex) {
    console.log(ex);
  }


}

function onPostChatwork() {

  var userProperties = PropertiesService.getUserProperties();
  var units2 = userProperties.getProperty('chatkey');
  var units4 = userProperties.getProperty('chatroomid');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var first = ss.getSheetByName("chatwork");

  a = first.getRange('a2').getValue();

  postChatwork(units2, units4, a);
}


function test_postChatwork_light() {
  postChatwork_light("109354026", "test");
}


/**
チャットワークに送信
＠var roomId
@var message
*/
function postChatwork_light(roomId, message) {

  //var chatworkToken = 'e4fe18a253ca9275067c53abc42171ea'; //TOKEのIDで応答がうる
  //var myAccountId = '2831794'; //botidからの送信は除外
  //var roomid = '93807357'


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

  // SpreadsheetApp.openById(spreadsheetId).getSheetByName('作業ログ').appendRow(["作業ログ",message, "panam"]);


  try {
    //$ret = createCase(message);
    //   exec_Mysql("insert into WEBSOCKET (WORD) VALUES ('"+message+"')");
    //sendgitter(message);
    //93806631
    //93807357
    UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + chatworkroom + "/messages", options);
    return "chatwork 38"; //UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
  }
  catch (ex) {
    console.log(ex);
  }

}
