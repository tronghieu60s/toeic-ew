import { RouteProp } from '@react-navigation/native';
import React from 'react';
import tailwind from '~/tailwind';
import { TabPracticeParamList } from '~/types';
import AdMobBanner from '../../Ads';
import StudyWord from '../../TabPractice/Study/StudyMode/StudyWord';
import { View } from '../../Themed';

type Props = {
  route: RouteProp<TabPracticeParamList, 'TabPracticeWordDetails'>;
};

const TabDifficultWordDetails = React.memo((props: Props) => {
  const { word } = props.route.params;

  return (
    <View light style={tailwind('flex-1')}>
      <StudyWord word={word} />
      <View style={tailwind('w-full absolute bottom-0')}>
        <AdMobBanner light bannerSize="smartBannerLandscape" />
      </View>
    </View>
  );
});

export default TabDifficultWordDetails;