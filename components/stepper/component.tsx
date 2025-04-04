import { View, Text } from 'react-native';
import React from 'react';
import { createStyles } from "../stepper/stepper.styles"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { scale } from '@/constants/scale';

interface IStepper {
    active: number
}

const StepperComponent = ({ active = 1 }: IStepper) => {
    const styles = createStyles();
    return (
        <View style={styles.checkMarkContainer}>
            <View style={styles.line} />

            <View style={styles.checkMark}>
                <View style={styles.check}>
                    {active > 1 && <MaterialCommunityIcons name="check" color={'white'} size={scale(16)} />}
                    {active === 1 && <View style={styles.active} />}
                </View>
                <Text style={[styles.checkMarkText,active !== 1 && styles.inActiveText]}> Detalles de compra</Text>
            </View>
            <View style={styles.checkMark}>
                <View style={styles.check}>
                    {active > 2 && <MaterialCommunityIcons name="check" color={'white'} size={scale(16)} />}
                    {active === 2 && <View style={styles.active} />}
                </View>
                <Text style={[styles.checkMarkText, active !== 2 && styles.inActiveText]}> Metodos de pago</Text>
            </View>
            <View style={styles.checkMark}>
                <View style={styles.check}>
                    {active > 3 && <MaterialCommunityIcons name="check" color={'white'} size={scale(16)} />}
                    {active === 3 && <View style={styles.active} />}
                </View>
                <Text style={[styles.checkMarkText, active !== 3 && styles.inActiveText]}> Confirmacion</Text>
            </View>

        </View>
    );
};

export default StepperComponent;
