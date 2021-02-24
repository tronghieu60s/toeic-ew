import React from 'react';
import tailwind from '~/tailwind';
import { Text, View } from '../Themed';

type Props = { children: React.ReactNode };

const ScreenCenter = React.memo((props: Props) => {
  const { children } = props;

  return (
    <View style={tailwind('flex-1 justify-center items-center px-10 pb-20')}>
      <Text style={{ fontSize: 13, textAlign: 'center' }}>{children}</Text>
    </View>
  );
});

export default ScreenCenter;