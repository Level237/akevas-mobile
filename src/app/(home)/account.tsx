import {
    CreditCard,
    FileText,
    Globe,
    Info,
    Phone,
    ShieldCheck,
    User
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AccountHeader from '../../features/account/components/AccountHeader';
import { AccountListItem, AccountSection } from '../../features/account/components/AccountListComponents';
import QuickActionGrid from '../../features/account/components/QuickActionGrid';

export default function AccountScreen() {
    const insets = useSafeAreaInsets();

    const handleLogout = () => {
        console.log("Logged out");
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <AccountHeader onLogout={handleLogout} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 100 }
                ]}
            >
                {/* Stats / Quick Actions */}
                <QuickActionGrid />

                {/* Account Section */}
                <AccountSection title="Compte">
                    <AccountListItem
                        icon={User}
                        title="Informations Personnelles"
                    />
                    <AccountListItem
                        icon={CreditCard}
                        title="Documents de Paiement"
                    />
                </AccountSection>

                {/* Settings Section */}
                <AccountSection title="Paramètres">
                    <AccountListItem
                        icon={Globe}
                        title="Langue"
                        subtitle="Français"
                    />
                    <AccountListItem
                        icon={FileText}
                        title="Conditions d'utilisation"
                    />
                    <AccountListItem
                        icon={ShieldCheck}
                        title="Politique de Confidentialité"
                    />
                </AccountSection>

                {/* Support Section */}
                <AccountSection title="Support">
                    <AccountListItem
                        icon={Info}
                        title="À propos d'Akevas"
                    />
                    <AccountListItem
                        icon={Phone}
                        title="Nous contacter"
                    />
                </AccountSection>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light grey e-commerce background
    },
    scrollContent: {
        paddingTop: 10,
    },
});