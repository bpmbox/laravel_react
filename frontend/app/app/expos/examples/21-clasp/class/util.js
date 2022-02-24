/**
 * Convert Japanese KANJI to HIRAGANA/KATAKANA by goo LAB API.
 *
 * @param {string} input The value of cell to convert.
 * @param {boolean} output_type The flag of convert type. TRUE: HIRAGANA, FALSE: KATAKANA.
 * @return The converted value that specified in output_type param.
 * @customfunction
 * @author Noriaki UCHIYAMA (twitter: @noriaki)
 */
function KANA(input, output_type) {
  output_type = output_type ? "hiragana" : "katakana";
  return perform(output_type, input);
}

// --- 和暦から西暦変換
//    引数は「和暦英数YY/MM/DD」 例示 S56/07/23
//        和暦英数　H・・・平成
//        　　　　　S・・・昭和
//        　　　　　T・・・大正
//        　　　　　M・・・明治
//    返り値は、文字列扱いとなっているため、シリアル値（日付データ）として扱うにはVALUE関数を使用する
//    例示　=VALUE(waToAD("S56/07/23"))
function waToAd(n) {
  var wa = n.substring(0, 1);
  var data = n.split("/")
  var nen = data[0].substring(1, 3);
  var tuki = data[1];
  var hi = data[2];
  var ans;
  nen = parseInt(nen);

  if ((wa == "H") && (nen > 0) && (nen < 99)) {
    ans = 1988 + nen;
  }
  else if ((wa == "S") && (nen > 0) && (nen < 65)) {
    ans = 1925 + nen;
  }
  else if ((wa == "T") && (nen > 0) && (nen < 16)) {
    ans = 1911 + nen;
  }
  else if ((wa == "M") && (nen > 0) && (nen < 46)) {
    ans = 1867 + nen;
  }
  else {
    ans = "計算不能"
  }

  ans = ans + "/" + tuki + "/" + hi;

  return ans;
}
// --- 西暦から和暦変換
//    引数は文字列とする（YYYY/MM/DD)
//    書式を自動設定とした場合、引数がシリアル値（日付データ）となり
//    正しい返り値にならない
//    返り値は、文字列として扱われる為、日付順のソートなどはできない
function AdToWa(n) {
  var data = n.split("/")
  var nen = data[0];
  var tuki = data[1];
  var hi = data[2];
  var wa;
  var ba;
  var ans;
  nen = parseInt(nen);

  if (1868 > nen) {}
  else if (1912 > nen) {
    ba = 1868;
    wa = "M";
  }
  else if (1926 > nen) {
    ba = 1912;
    wa = "T";
  }
  else if (1989 > nen) {
    ba = 1926;
    wa = "S";
  }
  else {
    ba = 1989;
    wa = "H";
  }

  ans = wa + (nen - ba + 1);

  ans = ans + "/" + tuki + "/" + hi;

  return ans;

}

function checkjson() {
  //ここで　データマップのテスト　caseid のJSONを取得していれる
  data = {
    "SYS_LANG": "en",
    "SYS_SKIN": "neoclassic",
    "SYS_SYS": "workflow",
    "APPLICATION": "6882608465acf1a225ef640089666699",
    "PROCESS": "8608639325ab67a9aede0e9004982104",
    "TASK": "6327686505ab67acabc7d34071107372",
    "INDEX": 1,
    "USER_LOGGED": "00000000000000000000000000000001",
    "USR_USERNAME": "",
    "APP_NUMBER": "18170",
    "PIN": "LE35",
    "prise": 4000,
    "a": "https:\/\/script.google.com\/macros\/d\/MW92VVoGXGb80Xrq-h9Umrlm3UXrA17ub\/edit?uiv=2&mid=ACjPJvFd56_kexFLlpO3BfGYrDodPJlGSIO9MUZb7DqWGLpQFVRi7UKmLCDY5rFNPSPFdXbknDV2b-0Nx99lkTUWTy1q1rCAk1CXfku0d7fpgcdUNkc9eapsXsAuUdEBzKtKP_mxc3dckg",
    "b": "宮田健一",
    "c": "平成21年8月6時",
    "d": 40854,
    "e": "ssssssssssssssss",
    "JPN": 1,
    "webhook_setting_id": "宮田健一",
    "webhook_event_type": "平成21年8月6時",
    "webhook_event_time": 1519552132,
    "subcontractors": {
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
    },
    "clientName": 1,
    "quantity": 56789,
    "amount": 12249.99,
    "makeContact": ["1"],
    "howContact": ["email", "fax"],
    "howContact_label": "[\"E-mail\", \"Fax\"]",
    "payNow": "0",
    "howPay": "credit_card",
    "howPay_label": "Credit Card",
    "serviceDue": "2015-12-31"
  }

  //  data.clientName[1]["test"] = 3333;
  // Logger.log(JSON.stringify(data))

  var addData = {
    name: "shiro",
    exam: {
      math: 10,
      lang: 100
    },
    grade: "b"
  }

  //data.push(addData);
  Logger.log(data);


  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var first = ss.getSheetByName("見積書");

  first.getRange('a3').setValue(data.a);
  first.getRange('d4').setValue(data.b);
  first.getRange('n4').setValue(data.c);
  first.getRange('n3').setValue(data.d);
  first.getRange('c6').setValue(data.f);
  /*
  f = first.getRange('k6').setValue();
  g = first.getRange('k7').setValue();
  h = first.getRange('k8').setValue();
  i = first.getRange('k9').setValue();
  j = first.getRange('c10').setValue();
  k = first.getRange('c11').setValue();
  l = first.getRange('c12').setValue();
  */




  Logger.log(data.subcontractors[1].name);
  //Logger.log(data.subcontractors[].length);

  var count = Object.keys(data.subcontractors).length;
  //Logger.log(count);
  //Logger.log(data.subcontractors.length())

  var key, count = 0;
  data2 = ["a", "b", "c"];
  for (key in data.subcontractors) {
    Logger.log(data.subcontractors.hasOwnProperty(key))
    Logger.log(data.subcontractors[key])

  }
}

//chat()

var perform = function (output_type, sentence) {
  var endpoint = "https://labs.goo.ne.jp/api/hiragana";
  var payload = {
    "app_id": "41d9d72f25cd8769559df6ec95a1331a92be26044ef95bc653eed942ec3f7719",
    "sentence": sentence,
    "output_type": output_type
  };
  var options = {
    "method": "post",
    "payload": payload
  };

  var response = UrlFetchApp.fetch(endpoint, options);
  var response_json = JSON.parse(response.getContentText());
  return response_json.converted;
};

/**
 * Convert Japanese KANJI to HIRAGANA by goo LAB API.
 *
 * @param {string} input The value of cell to convert.
 * @return The converted value that HIRAGANA.
 * @customfunction
 * @author Noriaki UCHIYAMA (twitter: @noriaki)
 */
function HIRAGANA(input) {
  return perform("hiragana", input);
}

/**
 * Convert Japanese KANJI to KATAKANA by goo LAB API.
 *
 * @param {string} input The value of cell to convert.
 * @return The converted value that KATAKANA.
 * @customfunction
 * @author Noriaki UCHIYAMA (twitter: @noriaki)
 */
function KATAKANA(input) {
  return perform("katakana", input);
}
