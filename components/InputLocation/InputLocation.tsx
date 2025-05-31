import { Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

interface NewInputProps {
    label: string;
    duration?: number;
    keyboardType?: any;
    minHeight?: number;
    data?: any[];
    multiline?: boolean;
    onChangeText: (value: string) => void;
    value: string;
    onFocus?: () => void;
    iconComponent?: JSX.Element;
    onLocationSelected?: (info: { description: string; lat: number; lng: number }) => void;

}

const InputLocation = ({ label, iconComponent, duration = 200, keyboardType, minHeight, data, multiline, onChangeText, value, onFocus, onLocationSelected }: NewInputProps) => {
    const borderWidth = useRef(new Animated.Value(1.25));
    const transY = useRef(new Animated.Value(0));

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [query, setQuery] = useState(value);

    useEffect(() => {
        if (value?.trim() !== '') {
            animateTransform(-40);
            animateBorderWidth(2);
            setQuery(value);
        }
    }, []);

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

    // Function to fetch location suggestions
    const fetchSuggestions = async (text: string) => {
        setQuery(text);
        setSelectedPlace(null); // Reset selected location

        if (text.length < 2) {
            setSuggestions([]);
            return;
        }

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&language=es&components=country:pe&key=${GOOGLE_API_KEY}`;

        try {
            const response = await fetch(url);
            const json = await response.json();
            setSuggestions(json.predictions || []);
        } catch (error) {
            console.error('Error al buscar ubicaciones:', error);
        }
    };

    const fetchPlaceDetails = async (placeId: string, description: string) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

        try {
            const response = await fetch(url);
            const json = await response.json();

            if (json.result?.geometry?.location) {
                const location = json.result.geometry.location;
                const locationInfo = {
                    description,
                    lat: location.lat,
                    lng: location.lng,
                };
                setSuggestions([]);
                setQuery(description);
                onChangeText(description);
                onLocationSelected?.(locationInfo);
                handleFocus();
            } else {
                Alert.alert('Error', 'No se pudo obtener detalles de la ubicación.');
            }
        } catch (error) {
            console.error('Error al obtener detalles:', error);
        }
    };

    return (
        <Animated.View style={[styles.container, { borderWidth: borderWidth.current, borderColor: borderColor }]}>
            <Animated.View style={[styles.labelContainer, { transform: [{ translateY: transY.current }, { translateX: transX }] }]}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <View>{iconComponent}</View>
                    <Animated.Text style={{ color: labelColor, fontSize, fontFamily: 'Medium' }}>{label}</Animated.Text>
                </View>
            </Animated.View>

            {/* Search input for location */}
            <TextInput
                style={[styles.input, { height: minHeight, fontFamily: 'Medium', fontSize: 14, color: 'black' }]}
                value={query}
                onChangeText={fetchSuggestions}
                onFocus={() => { handleFocus(); if (onFocus) onFocus(); }}
                onBlur={() => handleBlur(value)}
            />


            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.item}
                            onPress={() => fetchPlaceDetails(item.place_id, item.description)}
                        >
                            <Text style={{ fontFamily: 'Regular' }}>{item.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '90%',
        justifyContent: 'center',
    },
    labelContainer: {
        position: 'absolute',
        paddingLeft: 10,
        top: 16,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        color: '#1A1A1A',
    },
    suggestionsContainer: {
        paddingHorizontal: 10,
        maxHeight: 300,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        position: 'relative',
        width: '100%',
        zIndex: 10,


    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});

export default InputLocation;
