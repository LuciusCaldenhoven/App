import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView, Switch } from 'react-native-gesture-handler'
import  createStyles  from "../booking/booking.screen.styles";
import StepperComponent from "@/components/stepper/component";
import { COLORS } from "@/constants/theme";
import { renderMarginBottom } from "@/constants/ui-utils";
import InputComponent from "@/components/input/component";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { scale } from "@/constants/scale";
import TabSwitcher from "@/components/tabSwitcher/component";
import exportData from "@/app/search/filter.data";
import Button from "@/components/button/component";
import { router } from "expo-router";

const BookingScreen = () => {
    const styles = createStyles();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <View style={styles.main}>
                    <StepperComponent active={1} />
                    <ScrollView> 
                        {renderMarginBottom(6)}
                        <View style={styles.switchContainer}>
                            <View>
                                <Text style={styles.bookTitle}>Activa notificaciones</Text>
                                <Text style={styles.bookText}>Reciba alertas de nuevos productos</Text>
                            </View>

                            <Switch
                                value={isSwitchOn}
                                onValueChange={setIsSwitchOn}
                                thumbColor={COLORS.black}
                                trackColor={{
                                    false: COLORS.placeholder,
                                    true: COLORS.gray,
                                }}
                            />

                        </View>
                        {renderMarginBottom(12)}
                        <InputComponent leftAction={
                            <MaterialIcons
                                name="person-outline"
                                size={scale(22)}
                                color={COLORS.placeholder} />} placeholder="Nombre Completo*" onChangeText={e => console.log(e)} />
                        <InputComponent leftAction={
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={scale(22)}
                                color={COLORS.placeholder} />} placeholder="Correo Electronico*" onChangeText={e => console.log(e)} />
                        <InputComponent leftAction={
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={scale(22)}
                                color={COLORS.placeholder} />} keyboardType="numeric" placeholder="Numero*" onChangeText={e => console.log(e)} />
                        {renderMarginBottom(12)}
                        <TabSwitcher
                            title="Planes"
                            data={exportData.Planes}
                            onPress={e => console.log(e)}
                            tabContainerStyle={styles.tabContainerStyle}
                            tabStyle={styles.tabStyle}
                            tabTextStyle={styles.tabTextStyle}
                        />
                        
                        <TabSwitcher
                            title="Tiempo"
                            data={exportData.Renta}
                            onPress={e => console.log(e)}
                            tabContainerStyle={styles.tabContainerStyle}
                            tabStyle={[styles.tabStyle,  styles.ph]}
                            tabTextStyle={styles.tabTextStyle}
                        />
                        {renderMarginBottom(12)}
                    </ScrollView>

                    <Button 
                       onPress={() => router.push(`/booking.screen/payment/payment.screen`)}
                        text="Continuar" 
                        buttonStyles={styles.buttonStyles} 
                    /> 
                </View>

            </View>
        </GestureHandlerRootView>
    );
};

export default BookingScreen;
