import * as React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): string {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}

type ThemeProps = {
  weight?: number;
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ScrollViewProps = ThemeProps & DefaultScrollView['props'];

export function Text(props: TextProps): JSX.Element {
  const { style, weight, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultText style={[{ color, fontFamily: `san-${weight || 400}` }, style]} {...otherProps} />
  );
}

export function View(props: ViewProps): JSX.Element {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps): JSX.Element {
  const { style, ...otherProps } = props;

  return (
    <DefaultScrollView
      style={[style]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
    />
  );
}
