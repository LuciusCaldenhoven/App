import React, { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { createStyles } from '../payment/payment.styles';
import StepperComponent from "@/components/stepper/component";
import VisaCard from '@/components/visaCard/component';
import { renderMarginBottom } from "@/constants/ui-utils";
import InputComponent from '@/components/input/component';
import { View } from 'react-native';
import Button from '@/components/button/component';
import { AntDesign, FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { scale } from '@/constants/scale';
import { BottomSheet } from '@/components/bottomSheet/BottomSheet';
import CountryComponent from '@/components/countrypicker/component';
import CheckBoxComponent from '@/components/checkbox/component';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';


const BookingPaymentScreen = () => {
  const styles = createStyles();
  const [showPayment, setShowPayment] = useState(false);
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <StepperComponent active={2} />
        {renderMarginBottom(6)}
        <VisaCard />
        {renderMarginBottom(6)}
        <View style={styles.inputContainer}>
          <Text style={styles.lableText}>Seleccion metodo de pago</Text>
          <Pressable style={styles.selectPayment}>
            <View style={styles.rg}>
              <FontAwesome name="money" size={scale(18)} color={COLORS.gray} />
              <Text style={styles.selectPaymentText}>Tarjeta de credito</Text>
            </View>
            <Button
              text="DEFAULT"
              buttonStyles={styles.buttonStyles}
              textStyles={styles.buttonText}
              onPress={() => setShowPayment(true)}
            />
          </Pressable>
          {renderMarginBottom(22)}
          <Text style={styles.lableText}>Informacion de tarjeta</Text>
          <InputComponent
            onChangeText={e => console.log(e)}
            placeholder="Nombre en la tarjeta"
          />
          <InputComponent
            onChangeText={e => console.log(e)}
            placeholder="Correo electronico"
          />
          <InputComponent
            onChangeText={e => console.log(e)}
            placeholder="Numero de tarjeta"
          />
          <View style={styles.rg}>
            <InputComponent
              containerStyle={styles.inputStyle}
              onChangeText={e => console.log(e)}
              placeholder="MM/YY"
            />
            <InputComponent
              containerStyle={styles.inputStyle}
              onChangeText={e => console.log(e)}
              placeholder="CVV"
            />
          </View>
          {renderMarginBottom(22)}
          <Text style={styles.lableText}>Pais o region</Text>
          <CountryComponent onPress={e => console.log(e)} />
          <InputComponent
            onChangeText={e => console.log(e)}
            placeholder="ZIP"
          />
          {renderMarginBottom(12)}
          <View style={styles.flexRow}>
            <CheckBoxComponent
              onPress={e => {
                console.log('item', e);
              }}
              isChecked={false}
            />
            <Text style={styles.checkBoxText}>Terminos y condiciones</Text>
          </View>
          <View style={styles.borderContainer}>
            <View style={styles.orBorder} />
            <Text style={styles.orText}>Paga con tarjeta o</Text>
            <View style={styles.orBorder} />
          </View>
          {renderMarginBottom(12)}
          <Button
            text="Apple Pay"
            textStyles={styles.outlineButtonText}
            buttonStyles={styles.iconButtonStyle}
            component={<MaterialIcons name="apple" size={scale(26)} />}
          />
          {renderMarginBottom(14)}
          <Button
            text="Google Pay"
            textStyles={styles.outlineButtonText}
            buttonStyles={styles.iconButtonStyle}
            component={<AntDesign name="google" size={scale(20)} />}
          />
          {renderMarginBottom(24)}
          <Button
            onPress={() => router.push(`/booking.screen/confirmation/confirmation.screen`)}
            text="Pay Now"
          />
        </View>
        <BottomSheet visible={showPayment} setVisible={setShowPayment}>
          <View style={styles.paymentContainer}>
            <Text
              onPress={() => setShowPayment(false)}
              style={styles.paymentText}>
              Tarjeta de credito
            </Text>
            <Text
              onPress={() => setShowPayment(false)}
              style={styles.paymentText}>
              IDK
            </Text>
          </View>
        </BottomSheet>
      </ScrollView>
    </View>
  );
};

export default BookingPaymentScreen;
