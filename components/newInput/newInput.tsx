import { Animated, Easing, FlatList, Image, KeyboardTypeOptions, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { min } from 'date-fns';
import { BottomSheet } from '../bottomSheet/BottomSheet';
import { COLORS } from '@/constants/theme';
import { scale } from '@/constants/scale';
import { Entypo } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


interface NewInputProps {
    label: string;
    duration?: number;
    keyboardType?: KeyboardTypeOptions | undefined;
    minHeight?: number;
    data?: any[];
    multiline?: boolean;
    onChangeText: (value: string) => void;
    value: string;
    onFocus?: () => void;
    iconComponent?: JSX.Element;

}

const NewInput = ({ label, iconComponent, duration = 200, keyboardType, minHeight, data, multiline, onChangeText, value, onFocus }: NewInputProps) => {

    const borderWidth = useRef(new Animated.Value(1.25));
    const transY = useRef(new Animated.Value(0));
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);


    const handleFocus = () => {
        animateTransform(-40);
        animateBorderWidth(2);
    };
    const handleBlur = (currentValue: string) => {
        if (currentValue) return;
        animateTransform(0);
        animateBorderWidth(1.25);
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
        outputRange: ['black', '#0a5fff'],
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
        inputRange: [-10, 0],
        outputRange: [-10, 0],
        extrapolate: 'clamp',
    });

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <Animated.View style={[styles.container, { borderWidth: borderWidth.current, borderColor: borderColor }]}>
            <Animated.View style={[styles.labelContainer, { transform: [{ translateY: transY.current }, { translateX: transX }] }]} >
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <View>{iconComponent}</View>
                    <Animated.Text style={{ color: labelColor, fontSize, fontFamily: 'Medium' }}>{label}</Animated.Text>
                </View>
            </Animated.View>
            {data ? (
                <View>
                    <Pressable onPress={() => { handleFocus(); handlePresentModalPress(); }} style={styles.input} >
                        <Text style={{ flex: 1, fontFamily: 'Medium', fontSize: 14, color: 'black', }}> {selectedItem?.title} </Text>
                    </Pressable>


                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        onChange={handleSheetChanges}
                        onDismiss={() => {
                            if (!selectedItem) {
                                handleBlur('');
                            }
                        }}

                        backdropComponent={(props) => (
                            <BottomSheetBackdrop
                                {...props}
                                appearsOnIndex={0}
                                disappearsOnIndex={-1}
                                opacity={0.6}
                                pressBehavior="close"   
                            />
                        )}
                    >
                        <BottomSheetScrollView style={styles.bottomSheet} contentContainerStyle={{ paddingBottom: 40 }}>
                            {data.map((item, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setSelectedItem(item);
                                        bottomSheetModalRef.current?.dismiss();
                                        onChangeText(item.title);
                                        handleBlur(item.title);
                                    }}
                                    style={styles.itemContainer}
                                >
                                    <Text style={styles.bottomInfo}>{item.title}</Text>
                                    <Text style={[styles.bottomInfo, { fontSize: 12, color: 'grey' }]}>{item.description}</Text>
                                </Pressable>
                            ))}
                        </BottomSheetScrollView>
                    </BottomSheetModal>

                </View>
            ) : (
                <TextInput style={[styles.input, { height: minHeight, fontFamily: 'Medium', fontSize: 14, color: 'black' }]}
                    value={value} onChangeText={onChangeText}
                    onFocus={() => { handleFocus(); if (onFocus) onFocus(); }} multiline={multiline}
                    onBlur={() => handleBlur(value)}
                    keyboardType={keyboardType}
                />
            )
            }
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '90%',
        justifyContent: 'center',
    },

    containerbootm: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        color: '#1A1A1A', // texto principal
    },
    bottomInfo: {
        paddingLeft: scale(12),
        fontFamily: 'Medium',
        fontSize: 14,
        color: '#111827', // gris oscuro
        textAlign: 'left'
    },
    itemContainer: {
        paddingVertical: scale(15),
        paddingHorizontal: scale(12),
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        flex: 0.80,
        borderRadius: scale(12),
        paddingTop: scale(12),
    },
    labelContainer: {
        position: 'absolute',
        paddingLeft: 10,
        top: 16,
    },

});

export default NewInput;
