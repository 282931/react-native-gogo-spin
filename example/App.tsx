import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';

import { GoGoSpin } from '../src/index';

const prize = [
  { name: 'x999', image: require('./images/king.png') },
  { name: 'x10', image: require('./images/prize.png') },
  { name: 'x50', image: require('./images/prize.png') },
  { name: 'x80', image: require('./images/prize.png') },
  { name: 'x100', image: require('./images/prize.png') },
  { name: 'x200', image: require('./images/prize.png') },
];
const SIZE = 300;
export const App = () => {
  const spinRef = useRef<React.ElementRef<typeof GoGoSpin>>(null);
  const [prizeIdx, setprizeIdx] = useState(-1);
  const doSpin = () => {
    const getIdx = Math.floor(Math.random() * prize.length);
    setprizeIdx(getIdx);
    spinRef?.current?.doSpinAnimate(getIdx);
  };
  const onEndSpin = (endSuccess: boolean) => {
    console.log('endSuccess', endSuccess);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.prizeText}>奖品:{prizeIdx !== -1 ? prize[prizeIdx]?.name : ''}</Text>
        <Image source={prize[prizeIdx]?.image} style={styles.itemWrap} />
      </View>
      <View style={styles.centerWheel}>
        <GoGoSpin
          onEndSpinCallBack={onEndSpin}
          notShowDividLine={true}
          spinDuration={2000}
          spinReverse={true}
          spinTime={3}
          ref={spinRef}
          width={SIZE}
          height={SIZE}
          radius={SIZE / 2}
          data={prize}
          offsetEnable={true}
          source={require('./images/wheel.png')}
          renderItem={(data, i) => {
            return (
              <View key={i} style={styles.itemWrapper}>
                <Text style={styles.prizeText}>{data.name}</Text>

                <Image source={data.image} style={styles.itemWrap} />
              </View>
            );
          }}
        />
        <TouchableOpacity style={styles.spinWarp} onPress={doSpin}>
          <Image source={require('./images/btn.png')} style={styles.spinBtn} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  startText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  prizeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerWheel: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinBtn: { width: 105, height: 124 },
  spinWarp: { position: 'absolute' },
  itemWrap: { width: 40, height: 40 },
});
export default App;
