import React, { Component } from 'react';
import  { useEffect, useState } from "react";
import { ImageBackground,Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar,LocaleConfig, Agenda } from 'react-native-calendars';
import { Button } from 'react-native-paper';
import MainHeader from "../components/MainHeader";
const testIDs = require('./testIDs');
const image = { uri: "https://user-images.githubusercontent.com/68040080/118057532-2117be00-b3c7-11eb-8264-a9330f02f954.png" };
//日本語化
<Calendar
  // Initially visible month. Default = Date()
  current={'2012-03-01'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2012-05-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2012-05-30'}
  // Handler which gets executed on day press. Default = undefined
  onDayPress={(day) => {console.log('selected day', day)}}
  // Handler which gets executed on day long press. Default = undefined
  onDayLongPress={(day) => {console.log('selected day', day)}}
  // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
  monthFormat={'yyyy MM'}
  // Handler which gets executed when visible month changes in calendar. Default = undefined
  onMonthChange={(month) => {console.log('month changed', month)}}
  // Hide month navigation arrows. Default = false
  hideArrows={true}
  // Replace default arrows with custom ones (direction can be 'left' or 'right')
  renderArrow={(direction) => (<Arrow/>)}
  // Do not show days of other months in month page. Default = false
  hideExtraDays={true}
  // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
  // day from another month that is visible in calendar page. Default = false
  disableMonthChange={true}
  // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
  firstDay={1}
  // Hide day names. Default = false
  hideDayNames={true}
  // Show week numbers to the left. Default = false
  showWeekNumbers={true}
  // Handler which gets executed when press arrow icon left. It receive a callback can go back month
  onPressArrowLeft={subtractMonth => subtractMonth()}
  // Handler which gets executed when press arrow icon right. It receive a callback can go next month
  onPressArrowRight={addMonth => addMonth()}
  // Disable left arrow. Default = false
  disableArrowLeft={true}
  // Disable right arrow. Default = false
  disableArrowRight={true}
  // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
  disableAllTouchEventsForDisabledDays={true}
  // Replace default month and year title with custom one. the function receive a date as parameter.
  renderHeader={(date) => {/*Return JSX*/}}
  // Enable the option to swipe between months. Default = false
  enableSwipeMonths={true}
/>
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
    console.log(JSON.stringify(props))
    console.log(JSON.stringify(props.navigation))
    

    /**
     * ITEMの取得
     */
    this.state = {
      items: {},
      data: []
    };
  }

  async componentDidMount() {
    //const response = await startFetchMyQuery();
    //console.log("line 114 ---------------------")
    //console.log(JSON.stringify(response))
    //const json = await response.json();
    //this.setState({ data: json });
/////////////////////
    try {
      const response = await  startFetchMyQuery();
      console.log(JSON.stringify(response))
      const json = await response;
      this.state.data = json;
    } catch (error) {
      console.log(error);
    }
  }
  

  render() {
    return (
      <>
      <MainHeader
        title="会議室情報"
        isMain={false}
        navigation={this.props.navigation}
      />
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          //時間のロード
          loadItemsForMonth={this.loadItems.bind(this)}
          //開始日時
          selected={'2021-05-23'}
          //表示用データの表示
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          firstDay={1}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#43515c'},
          //    '2017-05-09': {textColor: '#43515c'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          renderDay={(day, item) => (<Text>{day ? '': ''}</Text>)}
          // hideExtraDays={false}
        />
        <Button
          icon="camera"
          mode="contained"
          onPress={() => {     this.props.navigation.goBack("PokemonDetail");this.props.navigation.navigate("PokemonList", {
            pokemon: "displayPokemons[index]",
          });}}>
          <Text>Press me</Text>
        </Button>
      </>
    );
  }

////
  loadItems(day) {
    setTimeout(() => {
      //strTime = this.timeToString(time);
      //this.state.items[""].push(<Button>sssssssssssssss</Button>)
      let count = 0;
      //const data = startFetchMyQuery();
//
      console.log("----------------------------------------------")
      console.log(JSON.stringify(this.state))
      global["rec"]={
  "data": {
    "workspace": [
      {
        "address": null,
        "building_name": null,
        "end_time": null,
        "id": 2,
        "latitude": null,
        "longitude": null,
        "start_time": "2021-05-23",
        "workplace_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "workspace_name": "ワクスタ上野",
        "room": [
          {
            "equipments": "1|3",
            "image_urls": "http://上野会議室1",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          },
          {
            "equipments": "1",
            "image_urls": "http://上野会議室2",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          }
        ]
      },
      {
        "address": null,
        "building_name": null,
        "end_time": null,
        "id": 3,
        "latitude": null,
        "longitude": null,
        "start_time": null,
        "workplace_id": "bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "workspace_name": "大会議室",
        "room": [
          {
            "equipments": "1",
            "image_urls": "http://プレゼンルーム1",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          },
          {
            "equipments": "1|2",
            "image_urls": "http://プレゼンルーム2",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          }
        ]
      },
      {
        "address": null,
        "building_name": null,
        "end_time": null,
        "id": 4,
        "latitude": null,
        "longitude": null,
        "start_time": null,
        "workplace_id": "bbbbbbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "workspace_name": "小会議室",
        "room": [
          {
            "equipments": "3|1",
            "image_urls": "http://来客室1",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          },
          {
            "equipments": "2",
            "image_urls": "http://来客室2",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          }
        ]
      },
      {
        "address": null,
        "building_name": null,
        "end_time": null,
        "id": 1,
        "latitude": null,
        "longitude": null,
        "start_time": null,
        "workplace_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "workspace_name": "ワクスタ新宿",
        "room": [
          {
            "equipments": "1|2",
            "image_urls": "http://新宿会議室1",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          },
          {
            "equipments": "2|3",
            "image_urls": "http://新宿会議室2",
            "is_in_house": true,
            "price_descriptions": null,
            "room_descriptions": null
          }
        ]
      }
    ]
  }
}
 /*   
{this.state.data.map(el => (
        console.log(JSON.stringify(e1))
          ))}
*/
      for (let i = -1; i < 2; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          //予定内容の設定
//test
 this.state.items[strTime].push({
                name: 'レコメンド ' + strTime + ' #' ,
                height: 70,//Math.max(50, Math.floor(Math.random() * 150)),
                header:1,
                name2: this.state.data[0].workplace_name,
                color : "red"
              });

          const numItems = 3//Math.floor(Math.random() * 10 + 1); //日別の予定設定
          for (let j = 0; j < numItems; j++) {
            if (j === 0) {
              this.state.items[strTime].push({
                name: 'レコメンド ' + strTime + ' #' + j,
                height: 70,//Math.max(50, Math.floor(Math.random() * 150)),
                header:1,
                name2: 'ＡＰＩ取得',
                color : "red"
              });
            }
            this.state.items[strTime].push({
              name: 'Workstyle Item for ' + strTime + ' #' + j,
              height: 70,//Math.max(50, Math.floor(Math.random() * 150)),
              name2: '10月２日　予定内容'
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
    //console.log("----------------------------------")
    //console.log(JSON.stringify(item))
    return (
      <>
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            marginLeft: 190
          }}>
 {item.header===1 && (
        <Button
          icon="camera"
          mode="contained"
          onPress={() => console.log('Pressed')}>
          予定を確定する
        </Button>
 )}
        </View>
        {}
        <View
          style={{
            flex: 1,
            width: '100%',
            flexDirection: 'row',
          }}>
          {item.header===1 && (
           <ImageBackground source={image} style={styles.image}>
             <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
            <Text style={[ { color: item.color }]}>{item.name2}</Text>
            <Text style={[ { color: item.color }]}>{item.name2}</Text>
            </View>
          </ImageBackground>
          )}
          {item.header!==1 && (
             <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item, { height: item.height,backgroundColor:"white"  }]}
            onPress={() => Alert.alert(item.name)}>
              <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
            <Text style={[ { color: "red",backgroundColor:"white" }]}>{item.name2}</Text>
            <Text>{item.name2}</Text>
            </View>
          </TouchableOpacity>
          )}

          {item.header===2 && (
             <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item2, { height: item.height }]}
            onPress={() => Alert.alert(item.name)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
          )}

          {item.header===3 && (
             <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item3, { height: item.height }]}
            onPress={() => Alert.alert(item.name)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
          )}

          <TouchableOpacity
            testID={testIDs.agenda.ITEM}
            style={[styles.item2, { height: item.height,backgroundColor:item.color}]}
            onPress={() => Alert.alert(item.name)}>
            <Text>{item.name}</Text>
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

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "http://35.72.50.16:8888/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const operationsDoc = `
  query MyQuery {
    workspace {
      address
      building_name
      end_time
      id
      latitude
      longitude
      start_time
      workplace_id
      workspace_name
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

function fetchMyQuery() {
  return fetchGraphQL(
    operationsDoc,
    "MyQuery",
    {}
  );
}

async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log("lin 525 get response data")
  console.log("ssssssssssssssssssssssssssss"+JSON.stringify(data));
  return await data["workspace"];
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
