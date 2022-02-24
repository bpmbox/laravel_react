import get from 'lodash/get';
import React, { FunctionComponent, useEffect, useState, useCallback} from 'react';
import { ItemProps } from '../../../../components/UIKit/Item';
import { renderItem } from '../../../../libs/integration/pageRenderer';
import { WithEventEmitter, WithItem, WithPageProps } from '../../../../pages/Integration/Page';
import defaultTo from 'lodash/defaultTo';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { getLayoutStyle } from '../../../UIKit/Item/style';
import { ItemWidth } from '../../../../theme.style';

enum CollectionViewItemSize {
    small = 'small',
    medium = 'medium',
    large = 'large'
};

enum SortType {
    ascending = 'ascending',
    descending = 'descending',
};

export type CollectionViewType = 'list' | 'gallery' | 'table';
export type RelativeWidth = '100%' | '50%' | '33%' | '25%';
export type ScrenSizes = 'tiny' | 'small' | 'medium' | 'full';

type CollectionProps = {
    value?: any;
    attrs?: {
        viewType?: CollectionViewType,
        itemSize?: CollectionViewItemSize,
        renderItem?: any,
        tableSetting?: TableSetting,
    },
} & ItemProps & WithPageProps & WithEventEmitter & WithItem;

type LayoutCollectionProps = {
    items: any[],
    itemRenderer: ItemRenderer,
    itemSize?: CollectionViewItemSize,
    desktopWidth?: ItemWidth,
    desktopCenterItem?: boolean,
    tableSetting?: TableSetting,
};

type TableSetting = {
    verticalHeader?: HeaderStyle,
    horizontalHeader?: HeaderStyle,
    borderStyle?: BorderStyle,
    columnWidth?: number,
    rowHeaderWidth?: number,
    tableHeight?: number
};

type HeaderStyle = {
    property: string,
    isDisplay: boolean,
    sort?: SortType
};
type BorderStyle = {
    isDisplay?: boolean,
    color?: string
};

type ItemRenderer = (item, index) => any;

const sizeMatrix = {
    small: {
        tiny: '100%',
        small: '50%',
        medium: '33%',
        full: '25%',
    },
    medium: {
        tiny: '100%',
        small: '100%',
        medium: '50%',
        full: '33%',
    },
    large: {
        tiny: '100%',
        small: '100%',
        medium: '100%',
        full: '50%',
    }
};

const getScrenSizeForWidth = (width: number): ScrenSizes => {
    if (width < 240) {
        return 'tiny';
    } else if (width < 360) {
        return 'small';
    } else if (width < 520) {
        return 'medium';
    } else {
        return 'full';
    }
}

const getWidthForItemSize = (screenWidth: number, itemSize: CollectionViewItemSize): string => {
    return sizeMatrix[itemSize][getScrenSizeForWidth(screenWidth)];
}

const Collection: FunctionComponent<CollectionProps> = (props) => {
    const [items, setItems] = useState<any[]>([]);
    const templateBlocks = get(props, 'attrs.renderItem.blocks', null);
    const viewType = get(props, 'attrs.viewType', 'list');

    const renderCollectionItem: ItemRenderer = (item, _) => {
        if (!templateBlocks || !Array.isArray(templateBlocks)) {
            return <></>;
        }
        return templateBlocks.map((block, index) => {
            return renderItem(
                index,
                props.eventEmitter,
                block,
                props.desktopWidth,
                props.pageProps,
                item);
        })
    }

    const fetchItems = useCallback(async () => {
        const source = get(props.value, 'source', null);
        if (source) {
            try {
                const response = await fetch(source);
                const result = await response.json();
                if (Array.isArray(result)) {
                    setItems(result);
                }
            } catch {
            }
        } else {
            setItems(get(props.value, 'items', []));
        }
    }, [props.value]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    if (viewType === 'list') {
        return <ListCollection
            items={items}
            itemRenderer={renderCollectionItem} />
    } else if (viewType === 'table') {
        let itemSize = get(props, 'attrs.itemSize', 'medium');
        if (!(itemSize in CollectionViewItemSize)) {
            itemSize = 'medium';
        }
        let tableSetting = get(props, 'attrs.tableSetting', null);
        return <TableCollection
            items={items}
            itemRenderer={renderCollectionItem}
            itemSize={itemSize}
            desktopWidth={props.desktopWidth}
            desktopCenterItem={props.desktopCenterItem}
            tableSetting={tableSetting} />
    } else {
        let itemSize = get(props, 'attrs.itemSize', 'medium');
        if (!(itemSize in CollectionViewItemSize)) {
            itemSize = 'medium';
        }
        return <GalleryCollection
            items={items}
            itemRenderer={renderCollectionItem}
            itemSize={itemSize}
            desktopWidth={props.desktopWidth}
            desktopCenterItem={props.desktopCenterItem}
        />;
    }
};

const ListCollection: FunctionComponent<LayoutCollectionProps> = (props) => {
    return <>
        { defaultTo(props.items, []).map(props.itemRenderer) }
    </>;
};

const GalleryCollection: FunctionComponent<LayoutCollectionProps> = (props) => {
    const [layout, setLayout] = useState(null);

    const layoutStyle = getLayoutStyle(
        props.desktopWidth,
        props.desktopCenterItem
    );

    const viewWidth = get(layout, 'nativeEvent.layout.width', 0);
    const itemWidth = getWidthForItemSize(viewWidth, props.itemSize);

    return <View style={[styles.container, layoutStyle]} onLayout={setLayout}>
        { defaultTo(props.items, []).map((item, index) => {
            return <View key={index} style={{ width: itemWidth }}>
                { props.itemRenderer(item, index) }
            </View>
        })}
    </View>
};

const TableCollection: FunctionComponent<LayoutCollectionProps> = (props) => {
    // プロパティチェック
    if(!checkProperties(props)) {
        return <></>
    }

    // TableSettingから情報を切り出す。
    const [
        verticalHeader, horizontalHeader,
        borderStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle,
        columnWidthStyle, rowHeaderWidthStyle, tableHeightStyle] = getTableSettingsParameters(props);

    // itemsの内容を行及び列のリストと、セル要素のディクショナリに分解する。
    const [rowList, columnList, importData] = disassemblyTableItems(props, verticalHeader, horizontalHeader);

    // ページのコンテンツのリスト
    let headerList = [];
    let list = [];

    // 行でループ。
    rowList.forEach((row) => {
        var currentRow = [];

        // ヘダーを生成。
        if (headerList.length === 0 && horizontalHeader && horizontalHeader.isDisplay) {
            // 列ヘダーが指定されている場合は行のリストの先頭に列名の行を追加する
            if (verticalHeader && verticalHeader.isDisplay) {
                // 行ヘダーの指定がある場合は列のリストの先頭に空文字を追加する。
                currentRow.push(<View style={[styles.tableColumn, rowHeaderWidthStyle, borderTopLeftStyle]} ><Text></Text></View>);
            }

            // 列でループ。
            columnList.forEach((column) => {
                if (currentRow.length <= 0) {
                    currentRow.push(<View style={[styles.tableColumn, columnWidthStyle, borderTopLeftStyle]} ><Text>{column}</Text></View>);
                } else {
                    currentRow.push(<View style={[styles.tableColumn, columnWidthStyle, borderTopStyle]} ><Text>{column}</Text></View>);
                }
            });

            // 1行追加。
            headerList.push(<View style={[styles.tableRow, styles.tableHeader]}>{currentRow.slice()}</View>);
            currentRow.length = 0;
        }

        // ディティールを生成。
        if (verticalHeader && verticalHeader.isDisplay) {
            // 行ヘダーの指定がある場合は列のリストの先頭に行ヘダーを追加する。
            if (headerList.length <= 0 && list.length <= 0) {
                currentRow.push(<View style={[styles.tableColumn, styles.tableHeader, rowHeaderWidthStyle, borderTopLeftStyle]} ><Text>{row}</Text></View>);
            } else {
                currentRow.push(<View style={[styles.tableColumn, styles.tableHeader, rowHeaderWidthStyle, borderLeftStyle]} ><Text>{row}</Text></View>);
            }
        }

        columnList.forEach((column) => {
            const key = getDictionaryKey(row, column);
            let tempBorderStyle = borderStyle;
            // BorderStyleを切り替える。
            if (headerList.length <= 0 && list.length <= 0) {
                if (verticalHeader && verticalHeader.isDisplay) {
                    tempBorderStyle = borderTopStyle;
                } else if (currentRow.length <= 0) {
                    tempBorderStyle = borderTopLeftStyle;
                } else {
                    tempBorderStyle = borderTopStyle;
                }
            } else if (currentRow.length <= 0) {
                tempBorderStyle = borderLeftStyle;
            }

            if (importData[key]) {
                currentRow.push(<View style={[styles.tableColumn, columnWidthStyle, tempBorderStyle]} >{importData[key]}</View>);
            } else {
                currentRow.push(<View style={[styles.tableColumn, columnWidthStyle, tempBorderStyle]} ><Text></Text></View>);
            }
        });

        // 1行追加。
        list.push(<View style={styles.tableRow}>{currentRow.slice()}</View>);
    });

    const mainList = (props.tableSetting && props.tableSetting.tableHeight) ? <ScrollView>{list}</ScrollView> : <>{list}</>;

    return <View style={[styles.parentContainer]}><ScrollView horizontal={true}><View style={[styles.tableContainer, tableHeightStyle]}>{headerList}{mainList}</View></ScrollView></View>; 

};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    parentContainer: {
        paddingLeft: 7
    }, 
    tableContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    tableCell: {
        alignSelf: 'stretch'
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
    }
});

// [tableで使用]2つの文字列から1つのキーを取得する
const getDictionaryKey = (key1: string, key2: string) => {
    return `key1:${key1};key2:${key2};`;
}

// [tableで使用]TableSettingから必要な情報を切り出す。
const getTableSettingsParameters = (props) => {
    let verticalHeader: HeaderStyle;
    let horizontalHeader: HeaderStyle;
    let [borderStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle] = getTableBorderStyles(props.tableSetting.borderStyle);
    let columnWidthStyle = { width: 150 };
    let rowHeaderWidthStyle = { width: 150 };
    let tableHeightStyle = {};

    // 設定値を取得。
    if (props.tableSetting) {
        if (props.tableSetting.verticalHeader) {
            verticalHeader = {property: '', isDisplay: true};
            verticalHeader.property = props.tableSetting.verticalHeader.property;
            verticalHeader.sort = props.tableSetting.verticalHeader.sort;
            verticalHeader.isDisplay = props.tableSetting.verticalHeader.isDisplay === false ? false : true;
        }
        if (props.tableSetting.horizontalHeader) {
            horizontalHeader = {property: '', isDisplay: true};
            horizontalHeader.property = props.tableSetting.horizontalHeader.property;
            horizontalHeader.sort = props.tableSetting.horizontalHeader.sort;
            horizontalHeader.isDisplay = props.tableSetting.horizontalHeader.isDisplay === false ? false : true;
        }
        if (props.tableSetting.columnWidth) {
            columnWidthStyle = { width: props.tableSetting.columnWidth };
        }
        if (props.tableSetting.rowHeaderWidth) {
            rowHeaderWidthStyle = { width: props.tableSetting.rowHeaderWidth };
        }
        if (props.tableSetting.tableHeight) {
            tableHeightStyle = { height: props.tableSetting.tableHeight };
        }
    }

    return [verticalHeader, horizontalHeader, borderStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle, columnWidthStyle, rowHeaderWidthStyle, tableHeightStyle];
}

// [tableで使用]Borderが重なるとその部分だけ銭が太くなるため、Styleを使い分けてBorderが重ならないよう調整するためのStyleを取得する。
const getTableBorderStyles = (borderStyle: BorderStyle) => {
    let mainStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle = {};

    if (!borderStyle) {
        return [mainStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle];
    }

    const borderColor = borderStyle.color ? borderStyle.color : '#000000';
    const borderWidth = borderStyle.isDisplay === false ? 0 : 1;

    // 標準のStyle。左及び上のBorderを表示しない。
    mainStyle = {
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent'
    };
    // 最上段セルのStyle。左のBorderを表示しない。
    borderTopStyle = {
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderLeftColor: 'transparent'
    };
    // 最左セルのStyle。上のBorderを表示しない。
    borderLeftStyle = {
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderTopColor: 'transparent'
    };
    // 最左上セルのStyle。
    borderTopLeftStyle = {
        borderColor: borderColor,
        borderWidth: borderWidth
    };

    return [mainStyle, borderTopStyle, borderLeftStyle, borderTopLeftStyle];
}

// [tableで使用]itemsの内容を行及び列のリストと、セル要素のディクショナリに分解する。
const disassemblyTableItems = (props, verticalHeader, horizontalHeader) => {
    // 取り込んだデータ
    const importData: {[key: string]: any} = {};
    // 行のリスト
    let rowList = [];
    // 列のリスト
    let columnList = [];
    // 行カウント
    let count = 0;

    // 行と列の一覧作成と、取り込んだデータの保持を行う。
    defaultTo(props.items, []).forEach((item) => {
        let row = `${count}`;
        if (verticalHeader) {
            // 行ヘダーが指定されている場合はその値を用いる。
            row = get(item, verticalHeader.property);
        }
        if (!rowList.includes(row)) {
            // 既に登録済みの行は無視する。
            rowList.push(row);
        }

        let column = '';
        if (horizontalHeader) {
            // 列ヘダーが指定されている場合はその値を用いる。
            column = get(item, horizontalHeader.property);
        }
        if (!columnList.includes(column)) {
            // 既に登録済みの列は無視する。
            columnList.push(column);
        }

        // Itemを格納する。
        importData[getDictionaryKey(row, column)] = <View style={styles.tableCell}>{ props.itemRenderer(item, null) }</View>;

        if (verticalHeader || !horizontalHeader) {
            // 行指定なしで列指定ありの場合、行をカウントしない。
            count++;
        }
    });

    // 行の並び替え
    if (verticalHeader && verticalHeader.sort) {
        if (verticalHeader.sort === SortType.ascending) {
            rowList = rowList.sort();
        } else {
            rowList = rowList.sort(sortDescending);
        }
    }

    // 列の並び替え
    if (horizontalHeader && horizontalHeader.sort) {
        if (horizontalHeader.sort === SortType.ascending) {
            columnList = columnList.sort();
        } else {
            columnList = columnList.sort(sortDescending);
        }
    }

    return [rowList, columnList, importData];
}

// [tableで使用]降順でのソート処理。
const sortDescending = (a, b) => {
    if (a > b) {
        return -1;
    } else if (a < b) {
        return 1;
    }
    return 0;
}

// 入力値チェック
const checkProperties = (props) => {
    // props.tableSettingが未設定の場合true
    if (!props.tableSetting) {
        return true
    }
    if (props.tableSetting.verticalHeader) {
        // props.tableSetting.verticalHeaderが設定されている かつ props.tableSetting.verticalHeader.isDisplay がtrueまたはfalseまたは未設定のいずれでもない場false
        if (props.tableSetting.verticalHeader.isDisplay && props.tableSetting.verticalHeader.isDisplay !== true && props.tableSetting.verticalHeader.isDisplay !== false) {
            return false;
        }
        // props.tableSetting.verticalHeaderが設定されている かつ props.tableSetting.verticalHeader.sortがSortTypeの値でない かつ 未設定でもない場合false
        if (props.tableSetting.verticalHeader.sort && props.tableSetting.verticalHeader.sort !== SortType.ascending && props.tableSetting.verticalHeader.sort !== SortType.descending) {
            return false;
        }
    }
    if (props.tableSetting.horizontalHeader) {
        // props.tableSetting.horizontalHeaderが設定されている かつ props.tableSetting.horizontalHeader.isDisplay がtrueまたはfalseまたは未設定のいずれでもない場false
        if (props.tableSetting.horizontalHeader.isDisplay && props.tableSetting.horizontalHeader.isDisplay !== true && props.tableSetting.horizontalHeader.isDisplay !== false) {
            return false;
        }
        // props.tableSetting.horizontalHeaderが設定されている かつ props.tableSetting.horizontalHeader.sortがSortTypeの値でない かつ 未設定でもない場合false
        if (props.tableSetting.horizontalHeader.sort && props.tableSetting.horizontalHeader.sort !== SortType.ascending && props.tableSetting.horizontalHeader.sort !== SortType.descending) {
            return false;
        }
    }
    if (props.tableSetting.borderStyle) {
        // props.tableSetting.borderStyleが設定されている かつ props.tableSetting.borderStyle.isDisplay がtrueまたはfalseまたは未設定のいずれでもない場合false
        if (props.tableSetting.borderStyle && props.tableSetting.borderStyle.isDisplay !== true && props.tableSetting.borderStyle.isDisplay !== false) {
            return false;
        }
    }
    if (props.tableSetting.columnWidth && !Number.isInteger(props.tableSetting.columnWidth)) {
        // props.tableSetting.columnWidthが設定されている かつ 数値でない場合false
        return false;
    }
    if (props.tableSetting.rowHeaderWidth && !Number.isInteger(props.tableSetting.rowHeaderWidth)) {
        // props.tableSetting.rowHeaderWidthが設定されている かつ 数値でない場合false
        return false;
    }
    if (props.tableSetting.tableHeight && !Number.isInteger(props.tableSetting.tableHeight)) {
        // props.tableSetting.tableHeightが設定されている かつ 数値でない場合false
        return false;
    }
    return true;
}
export default Collection;
