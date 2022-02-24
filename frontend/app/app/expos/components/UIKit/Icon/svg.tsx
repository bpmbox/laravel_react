import React, { FunctionComponent } from 'react';

import svgIcons from '../../../assets/native/svg-icons';


export const SvgByIconId: FunctionComponent<NSIcon.SvgByIconIdProps> = (props) => {
    const { iconId, width, height } = props;
    const svgXml = svgIcons[iconId];

    return <span
        style={{
            backgroundImage: `url('data:image/svg+xml;utf8,${escape(svgXml)}')`,
            backgroundSize: `${width}px ${height}px`,
            width: `${width}px`,
            height: `${height}px`,
        }}
    />;
};
