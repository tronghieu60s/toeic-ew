import { StackNavigationProp } from '@react-navigation/stack';
import React, { memo } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { actToggleFlashWord } from '~/src/redux/actions/practiceAction';
import { RootState } from '~/src/redux/reducers/rootReducer';
import tailwind from '~/tailwind';
import { TabDifficultParamList, WordType } from '~/types';
import WordItem from '../TabPractice/Words/WordItem';
import { View } from '../Themed';
import CenterUI from '../UI/Center';

type Props = {
  navigation: StackNavigationProp<TabDifficultParamList, 'TabDifficultScreen'>;
};

const TabDifficult = memo(({ navigation }: Props) => {
  const dispatch = useDispatch();
  const words = useSelector((state: RootState) => state.practice.wordsDifficult);

  const renderItem = ({ item }: { item: WordType }) => (
    <WordItem word={item} handleFlashWord={handleFlashWord} handleDetailsWord={handleDetailsWord} />
  );

  const handleFlashWord = (word: WordType) => dispatch(actToggleFlashWord(word));
  const handleDetailsWord = (word: WordType) =>
    navigation.navigate('TabPracticeWordDetails', { word });

  const text = 'Không có từ khó. Bạn đang làm rất tốt ^^.';
  if (words.length <= 0) return <CenterUI>{text}</CenterUI>;

  return (
    <View light style={tailwind('flex-1 px-2')}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tailwind('pt-2 pb-14')}
      />
    </View>
  );
});

export default TabDifficult;