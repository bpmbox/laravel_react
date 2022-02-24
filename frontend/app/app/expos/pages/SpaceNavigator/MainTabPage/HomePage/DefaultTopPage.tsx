import React, { useContext, useEffect, useState } from 'react';
import Text from '../../../../components/UIKit/items/Text';
import { View, ScrollView, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import routes from '../../../../routes';
import { withNavigation } from '@react-navigation/core';
import { SpaceContext } from '../../SpaceContext';
import ErrorPage from '../../../General/ErrorPage';
import FullPageLoading from '../../../General/FullPageLoading';
import { default as UrlParse } from 'url';
const DefaultTopPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const { space } = useContext(SpaceContext);

    const env = setEnvironment(space.id);
    const integrations = getIntegrations(env);

    const [state, setState] = useState<{
        contents: any;
        loading: boolean;
        error: boolean;
    } | null>({
        contents: null,
        loading: true,
        error: false,
    });

    useEffect(() => {
        (async () => {
            try {
                setState({ ...state, loading: true, error: false });
                const contents = await getContents(env);
                setState({ ...state, contents: contents, loading: false, error: false });
            } catch (err) {
                console.error('NativeIntegrationPage: error loading homepage', err);
                setState({ ...state, loading: false, error: true });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space]);

    if (state.loading) {
        return <FullPageLoading />;
    }

    if (state.error) {
        return <ErrorPage code={404} message={'Error loading content.'} />;
    }

    const news = state.contents.news;
    //const news2 = state.contents.news2;
    const event = state.contents.events;
    const coupon = state.contents.coupons;

    const onclick = async (id, page) => {
        if (!id) {
            return false;
        }

        navigation.navigate({
            routeName: routes.INTEGRATIONS_NATIVE,
            params: {
                integrationId: id,
                pageId: page
            },
            key: `${id}.${page}`,
        });
    };

    /*----------ホームメニュー設定ここから----------*/
    const menu = [
        {
            id: '1',
            image: require('../../../../assets/images/shugyo.png'),
            integrationId: integrations.shugyo,
            pageId: 'topPage',
        },
        {
            id: '2',
            image: require('../../../../assets/images/userinfo.png'),
            integrationId: integrations.top,
            pageId: 'userInfo',
        },
        {
            id: '3',
            image: require('../../../../assets/images/space.png'),
            integrationId: integrations.top,
            pageId: 'space',
        },
        {
            id: '4',
            image: require('../../../../assets/images/qr.png'),
            integrationId: integrations.top,
            pageId: 'qr',
        },
    ];
    const menu2 = [
        {
            id: '1',
            image: require('../../../../assets/images/bousai.png'),
            integrationId: integrations.top,
            pageId: 'saigai',
        },
        {
            id: '2',
            image: require('../../../../assets/images/coupon.png'),
            integrationId: integrations.top,
            pageId: 'coupon',
        },
        { id: '3', image: require('../../../../assets/images/kojityu.png') },
        { id: '4', image: require('../../../../assets/images/kojityu.png') },
    ];

    //損保ジャパン用メニュー
    const menu3 = [
        {
            id: '1',
            image: require('../../../../assets/images/workArea.png'),
            integrationId: integrations.workArea,
            pageId: 'requestPage',
        },
        {
            id: '2',
            image: require('../../../../assets/images/space.png'),
            integrationId: integrations.space,
            pageId: 'topPage',
        },
        {
            id: '3',
            image: require('../../../../assets/images/konzatsu.png'),
            integrationId: integrations.konzatsu,
            pageId: 'top',
        },
        {
            id: '4',
            image: require('../../../../assets/images/setsubi.png'),
            integrationId: integrations.setsubi,
            pageId: 'requestPage',
        },
    ];

    /*----------ホームメニュー設定ここまで----------*/

    /*----------flatlist用設定ここから----------*/
    const _renderNews = item => {
        return (
            <View>
                <TouchableOpacity onPress={() => onclick(integrations.top, item.item.pageId) }>
                    <View style={styles.newsPhotoContainer}>
                        <Image source={{ uri: item.item.imageUrl }} style={styles.newsPhoto} />
                    </View>
                </TouchableOpacity>
                <View style={styles.newsText}>
                    <Text text={item.item.title} numberOfLines={1} small bold />
                    <Text text={`${item.item.createdAt} ${item.item.place}`} small light />
                </View>
            </View>
        );
    };
    const _renderEvent = item => {
        return (
            <TouchableOpacity onPress={() => onclick(integrations.top, item.item.pageId)}>
                <View style={styles.shadowBox}>
                    <View style={styles.eventContainer}>
                        <Image source={{ uri: item.item.imageUrl }} style={styles.eventPhoto} />
                        <View style={styles.eventText}>
                            <Text text={item.item.title} numberOfLines={2} small bold />
                            <Text text={`${item.item.eventDate}`} small light />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const _renderCoupon = item => {
        return (
            <TouchableOpacity onPress={() => onclick(integrations.top, item.item.pageId)}>
                <View style={styles.shadowBox}>
                    <Image source={{ uri: item.item.imageUrl }} style={styles.couponPhoto} />
                    <View style={styles.couponText}>
                        <Text text={item.item.title} numberOfLines={2} small bold />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const _renderMenu = item => {
        return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={() => onclick(item.item.integrationId, item.item.pageId)}>
                    <Image source={item.item.image} style={styles.icon} />
                </TouchableOpacity>
            </View>
        );
    };
    const _keyExtractor = item => `${item.id}`;
    /*----------flatlist用設定ここまで----------*/

    if (env === "sonpo-dev" || env === "sonpo-qa" || env === "sonpo-prod") {
        return (
            <ScrollView>
                <View style={styles.titleContainer}>
                    <View style={styles.titleText}>
                        <Text text={'ニュース'} bold small />
                    </View>
                    <TouchableOpacity onPress={() => onclick(integrations.newsList, 'news')} style={styles.moreText}>
                        <Text text={'もっと見る'} light small />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={news}
                    horizontal={true}
                    renderItem={_renderNews}
                    keyExtractor={_keyExtractor}
                    showsHorizontalScrollIndicator={false}
                />
                <Text text={'ホームメニュー'} bold small />
                <FlatList
                    data={menu3}
                    horizontal={true}
                    renderItem={_renderMenu}
                    keyExtractor={_keyExtractor}
                    showsHorizontalScrollIndicator={false}
                />
            </ScrollView>
        );
    }
    return (
        <ScrollView>
            <View style={styles.titleContainer}>
                <View style={styles.titleText}>
                    <Text text={'ニュース'} bold small />
                </View>
                <TouchableOpacity onPress={() => onclick(integrations.top, 'news')} style={styles.moreText}>
                    <Text text={'もっと見る'} light small />
                </TouchableOpacity>
            </View>
            <FlatList
                data={news}
                horizontal={true}
                renderItem={_renderNews}
                keyExtractor={_keyExtractor}
                showsHorizontalScrollIndicator={false}
            />
            <Text text={'ホームメニュー'} bold small />
            <FlatList
                data={menu}
                horizontal={true}
                renderItem={_renderMenu}
                keyExtractor={_keyExtractor}
                showsHorizontalScrollIndicator={false}
            />
            <FlatList
                data={menu2}
                horizontal={true}
                renderItem={_renderMenu}
                keyExtractor={_keyExtractor}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.titleContainer}>
                <View style={styles.titleText}>
                    <Text text={'イベント'} bold small />
                </View>
                <TouchableOpacity onPress={() => onclick(integrations.top, 'event')} style={styles.moreText}>
                    <Text text={'もっと見る'} light small />
                </TouchableOpacity>
            </View>
            <FlatList
                data={event}
                horizontal={true}
                renderItem={_renderEvent}
                keyExtractor={_keyExtractor}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.margin} />
            <View style={styles.titleContainer}>
                <View style={styles.titleText}>
                    <Text text={'クーポン'} bold small />
                </View>
                <TouchableOpacity onPress={() => onclick(integrations.top, 'coupon')} style={styles.moreText}>
                    <Text text={'もっと見る'} light small />
                </TouchableOpacity>
            </View>
            <FlatList
                data={coupon}
                horizontal={true}
                renderItem={_renderCoupon}
                keyExtractor={_keyExtractor}
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>
    );
};

export default withNavigation(DefaultTopPage);

// 現在のスペースIDから、環境を判別する
const setEnvironment = space_id => {
    switch (space_id) {
        case '4223c88c-fe49-4013-aa2b-e984b8a19bc7':
            // dev環境「JMAS_TEST_SPACE」
            return 'dev';
        case '550e2c52-814e-409a-8ae8-5da9ecdb49f3':
            // qa環境「日本橋室町三井タワー」
            return 'qa';
        case '6ffa6f31-9bef-4170-91ec-45a447157169':
            // prod or stage環境「日本橋室町三井タワー」
            return 'prod';
        case "bdfda204-ba83-4a34-8af3-43a229e7052a":
            // dev環境「損保ジャパン用」
            return 'sonpo-dev';
        case "26e742b4-1672-4546-be2a-0d84b0ba7479":
            // qa環境「損保ジャパン用」
            return 'sonpo-qa';
        case "36b2e6ca-f1e9-4e52-905c-fa336c769104":
            // stage or prod環境「損保ジャパン」
            return 'sonpo-prod';
        default:
            return 'local';
    }
};

// 環境ごとに異なるインテグレーションIDを返却する
const getIntegrations = env => {
    switch (env) {
        case 'dev':
            // dev環境「JMAS_TEST_SPACE」
            return {
                top: '83bf8530-1db8-4c31-a81b-0ddb7bf25d51',
                shugyo: '15136aed-ff93-4755-aba3-20e621e08f4d',
            };
        case 'qa':
            // qa環境「日本橋室町三井タワー」
            return {
                top: '6056fe1b-6d0c-4b1b-8226-54000bd32860',
                shugyo: 'a36fc239-6b7f-426e-b43a-b1200f814378',
            };
        case 'prod':
            // prod or stage環境「日本橋室町三井タワー」
            return {
                top: '8ef08843-238d-431d-8c42-2e0d45e55782',
                shugyo: 'fad8e901-1bcf-4aec-840d-14b1d674d2cc'
            };
        case 'local':
            return {
                top: '222e8df3-298d-4dde-979d-e64cc21218ad',
                shugyo: '3ed43c47-667c-49f1-adaa-f02936821ade',
            };
        case 'sonpo-dev':
            return {
                top: '83bf8530-1db8-4c31-a81b-0ddb7bf25d51',
                shugyo: '3ed43c47-667c-49f1-adaa-f02936821ade',
                setsubi: '2b1f428a-f3a1-45f4-88cf-6bdd4b8287b0',
                konzatsu: '549f8147-fc70-4061-ba7e-47d491d1e8ae',
                workArea: 'a4f7e53c-24ea-4a56-8e96-162e9e958f07',
                space: '931060cb-bd34-4ea5-bc82-389a2ae5160f',
                newsList: '8ad16027-b311-48e8-9ae1-342a61eb4e51'
        };
        case 'sonpo-qa':
            return {
                top: '83bf8530-1db8-4c31-a81b-0ddb7bf25d51',
                setsubi: '2b1f428a-f3a1-45f4-88cf-6bdd4b8287b0',
                shugyo: '3ed43c47-667c-49f1-adaa-f02936821ade',
                konzatsu: '',
                workArea: '',
                newsList: ''
            };
        case 'sonpo-prod':
            return {
                top: '83bf8530-1db8-4c31-a81b-0ddb7bf25d51',
                setsubi: '2b1f428a-f3a1-45f4-88cf-6bdd4b8287b0',
                shugyo: '3ed43c47-667c-49f1-adaa-f02936821ade',
                konzatsu: '',
                workArea: '',
                newsList: ''
            };
            
    
    }
};

// 環境ごとのlamdaエンドポイント返却
const getEndPoint  = env => {
    switch (env) {
        case 'dev':
            // dev環境
            return "https://7t0sgatkyj.execute-api.ap-northeast-1.amazonaws.com/default/dev-TreeAPI_GetContents";
        case 'qa':
            // qa環境
            return "https://25wt4no515.execute-api.ap-northeast-1.amazonaws.com/default/QA-TreeAPI_GetContents";
        case 'stage':
            // stage環境
            return "https://eygpst4s14.execute-api.ap-northeast-1.amazonaws.com/default/TreeAPI_GetContents";
        case 'api.withtree.com':
            // prod環境
            return "https://eygpst4s14.execute-api.ap-northeast-1.amazonaws.com/default/TreeAPI_GetContents";    
    }
};

// ニュース、イベント、クーポンをコンテンツ取得API(Lambda)から取得
async function getContents(env) {
    return new Promise(async function(resolve, reject) {
        try {
            let response = await fetch(
                getEndPoint(UrlParse.parse(process.env.REACT_APP_GRAPHQL_URL,false).hostname.split("-")[0]),
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        env: env,
                    }),
                }
            );
            let responseJson = await response.json();
            console.log(responseJson);
            resolve(responseJson);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

// スタイル設定
const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    titleText: {
        width: 280,
    },
    moreText: {
        width: 100,
    },
    newsPhoto: {
        width: 320,
        height: 180,
        borderRadius: 5,
        margin: 10,
    },
    newsPhotoContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 0.16,
    },
    newsText: {
        width: 320,
    },
    icon: {
        width: 80,
        height: 80,
    },
    menu: {
        width: 80,
        margin: 7,
    },
    shadowBox: {
        borderRadius: 8,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 0.16,
        backgroundColor: 'white',
    },
    eventContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    eventPhoto: {
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 5,
    },
    eventText: {
        width: 215,
    },
    couponPhoto: {
        width: 156,
        height: 120,
        borderTopEndRadius: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderTopStartRadius: 8,
    },
    couponText: {
        width: 156,
        height: 60,
        borderBottomEndRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomStartRadius: 8,
    },
    margin: {
        marginBottom: 24,
    },
});
