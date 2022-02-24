import React, {FunctionComponent} from 'react';

import { SvgXml, SvgUri } from 'react-native-svg';
import svgIcons from '../../../assets/native/svg-icons';


export const SvgByIconId: FunctionComponent<NSIcon.SvgByIconIdProps> = (props) => {
    const { iconId, width, height } = props;

    return <SvgXml width={width} height={height} xml={svgIcons[iconId]} />
};
