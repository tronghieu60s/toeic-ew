import { StackNavigationProp } from '@react-navigation/stack';
import * as Speech from 'expo-speech';
import React, { memo, useEffect, useState } from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  Vibration,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { View } from '~/src/components/Themed';
import ProcessBar from '~/src/components/UI/ProcessBar';
import { convertWordsBase, removeVietnameseTones as rmVN } from '~/src/helpers/convert';
import { randomBetweenTwoNumber as rdNum } from '~/src/helpers/random';
import {
  AUDIO_CORRECT,
  AUDIO_CORRECT_FULL,
  AUDIO_FINISH,
  AUDIO_WRONG,
  playSound,
} from '~/src/helpers/sound';
import { typeAnswersName, typeAnswersMean } from '~/src/helpers/type-condition';
import {
  actStudyCorrect,
  actStudyInCorrect,
  increasePoint,
} from '~/src/redux/actions/practiceAction';
import { RootState } from '~/src/redux/reducers/rootReducer';
import tailwind from '~/tailwind';
import { StatusQuestion, TabPracticeParamList, TypesAnswer, WordType } from '~/types';
import AlertUI from './Alert';
import BottomUI from './Bottom';
import StudyMode from './StudyMode';
import StudyWord from './StudyMode/StudyWord';
import StudyUI from './StudyCover';
import Config from '~/src/constants/Config';

const { total_max } = Config.study;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Props = {
  navigation: StackNavigationProp<TabPracticeParamList, 'TabPracticeScreen'>;
};

const TabPracticeStudy = memo(({ navigation }: Props) => {
  const totalQuestions = total_max;
  const [status, setStatus] = useState<StatusQuestion>('Waiting');
  const [statusStudy, setStatusStudy] = useState<boolean>();

  const [userAnswer, setUserAnswer] = useState('');
  const [typeAnswer, setTypeAnswer] = useState<TypesAnswer>();
  const [countQuestion, setCountQuestion] = useState(0);

  const dispatch = useDispatch();
  const words = useSelector((state: RootState) => state.practice.words);
  const [wordQuestion, setWordQuestion] = useState<WordType>(() => words[rdNum(0, words.length)]);

  useEffect(() => {
    Speech.stop();

    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        duration: 200,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    const { count_study = 0 } = wordQuestion;
    switch (count_study) {
      case null:
        setStatusStudy(true);
        setTypeAnswer('CHOOSE-NAME-MEAN');
        break;
      case 1:
        setTypeAnswer('CHOOSE-MEAN-NAME');
        break;
      case 2:
        setTypeAnswer('CHOOSE-SOUND-MEAN');
        break;
      case 3:
        setTypeAnswer('FILL-MEAN-NAME');
        break;
      case 4:
        setTypeAnswer('CHOOSE-MEAN-SOUND');
        break;
      case 5:
        setTypeAnswer('FILL-NAME-MEAN');
        break;
      default:
        {
          const rdStudy = rdNum(1, 5);
          if (rdStudy === 1) setTypeAnswer('CHOOSE-MEAN-NAME');
          if (rdStudy === 2) setTypeAnswer('CHOOSE-SOUND-MEAN');
          if (rdStudy === 3) setTypeAnswer('FILL-MEAN-NAME');
          if (rdStudy === 4) setTypeAnswer('CHOOSE-MEAN-SOUND');
          if (rdStudy === 5) setTypeAnswer('FILL-NAME-MEAN');
        }
        break;
    }
  }, [wordQuestion]);

  useEffect(() => {
    if (statusStudy) {
      setStatus('Correct');
      setUserAnswer('Continue');
    }
  }, [statusStudy]);

  const handleSendAnswer = (value: string) => setUserAnswer(convertWordsBase(value));
  const handleAnswer = async () => {
    Keyboard.dismiss();

    let expected = '';
    if (typeAnswersName(typeAnswer || 'CHOOSE-MEAN-NAME')) expected = wordQuestion.name_word || '';
    if (typeAnswersMean(typeAnswer || 'CHOOSE-MEAN-NAME')) expected = wordQuestion.mean_word || '';
    expected = convertWordsBase(expected);

    const arrExpected = expected.split(',').map((s) => convertWordsBase(s));
    const arrExpectedVn = expected.split(',').map((s) => rmVN(convertWordsBase(s)));

    const actual = convertWordsBase(userAnswer);
    const conditionArr = arrExpected.indexOf(actual) !== -1 || arrExpectedVn.indexOf(actual) !== -1;

    if (conditionArr || actual === expected) {
      dispatch(increasePoint(50));
      dispatch(actStudyCorrect(wordQuestion));
      setCountQuestion(countQuestion + 1);

      setStatus('Correct');
      if (wordQuestion.count_study === 4) await playSound(AUDIO_CORRECT_FULL);
      else await playSound(AUDIO_CORRECT);
    } else {
      dispatch(actStudyInCorrect(wordQuestion));

      setStatus('Incorrect');
      Vibration.vibrate(200);
      await playSound(AUDIO_WRONG);
    }
  };
  const handleContinue = () => {
    Speech.stop();
    if (status === 'Waiting') {
      handleAnswer();
      return;
    }

    // Handle Exit Study
    if (countQuestion === totalQuestions || words.length === 0) {
      playSound(AUDIO_FINISH);
      navigation.removeListener('beforeRemove', (e) => navigation.dispatch(e.data.action));
      navigation.goBack();
      return;
    }

    const wordRandom = words[rdNum(0, words.length)];
    const newWordQuestion = status === 'Incorrect' || statusStudy ? wordQuestion : wordRandom;
    setWordQuestion(newWordQuestion);

    if (status === 'Incorrect') setStatusStudy(true);
    else setStatusStudy(false);

    setUserAnswer('');
    setStatus('Waiting');
  };

  if (!wordQuestion || !typeAnswer) return <View />;

  return (
    <View style={styles.container}>
      <ProcessBar percent={(countQuestion * 100) / totalQuestions} />
      {statusStudy && <StudyWord word={wordQuestion} />}
      {!statusStudy && (
        <StudyUI status={status} word={wordQuestion} typeAnswer={typeAnswer}>
          <StudyMode
            word={wordQuestion}
            typeAnswer={typeAnswer}
            handleSendAnswer={handleSendAnswer}
          />
        </StudyUI>
      )}
      <BottomUI status={status} userAnswer={userAnswer} handleContinue={handleContinue} />
      {status !== 'Waiting' && !statusStudy && <AlertUI status={status} word={wordQuestion} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { ...tailwind('w-full flex-1 justify-between') },
});

export default TabPracticeStudy;