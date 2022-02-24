import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import CodeEditor from '../items/CodeEditor';
import BlocksRenderer from './BlocksRenderer';
import Spacer from '../items/Spacer';
import { useTranslation } from 'react-i18next';
import { PageContent } from '../../../libs/integration/pageRenderer';
import { View, StyleSheet } from 'react-native';
import theme, { Color } from '../../../theme.style';
import TableHeader from '../items/TableHeader';
import { IconId } from '../../../assets/native/svg-icons';
import messageService from '../../../services/message';
import { copyToClipboard } from '../../../libs/clipboard';

type PlaygroundProps = {
    code: any,
};

const Playground: FunctionComponent<PlaygroundProps> = (props) => {
    const { t } = useTranslation('Playground');
    const [showCode, setShowCode] = useState<boolean>(false);
    const headerLabel = showCode ? t`Code Editor ⇣` : t`Code Editor ⇢`;

    const validationSchema = yup.object().shape({
        codeString: yup.string()
            .test('code-valid', t`Invalid code.`, async (_code) => {
                return true;
            }),
    });

    type PlaygroundFormValues = {
        codeString: string;
    };

    const intialValues = { codeString: JSON.stringify(props.code, null, 2) };

    const parseCode = (codeString): PageContent => {
        try {
            return JSON.parse(codeString) as PageContent;
        } catch {
            return {};
        }
    }

    const handleOnCopyPress = async (codeString) => {
        copyToClipboard(codeString);
        messageService.sendSuccess(t`Code copied to clipboard!`);
    }

    return <Formik
        validationSchema={validationSchema}
        initialValues={intialValues}
        enableReinitialize
        onSubmit={() => {}}>
            {
                (formikProps: FormikProps<PlaygroundFormValues>): ReactNode => {
                    const { values, handleChange, handleBlur } = formikProps;
                    return (
                        <View style={styles.container}>
                            <Spacer />
                            <BlocksRenderer content={parseCode(values.codeString)} />
                            <TableHeader text={headerLabel}
                                rightIconId={IconId.feather_copy_stroke_accent6}
                                onRightIconPress={() => handleOnCopyPress(values.codeString)}
                                includeBottomBorder={showCode}
                                touchable
                                onPress={() => {setShowCode(!showCode)}} />
                            { showCode &&
                                <CodeEditor
                                    onChangeText={handleChange('codeString')}
                                    onBlur={handleBlur('codeString')}
                                    value={values.codeString}
                                    spellCheck={false}
                                    placeholder={t`Enter JSON code here`} />
                            }
                        </View>
                    );
                }
            }
    </Formik>
};

const styles = StyleSheet.create({
    container: {
        borderColor: Color.accent3,
        borderWidth: theme.borderWidth,
        borderRadius: theme.radius,
    }
})

export default Playground;
