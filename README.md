# react-native-gogo-spin

[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://www.npmjs.com/package/react-native-gogo-spin)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://www.npmjs.com/package/react-native-gogo-spin)
[![npm](https://img.shields.io/npm/v/react-native-gogo-spin.svg)](https://www.npmjs.com/package/react-native-gogo-spin)
[![npm](https://img.shields.io/npm/dm/react-native-gogo-spin.svg)](https://www.npmjs.com/package/react-native-gogo-spin)
![license](https://img.shields.io/npm/l/react-native-gogo-spin.svg)
| Example                              |
| :-------------------------------------- |
| ![Example](https://raw.githubusercontent.com/282931/react-native-gogo-spin/master/example/gif/demo.gif) |

## Installation

```
yarn add react-native-gogo-spin
```

or

```
npm install react-native-gogo-spin --save
```

## Notice

worked in react native web and ios android ,you can custom each pie base on array you passed in,like Flatlist;check the example to seek the usage;


## Examples

[React Native example](./example/App.tsx)

### Code

```jsx
export const App = () => {
  const prize=[1,2,3,4,5,6]
  const spinRef = useRef<React.ElementRef<typeof GoGoSpin>>(null);
  const doSpin = () => {
    const getIdx = ~~(Math.random() * prize.length);
    spinRef.current.doSpinAnimate(getIdx);
  };
  const onEndSpin = (endSuccess: boolean) => {
    console.log('endSuccess', endSuccess);
  };
  return (
    <View style={styles.container}>
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
                <Image source={data.image} style={{ width: 40, height: 40 }} />
              </View>
            );
          }}
        />
        <TouchableOpacity style={{ position: 'absolute' }} onPress={doSpin}>
          <Image source={require('./images/btn.png')} style={{ width: 105, height: 124 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## Methods

| Prop                        |                      Default                      |                  Type                   | Description                                                                           |
| :-------------------------- | :-----------------------------------------------: | :-------------------------------------: | :------------------------------------------------------------------------------------ |
| doSpinAnimate                   |                         -                         |                 `(idx: number) => void`                  | spin to the given index in data prop                                                                      |


## Props

| Prop                        |                      Default                      |                  Type                   | Description                                                                           |
| :-------------------------- | :-----------------------------------------------: | :-------------------------------------: | :------------------------------------------------------------------------------------ |
| data(required)                    |                         -                         |                 `array`                  | Like data in flatlist                                                                      |
| renderItem(required)                    |                         -                         |                 `(data,index)=>React.ReactElement`                  | Like renderItem in flatlist                                                                      |
| width/height/radius(required)                    |                         -                         |                 `number`                  | Size of the wheel                                                                     |
| source                    |                         -                         |                 `ImageSourcePropType`                  | this props shows a background image if it exist                                                                    |
| onEndSpinCallBack                    |                         -                         |                 `(finish: boolean) => void`                  | call after spin end                                                                    |
| notShowDividLine                    |                        false                         |                `boolean`                 | if show the dividing line between each pie                           |
| offsetEnable                    |                        false                         |                `boolean`                 | false will point to the center of the pie ,true will randomly point to the section of the pie                           |
| spinReverse                    |                        false                         |                `boolean`                 | spin reverse                           |
| wheelStyle                       |                         8000                         |                `StyleProp<ViewStyle>`                 | the style of the outside wheel
| spinTime                    |                       8                       |                `number`                 | the number of the wheel make turns after it point to the prize                                 |
| spinDuration                       |                         8000                         |                `number`                 | The time(ms)  whole spin animation last                                                           |
| innerHeight/innerWidth                 |                        50                        |                `number`                 | item in pie default size                                                |


## Author

282931
