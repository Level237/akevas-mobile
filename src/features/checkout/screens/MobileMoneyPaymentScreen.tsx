
import {
    useControlPaymentMutation,
    useInitPayinMutation,
    useVerifyPayinMutation
} from '@/services/authService';
import { useRouter } from 'expo-router';
import { AlertCircle, CheckCircle, Clock, RefreshCw, Smartphone, Ticket, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Props {
    orderData: any;
}

const MobileMoneyPaymentScreen = ({ orderData }: Props) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [paymentStatus, setPaymentStatus] = useState<'initializing' | 'waiting' | 'failed' | 'success' | 'loading' | 'low'>('initializing');
    const [message, setMessage] = useState("Patientez, votre paiement est en cours d'initialisation...");
    const [paymentRef, setPaymentRef] = useState<string | null>(null);
    const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
    const [isControlPayment, setIsControlPayment] = useState(false);
    const [step, setStep] = useState<'start' | 'processing'>('start');

    const [initPayment] = useInitPayinMutation();
    const [verifyPayin] = useVerifyPayinMutation();
    const [controlPayment] = useControlPaymentMutation();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const isOrange = orderData.paymentMethod === 'cm.orange';

    useEffect(() => {
        if (paymentStatus === 'initializing' || paymentStatus === 'loading') {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [paymentStatus]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const initializePayment = async () => {
        setStep('processing');
        setPaymentStatus('initializing');
        try {
            // Re-matching the expected payload from the model
            const payload = {
                ...orderData,
                payinAmount: 10, // Model suggests amount is used
            };

            const response: any = await initPayment(payload).unwrap();

            if (response.status === "success") {
                setPaymentRef(response.reference);
                setPaymentStatus('waiting');
                setMessage(isOrange
                    ? "Confirmez votre transaction en composant #150*50#"
                    : "Confirmez votre transaction en composant *126#");
            } else if (response.status === "low") {
                setPaymentStatus('low');
                setMessage("Votre solde est insuffisant.");
            } else {
                setPaymentStatus('failed');
                setMessage("L'initialisation a échoué. Veuillez réessayer.");
            }
        } catch (error) {
            console.error('Init error:', error);
            setPaymentStatus('failed');
            setMessage("Impossible d'initialiser le paiement.");
        }
    };

    const pollStatus = async () => {
        if (!paymentRef || paymentStatus === 'success' || paymentStatus === 'failed') return;

        try {
            const response: any = await verifyPayin({ transaction_ref: paymentRef }).unwrap();

            if (response.data.status === 'SUCCESS') {
                setPaymentStatus('loading');
                setIsGeneratingTicket(true);
                setTimeout(() => {
                    setIsControlPayment(true);
                }, 1000);
            } else if (response.data.status === 'CANCELED') {
                setPaymentStatus('failed');
                setMessage("Paiement annulé.");
            } else if (response.data.status === 'FAILED') {
                setPaymentStatus('failed');
                setMessage("Paiement échoué.");
            } else if (response.data.status === "PENDING") {
                timeoutRef.current = setTimeout(pollStatus, 3000);
            }
        } catch (error) {
            console.error('Verify error:', error);
            // On error, try again later unless it's a fatal error
            timeoutRef.current = setTimeout(pollStatus, 5000);
        }
    };

    useEffect(() => {
        if (paymentRef && paymentStatus === 'waiting') {
            pollStatus();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [paymentRef, paymentStatus]);

    const doControlPayment = async () => {
        if (!isControlPayment) return;

        try {
            const response: any = await controlPayment({ reference: paymentRef }).unwrap();
            if (response.status === 200) {
                setPaymentStatus('success');
                setIsControlPayment(false);
                setIsGeneratingTicket(false);
            } else {
                controlTimeoutRef.current = setTimeout(doControlPayment, 3000);
            }
        } catch (error) {
            controlTimeoutRef.current = setTimeout(doControlPayment, 3000);
        }
    };

    useEffect(() => {
        if (isControlPayment) {
            doControlPayment();
        }
        return () => {
            if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
        };
    }, [isControlPayment]);

    const renderStatusIcon = () => {
        switch (paymentStatus) {
            case 'initializing':
            case 'loading':
                return (
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <RefreshCw size={64} color={isOrange ? "#ff7900" : "#2563eb"} />
                    </Animated.View>
                );
            case 'waiting':
                return <Clock size={64} color={isOrange ? "#ff7900" : "#2563eb"} />;
            case 'failed':
            case 'low':
                return <AlertCircle size={64} color="#ef4444" />;
            case 'success':
                return <CheckCircle size={64} color="#10b981" />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isOrange ? '#fff7ed' : '#fefce8' }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.closeBtn}>
                    <X size={24} color="#4b5563" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.paymentCard}>
                    {/* Brand Header */}
                    <View style={[styles.brandHeader, { backgroundColor: isOrange ? '#ff7900' : '#facc15' }]}>
                        <View style={styles.brandIconContainer}>
                            <Smartphone size={24} color={isOrange ? "#ff7900" : "#2563eb"} />
                        </View>
                        <View>
                            <Text style={[styles.brandName, { color: isOrange ? '#FFF' : '#2563eb' }]}>
                                {isOrange ? "Orange Money" : "MTN MoMo"}
                            </Text>
                            <Text style={[styles.brandSubtitle, { color: isOrange ? 'rgba(255,255,255,0.8)' : '#2563eb' }]}>
                                Paiement sécurisé
                            </Text>
                        </View>
                    </View>

                    {/* Order Summary */}
                    <View style={styles.orderInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Numéro</Text>
                            <Text style={styles.infoValue}>{orderData.paymentPhone}</Text>
                        </View>
                        <View style={styles.dividerDashed} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={[styles.totalValue, { color: isOrange ? '#ff7900' : '#2563eb' }]}>
                                {orderData.amount} XAF
                            </Text>
                        </View>
                    </View>

                    {/* Status Content */}
                    <View style={styles.statusContent}>
                        {step === 'start' ? (
                            <View style={styles.startStep}>
                                <Smartphone size={48} color={isOrange ? "#ff7900" : "#2563eb"} style={styles.stepIcon} />
                                <Text style={styles.stepTitle}>Démarrer le paiement</Text>
                                <Text style={styles.stepDesc}>
                                    Veuillez cliquer pour lancer le processus de paiement sur votre téléphone.
                                </Text>
                                <TouchableOpacity
                                    style={[styles.mainBtn, { backgroundColor: isOrange ? '#ff7900' : '#2563eb' }]}
                                    onPress={initializePayment}
                                >
                                    <Text style={styles.mainBtnText}>Démarrer le paiement</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.processingContent}>
                                <View style={styles.iconContainer}>
                                    {renderStatusIcon()}
                                </View>

                                <Text style={styles.statusTitle}>
                                    {paymentStatus === 'initializing' && "Initialisation..."}
                                    {paymentStatus === 'waiting' && "En attente de confirmation"}
                                    {paymentStatus === 'failed' && "Échec du paiement"}
                                    {paymentStatus === 'low' && "Solde insuffisant"}
                                    {paymentStatus === 'loading' && "Génération du reçu..."}
                                    {paymentStatus === 'success' && "Paiement réussi !"}
                                </Text>

                                <Text style={styles.statusMessage}>{message}</Text>

                                {paymentStatus === 'waiting' && (
                                    <View style={[styles.codeBadge, { backgroundColor: isOrange ? '#ffedd5' : '#fef9c3' }]}>
                                        <Text style={[styles.codeText, { color: isOrange ? '#c2410c' : '#854d0e' }]}>
                                            {isOrange ? "#150*50#" : "*126#"}
                                        </Text>
                                    </View>
                                )}

                                {(paymentStatus === 'failed' || paymentStatus === 'low') && (
                                    <TouchableOpacity
                                        style={[styles.retryBtn, { backgroundColor: isOrange ? '#ff7900' : '#2563eb' }]}
                                        onPress={() => setStep('start')}
                                    >
                                        <Text style={styles.retryBtnText}>Réessayer</Text>
                                    </TouchableOpacity>
                                )}

                                {paymentStatus === 'success' && (
                                    <TouchableOpacity
                                        style={[styles.successBtn, { backgroundColor: isOrange ? '#ff7900' : '#2563eb' }]}
                                        onPress={() => router.push(`/orders/ticket/${paymentRef}` as any)}
                                    >
                                        <Ticket size={20} color="#FFF" />
                                        <Text style={styles.successBtnText}>Voir le Reçu</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Bottom Info */}
                    <View style={styles.cardFooter}>
                        {paymentRef ? (
                            <Text style={styles.refText}>
                                Réf: <Text style={styles.refCode}>{paymentRef}</Text>
                            </Text>
                        ) : (
                            <Text style={styles.refText}>En attente de référence...</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    closeBtn: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    paymentCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    brandHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    brandIconContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 15,
    },
    brandName: {
        fontSize: 20,
        fontWeight: '900',
    },
    brandSubtitle: {
        fontSize: 12,
    },
    orderInfo: {
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        color: '#6b7280',
        fontSize: 14,
    },
    infoValue: {
        fontWeight: '700',
        color: '#1f2937',
    },
    dividerDashed: {
        height: 1,
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        marginVertical: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
    },
    statusContent: {
        padding: 30,
        minHeight: 280,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startStep: {
        alignItems: 'center',
        width: '100%',
    },
    stepIcon: {
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 8,
    },
    stepDesc: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    mainBtn: {
        width: '100%',
        height: 54,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    processingContent: {
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    statusMessage: {
        color: '#6b7280',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    codeBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        marginTop: 8,
    },
    codeText: {
        fontSize: 18,
        fontWeight: '800',
    },
    retryBtn: {
        marginTop: 24,
        width: '100%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryBtnText: {
        color: '#FFF',
        fontWeight: '700',
    },
    successBtn: {
        marginTop: 24,
        width: '100%',
        height: 56,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    successBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cardFooter: {
        backgroundColor: '#f9fafb',
        padding: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    refText: {
        fontSize: 11,
        color: '#9ca3af',
    },
    refCode: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontWeight: '700',
    }
});

export default MobileMoneyPaymentScreen;
