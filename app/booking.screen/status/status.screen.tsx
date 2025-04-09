import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { createStyles } from './status.styles';
import assets from '../../../assets';
import Button from '../../../components/button/component';
import { renderBorderBottom, renderMarginBottom } from '@/constants/ui-utils';
import { AntDesign, EvilIcons, Feather } from '@expo/vector-icons';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';


const BookingStatusScreen = () => {
    const styles = createStyles();
    const { success } = assets;
    return (
        <View style={styles.container}>
            <ScrollView style={styles.main}>
                <View style={styles.successContainer}>
                    <Image
                        resizeMode="contain"
                        source={success}
                        style={styles.successImage}
                    />
                    {renderBorderBottom(18)}
                    <Text style={styles.title}>Pago con exito</Text>
                    {renderBorderBottom(4)}
                    <Text style={styles.infoText}>
                        Tu plan promocional ha sido comprado con exito
                    </Text>
                </View>
                {renderMarginBottom(18)}
                <View style={styles.bookingInfo}>
                    <Text style={[styles.title, styles.f14]}>Informacion </Text>
                    {renderMarginBottom(12)}
                    {renderBorderBottom(1)}
                    {renderMarginBottom(12)}
                    <View style={styles.horizontalContainer}>
                        <Text style={[styles.value]}>Plan promocional</Text>
                        <Text style={[styles.value, styles.bl]}>Flash</Text>
                    </View>
                    <View style={styles.horizontalContainer}>
                        <Text style={[styles.value]}>Cantidad</Text>
                        <Text style={[styles.value, styles.bl]}>100k+ Personas</Text>
                    </View>
                    <View style={styles.horizontalContainer}>
                        <Text style={[styles.value]}>Nombre</Text>
                        <Text style={[styles.value, styles.bl]}>Lucius Caldenhoven</Text>
                    </View>
                </View>
                {renderMarginBottom(18)}
                {renderBorderBottom(1)}
                {renderMarginBottom(18)}
                <Text style={[styles.title, styles.f14]}>Informacion de la transaccion</Text>
                {renderMarginBottom(8)}
                <View style={styles.horizontalContainer}>
                    <Text style={[styles.value]}>transaccion ID</Text>
                    <Text style={[styles.value, styles.bl]}>#T000123B0J1</Text>
                </View>
                <View style={styles.horizontalContainer}>
                    <Text style={[styles.value]}>Metodo de Pago</Text>
                    <Text style={[styles.value, styles.bl]}>Tarjeta de credito</Text>
                </View>
                {renderMarginBottom(4)}
                {renderBorderBottom(1)}
                {renderMarginBottom(18)}
                <View style={styles.horizontalContainer}>
                    <Text style={[styles.value, styles.bold, styles.bl]}>
                        Total
                    </Text>
                    <Text style={[styles.value, styles.bold, styles.bl]}>$6.80</Text>
                </View>
                <Button
                    text="Descargar tu recibo"
                    textStyles={styles.outlineButtonText}
                    buttonStyles={styles.downloadBtn}
                    component={<Feather name="download" size={scale(20)} color={COLORS.gray}/>}
                />
                {renderMarginBottom(14)}
                <Button
                    text="Compartir tu recibo"
                    textStyles={styles.outlineButtonText}
                    buttonStyles={styles.shareBtn}
                    component={<EvilIcons name="share-google" size={scale(30)} color={COLORS.gray}/>}
                />
            </ScrollView>

            {renderMarginBottom(14)}
            <Button
                onPress={() => console.log('Confirm')}
                text="Confirm"
                buttonStyles={styles.btn}
            />
        </View>
    );
};

export default BookingStatusScreen;