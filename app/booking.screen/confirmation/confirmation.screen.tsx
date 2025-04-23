import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import StepperComponent from '../../../components/stepper/component';
import createStyles from './confirmation.styles';

import Button from '../../../components/button/component';
import { renderMarginBottom,renderBorderBottom } from '@/constants/ui-utils';
import { FontAwesome } from '@expo/vector-icons';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import assets from '@/assets';

const BookingConfirmationScreen = () => {
  const styles = createStyles();
  const { flash } = assets;
    

  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <StepperComponent active={3} />
       
        <Image
           source={flash}
           resizeMode="cover"
           style={styles.image}
        />
              
                
        
        {renderMarginBottom(12)}
        <View style={styles.titleContainer}>
          <View style={styles.flex}>
            <Text style={styles.title}>Flash</Text>
            {renderMarginBottom(4)}
            <Text style={styles.text}>
              Alcance a mas de 100000 personas a nivel nacional
            </Text>
          </View>
          <View>
            <View style={styles.reviewContainer}>
              <Text style={styles.textBold}>5.0</Text>
              <FontAwesome name="star" size={scale(18)} color={COLORS.star} />
            </View>
            <Text style={[styles.text]}>(100k+ Personas)</Text>
          </View>
        </View>
        {renderMarginBottom(12)}
        {renderBorderBottom(1)}
        {renderMarginBottom(12)}
        <Text style={styles.title}>Booking Information</Text>
        {renderMarginBottom(12)}
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Booking ID</Text>
          <Text style={styles.value}>Booking ID</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Nombre</Text>
          <Text style={styles.value}>Lucius Caldenhoven</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Ubicacion</Text>
          <Text style={styles.value}>Alvarez Thomas 102, Peru</Text>
        </View>
        {renderBorderBottom(1)}
        {renderMarginBottom(12)}

        <Text style={styles.title}>Pago</Text>
        {renderMarginBottom(12)}
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Txt ID</Text>
          <Text style={[styles.value, styles.bold]}>#141mtslv5854d58</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Precio</Text>
          <Text style={[styles.value, styles.bold]}>$5.90</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Service Fee</Text>
          <Text style={[styles.value, styles.bold]}>$1.90</Text>
        </View>
        
        {renderBorderBottom(1)}
        {renderMarginBottom(12)}
        <View style={styles.horizontalContainer}>
          <Text style={[styles.value, styles.bold]}>Total</Text>
          <Text style={[styles.value, styles.bold]}>$6.80</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <Text style={styles.key}>Pago con</Text>
          <Text style={styles.value}>Tarjeta de Credito</Text>
        </View>
      </ScrollView>
      <Button
        onPress={() => router.push(`/booking.screen/status/status.screen`)}
        text="Confirmo"
        buttonStyles={styles.btn}
      />
    </View>
  );
};

export default BookingConfirmationScreen;