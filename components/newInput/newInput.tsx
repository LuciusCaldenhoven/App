import { Animated, Easing, FlatList, Image, KeyboardTypeOptions, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { min } from 'date-fns';
import { BottomSheet } from '../bottomSheet/BottomSheet';
import { COLORS } from '@/constants/theme';
import { scale } from '@/constants/scale';
import { Entypo } from '@expo/vector-icons';


interface NewInputProps {
    label: string;
    duration?: number;
    keyboardType?: KeyboardTypeOptions | undefined;
    minHeight?: number;
    data?: any[];
    multiline?: boolean;
    onChangeText: (value: string) => void;
    value: string;

}

const NewInput = ({ label, duration = 200, keyboardType, minHeight, data, multiline,onChangeText,value }: NewInputProps) => {

    const borderWidth = useRef(new Animated.Value(1));
    const transY = useRef(new Animated.Value(0));
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [products, setProducts] = useState<any[]>(data || []);



    const handleFocus = () => {
        animateTransform(-40);
        animateBorderWidth(2);
    };
    const handleBlur = (currentValue: string) => {
        if (currentValue) return;
        animateTransform(0);
        animateBorderWidth(1);
      };



    const animateTransform = (toValue: number) => {
        Animated.timing(transY.current, {
            toValue,
            duration,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start();
    };

    const animateBorderWidth = (toValue: number) => {
        Animated.timing(borderWidth.current, {
            toValue,
            duration,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();
    };

    const borderColor = borderWidth.current.interpolate({
        inputRange: [0, 2],
        outputRange: ['black', 'grey'],
        extrapolate: 'clamp',
    });

    const labelColor = borderWidth.current.interpolate({
        inputRange: [0, 2],
        outputRange: ['grey', 'black'],
        extrapolate: 'clamp',
    });

    const fontSize = borderWidth.current.interpolate({
        inputRange: [0, 2],
        outputRange: [14, 12],
        extrapolate: 'clamp',
    });


    const transX = transY.current.interpolate({
        inputRange: [-40, 0],
        outputRange: [-20, 0],
        extrapolate: 'clamp',
    });


    return (
        <Animated.View style={[styles.container, { borderWidth: borderWidth.current, borderColor: borderColor }]}>
            <Animated.View style={[styles.labelContainer, { transform: [{ translateY: transY.current }, { translateX: transX }] }]} >
                <Animated.Text style={{ color: labelColor, fontSize, fontFamily: 'Medium' }}>{label}</Animated.Text>
            </Animated.View>
            {data ? (
                <View>
                    <Pressable onPress={() => { handleFocus(); setIsVisible(!isVisible) }} style={styles.input} >
                    <Text style={{ flex: 1, fontFamily: 'Medium', fontSize: 14, color: 'black' }}> {selectedItem?.title} </Text>
                    </Pressable>

                    <BottomSheet visible={isVisible} setVisible={setIsVisible}>
                        <View style={styles.bottomSheet}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            setSelectedItem(item);
                                            setIsVisible(false);
                                            onChangeText(item.title);
                                            handleBlur(item.title);
                                        }}
                                        style={styles.itemContainer}
                                    >
                                        <Text style={styles.bottomInfo}>{item.title}</Text>
                                        
                                        <Text style={[styles.bottomInfo, { fontSize: 12, color: 'grey' }]}>{item.description}</Text>
                                        
                                    </Pressable>
                                )}
                            />
                        </View>
                    </BottomSheet>
                </View>
            ) : (
                <TextInput style={[styles.input, { height: minHeight, fontFamily: 'Medium', fontSize: 14, color: 'black' }]}
                    value={value} onChangeText={onChangeText}
                    onFocus={handleFocus} multiline={multiline} onBlur={() => handleBlur(value)}
                    keyboardType={keyboardType} />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        justifyContent: 'center',
    },
    input: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    labelContainer: {
        position: 'absolute',
        paddingLeft: 20,
        top: 20,
    },
    bottomSheet: {
        backgroundColor: COLORS.white,
        flex: 0.80,
        borderRadius: scale(12),
        paddingTop: scale(12),
    },
    itemContainer: {

        paddingVertical: scale(15),
        paddingHorizontal: scale(12),
    },
    bottomInfo: {
        paddingLeft: scale(12),
        fontFamily: 'Medium',
        fontSize: 14,
        color: 'black',
        textAlign: 'left'
    }
});

export default NewInput;
