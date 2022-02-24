import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import defaultTo from 'lodash/defaultTo';
//import chatService from "../chat";

export class log {
    private client: any;

    constructor() {
        /**
         * Applocloinet init
         * cant, use naibuni ddata wo
         */
        this.client = new ApolloClient({
            link: createHttpLink({
                uri: defaultTo(process.env.REACT_APP_GRAPHQL_URL, 'http://localhost:8000/graphql'),
                //uri: defaultTo('http://bpms.bpmboxes.com:8000/graphql', 'http://bpms.bpmboxes.com:8000/graphql'),
            }),
            cache: new InMemoryCache(),
        });
        console.log('image is ' + global['img']);
        console.log(' uid is ' + global['uid']);
        console.log('chat service detail ' + global['foo']);
        console.log('chat service detail ' + global['teamName']);
        //const ch = chatService
    }

    setGlobal = (team, img) => {
        global['teamname'] = team;
        global['img'] = img;
    };

    async logOutput(detail: any) {
        detail(global['loading']);
        //console.log(detail);
    }

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    sendBirdLog = async (id: string, message: string) => {
        this.client
            .query({
                query: gql`
                        query {
                            getmeta2(
                                name: "sendbird_group_channel_61689112_e9e28e900861706700358a75348bdaf8aad739e5"
                                message: "${message}"
                            )
                        }
                    `,
            })
            .then((result) => console.log(result));
    };

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    sendTeams = async (id: string, message: string) => {
        /*this.client
            .query({
                query: gql`
                        query {
                            sendTeams(
                                subject: "${id}",
                                message: "${message}"
                            )
                        }
                    `,
            })
            .then((result) => console.log(result));
        */
    };

    /**
     * UPDATE METADATE
     * @param id
     * @param teamname
     * @param imgUrl
     */
    async setUserData() {
        //let name;
        //global['setName']="";
        console.log('start setUserData');
        console.log(global['userID']);
        console.log(`
                    query {
                        setUserData(
                            userId: "${global['userID']}",
                            organization:"${global['organization']}",
                            department:"${global['department']}",
                            tags:"${global['tags']}",
                            gender:"${global['gender']}",
                            birthdate:${global['birthdate']},
                            post:"${global['post']}"
                        )
                    }
                `);
        try {
            await this.client
                .query({
                    query: gql`
                    query {
                        setUserData(
                            userId: "${global['userID']}",
                            organization:"${global['organization']}",
                            department:"${global['department']}",
                            tags:"${global['tags']}",
                            gender:"${global['gender']}",
                            birthdate:"${global['birthdate']}",
                            post:"${global['post']}"
                        )
                    }
                `,
                })
                .then(
                    (result) =>
                        new Promise((resolve) => {
                            console.log('---------------------------------------------------');
                            //if (response["teamName"] != '') {

                            //global['yakushoku'] = '役職１';
                            //global['busho'] = '部署２';

                            //global['setName3'] = JSON.stringify(result);
                            //global["tags"] = "";
                            resolve(result);

                            //conversationList[x].name = "aaaaaa";//response["teamName"];
                            //}
                            //console.dir(result);
                        })
                );
        } catch (e) {
            console.log('log.ts 102 setUserdata error ' + e);
            //global['setName'] = '会社名　Djiangoから22222';
            //global['yakushoku'] = '役職１22222';
            //global['busho'] = '部署２2222222222';
            //global['shumi'] = [[1,2,4,5]];
            //global['seibetu'] = 2;
            //global["tags"] = [[1,2,4]];
            //global['setName3'] = JSON.stringify(result);
        }
        return global['setName'];
    }

    /**
     * UPDATE METADATE
     * @param id
     * @param teamname
     * @param imgUrl
     */
    async getname(id: string): Promise<any> {
        console.log('log getuser id ' + id);
        try {
            await this.client
                .query({
                    query: gql`
                    query {
                         getUserData(
                            name: "${global['userID']}"
                        )
                    }
                `,
                })
                .then(
                    (result) =>
                        new Promise((resolve) => {
                            //console.log('log.ts get data149');
                            //console.log(result);
                            //let json_arr = JSON.parse(result);
                            //console.dir(result);
                            //console.log(global['userID']);

                            //console.log(result['data']['getUserData'][0]['model']);
                            console.log(result['data'].getUserData);
                            console.log(result['data'].getUserData.length);
                            if (result['data'].getUserData.length === 2) {
                                global['organization'] = '';
                                global['department'] = '';
                                global['post'] = '';
                                global['birthdate'] = '1999-01-01';
                                global['tags'] = [[-1]];
                                global['gender'] = '';
                                global['loading'] = 1;
                                global['loading'] = 1;
                                return;
                            }
                            //if(result['data'].length = 0)
                            const js_arr = JSON.parse(result['data'].getUserData);
                            console.log(js_arr);
                            //this.sendTeams('userData', result['data'].getUserData);
                            //console.log(js_arr);
                            //console.log(js_arr[0]['fields'].department);
                            //console.dir(js_arr);

                            if (global['organization'] === undefined || global['organization'] === '') {
                                global['organization'] = js_arr[0].fields.organization;
                            } else {
                                //global['setName'] = '';
                            }

                            if (global['department'] === undefined || global['department'] === '') {
                                global['department'] = js_arr[0].fields.department;
                            } else {
                                //global['setName'] = '';
                            }
                            if (global['post'] === undefined || global['post'] === '') {
                                global['post'] = js_arr[0].fields.post;
                            } else {
                                //global['yakushoku'] = '';
                            }
                            if (global['busho'] === undefined || global['busho'] === '') {
                                global['busho'] = js_arr[0].fields.organization;
                            } else {
                                //global['busho'] = '';
                            }
                            if (global['birthdate'] === undefined || global['birthdate'] === '') {
                                if (js_arr[0].fields.birthdate !== '') global['birthdate'] = js_arr[0].fields.birthdate;
                            } else {
                                //global['busho'] = '';
                            }

                            if (global['tags'] === undefined || global['tags'] === '') {
                                //global['tags'] = [[1, 2]];
                                if (js_arr[0]['fields'].tags !== '') {
                                    let sh = '[' + js_arr[0].fields.tags + ']';
                                    global['tags'] = [JSON.parse(sh)];
                                } else {
                                    global['tags'] = [[1, 2, 3]];
                                }
                            } else {
                                //global['tags'] = [[1]];
                            }
                            if (global['gender'] === undefined || global['gender'] === '') {
                                global['gender'] = js_arr[0].fields.gender;
                            } else {
                                //global['gender'] = '';
                            }
                            console.log('======= set global loading 1 ======');
                            global['loading'] = 1;
                            resolve(result);
                        })
                );
        } catch (e) {
            global['loading'] = 0;
            global['error'] = e;
            console.log('データ取得エラー　DDDDDD 初期値設定　245　Error　==========  log.ts' + e);

            if (global['department'] === undefined || global['department'] === '') global['department'] = '';
            if (global['organization'] === undefined || global['organization'] === '') global['organization'] = '';
            if (global['post'] === undefined || global['post'] === '') global['post'] = '';
            //if(global['tags'] === undefined || global['tags'] === "")
            global['tags'] = [[1, 3]];
            if (global['birthdate'] === undefined || global['birthdate'] === '') global['birthdate'] = '2021-12-12';
            //global['setName3'] = JSON.stringify(result);
        }
        //global['loading'] = 1;
        return global['setName'];
    }

    async getName2() {
        global['setName'] = 'name';
        return 'name';
    }

    /**
     * UPDATE METADATE
     * @param id
     * @param teamname
     * @param imgUrl
     */
    async updatemeta(id: string, teamname: string, imgUrl: string) {
        try {
            this.client
                .query({
                    query: gql`
                    query {
                        setMetaData(
                            name: "${id}"
                            teamname: "${teamname}"
                            imgUrl: "${imgUrl}"
                        )
                    }
                `,
                })
                .then((result) => console.log(result));
        } catch (e) {}
        global['teamName'] = '';
        global['img'] = '';
    }

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    sendberdInvite = (id: string, message: string) => {
        this.client
            .query({
                query: gql`
                        query {
                            sendberdInvite(
                                name: "${id}"
                                teamname: "${message}"
                            )
                        }
                    `,
            })
            .then((result) => console.log(result));
    };

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    sendberdLeave = (id: string, message: string) => {
        this.client
            .query({
                query: gql`
                        query {
                            sendberdLeave(
                                name: "${id}"
                                teamname: "${message}"
                            )
                        }
                    `,
            })
            .then((result) => console.log(result));
    };

    /**
     * meta data ge
     * @param id
     * @param message
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getMeta = (id: string, message: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let res;
        let _imgUrl: any;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let imgss;

        _imgUrl = '';

        this.client
            .query({
                query: gql`
      query{
  getmeta(name:"${id}")
}
`,
            })
            .then((result) => {
                res = result['data']['getmeta']['imgUrl'];
                console.log(result['data']['getmeta']);
                let jso = result['data']['getmeta'].replace(/'/g, '"');
                //global.lg.sendBirdLog("sss",jso)
                jso = JSON.parse(jso);
                console.log(jso['imgUrl']);
                _imgUrl = jso['imgUrl'];

                imgss = _imgUrl;
                // conversations[x].avatarUrl = _imgUrl

                // this.setState({isShowingText: _imgUrl});
                //console.log(jso);
            });
        //this.sendBirdLog("ssssssss","")
        return _imgUrl;
    };

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    changePhoto = (id: string, message: string) => {
        this.client
            .query({
                query: gql`
                        query {
                            getmeta2(
                                name: "sendbird_group_channel_61689112_e9e28e900861706700358a75348bdaf8aad739e5"
                                message: "${message}"
                            )
                        }
                    `,
            })
            .then((result) => console.log(result));
    };

    /**
     * チャットログの送信
     * @param id
     * @param message
     */
    chat_ins = (id: string, message: string, dis: string) => {
        console.log('image upload start');
        this.client
            .query({
                query: gql`
                        qquery{
 insChat(userId:"${id}",
    applicationId:"${message}",registrationId:"${dis}")
}
                    `,
            })
            .then((result) => console.log(result));
    };
}
