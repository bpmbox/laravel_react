function setkey(chatkey, chatroomid) {
  PropertiesService.getScriptProperties().setProperty('chatkey', chatkey);
  PropertiesService.getScriptProperties().setProperty('chatroomid', chatroomid);

  // Change the unit type in the user property 'DISPLAY_UNITS'.
  // var dp = PropertiesService.getDocumentProperties();
  //  dp.setProperty('AAA', 'HOGE');
  //  dp.setProperty('BBB', 'FUGA');

  //   var keyA = dp.getProperty('AAA');
  //  var keyB = dp.getProperty('BBB');

  //alert(keyA);
  // alert(keyB);
  var userProperties = PropertiesService.getUserProperties();
  units = 'imperial'; // Only changes local value, not stored value.
  //userProperties.setProperty('DISPLAY_UNITS', units); // Updates stored value.
  userProperties.setProperty('chatkey', chatkey); // Updates stored value.
  userProperties.setProperty('chatroomid', chatroomid); // Updates stored value.


  var units2 = userProperties.getProperty('chatkey');
  var units4 = userProperties.getProperty('chatroomid');

  Logger.log(units2);
  Logger.log(units4);
  // alert(units);
}
