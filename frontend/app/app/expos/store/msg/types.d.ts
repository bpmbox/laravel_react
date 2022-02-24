type MsgStateType = {
    msg: any;
    title: string;
    type: 'ERROR' | 'SUCCESS' | 'MESSAGE';
    time: import('luxon').DateTime;
};
