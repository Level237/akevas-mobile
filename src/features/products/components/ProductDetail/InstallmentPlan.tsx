import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InstallmentStep = {
    label: string;
    amount: string;
    date: string;
};

type Props = {
    price: string;
};

const InstallmentPlan = ({ price }: Props) => {
    // Calcul factice pour la démonstration du mockup
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

    const steps: InstallmentStep[] = [
        { label: 'Aujourd\'hui', amount: `${(numericPrice * 0.25).toFixed(0)}`, date: 'Payé' },
        { label: 'Dans 1 mois', amount: `${(numericPrice * 0.25).toFixed(0)}`, date: '27 Mar' },
        { label: 'Dans 2 mois', amount: `${(numericPrice * 0.25).toFixed(0)}`, date: '27 Avr' },
        { label: 'Dans 3 mois', amount: `${(numericPrice * 0.25).toFixed(0)}`, date: '27 Mai' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payer en plusieurs fois</Text>
                <Text style={styles.subtitle}>Sans frais supplémentaires</Text>
            </View>

            <View style={styles.stepsWrapper}>
                {steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        <View style={styles.dotWrapper}>
                            <View style={[styles.dot, index === 0 && styles.activeDot]}>
                                <Text style={[styles.dotText, index === 0 && styles.activeDotText]}>
                                    {index + 1}
                                </Text>
                            </View>
                            {index < steps.length - 1 && <View style={styles.line} />}
                        </View>

                        <View style={styles.stepContent}>
                            <Text style={styles.stepLabel}>{step.label}</Text>
                            <Text style={styles.stepAmount}>{step.amount} FCFA</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 24,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#717171',
    },
    stepsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepItem: {
        alignItems: 'center',
        flex: 1,
    },
    dotWrapper: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    activeDot: {
        backgroundColor: '#6366F1',
    },
    dotText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    activeDotText: {
        color: '#FFF',
    },
    line: {
        position: 'absolute',
        top: 14,
        left: '50%',
        right: '-50%',
        height: 2,
        backgroundColor: '#F3F4F6',
        zIndex: 1,
    },
    stepContent: {
        alignItems: 'center',
    },
    stepLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    stepAmount: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1A1A1A',
    },
});

export default React.memo(InstallmentPlan);
