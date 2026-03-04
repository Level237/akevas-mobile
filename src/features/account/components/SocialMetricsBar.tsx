import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MetricProps = {
    label: string;
    value: string | number;
    showBorder?: boolean;
};

const Metric = ({ label, value, showBorder = true }: MetricProps) => (
    <View style={[styles.metricItem, showBorder && styles.borderRight]}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </View>
);

const SocialMetricsBar = () => {
    return (
        <View style={styles.container}>
            <Metric label="Commandes" value={15} />
            <Metric label="Mes Avis" value={12} />
            <Metric label="Akevas Coins" value="500.25" showBorder={false} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',

        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    metricLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
        letterSpacing: 0.5,
    },
});

export default React.memo(SocialMetricsBar);
