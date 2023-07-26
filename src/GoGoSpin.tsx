import * as Animatable from 'react-native-animatable';

import { ImageBackground, ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';
import React, { useImperativeHandle, useRef } from 'react';

import { StyleSheet } from 'react-native';

export type RouletteLotteryType<T> = {
  width: number;
  height: number;
  radius: number;
  innerWidth?: number;
  innerHeight?: number;
  wheelStyle?: StyleProp<ViewStyle>;
  borderStyle?: StyleProp<ViewStyle>;
  data: T[];
  renderItem: (data: T, index: number) => React.ReactElement | null;
  onEndSpinCallBack?: (finish: boolean) => void;
  spinTime?: number;
  spinDuration?: number;
  offsetEnable?: boolean;
  source?: ImageSourcePropType;
  notShowDividLine?: boolean;
  spinReverse?: boolean;
  offsetPercent?: number;
};
export type RouletteLotteryHandle = {
  doSpinAnimate: (idx: number) => void;
};
const Frag: React.FC<{
  source?: ImageSourcePropType;
  width: number;
  height: number;
}> = ({ children, source, height, width }) =>
  source ? (
    <ImageBackground source={source} style={{ width: width, height: height }}>
      {children}
    </ImageBackground>
  ) : (
    <View style={{ width: width, height: height }}>{children}</View>
  );

function RouletteLotteryRef<T>(
  {
    radius,
    height,
    width,
    innerHeight = 50,
    innerWidth = 50,
    wheelStyle,
    data,
    renderItem,
    borderStyle,
    spinTime = 8,
    spinDuration = 8000,
    onEndSpinCallBack,
    offsetEnable = false,
    source,
    notShowDividLine = false,
    spinReverse = false,
    offsetPercent = 0.9,
  }: RouletteLotteryType<T>,
  ref: React.ForwardedRef<RouletteLotteryHandle>,
) {
  useImperativeHandle(ref, () => ({
    doSpinAnimate,
  }));
  const animateRef = useRef(null) as React.RefObject<Animatable.View & View>;
  const iconSize = innerWidth;
  const iconOffset = radius - iconSize / 2;
  const iconsDegree = 360 / data.length;
  const iconPosition = radius - iconSize;
  const length = data.length;

  const doSpinAnimate = (idx: number) => {
    const rotate = ((spinReverse ? idx : length - idx) / length) * 360;
    const maxOffsetDeg = 360 / length;
    const randomDeg = offsetEnable
      ? Math.floor(maxOffsetDeg * Math.random()) - maxOffsetDeg / 2
      : 0;
    const finalDeg = (spinTime - 1) * 360 + rotate + randomDeg * offsetPercent;
    const finalAnimate = {
      0: { transform: [{ rotate: '0deg' }] },
      1: {
        transform: [
          {
            rotate: `${spinReverse ? finalDeg * -1 : finalDeg}deg`,
          },
        ],
      },
    };
    animateRef?.current
      //@ts-ignore
      ?.animate({
        ...finalAnimate,
      })
      .then((endState: { finished: boolean }) => {
        onEndSpinCallBack && onEndSpinCallBack(endState?.finished);
      });
  };

  return (
    <Animatable.View
      ref={animateRef}
      duration={spinDuration}
      useNativeDriver
      style={[
        styles.container,
        {
          width: width,
          height: height,
          borderRadius: radius,
        },
        wheelStyle,
      ]}
    >
      <Frag source={source} height={height} width={width}>
        {data.map((e, i) => {
          const angle = i * iconsDegree - 90;
          const x = iconPosition * Math.cos((Math.PI * 2 * angle) / 360) + iconOffset;
          const y = iconPosition * Math.sin((Math.PI * 2 * angle) / 360) + iconOffset;
          return (
            <View
              key={i}
              style={[
                styles.wrap,
                {
                  left: x - 2,
                  top: y - 2,
                  width: innerWidth + 4,
                  height: innerHeight + 4,
                  transform: [{ rotate: angle + 90 + 'deg' }],
                },
              ]}
            >
              <>{renderItem(e, i)}</>
            </View>
          );
        })}
        {!notShowDividLine && (
          <View
            style={{
              width: width,
              height: height,
              transform: [{ rotate: 180 / data.length + 'deg' }],
            }}
          >
            {data.map((_e, i) => {
              const angle = i * iconsDegree - 90;
              const x = iconPosition * Math.cos((Math.PI * 2 * angle) / 360) + iconOffset;
              const y = iconPosition * Math.sin((Math.PI * 2 * angle) / 360) + iconOffset;
              return (
                <View
                  style={[
                    styles.wrap,
                    {
                      left: x - 2,
                      top: y - 2,
                      width: iconSize + 4,
                      height: iconSize + 4,
                      transform: [{ rotate: angle + 90 + 'deg' }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.defaultBorderStyle,
                      {
                        width: radius,
                        top: iconSize + 4,
                        transform: [{ rotate: '90deg' }],
                      },
                      borderStyle,
                    ]}
                  />
                </View>
              );
            })}
          </View>
        )}
      </Frag>
    </Animatable.View>
  );
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  wrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultBorderStyle: {
    height: 1,
    backgroundColor: '#fff',
  },
});
export const GoGoSpin = React.forwardRef(RouletteLotteryRef) as <T>(
  props: RouletteLotteryType<T> & {
    ref?: React.ForwardedRef<RouletteLotteryHandle>;
  },
) => ReturnType<typeof RouletteLotteryRef>;
