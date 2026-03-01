import ProductCard from '@/components/ProductCard';
import { normalizeProduct } from '@/lib/normalizeProduct';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShopDetailHeader from './ShopDetailHeader';
import ShopTabs from './ShopTabs';
import { ShopDetailData } from './types';

type Props = {
    shopData: ShopDetailData;
};

type SectionData = {
    title: string;
    data: any[];
    renderItem: ({ item }: { item: any }) => React.ReactElement | null;
};

const ShopDetailFeature = ({ shopData }: any) => {
    const [activeTab, setActiveTab] = useState<'Produits' | 'À propos' | 'Avis'>('Produits');
    const products = shopData.products || [];

    const normalizedProducts = products.map(normalizeProduct);

    // Génération des lignes pour la grille
    const productRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < normalizedProducts.length; i += 2) {
            rows.push(normalizedProducts.slice(i, i + 2));
        }
        return rows;
    }, [normalizedProducts]);

    const sections = useMemo<SectionData[]>(() => [
        {
            title: 'Header',
            data: [shopData],
            renderItem: ({ item }: { item: any }) => <ShopDetailHeader shop={item} />,
        },
        {
            title: 'Tabs',
            data: [activeTab],
            renderItem: () => <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />,
        },
        {
            title: 'Content',
            // Astuce : Si vide, on injecte un marqueur
            data: activeTab === 'Produits'
                ? (productRows.length > 0 ? productRows : [{ isEmpty: true }])
                : [activeTab],

            renderItem: ({ item }: { item: any }) => {
                if (activeTab === 'Produits') {
                    // Affichage de l'état vide
                    if (item.isEmpty) {
                        return (
                            <View style={styles.emptyContainer}>
                                {/* Illustration (Tu peux remplacer l'URL par une icône locale ou un Lottie) */}
                                <Image
                                    source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png' }}
                                    style={styles.emptyImage}

                                />

                                <Text style={styles.emptyTitle}>C'est calme ici...</Text>

                                <Text style={styles.emptyDescription}>
                                    Cette boutique est en train de remplir ses rayons. Reviens bientôt pour voir ses pépites !
                                </Text>

                                <TouchableOpacity
                                    style={styles.exploreButton}
                                    onPress={() => { }} // Assure-toi d'avoir navigation ou une callback
                                >
                                    <Text style={styles.exploreButtonText}>Explorer les autres boutiques</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    // Affichage de la grille
                    return (
                        <View style={styles.productsGrid}>
                            {item.map((product: any) => (
                                <View key={product.id} style={styles.productContainer}>
                                    {/* Ici ton  */}
                                    <ProductCard product={product} />
                                </View>
                            ))}
                        </View>
                    );
                }

                // Affichage des autres onglets
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {activeTab === 'À propos' ? 'À propos de nous' : 'Avis clients'}
                        </Text>
                        <Text style={styles.sectionText}>
                            {activeTab === 'À propos'
                                ? shopData.shop_description
                                : 'Aucun avis pour le moment.'}
                        </Text>
                    </View>
                );
            },
        },
    ], [shopData, activeTab, productRows]);

    return (
        <View style={styles.container}>
            <SectionList<any, any>
                sections={sections}
                keyExtractor={(item, index) => index.toString()}
                stickySectionHeadersEnabled={true}
                renderItem={({ item, section }) => {
                    if (section.title === 'Tabs') return null;
                    return section.renderItem({ item });
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    listContent: {
        paddingBottom: 40,
    },
    productsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
    }, emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6, // Beaucoup d'espace vertical
        paddingHorizontal: 40,
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 12,
        opacity: 0.8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A', // Noir doux
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyDescription: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20, // Espace avant le bouton
    },
    exploreButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF6B00', // Ta couleur orange (à adapter)
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12, // Bouton pilule
    },
    exploreButtonText: {
        color: '#FF6B00',
        fontSize: 16,
        fontWeight: '600',
    },
    productContainer: {
        width: '48%',
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 8,
        padding: 10,
    },
    // Styles pour l'état vide
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    // Styles existants
    section: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    debugText: {
        fontSize: 12,
        color: 'red'
    }
});

export default ShopDetailFeature;