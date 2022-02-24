import Swiper from 'react-native-swiper/src';
import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import ImageItem from '../../../../components/UIKit/items/Image';
import Text from '../../../../components/UIKit/items/Text';
import {ImageAspectRatio, ItemHeight} from '../../../../theme.style';
import { EventEmitterProps } from '../../../../libs/integration/pageRenderer';
import { WithItem, WithPageProps, WithAction, WithEventEmitter } from '../../../../pages/Integration/Page';
import get from 'lodash/get';
import {Platform,StyleSheet,View,ScrollView,Dimensions} from 'react-native';
//let {width} = Dimensions.get('window'); //get window size
export type ImageFormat = 'square' | 'landscape' | 'original';

let {width} = Dimensions.get('window'); //get window size
//export type ImageFormat = 'square' | 'landscape' | 'original';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcome: {
        position : "absolute",
        bottom : 0,
        top : 100,
        left : 100,
        right : 0,
        alignItems: 'center',
        textAlignVertical : 'bottom',
        color:'#ffffff'
    },
    slideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});

type ImageProps = {
    value: string;
    attrs?: {
        caption?: string;
        format?: ImageFormat;
        width?: number;
        height?: number;
        zoomEnabled?: boolean;
    } & WithAction;
} & EventEmitterProps & ItemProps & WithPageProps & WithEventEmitter & WithItem;

const getAspectRatio = (ratio?: ImageFormat): ImageAspectRatio => {
    switch (ratio) {
        case 'square': return ImageAspectRatio.square;
        case 'landscape': return ImageAspectRatio.landscape;
        default: return ImageAspectRatio.original;
    }
}
//  <Text text={//JSON.stringify(props.value)}/>
const Image: FunctionComponent<ImageProps> = (props) => {
    let list = [];
    let listweb = [];
    let _ios = false;
    const onClick = get(props, 'attrs.onClick', null);
    const onImageClick = () => {
        if (onClick && props.onClick) {
            props.onClick(props.attrs.onClick)
        }
    };

    const caption = get(props, 'attrs.caption', null);

    //change this line to prop.value
    let _list = Array.isArray(props.value);
    //let _listweb = Array.isArray(props.value);
    let imgcnt=1;
    let indicate = "";
    let i=1;


    if (Platform.OS === 'ios') {
        _ios = true;
    }
    if(Array.isArray(props.value)) {
        //value の数だけ　画像アイテムの追加
        props.value.forEach((value) => {
            indicate = "";
            for (i = 1; i<=props.value.length; i++) {
                if (i === imgcnt) {
                    indicate = indicate + "○";
                } else {
                    indicate = indicate + "●";
                }
            };
            list.push(
                <View testID="Hello" style={styles.slide1}>
                    <ImageItem
                        source={value.toString()}
                        aspectRatio={getAspectRatio(get(props, 'attrs.format'))}
                        zoomEnabled={false}
                        onPress={onImageClick}
                        touchable={!!onClick}
                        {...omit(props, 'value', 'attrs')} />
                </View>
            );
            listweb.push(
                <View style={[{width: width, height: ItemHeight.flex}]}>
                    <ImageItem
                        source={value.toString()}
                        aspectRatio={getAspectRatio(get(props, 'attrs.format'))}
                        zoomEnabled={false}
                        onPress={onImageClick}
                        touchable={!!onClick}
                        {...omit(props, 'value', 'attrs')} />
                    <Text text={imgcnt.toString()+"/"+props.value.length+"画像中"} />
                </View>
            );
            imgcnt=imgcnt+1;
        });
    }else{
        list.push(<ImageItem
            source={props.value}
            aspectRatio={getAspectRatio(get(props, 'attrs.format'))}
            zoomEnabled={false}
            onPress={onImageClick}
            touchable={!!onClick}
            {...omit(props, 'value', 'attrs')} />)
    }


    return <>
        {_list && _ios &&
        <Swiper style={styles.wrapper}
                height={ItemHeight.flex}
                horizontal={true}
                loop={false}
        >
            {list}
        </Swiper>
        }

        {_list && !_ios &&
        <ScrollView horizontal={true} style={{width: "100%"}}>
            {listweb}
        </ScrollView>
        }

        { !_list &&
        <View>
            {list}
        </View>
        }
        { !!caption &&
        <Text text={caption} light center mini textNumberOfLines={1} />
        }
    </>;
};

export default Image;
