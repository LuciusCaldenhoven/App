import React from 'react';
import {BottomSheet} from '../bottomSheet/BottomSheet';
import {FlatList, Pressable, Text, View} from 'react-native';
import {createStyles} from './countrypicker.styles';
import {ICountryProps} from './ICountrypicker.props';

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳', ph: '+91' },
  { code: 'US', name: 'United States', flag: '🇺🇸', ph: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', ph: '+44' },
  { code: 'FR', name: 'France', flag: '🇫🇷', ph: '+33' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', ph: '+51' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', ph: '+56' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', ph: '+54' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', ph: '+57' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', ph: '+52' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', ph: '+55' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', ph: '+593' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', ph: '+591' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', ph: '+598' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', ph: '+595' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', ph: '+58' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', ph: '+506' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', ph: '+507' }
];

const CountryComponent = ({onPress}: ICountryProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0]);
  const styles = createStyles();

  return (
    <View>
      <Pressable
        onPress={() => setIsVisible(!isVisible)}
        style={styles.container}>
        <Text style={styles.text}>
          {selectedCountry?.flag}
          {'\t\t'}
          {selectedCountry?.name}
        </Text>
      </Pressable>
      <BottomSheet visible={isVisible} setVisible={setIsVisible}>
        <View style={styles.bottomSheet}>
          <FlatList
            data={countries}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  setSelectedCountry(item);
                  setIsVisible(false);
                  onPress(item);
                }}
                style={styles.itemContainer}>
                <Text style={styles.text}>
                  {item?.flag} {'\t\t'}
                  {item?.name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default CountryComponent;