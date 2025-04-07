import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { createStyles } from '../payment/payment.styles';
import StepperComponent from "@/components/stepper/component";
import VisaCard from '@/components/visaCard/component';
import { renderMarginBottom } from "@/constants/ui-utils";
import InputComponent from '@/components/input/component';
import { View } from 'react-native';
import Button from '@/components/button/component';

const BookingPaymentScreen = () => {
  const styles = createStyles();

  return (
    <View style={styles.container}>

      <ScrollView style={styles.main}>
        <StepperComponent active={2} />
        {renderMarginBottom(6)}
        <VisaCard />
        {renderMarginBottom(6)}
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Selecciona metodo de pago</Text>
          <Pressable style={styles.selectPayment}>
            <Text style={styles.selectPaymentText}>Credit Card</Text>
            <Button text="DEFAULT" buttonStyles={styles.buttonStyles} textStyles={styles.buttonText} onPress={() => console.log('default')} />

          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
};

export default BookingPaymentScreen;
