module.exports = {
  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn'
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar'
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item'
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  
  weekCalendar: {CONTAINER: 'weekCalendar'},
  "レコメンド情報リスト": [
    {
      "開始日時": "10:00",
      "終了日時": "11:00",
      "レコメンド区分": "ワークスペース",
      "名称": "M3-A",
      "外部の場所": {
        "場所名": "M3-A",
        "メールアドレス": "m3-a@example",
        "電話番号": "0xx-0xxx-0xxx",
        "住所": {
          "国名": "日本",
          "都道府県": "東京都",
          "市区町村": "中央区",
          "番地": "日本橋室町2丁目1−1",
          "郵便番号": "103-0022",
          "緯度": "35.6867999",
          "経度": "139.7731158"
        }
      },
      "予約確定用URL": "ttps://example/",
      "予約確定用パラメータリスト": [
        {
          "キー": "token",
          "値": "a7ha0Ao0345ajuiv9asu26zz82hakjasdf"
        }
      ]
    },
    {
      "開始日時": "11:00",
      "終了日時": "12:00",
      "レコメンド区分": "移動手段",
      "名称": "中央区日本橋室町2丁目1−1",
      "予約確定用URL": "ttps://example/",
      "予約確定用パラメータリスト": [
        {
          "キー": "token",
          "値": "a7ha0Ao0345ajuiv9asu26zz82hakjasdf"
        }
      ]
    }
  ],
	"recommends": [
		{
			"start_datetime": "2021/06/01 10:00",
			"end_datetime": "2021/06/01 11:00",
			"item_type": {
				"WorkSpace": "日本橋室町三井タワー",
				"Transportation": "",
				"ConferenceRoom": "11S-6",
				"none": ""
			},
			"name": "会議室11S-6",
			"item": "11階",
			"request_url": "https://yoyaku.com/microsoft365",
			"request_parameters": [
				{
					"key": "bunrui",
					"value": "11S"
				},
				{
					"key": "room",
					"value": "6"
				}
			]
		},
		{
			"start_datetime": "2021/06/01 11:00",
			"end_datetime": "2021/06/01 12:00",
			"item_type": {
				"WorkSpace": "",
				"Transportation": "タクシー",
				"ConferenceRoom": "",
				"none": ""
			},
			"name": "移動",
			"item": "",
			"request_url": "",
			"request_parameters": [
				{
					"key": "",
					"value": ""
				}
			]
		},
		{
			"start_datetime": "2021/06/01 12:00",
			"end_datetime": "2021/06/01 13:00",
			"item_type": {
				"WorkSpace": "",
				"Transportation": "",
				"ConferenceRoom": "",
				"none": "none"
			},
			"name": "レコメンドなし",
			"item": "",
			"request_url": "",
			"request_parameters": [
				{
					"key": "",
					"value": ""
				}
			]
		}
	]

};