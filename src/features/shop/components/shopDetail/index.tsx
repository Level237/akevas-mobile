import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import ProductCard from './ProductCard';
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

const ShopDetailFeature = ({ shopData }: Props) => {
    const [activeTab, setActiveTab] = useState<'Produits' | 'À propos' | 'Avis'>('Produits');

    const sections = useMemo<SectionData[]>(() => [
        {
            title: 'Header',
            data: [shopData],
            renderItem: ({ item }: { item: ShopDetailData }) => <ShopDetailHeader shop={item} />,
        },
        {
            title: 'Tabs',
            data: [activeTab],
            renderItem: () => <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />,
        },
        {
            title: 'Content',
            data: activeTab === 'Produits' ? [shopData.products] : [activeTab],
            renderItem: ({ item }: { item: any }) => {
                if (activeTab === 'Produits') {
                    return (
                        <View style={styles.productsGrid}>
                            {shopData.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </View>
                    );
                }
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {activeTab === 'À propos' ? 'À propos de nous' : 'Avis clients'}
                        </Text>
                        <Text style={styles.sectionText}>
                            {activeTab === 'À propos'
                                ? shopData.description
                                : 'Aucun avis pour le moment.'}
                        </Text>
                    </View>
                );
            },
        },
    ], [shopData, activeTab]);


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
    stickyHeader: {
        backgroundColor: '#FFF',
        zIndex: 100,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
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
});

export default ShopDetailFeature;
