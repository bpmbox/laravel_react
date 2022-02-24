import firebase from 'firebase'; // 4.8.1

class FirebaseStorage {

  constructor() {
    this.init();
    this.observeAuth();
  }

  initd = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDZJZm9TgdBItFu1agAWryuKHWXv8og4pE",
        authDomain: "stachka-example.firebaseapp.com",
        databaseURL: "https://stachka-example.firebaseio.com",
        projectId: "stachka-example",
        storageBucket: "stachka-example.appspot.com",
        messagingSenderId: "907316643379"
      });
    }
  }
  init = () => {
    //alert(firebase.apps.length)
    if (!firebase.apps.length) {
      alert(firebase.apps.length)
      firebase.initializeApp({
        apiKey: "AIzaSyCsOjFyAAuFr1CITcnufG-GpZBKpLgUP90",
        authDomain: "rpa999-56929.firebaseapp.com",
        databaseURL: "https://rpa999-56929.firebaseio.com",
        projectId: "rpa999-56929",
        storageBucket: "rpa999-56929.appspot.com",
        messagingSenderId: "155298248089",
        appId: "1:155298248089:web:e25d64dc9f5370c4"
      });
    }
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    console.log("line 50")
    console.log(snapshot)
    let { timestamp: numberStamp, text, user } = snapshot.val();//val text で設定

    //GASよびだし
    google.script.run
      .withSuccessHandler(
        //無名関数にデータを入れる
        function (message) {
          // Respond to success conditions here.
          //showStatus('Cell set to reference value: ' + value);
          // element.disabled = false;
          spflg = message
          //Logger.log(message)
          //alert(message)
          //speechSynthesis.speak(msg);
        })
      .withFailureHandler(
        function (msg, element) {
          // Respond to failure conditions here.
          showStatus(msg, 'error');
          element.disabled = false;
        })
      .withUserObject(this)
      .myFunction2(snapshot.val());

    //text = JSON.stringify(snapshot)//text + "chinko";
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
      aaaaaaaaa: 1111111111111111111
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
        teset: 1111111111111111111111111111
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  off() {
    this.ref.off();
  }
}

FirebaseStorage.shared = new FirebaseStorage();
export default FirebaseStorage;
