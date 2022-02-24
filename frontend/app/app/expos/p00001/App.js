import { min } from 'lodash';
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { Button, ImageBackground, Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
// 検証用
//import { Header, Icon } from "react-native-elements";
//import { Button } from 'react-native-paper';
//import MainHeader from "./MainHeader";

/**
 * テスト用　GraphQLレスポンス
 */

//テストデータ
const a = {
  room: [
    {
      equipments: '1|2',
      image_urls: 'http://新宿会議室1|http://新宿会議室1|http://新宿会議室1',
      is_in_house: true,
      price_descriptions: '22',
      room_descriptions: 'テスト',
      rectype: 'ワークスペース',
      room_name: 'WorkRoom2新宿会議室1',
      time: '8:00'
    },
    {
      equipments: '2|3',
      image_urls: 'http://新宿会議室2',
      is_in_house: true,
      price_descriptions: '33',
      room_descriptions: 'テスト',
      rectype: 'ワークスペース',
      room_name: '新宿会議室2',
      time: '15:00'
    },
    {
      equipments: '2|3',
      image_urls: 'http://新宿会議室2',
      is_in_house: true,
      price_descriptions: '33',
      room_descriptions: 'テスト',
      rectype: '移動手段',
      room_name: '新宿会議室2',
      time: '15:00'
    }
  ]
};


const testIDs = require('./testIDs');
//現在時間の表示画像
const image = { uri: "https://user-images.githubusercontent.com/68040080/118057532-2117be00-b3c7-11eb-8264-a9330f02f954.png" };
/**
 * 日本語化
 * ベットカレンダーを設定する場合は必要
 */

LocaleConfig.locales.jp = {
  monthNames: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  dayNames: [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
};
LocaleConfig.defaultLocale = 'jp';


export default class AgendaScreen extends Component {

  constructor(props) {
    super(props);
    //console.log(JSON.stringify(props))
    //console.log(JSON.stringify(props.navigation))//画面呼び出しの際にパラメーターの設定　TOP画面からの実装はTOP画面側

    /**
     * ITEMの取得 現在時間の設定 setState など使わなく直接ステート変更
     */
    this.state = {
      items: {},
      data: [],
      item: {},
      day: "2021-06-02",//今日の日付けを設定
      title: "おすすめ一括設定",
      reserve: 0
    };

    this.handleClickFunction = this.handleClickFunction.bind(this);
  }

  /**
   * マージ処理
   * @param {*} str 
   */

  /**
   * 通信同期処理
   * ENDPOINTを切り替えて取得したJSONを表示
   * ここに設定しないと、データ取得前に表示され表示されない
   */

  async componentDidMount(str) {
    this.handleClickFunction = this.handleClickFunction.bind(this);
    try {

      alert("---------------dd-----dddddddddddddd---------")
      const response = await startFetchMyQuery(this.state.day);
      alert("errorna ni nacchauuno kana-- ")
      //console.log(JSON.stringify(response))
      const json = await response;
      alert(json)
      alert("---------------nandee--------------")
      this.state.data = json;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 日付けを押した際に実行
   * @param {} str 
   */
  async fetchQuery(str) {
    try {

      const response = await startFetchMyQuery(str);
      //console.log(JSON.stringify(response))
      const json = await response;
      this.state.data = json;
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <>
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          title={this.state.title}


          //時間のロード
          loadItemsForMonth={this.loadItems.bind(this)}
          //開始日時
          selected={this.state.day}//本日の日にちを設定
          //表示用データの表示
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          //どの曜日を最初にするか設定
          firstDay={1}
          renderDay={(day, item) => (<Text>{day ? '' : ''}</Text>)}
          onDayPress={(day) => {
            alert("API設定用なので確認後コメントして下さい" + JSON.stringify(day))
            //
            this.setState({
              day: day,
            });
            this.setState({
              title: "ボタンの値の変更",
            });
            //this.fetchQuery("2021-05-25")           
            console.log('selected day', day)
          }}
        />

      </>
    );
  }


  /**
   * async して日付けを変更しないとデータが更新されない
   */
  async fun() {
    //alert("test")
    this.setState({ day: "2021-06-03" })

    //this.setState({day:"2021-06-02"})
    await this.setState({ title: "ボタンの値の変更" })
    this.setState({ day: "2021-06-02" })

  }
  /**
   * @function レコメンド色の取得　Undefined の場合の処理
   * @param {any} str 
   * @returns 
   */
  changeColor(str) {
    //正規表現の追加
    if (str.match(/ワークスペース/)) {
      //strにhogeを含む場合の処理
      return "purple"
    }

    if (str.match(/移動手段/)) {
      //strにhogeを含む場合の処理
      return "brown"
    }

    if (str.match(/hoge/)) {
      //strにhogeを含む場合の処理
      return "yellow"
    }
    return "white";
  }

  /**
   * 現在の時間の取得　赤線でのボーターライン表示用
   * 現座時刻の場合１を返す
   * @returns 
   */
  getToday() {
    alert("true")
    //let DD = new Date();
    //let Hours = DD.getHours();
    //let Minutes = DD.getMinutes();
    //let Seconds = DD.getSeconds();
    //if ( str.match(/{$Hours}/)) {
    //  //strにhogeを含む場合の処理
    // return 1
    //}
    //return 0
  }

  jsonMerge(json) {
    let mergeData = {}
    Object.keys(json).forEach(function (key) {
      //Alert.alert(key)
      mergeData[key] = mergeData[key] + "a";
    });
  }

  //マージデータ
  mergeJson(a) {
    let i = 0;
    let j = 0;
    //マージ用変数を定義
    let merge = []

    //キーの内容で強制的に上書き


    let dest = []
    //フィルダーして対応するデータの取得
    //merge[0] = a.room.filter(function(item){
    //    return item.time == "15:00";    
    //});
    let _time = "";
    let _is_in_house = "";
    let _price_descriptions = "";
    let _rectype = "";
    let copyMerge = { "time": "", "rectype": "" }
    //alert(JSON.stringify(a))
    //ルームデータで同じ時間があればマージをする
    //
    for (j = 0; j < a.length; j++) {
      //alert(j)
      copyMerge = { "time": "", "rectype": "" }
      //時間でフィルタリングしてデータを成形
      merge[0] = a.filter(function (item) {
        return item.time === a[j].time;
      });
      console.log("get data from master ----------------------------")
      console.log(merge[0])
      //alert(JSON.stringify(merge[0]))
      copyMerge["room_name"] = []
      copyMerge["room_descriptions"] = []
      //copyMerge["room_name"].push(<View><Text>sssssssssssss</Text></View>)
      console.log("length")
      console.log(merge[0].length)
      for (i = 0; i < merge[0].length; i++) {
        copyMerge["time"] = merge[0][i].time;
        copyMerge["is_in_house"] += " " + merge[0][i].is_in_house;
        copyMerge["price_descriptions"] += " " + merge[0][i].price_descriptions;
        copyMerge["rectype"] += merge[0][i].rectype;
        copyMerge["room_name"].push(<View><Text>{merge[0][i].room_name}</Text></View>);//改行で表示
        copyMerge["room_descriptions"].push(<View><Text>{merge[0][i].room_descriptions}</Text></View>);//改行で表示
        copyMerge['header'] = this.getTimeNow(merge[0][i].time)
      }
      dest[a[j].time] = copyMerge
    }

    //dest[0] = copyMerge
    console.log("フィルタリング　------------------------------------")
    //console.log(copyMerge)
    console.log("コピーされたデータ------------------------------------")
    //alert("aaaaaaaaaaaaaaaa"+JSON.stringify(dest["8:00"]))
    console.log(dest)
    return dest
  }


  handleClickFunction = () => {


    //  alert("ssss")
    this.setState({ title: "change" });
  };

  /**
  * 現在の時間の取得　赤線でのボーターライン表示用
  * 現座時刻の場合１を返す
  * @returns 
  */
  getTimeNow(_time) {
    //Alert.alert("test")
    let DD = new Date();
    let Hours = DD.getHours();
    let Minutes = DD.getMinutes();
    let time

    let checktime = [0.15, 30, 45.60]
    //let Seconds = DD.getSeconds();
    //Alert.alert(Hours.toString())
    if (Minutes > 0 && Minutes < 15)
      time = Hours.toString() + ":00"
    if (Minutes >= 15 && Minutes < 30)
      time = Hours.toString() + ":15"
    if (Minutes >= 30 && Minutes < 45)
      time = Hours.toString() + ":30"
    if (Minutes >= 45 && Minutes < 60)
      time = Hours.toString() + ":45"


    //時間がマッチした場合にはヘッダーフラグ表示を設定
    if (time === _time) {
      //strにhogeを含む場合の処理
      return 1
    }
    return 0
  }

  /**
   * @funciion カレンダーの設定
   * マスターのJSONデータの子要素の書き出し
   * name: memo,　レコメンド内容
   * height: 70,
   * header: 1, ヘッダー情報
   * name2: memo,//this.state.data[ii].memo,
   * color: rectype,
   * ntime: ntime,　串刺し検索の時間
   * border: border　現在時刻の場合　1
   * 
   * @param {} day 
   */

  loadItems(day) {
    setTimeout(() => {

      let count = 0;
      let rectype = "";
      let starttime = "";
      let DD = "";
      let ii = 0;
      let jj = 0;
      let name = "";
      let ntime = "";
      let header = "";
      let memo = "";
      let border = "";

      //Alert.alert(this.getTimeNow())
      //Alert.alert(this.state)
      console.log("173 ----------------------------")
      console.log(JSON.stringify(this.state.data[0]))
      console.log(this.state.data[0]["workplace_name"])
      console.log(this.state.data[0].room)
      console.log("end 261 --------------------------")

      //GraphQLで取得したデータをカレンダーに追加
      //名前で色の設定
      //複数の時間の場合の対応　どこかにデータをいれて再度画面表示の方がいい
      // 月　⇨　月の詳細の内容でループしてカレンダー追加 メインデータの日付けの内容でカレンダーを設定していく
      // 仕様　当日のデータのみ取得

      for (ii = 0; ii < this.state.data.length; ii++) {
        //const time = day.timestamp + 2 * 24 * 60 * 60 * 1000;
        //console.log("190 reserve time is this " + time)
        //書き込む日付けの設定 //const strTime = this.timeToString(time);// 当日の予定　
        const strTime = this.state.data[ii].start_time//this.state.day 日付け単位で予定の登録　仕様では、毎回クリック時に取得
        let room = this.state.data[0].room;
        //Alert.alert(room)
        let _room = this.mergeJson(room)
        //alert("------------------")
        //alert(JSON.stringify(_room["8:00"]))
        if (!this.state.items[strTime]) {
          //strtime が日単位で　JSONの時系列でデータを設定をしていく　
          this.state.items[strTime] = [];
          /**
           * 日付けの内容にカレンダーデータを設定していく
           */
          jj = 0;
          for (let key in _room) {

            rectype = this.changeColor(_room[key].rectype)//this.state.data[ii].rectype);
            starttime = "aaa"//_room[key].rectype
            name = _room[key].room_descriptions//ルームの表記
            memo = _room[key].room_name//memo1
            ntime = _room[key].time//time
            header = 0
            border = _room[key].herder//現在時間の場合バックグラウンドに画像の表示

            if (jj === 0) {//予定の最初には、レコメンド用の登録ボタンを表示
              header = 1
              jj++
            }
            //const strTime = this.timeToString(1621728000000);  

            this.state.items[strTime].push({
              name: memo,//this.state.data[ii].workspace_name + strTime + ' #',
              height: 70,//Math.max(50, Math.floor(Math.random() * 150)),
              header: header,
              name2: name,//this.state.data[ii].memo,
              color: rectype,
              //ntime: strTime + " " + ntime,//starttime,
              ntime: ntime,//starttime,
              border: border//現在時刻の取得
            });

          }
        }
      }


      const newItems = {};
      //キーの設定
      Object.keys(this.state.items).forEach((key) => {
        newItems[key] = this.state.items[key];
      });
      //render calender
      this.setState({
        items: newItems,
      });

    }, 1000);
  }

  /**
   * @function カレンダー明細の記載
   * @params item:<any> item object
   */

  renderItem(item, i) {

    return (
      <>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            marginLeft: 190
          }}>
          {item.header === 1 && (//日にちの頭には、登録ボタンを表示する APIデータ登録処理を記載する
            <Button
              title={this.state.title}
              color="#f194ff"
              backgroundColor="blue"
              onPress={() => { this.fun() }}
            />
          )}
        </View>
        { }
        <View
          style={{//時間の表示
            flex: 1,
            flexDirection: 'column',
          }}>
          <Text style={[{ color: "red" }]}>{item.ntime}</Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
          }}>

          {item.border === 1 && (//現在時間の場合は　赤でバックグランドにラインを設定する
            <ImageBackground source={image} style={styles.image}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}>
                {item.name2}
              </View>
            </ImageBackground>
          )}
          {item.border !== 1 && (//現在時間以外の予定の表示
            <TouchableOpacity
              testID={testIDs.agenda.ITEM}
              style={[styles.item, { height: item.height, backgroundColor: "white" }]}
              onPress={() => Alert.alert(item.ntime)}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}>
                {item.name2}
              </View>
            </TouchableOpacity>
          )}
          {//レコメンド内容の表示
          }
          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item2, { height: item.height, backgroundColor: item.color }]}
            onPress={() => Alert.alert("test")}>
            {item.name}
          </TouchableOpacity>
        </View>
      </>
    );
  }

  renderItemH(item, i) {
    return (
      <>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
          }}>
          、
        </View>
      </>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

/*
This is an example snippet - you should consider tailoring it
to your service.
*/

async function fetchGraphQL(operationsDoc, operationName, variables, str) {
  //////////////////////
  //alert(operationsDoc)
  const result = await fetch("https://api.dreamso.net/graphql", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json"
    },
    "referrer": "https://api.dreamso.net/graphql",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "operationName": "",
    "variables": {},
    body: JSON.stringify({
      query: `
 query{
  workplace(id:"1",roomid:"12"){
    id
    workplaceId
    workplaceName
    workplacerelationSet{
      id
      spaceId
    }
  }
}
      `
    }),
    "method": "POST",
    "mode": "cors"
  });

  let rec = await result.json();
  alert(rec)
}
//ここのクエリーが呼ばれる
function listQuery(str) {
  //workspace(where: {date: {}}) {
  //workspace(where: {date: {_eq: "`+str+`"}}) {
  const operationsDocs = `
 query {
workplace(id:\"1\",roomid:\"2\"){
  id
  workplaceId
  roomSet{
    roomName,
    roomUniqueKey,
    isInHouse,
    roomUniqueKey,
    capacity,
    imageUrls
    featureSet{
      roomId,
      featureId,
      featureNo,
      value
    }

  }
  workplacerelationSet{
    spaceId
    workspaceSet{
      id
      roomSet{
        roomId
        featureSet{
          roomId
        }
      }
    }
  }
  featureSet{
    roomId
  }
  workspaceSet{
    id,
    workspaceName,
    postCode,
    prefectures,
    municipality,
    address,
    buildingName
    roomSet{
      roomId
      featureSet{
        roomId,
        featureId,
        featureNo,
        value
      }
    }
   }
  }
}
`;
  return operationsDocs

}

/**
 * 検索用GraphQL
 */

const operationsDoc = `
  query MyQuery {
    workspace(where: {date: {_eq: "2021-05-24"}}) {
      address
      building_name
      end_time
      id
      latitude
      longitude
      start_time
      workplace_id
      workspace_name
      unixtime
      memo
      memo1
      rectype
      room {
        equipments
        image_urls
        is_in_house
        price_descriptions
        room_descriptions
      }
    }
  }
`;


const operationsDoc2 = `
 query testQ{
  
workplace(id:"1",roomid:"2"){
  id
  workplaceId
  roomSet{
    roomName,
    roomUniqueKey,
    isInHouse,
    roomUniqueKey,
    capacity,
    imageUrls
    featureSet{
      roomId,
      featureId,
      featureNo,
      value
    }

  }
  workplacerelationSet{
    spaceId
    workspaceSet{
      id
      roomSet{
        roomId
        featureSet{
          roomId
        }
      }
    }
  }
  featureSet{
    roomId
  }
  workspaceSet{
    id,
    workspaceName,
    postCode,
    prefectures,
    municipality,
    address,
    buildingName
    roomSet{
      roomId
      featureSet{
        roomId,
        featureId,
        featureNo,
        value
      }
    }
    
  }
  }
}
`;

//ここでmicrosoft365を呼ぶなど
function fetchMyQuery(str) {
  return fetchGraphQL(
    operationsDoc2,
    "testQ",
    {},
    str
  );
}

async function startFetchMyQuery(str) {
  const { errors, data } = await fetchMyQuery(str);

  if (errors) {
    // handle those errors like a pro
    alert("error")
    console.error(errors);
  }
  //
  // do something great with this precious data
  console.log("lin 529 get response data")
  console.log("log 530 " + JSON.stringify(data));
  //表示するオブジェクトを返信
  alert(JSON.stringify(data))
  return await data["workplace"];
}

//startFetchMyQuery();

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  item2: {
    backgroundColor: '#800080',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  item3: {
    backgroundColor: '#00ff00',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  image: {
    backgroundColor: '#800080',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
