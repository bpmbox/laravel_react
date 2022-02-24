import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

const windowDimensions = Dimensions.get('window');

export default () => {
    const [dimensions, setDimensions] = useState(windowDimensions);

    const onChange = ({
        window: { width, height, scale, fontScale }
    }: {
        window: ScaledSize;
    }) => setDimensions({ width, height, scale, fontScale });

    useEffect(() => {
        Dimensions.addEventListener('change', onChange);
        return () => Dimensions.removeEventListener('change', onChange);
    }, []);

    return dimensions;
};
