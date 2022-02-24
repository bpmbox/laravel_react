import { withNavigation } from '@react-navigation/core';
import { Formik, FormikActions, FormikProps } from 'formik';
import assign from 'lodash/assign';
import React, { FunctionComponent, ReactNode, useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import * as yup from 'yup';
import ImagePicker from '../../components/UIKit/ImagePicker';
import Button from '../../components/UIKit/items/Button';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import SimpleListButton from '../../components/UIKit/items/SimpleListButton';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Spacer from '../../components/UIKit/items/Spacer';
import Divider from '../../components/UIKit/items/Divider';
import Page from '../../components/UIKit/Layout/Page';
import i18n from '../../i18n';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { isMobilePlatform } from '../../libs/platform';
import routes from '../../routes';
import alertService from '../../services/alert';
import authService from '../../services/auth';
import historyService from '../../services/history';
import messageService from '../../services/message';
import userService from '../../services/user';
import AuthStore from '../../store/auth';
import { DesktopHeaderType, ItemHeight, PaddingType } from '../../theme.style';
import ErrorPage from '../General/ErrorPage';
import FullPageLoading from '../General/FullPageLoading';
import { appVersion } from '../../libs/version';
import Text from '../../components/UIKit/items/Text';
import PageLocal from '../Integration/PageLocal';
import { PageContent } from '../../libs/integration/pageRenderer';

//import { PAGE_INPUT_CHANGE_EVENT, PageContent } from '../../libs/integration/pageRenderer';
import { log } from '../../services/log/log';
//import DatePickerPage from "../GeneralPurposeModals/DatePickerPage";
//import trackingService from '../../services/tracking';
//import {platform} from "os";

/**
 * ACOUNT 一覧の情報を元にアカウント情報の取得更新をする -
 * 画面感でGLOBAL値を使用しているので、キャッシュライブラリーの作成
 * @constructor
 */
const AccountSettingsPage: FunctionComponent<NavigationInjectedProps> = () => {
    const { isLoading, currentUser } = AuthStore.useContainer();
    const { t } = useTranslation('AccountSettingsPage');

    const validationSchema = yup.object().shape({
        givenName: yup.string().required(t`First name is required.`),
        familyName: yup.string().required(t`Last name is required.`),
    });


    const [state, setState] = useState<{
        contents: any;
        loading: any;
        error: boolean;
    } | null>({
        contents: null,
        loading: 0,
        error: false,
    });

    const [num, setNum] = useState(false);

    const lg = new log();
    console.log(' ---------------------------- ' + num);

    useEffect(() => {
        console.log(' useEffect 67 rerender ' + num);
        (async () => {
            try {
                setState({ ...state, loading: true, error: false });
                await lg.logOutput(setNum);
                //const contents = await getContents(env);
                setState({ ...state, contents: num, loading: num, error: false });
            } catch (err) {
                await lg.logOutput(setNum);
                console.error('NativeIntegrationPage: error loading homepage', err);
                setState({ ...state, loading: false, error: true });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [num]);

    if (global['loading'] !== 1) {
        //setNum(global['loading']);
        console.log(' rerender ' + num);
        return <FullPageLoading />;
    }

    if (state.error) {
        return <ErrorPage code={404} message={'Error loading content.'} />;
    }

    // const random = Math.random();

    interface ProfileFormValues {
        givenName: string;
        familyName: string;
        avatarUrl?: string;
        usage: string;
    }

    // @ts-ignore
    // const [global["sample"], setState] = useState(1)

    const handleFormSubmit = async (
        values: ProfileFormValues,
        actions: FormikActions<ProfileFormValues>
    ): Promise<void> => {
        actions.setSubmitting(true);
        Keyboard.dismiss();
        try {
            await lg.setUserData();
            await userService.registerAccountUser({
                givenName: values.givenName,
                familyName: values.familyName,
                purpose: values.usage,
                avatarUrl: values.avatarUrl,
            });
            //res = await lg.updatemeta('', '', '');

            messageService.sendSuccess(t`Your account has been updated.`);
            historyService.goBack();
        } catch (err) {
            const errMsg = err.message || t`Unable to update your account.`;
            messageService.sendError(errMsg);
        }
    };

    const handleLogOut = async () => {
        try {
            await authService.logout();
            const routeAfterLogout = isMobilePlatform ? routes.LOGIN_HOME : routes.APP_ENTRY_POINT;
            historyService.navigateAsRoot(routeAfterLogout);
        } catch (err) {
            messageService.sendError(t`Error logging out.`);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await userService.deactivateAccount();
            historyService.navigateAsRoot(routes.LOGIN_HOME);
            messageService.sendSuccess(t`Your account has been deleted.`);
        } catch (err) {
            messageService.sendError(err.message);
        }
    };

    const onChangeEmailPress = () => {
        historyService.push(routes.CHANGE_EMAIL);
        //historyService.push(routes.DATE_PICKER);
    };

    const onLogOutPress = async () => {
        // console.log(props);
        //console.log(BlockGalleryPage)
        alertService.alert(t`Are you sure you want to log out?`, '', [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`Log Out`, style: 'default', onPress: handleLogOut },
        ]);
    };

    const onDeleteAccountPress = async () => {
        alertService.alert(
            t`Delete your account?`,
            t`削除すると、あなたが作成したスペースは全て削除される可能性があります。参加しているスペースにもログイン出来なくなります。この操作は元には戻せません。`,
            [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Delete`, style: 'destructive', onPress: handleDeleteAccount },
            ]
        );
    };

    const INITIAL_VALUES: ProfileFormValues = { givenName: '', familyName: '', usage: '', avatarUrl: '' };
    const initialValues: ProfileFormValues = assign(INITIAL_VALUES, currentUser);

    if (isLoading) {
        return <FullPageLoading />;
    }

    if (!currentUser || !currentUser.email) {
        return <ErrorPage code={404} message={t`Could not load your profile info.`} />;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tagMaster = [
        '漫画',
        '映画',
        'アイドル',
        'ドライブ',
        'お酒',
        'グルメ',
        '料理',
        'DIY',
        'ゲーム',
        '釣り',
        'キャンプ',
        'ランニング',
        'ゴルフ',
        'フィットネス',
        'カフェ',
        '温泉',
        '読書',
        '音楽',
        'ショッピング',
        '旅行',
        'カメラ',
        'ペット',
        'ダイエット',
        '子育て',
        '筋トレ',
    ];

    //let content2: any = '';
    // eslint-disable-next-line react-hooks/rules-of-hooks
    //useEffect(() => {
    // trackingService.__storageService.setItem('kaishamei3', 'sssssssss');
    //const zzz =trackingService.__storageService.getItem('kaishamei3');
    //let name3 = trackingService.__storageService.getItem('givenName');

    (async () => {
        try {
            //setState({ ...state, loading: true, error: false });
            //const contents = await getContents(env);
            //const content21 = await getContents();
            //setState({ ...state, contents: content21, loading: false, error: false });
            //console.log('osiosiufdoafaoufoufoa ' + content21);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            //content2 = content21;
        } catch (err) {
            console.error('NativeIntegrationPage: error loading homepage', err);
        }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // });

    //const name3 = content2;
    //Alert.alert(name3);
    //console.log(content2 + '----------///////-----------------------------');
    //console.log(content2);
    //console.dir(content2);
    //const tagYakushoku = ['役職１', '役職２', '役職３'];

    //const tagBusho = ['部署１', '部署２', '部署３'];

    global['isshow'] = false;

    return (
        <Page scrollable desktopPadding={PaddingType.all}>
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<ProfileFormValues>): ReactNode => {
                    let {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                    } = formikProps;
                    //values.test = Math.random().toString();

                    const BlockGalleryPage = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                                {
                                    name: 'post',
                                    type: 'text',
                                    value: '',
                                },
                                {
                                    name: 'department',
                                    type: 'text',
                                    value: '',
                                },
                                {
                                    name: 'gender',
                                    type: 'singleselect',
                                    value: '',
                                },
                                {
                                    name: 'birthdate',
                                    type: 'date',
                                    value: '',
                                },
                                {
                                    name: 'tags',
                                    type: 'multiselect',
                                    value: '',
                                },
                                {
                                    name: 'userId',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'input',
                                    value: global['organization'],
                                    attrs: {
                                        localOut: true,
                                        localData: '_department',
                                        name: 'organization',
                                        label: '会社名',
                                        placeholder: '会社名を入力してください',
                                    },
                                },
                                {
                                    type: 'input',
                                    value: global['department'],
                                    attrs: {
                                        localOut: true,
                                        localData: '_department',
                                        name: 'department',
                                        label: '部署名',
                                        placeholder: '部署名を入力してください',
                                    },
                                },
                                {
                                    type: 'input',
                                    value: global['post'],
                                    attrs: {
                                        localOut: true,
                                        localData: '_post',
                                        name: 'post',
                                        label: '役職名',
                                        placeholder: '役職名を入力してください',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockGalleryPage2 = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'text',
                                    value: '必須',
                                    attrs: {
                                        appearance: 'danger',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDiver = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [{ type: 'divider', attrs: { margin: 'false' } }],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDataPicker = () => {
                        //let a = 'DataPicker';

                        const pickertype = isMobilePlatform ? 'datepickerios' : 'datepicker';

                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: pickertype,
                                    attrs: {
                                        margin: 'true',
                                        name: 'birthdate',
                                    },
                                    value: {
                                        startDate: global['birthdate'],
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDataname1 = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'text',
                                    value: '名前',
                                    attrs: {
                                        appearance: '',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDataname2 = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: 'タグ情報',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'text',
                                    value: 'タグ情報',
                                    attrs: {
                                        appearance: '',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDatanameS = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'text',
                                    value: '生年月日',
                                    attrs: {
                                        appearance: '',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockDatanameSeibetu = () => {
                        //let a = 'チーム名変更';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '性別',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'text',
                                    value: '性別',
                                    attrs: {
                                        appearance: '',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockGalleryPage32 = () => {
                        //let a = '性別';
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'singleselect',
                                    value: {
                                        items: ['未選択', '男性', '女性'],
                                        selectedIndex: global['gender'],
                                    },
                                    attrs: {
                                        name: 'gender',
                                        localData: 'sex',
                                        label: '性別を選択してください',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    const BlockGalleryPage4 = () => {
                        const content: PageContent = {
                            title: 'Basic Blocks',
                            props: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    value: '',
                                },
                            ],
                            blocks: [
                                {
                                    type: 'multiselect',
                                    value: {
                                        items: tagMaster,
                                        selectedIndices: global['tags'][0],
                                    },
                                    attrs: {
                                        label: 'タグ情報を選択してください',
                                        name: 'tags',
                                    },
                                },
                            ],
                        };

                        return (
                            <View style={{ flex: 1, paddingTop: 0 }}>
                                <PageLocal content={content} />
                            </View>
                        );
                    };

                    let isDisabled = !isValid || isSubmitting;

                    global['prop'] = () => {
                        if (global['_change'] === true) {
                            global['_change'] = false;
                            setNum(true);
                        }
                        isDisabled = true;
                    };
                    //global["isshow"] = !isValid || isSubmitting;
                    //isDisabled = global['isshow'];
                    return (
                        <View>
                            <ImagePicker
                                round
                                profile
                                includeButton
                                allowSelection
                                buttonTitle={values.avatarUrl ? t`Change Photo` : t`Set Photo`}
                                imageUrl={values.avatarUrl || ''}
                                onUploaded={(fileUrl: string) => {
                                    setFieldValue('avatarUrl', fileUrl);
                                }}
                            />
                            <SectionHeading text={currentUser.email} />
                            <SimpleListButton text={t`Change Email`} onPress={onChangeEmailPress} />
                            <SectionHeading text={t`Personal Info`} />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 2 }}>
                                    <BlockDataname1 />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <BlockGalleryPage2 />
                                </View>
                                <View style={{ flex: 3 }}>
                                    <SingleLineInput
                                        onChangeText={handleChange('givenName')}
                                        onBlur={handleBlur('givenName')}
                                        value={values.givenName}
                                        placeholder={t('姓')}
                                        returnKeyType="next"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoCapitalize="words"
                                    />
                                </View>
                                <View style={{ flex: 4 }}>
                                    <SingleLineInput
                                        onChangeText={handleChange('familyName')}
                                        onBlur={handleBlur('familyName')}
                                        value={values.familyName}
                                        placeholder={t('名')}
                                        returnKeyType="next"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <BlockGalleryPage />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <BlockDatanameS />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <BlockDataPicker />
                                </View>
                            </View>
                            <BlockDiver />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <BlockDatanameSeibetu />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <BlockGalleryPage32 />
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row'}}>
                                <View style={{ flex: 1 }}>
                                    <BlockDiver />
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row'}}>
                                <View style={{ flex: 1, width: 200 }}>
                                    <BlockDataname2 />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <BlockGalleryPage4 />
                                </View>
                            </View>
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                onPress={() => {
                                    handleSubmit();
                                }}
                                disabled={isDisabled && global['_change']}
                                text={t('Update')}
                            />
                            <SectionHeading text={t`アカウント`} />
                            <SimpleListButton text={t`ログアウト`} onPress={onLogOutPress} />
                            <SimpleListButton danger text={t`Delete Account`} onPress={onDeleteAccountPress} />
                            {!!appVersion && (
                                <>
                                    <Divider middle />
                                    <Text
                                        text={t('Version: {{version}}', { version: appVersion })}
                                        light
                                        small
                                        textSelectable
                                    />
                                </>
                            )}
                        </View>
                    );
                }}
            </Formik>
        </Page>
    );
};

/*
async function getContents() {
    return new Promise(async function(resolve, reject) {
        try {
            const lg = new log();
            let response = await lg.getname('2630b110-11c0-4ea0-a53f-984003669ff8');
            console.log('------------------------------------ ' + response);
            let responseJson = await response;
            //console.log(responseJson);
            resolve(responseJson);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
*/
export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('アカウント設定'),
        desktopHeaderType: DesktopHeaderType.none,
        ...defaultStackNavigationOptions,
    };
};

// @ts-ignore
AccountSettingsPage.navigationOptions = navigationOptions;

// @ts-ignore
AccountSettingsPage.path = 'account/settings'; //override path for better web URLs

export default withNavigation(AccountSettingsPage);
