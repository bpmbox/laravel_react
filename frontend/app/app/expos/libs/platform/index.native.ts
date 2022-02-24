import DeviceInfo from 'react-native-device-info';

export const isMobilePlatform = true;
export const isSimulator = () => DeviceInfo.isEmulator();
