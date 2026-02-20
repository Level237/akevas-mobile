
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cart from './Cart';
import SearchResource from './Search';

type Props = {
    title: string;
    showCart?: boolean;
    rightComponent?: React.ReactNode;
};

const HeaderScreen = ({ title, showCart = true, rightComponent }: Props) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* LEFT: Back Button with Standard Hit Target */}
                <View style={styles.leftContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ChevronLeft size={28} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                {/* CENTER: Premium Bold Title */}
                <View style={styles.centerContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {/* RIGHT: Action Group (Search + Cart) */}
                <View style={styles.rightContainer}>
                    <SearchResource />
                    {showCart && <Cart />}
                    {rightComponent}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFF',
        borderBottomWidth: 0.5,
        borderBottomColor: '#F2F2F2',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    leftContainer: {
        width: 60,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        width: 80, // Space for 2 icons usually
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
});

export default HeaderScreen;