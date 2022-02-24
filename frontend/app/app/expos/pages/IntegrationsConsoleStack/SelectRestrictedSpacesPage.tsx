import React, { useState, useEffect, ReactNode } from 'react';
import { withNavigation } from '@react-navigation/core';
import historyService from '../../services/history';
import { useTranslation } from 'react-i18next';
import Page from '../../components/UIKit/Layout/Page';
import SectionHeading from '../../components/UIKit/items/SectionHeading';
import Spacer from '../../components/UIKit/items/Spacer';
import SingleLineInput from '../../components/UIKit/items/SingleLineInput';
import Button from '../../components/UIKit/items/Button';
import Text from '../../components/UIKit/items/Text';
import RestrictedSpaceItem from '../../components/UIKit/items/RestrictedSpaceItem';
import spaceService from '../../services/space';
import { defaultStackNavigationOptions } from '../../libs/nav/config';
import { getModalHeader, ModalButtonType, getRightActionHeader } from '../../components/Navigation/NavButtons'
import messageService from '../../services/message';
import i18n from '../../i18n';
import { Formik, FormikProps, FormikActions } from 'formik';
import * as yup from 'yup';
import find from 'lodash/find';
import assign from 'lodash/assign';
import { DesktopHeaderType, PaddingType, ItemHeight } from '../../theme.style';
import { PARAM_ON_DONE } from '../../constants';

const SelectRestrictedSpacesPage = (props: any) => {
    const { t } = useTranslation('SelectRestrictedSpacesPage');
    const { navigation } = props;
    const { restrictedSpaces, onFinish } = navigation.state.params;
    const [selection, setSelection] = useState<Space[]>(restrictedSpaces || []);

    const validationSchema = yup.object().shape({
        slug: yup
            .string()
            .required()
            .min(3),
    });

    type FormValues = {
        slug: string;
    };

    const intialValues = {
        slug: '',
    };

    const handleFormSubmit = async (values: FormValues, actions: FormikActions<FormValues>): Promise<void> => {
        try {
            const spaceInfo: SpaceServiceTypes.SpaceInfo | null = await spaceService.getInfoBySlug(values.slug);
            if (spaceInfo) {
                if (!find(selection, space => space.id === spaceInfo.space.id)) {
                    const temp = assign(selection);
                    temp.push(spaceInfo.space);
                    setSelection(temp);
                }
            } else {
                throw new Error();
            }
        } catch (err) {
            messageService.sendError(t('The space {{slug}} does not exist.', { slug: values.slug }));
        } finally {
            actions.resetForm();
        }
    };

    const onRemoveSpacePress = space => {
        setSelection(
            selection.filter(s => {
                return s.id !== space.id;
            })
        );
    };

    useEffect(() => {
        navigation.setParams({
            [PARAM_ON_DONE]: () => {
                onFinish(selection);
                navigation.goBack();
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    return (
        <Page scrollable desktopPadding={PaddingType.horizontalBottom}>
            <Formik
                validationSchema={validationSchema}
                initialValues={intialValues}
                enableReinitialize
                onSubmit={handleFormSubmit}>
                {(formikProps: FormikProps<FormValues>): ReactNode => {
                    const { values, handleSubmit, isValid, isSubmitting, handleChange, handleBlur } = formikProps;
                    return (
                        <>
                            <SectionHeading text={t`Enter space domain`} />
                            <SingleLineInput
                                onChangeText={handleChange('slug')}
                                onBlur={handleBlur('slug')}
                                value={values.slug}
                                inputLegend={t('Brand::withtree.com/')}
                                placeholder={t('domain')}
                                returnKeyType="go"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="none"
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            <Button
                                onPress={() => handleSubmit()}
                                disabled={!isValid || isSubmitting}
                                text={t`Add Space`}
                                desktopFitWidth
                            />
                            <Text
                                text={t`[How do I find the space domain?](https://www.notion.so/workwell/Guides-and-FAQs-v4-95a1875f58fb4df4b82b41aeb4552c31#d037a3ff6d6b48e0970cf6a92f2cedf9)`}
                                small
                                light
                                markdown
                            />
                            <Spacer height={ItemHeight.xsmall} />
                            {selection.map((space: Space) => (
                                <RestrictedSpaceItem
                                    key={space.id}
                                    space={space}
                                    onRemovePress={() => {
                                        onRemoveSpacePress(space);
                                    }}
                                />
                            ))}
                        </>
                    );
                }}
            </Formik>

        </Page>
    );
};

export const navigationOptions = ({ navigation }: any) => {
    historyService.setNavigation(navigation);
    return {
        title: i18n.t('SelectRestrictedSpacesPage::Restricted Spaces'),
        desktopHeaderType: DesktopHeaderType.plain,
        ...defaultStackNavigationOptions,
        ...getModalHeader(ModalButtonType.cancel),
        ...getRightActionHeader(i18n.t('SelectRestrictedSpacesPage::Done'), true, true, () => {
            navigation.state.params[PARAM_ON_DONE] && navigation.state.params[PARAM_ON_DONE]();
        }),
    };
};

// @ts-ignore
SelectRestrictedSpacesPage.navigationOptions = navigationOptions;

export default withNavigation(SelectRestrictedSpacesPage);
