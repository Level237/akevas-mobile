import { CheckCircle, Info, XCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';

export const toastConfig = {
    success: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.successContainer]}>
            <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                <CheckCircle size={20} color="#E67E22" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text1}>{text1}</Text>
                {text2 ? <Text style={styles.text2} numberOfLines={2}>{text2}</Text> : null}
            </View>
        </View>
    ),
    error: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.errorContainer]}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                <XCircle size={20} color="#EF4444" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text1}>{text1}</Text>
                {text2 ? <Text style={styles.text2} numberOfLines={2}>{text2}</Text> : null}
            </View>
        </View>
    ),
    info: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.infoContainer]}>
            <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Info size={20} color="#3B82F6" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text1}>{text1}</Text>
                {text2 ? <Text style={styles.text2} numberOfLines={2}>{text2}</Text> : null}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
        borderLeftWidth: 3,
    },
    successContainer: {
        borderLeftColor: '#E67E22',
    },
    errorContainer: {
        borderLeftColor: '#EF4444',
    },
    infoContainer: {
        borderLeftColor: '#3B82F6',
    },
    iconContainer: {
        marginRight: 10,
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text1: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    text2: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
        marginTop: 2,
    }
});
