import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SLIDE_DATA } from '../../data/slideData';
import HeroContent from './HeroContent';
import HeroImageGrid from './HeroImageGrid';
import HeroPagination from './HeroPagination';

const { width } = Dimensions.get('window');



const HomeHero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(0)

    const startTimer = () => {
        stopTimer(); // On nettoie l'ancien avant d'en créer un nouveau
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
        }, 5000);
    };

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
    useEffect(() => {
        startTimer();
        return () => stopTimer(); // Clean up au démontage
    }, []);

    const handleManualPress = (index: number) => {
        setActiveIndex(index);
        startTimer(); // On relance le timer de zéro après le clic !
    };

    return (
        <View style={styles.container}>
            {SLIDE_DATA.map((slide, index) => (
                <View
                    key={slide.id}
                    style={[
                        StyleSheet.absoluteFill,
                        { opacity: activeIndex === index ? 1 : 0, zIndex: activeIndex === index ? 1 : 0 }
                    ]}
                >
                    <LinearGradient
                        colors={slide.colors as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        {/* Header Tag */}
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Marketplace</Text>
                        </View>

                        {/* Content Section (Titles) */}
                        <HeroContent activeIndex={activeIndex} />

                        {/* Large 2x2 Grid Section */}
                        <View style={styles.gridSection}>
                            <HeroImageGrid />
                        </View>

                        {/* Footer Section (CTA + Pagination) */}
                        <View style={styles.footer}>
                            <HeroPagination activeIndex={activeIndex} onPressDot={(index) => handleManualPress(index)} />
                            <TouchableOpacity onPress={() => router.push(slide.link as any)} style={styles.ctaButton} activeOpacity={0.9}>
                                <Text style={[styles.ctaText, { color: slide.colors[1] }]}>{slide.ctaText}</Text>
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>
                </View>
            ))}
            {/* Invisible placeholder to maintain height since we use absolute fills for crossfade */}
            <View style={{ height: 480 }} pointerEvents="none" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 0,
        marginTop: -55,
    },
    gradient: {
        padding: 20,
        height: 480, // Fixed height for absolute fill container
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tag: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    tagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    gridSection: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    footer: {
        width: '100%',
        gap: 16,
        alignItems: 'center',
    },
    ctaButton: {
        backgroundColor: '#fff',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaText: {
        color: '#c05a00',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeHero;
