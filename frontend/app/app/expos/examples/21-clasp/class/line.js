function LineNotify(word) {
  var url = "https://notify-api.line.me/api/notify";
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer iduGfA4FZTNxcCI3IwMJlnaN8taWN4xsuyQcXYIWfyS',
  };
  var postData = {
    'message': 'Hello, World!'
  }
  var options = {
    "method": "post",
    "headers": headers,
    "payload": (postData)
  };
  UrlFetchApp.fetch(url, options);
}


//CHANNEL_ACCESS_TOKENを設定
//LINE developerで登録をした、自分のCHANNEL_ACCESS_TOKENを入れて下さい

function getDoc() {
  var doc = DocumentApp.openById("3434343434343");
}

// 画像とか取得するやつ
function get_line_content(message_id) {
  var CHANNEL_ACCESS_TOKEN = 'ckz5Qr307SlumiVfWtBcEIy+m62a6L5CFvJMWNfea+qQmY7H7RI9EbfN8aE/uSQlxNPS4U6j+fdkJpWMIG1D4TU36wr+ASj8cLDXdAC7tIJBjv5eVGR3tdGqb29dzAkg8CBlO/sZnSQdIgTUHljX4AdB04t89/1O/w1cDnyilFU=';

  var headers = {
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN //getProp('CHANNEL_ACCESS_TOKEN')
  };
  var options = {
    'method': 'GET',
    'headers': headers
  };
  var url = 'https://api.line.me/v2/bot/message/' + message_id + '/content';
  var blob = UrlFetchApp.fetch(url, options).getBlob();
  return blob;
}

// OCRするやつ
function ocr(imgBlob) {
  var resource = {
    title: imgBlob.getName(),
    mimeType: imgBlob.getContentType()
  };
  var options = {
    ocr: true
  };
  try {
    var imgFile = Drive.Files.insert(resource, imgBlob, options);
    var doc = DocumentApp.openById(imgFile.id);
    var text = doc.getBody().getText().replace("\n", "");
    var res = Drive.Files.remove(imgFile.id);
  }
  catch (e) {
    postChatwork_light("", 'err in ocr::ocr: ' + e)
      //spreadsheetLog('err in ocr::ocr: '+e);
    return 'err';
  }
  return text;
}



//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function line(e) {
  var json = JSON.parse(e.postData.contents);
  /*if (json.events[0].message.type = 'image') {
     postChatwork_light("",'OCR STAR')

      var blob = get_line_content(json.events[0].message.id);
      // 全部画像として扱っちゃう
      var text = ocr(blob);
      reply(json, text);
    }

  return
  */
  var CHANNEL_ACCESS_TOKEN = 'ckz5Qr307SlumiVfWtBcEIy+m62a6L5CFvJMWNfea+qQmY7H7RI9EbfN8aE/uSQlxNPS4U6j+fdkJpWMIG1D4TU36wr+ASj8cLDXdAC7tIJBjv5eVGR3tdGqb29dzAkg8CBlO/sZnSQdIgTUHljX4AdB04t89/1O/w1cDnyilFU=';
  var line_endpoint = 'https://api.line.me/v2/bot/message/reply';


  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token = json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //送られたLINEメッセージを取得
  var user_message = json.events[0].message.text;
  var googlemessage = "";
  postChatwork_light("", "LINEからの検索テスト　フォーマット確認中 " + user_message)
  googlemessage = GOOGLESEARCHAPI(user_message)

  //postWEBSOCKET(user_message)
  //返信する内容を作成
  var reply_messages = "";
  if ('たかい' == user_message) {
    //かっこいいと入力された際
    reply_messages = ['「' + user_message + '」ですね？\n' + '「' + user_message + '」はこちらになります。\n' + 'https://hogehoge.com', ];
    postChatwork_light("", reply_messages[0])

  }
  else if ('やすい' == user_message) {
    //かわいいと入力された際
    reply_messages = ['「' + user_message + '」ですね？\n' + '「' + user_message + '」はこちらになります。\n' + 'https://hogehoge.com', ];
    postChatwork_light("", reply_messages[0])

  }
  else if ('他店' == user_message) {
    //普通と入力された際
    reply_messages = ['「' + user_message + '」ですね？\n' + '「' + user_message + '」はこちらになります。\n' + 'https://hogehoge.com', ];
    postChatwork_light("", reply_messages[0])

  }
  else {
    //かっこいい、かわいい、普通が入力されたときの処理
    reply_messages = [googlemessage + "\r\n\r\n" + '「たかい」、「やすい」、「他店」で入力してくださいね！'];
    postChatwork_light("", reply_messages[0])
  }


  // メッセージを返信
  var messages = reply_messages.map(function (v) {
    //return {'type': 'text', 'text': v};
    return {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "actions": [
          {
            "type": "message",
            "label": "Mart",
            "text": "Mart"
      },
          {
            "type": "message",
            "label": "Oil",
            "text": "Oil"
      },
          {
            "type": "message",
            "label": "Telephone charges",
            "text": "Telephone charges"
      },
          {
            "type": "message",
            "label": "Cafeteria",
            "text": "Cafeteria"
      }
    ],
        "title": "Question 1",
        "text": "Where do you spend your money most ? "
      }
    }
  });
  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({
    'content': 'post ok'
  })).setMimeType(ContentService.MimeType.JSON);
}
