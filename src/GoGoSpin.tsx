import * as Animatable from 'react-native-animatable';

import {
  ImageBackground,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, { useImperativeHandle, useRef } from 'react';

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
};
export type RouletteLotteryHandle = {
  doSpinAnimate: (idx: number) => void;
};

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
    const randomDeg = offsetEnable ? ~~(maxOffsetDeg * Math.random()) - maxOffsetDeg / 2 : 0;
    const finalDeg = (spinTime - 1) * 360 + rotate + randomDeg;
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

  const Frag: React.FC = ({ children }) =>
    source ? (
      //@ts-ignore
      <ImageBackground source={source} style={{ width: width, height: height }}>
        {children}
      </ImageBackground>
    ) : (
      //@ts-ignore
      <View style={{ width: width, height: height }}>{children}</View>
    );

  return (
    //@ts-ignore
    <Animatable.View
      ref={animateRef}
      duration={spinDuration}
      useNativeDriver
      style={[
        {
          width: width,
          height: height,
          borderRadius: radius,
          overflow: 'hidden',
        },
        wheelStyle,
      ]}
    >
      <Frag>
        {data.map((e, i) => {
          const angle = i * iconsDegree - 90;
          const x = iconPosition * Math.cos((Math.PI * 2 * angle) / 360) + iconOffset;
          const y = iconPosition * Math.sin((Math.PI * 2 * angle) / 360) + iconOffset;
          return (
            <View
              style={{
                position: 'absolute',
                left: x - 2,
                top: y - 2,
                width: innerWidth + 4,
                height: innerHeight + 4,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ rotate: angle + 90 + 'deg' }],
              }}
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
            {data.map((e, i) => {
              const angle = i * iconsDegree - 90;
              const x = iconPosition * Math.cos((Math.PI * 2 * angle) / 360) + iconOffset;
              const y = iconPosition * Math.sin((Math.PI * 2 * angle) / 360) + iconOffset;
              return (
                <View
                  style={{
                    position: 'absolute',
                    left: x - 2,
                    top: y - 2,
                    width: iconSize + 4,
                    height: iconSize + 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ rotate: angle + 90 + 'deg' }],
                  }}
                >
                  <View
                    style={[
                      {
                        width: radius,
                        height: 1,
                        top: iconSize + 4,
                        backgroundColor: '#fff',
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

export const GoGoSpin = React.forwardRef(RouletteLotteryRef) as <T>(
  props: RouletteLotteryType<T> & { ref?: React.ForwardedRef<RouletteLotteryHandle> },
) => ReturnType<typeof RouletteLotteryRef>;
const styles = StyleSheet.create({});
