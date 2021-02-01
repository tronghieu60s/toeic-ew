import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import TabDifficult from '~/src/components/TabDifficult';
import { TabDifficultParamList } from '~/types';

type Props = {
  navigation: StackNavigationProp<TabDifficultParamList, 'TabDifficultScreen'>;
};

export default function TabDifficultScreen(props: Props): JSX.Element {
  const { navigation } = props;
  return <TabDifficult navigation={navigation} />;
}
