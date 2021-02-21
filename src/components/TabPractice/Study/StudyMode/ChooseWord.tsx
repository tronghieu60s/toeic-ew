import React, { memo, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import tailwind from '~/tailwind';
import { Text, View } from '~/src/components/Themed';
import { shuffle } from '~/src/helpers/array';
import { randomBetweenTwoNumber as rdNum } from '~/src/helpers/random';
import { typeAnswersMean, typeAnswersName } from '~/src/helpers/type-condition';
import { getWordsByIdGroup } from '~/src/models/WordsModel';
import { TypesAnswer, WordType } from '~/types';

type Props = {
  word: WordType;
  typeAnswer: TypesAnswer;
  handleSendAnswer: (value: string) => void;
};

const ChooseWord = memo(({ word, typeAnswer, handleSendAnswer }: Props) => {
  const [selectWords, setSelectWords] = useState(-1);
  const [words, setWords] = useState<WordType[]>([]);

  useEffect(() => {
    setSelectWords(-1);

    (async () => {
      const getWords = await getWordsByIdGroup(word);
      if (getWords.data !== null) {
        let words = getWords.data;
        words = words.filter((o) => o.id_word !== word.id_word);
        words = shuffle(words).slice(0, 5);
        words.splice(rdNum(0, 5), 0, word);
        setWords(words);
      }
    })();
  }, [word]);

  const renderWordsSelect = () =>
    words.map((word, index) => {
      const bgColor = selectWords === index ? '#2dce89' : '#e1e4ea';
      const color = selectWords === index ? '#fff' : '#000';

      let name = '';
      if (typeAnswersMean(typeAnswer)) name = word.mean_word || '';
      if (typeAnswersName(typeAnswer)) name = word.name_word || '';

      return (
        <TouchableWithoutFeedback
          key={word.id_word}
          style={[styles.word, { backgroundColor: bgColor }]}
          onPress={() => {
            setSelectWords(index);
            handleSendAnswer(name);
          }}
        >
          <Text style={[styles.wordText, { color }]}>{name}</Text>
        </TouchableWithoutFeedback>
      );
    });

  return <View style={styles.container}>{renderWordsSelect()}</View>;
});

const styles = StyleSheet.create({
  container: {
    ...tailwind('flex-row flex-wrap justify-center items-center'),
    width: Dimensions.get('window').width - 40,
    height: '72%',
  },
  word: {
    ...tailwind('justify-center items-center m-1 px-4 rounded-lg'),
    height: '39%',
    width: Dimensions.get('window').width / 2 - 28,
    backgroundColor: '#e1e4ea',
  },
  wordText: { ...tailwind('text-base text-center') },
});

export default ChooseWord;