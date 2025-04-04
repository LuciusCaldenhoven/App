import { View, Text } from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView, Switch } from 'react-native-gesture-handler'
import { createStyles } from "../booking.screen/booking.screen.styles";
import StepperComponent from "@/components/stepper/component";
import { COLORS } from "@/constants/theme";
import { renderMarginBottom } from "@/constants/ui-utils";

const BookingScreen = () => {
    const styles = createStyles();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <View style={styles.main}>
                    <StepperComponent active={3} />
                    {renderMarginBottom(6)}
                    <View style={styles.switchContainer}>
                        <View>
                            <Text style={styles.bookTitle}>Active notifica</Text>
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
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

export default BookingScreen;
