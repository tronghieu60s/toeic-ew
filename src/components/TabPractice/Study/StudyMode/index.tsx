import React, { memo } from 'react';
import { View } from '~/src/components/Themed';
import { TypesAnswer, WordType } from '~/types';
import ChooseSoundEN from './ChooseSoundEN';
import ChooseWord from './ChooseWord';
import FillWord from './FillWord';

type Props = {
  word: WordType;
  typeAnswer: TypesAnswer;
  handleSendAnswer: (value: string) => void;
};

const StudyMode = memo((props: Props) => {
  const { word, typeAnswer, handleSendAnswer } = props;

  return (
    <View>
      {typeAnswer === 'CHOOSE-NAME-MEAN' && (
        <ChooseWord word={word} typeAnswer={typeAnswer} handleSendAnswer={handleSendAnswer} />
      )}
      {typeAnswer === 'CHOOSE-MEAN-NAME' && (
        <ChooseWord word={word} typeAnswer={typeAnswer} handleSendAnswer={handleSendAnswer} />
      )}
      {(typeAnswer === 'FILL-NAME-MEAN' || typeAnswer === 'FILL-MEAN-NAME') && (
        <FillWord word={word} handleSendAnswer={handleSendAnswer} />
      )}
      {typeAnswer === 'CHOOSE-MEAN-SOUND' && (
        <ChooseSoundEN word={word} handleSendAnswer={handleSendAnswer} />
      )}
      {typeAnswer === 'CHOOSE-SOUND-MEAN' && (
        <ChooseWord word={word} typeAnswer={typeAnswer} handleSendAnswer={handleSendAnswer} />
      )}
    </View>
  );
});

export default StudyMode;
