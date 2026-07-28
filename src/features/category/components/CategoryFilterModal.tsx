import { useGetAttributeByCategoryQuery, useGetAttributeValueByIdQuery, useGetAttributeValuesQuery } from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    categoryId: number;

    // Current filter states
    minPrice: number;
    maxPrice: number;
    selectedColors: string[];
    selectedAttributes: number[];
    selectedGenders: number[];
    isSellerMode: boolean;
    selectedBulkPriceRange: string;

    // Callbacks to update states
    onApply: (filters: any) => void;
    onClearAll: () => void;
};

const PRICE_MAX = 500000;

export default function CategoryFilterModal(props: Props) {
    // Local state for the modal before applying
    const [localMinPrice, setLocalMinPrice] = useState(props.minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(props.maxPrice);
    const [localSelectedColors, setLocalSelectedColors] = useState<string[]>([...props.selectedColors]);
    const [localSelectedAttributes, setLocalSelectedAttributes] = useState<number[]>([...props.selectedAttributes]);
    const [localSelectedGenders, setLocalSelectedGenders] = useState<number[]>([...props.selectedGenders]);
    const [localIsSellerMode, setLocalIsSellerMode] = useState(props.isSellerMode);
    const [localSelectedBulkPrice, setLocalSelectedBulkPrice] = useState(props.selectedBulkPriceRange);

    const [expandedSections, setExpandedSections] = useState<string[]>(['gender', 'price', 'color', 'attributes']);
    const [selectedAttributeType, setSelectedAttributeType] = useState<string>('');

    // Sync when opened
    useEffect(() => {
        if (props.visible) {
            setLocalMinPrice(props.minPrice);
            setLocalMaxPrice(props.maxPrice);
            setLocalSelectedColors([...props.selectedColors]);
            setLocalSelectedAttributes([...props.selectedAttributes]);
            setLocalSelectedGenders([...props.selectedGenders]);
            setLocalIsSellerMode(props.isSellerMode);
            setLocalSelectedBulkPrice(props.selectedBulkPriceRange);
        }
    }, [props.visible]);

    // Query Data
    const { data: getAttributesData } = useGetAttributeValuesQuery("1");
    const colorAttributes = getAttributesData?.data?.find((attr: any) => attr.name === 'Couleur')?.values || [];

    // For general attributes
    const { data: availableAttributesData } = useGetAttributeByCategoryQuery('guard');
    const allAvailableAttributes = availableAttributesData?.data || availableAttributesData || [];

    const currentCategoryAttributes = allAvailableAttributes.filter((attr: any) => {

        return attr.category_id === props.categoryId;
    });



    const { data: selectedTypeAttributesData } = useGetAttributeValueByIdQuery(selectedAttributeType, {
        skip: !selectedAttributeType
    });



    const attributeGroups = selectedTypeAttributesData?.data || selectedTypeAttributesData || [];

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    // Helper functions for toggles
    const toggleGender = (id: number) => {
        setLocalSelectedGenders(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };
    const toggleColor = (color: string) => {
        setLocalSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
    };
    const toggleAttribute = (id: number) => {
        setLocalSelectedAttributes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const handleApply = () => {
        props.onApply({
            minPrice: localMinPrice,
            maxPrice: localMaxPrice,
            selectedColors: localSelectedColors,
            selectedAttributes: localSelectedAttributes,
            selectedGenders: localSelectedGenders,
            isSellerMode: localIsSellerMode,
            selectedBulkPriceRange: localSelectedBulkPrice
        });
        props.onClose();
    };

    const handleClear = () => {
        setLocalMinPrice(0);
        setLocalMaxPrice(PRICE_MAX);
        setLocalSelectedColors([]);
        setLocalSelectedAttributes([]);
        setLocalSelectedGenders([]);
        setLocalIsSellerMode(false);
        setLocalSelectedBulkPrice('');
    };

    // Render Section Header
    const SectionHeader = ({ id, title }: { id: string; title: string }) => (
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(id)}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Ionicons name={expandedSections.includes(id) ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>
    );

    return (
        <Modal visible={props.visible} animationType="slide" transparent={true} onRequestClose={props.onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Drag Indicator */}
                    <View style={styles.dragIndicatorContainer}>
                        <View style={styles.dragIndicator} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filtres</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={props.onClose}>
                            <Ionicons name="close-circle-outline" size={28} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Genre */}
                        <SectionHeader id="gender" title="Genre" />
                        {expandedSections.includes('gender') && (
                            <View style={styles.sectionContent}>
                                <View style={styles.grid4}>
                                    {[
                                        { id: 1, name: 'Homme' },
                                        { id: 2, name: 'Femme' },
                                        { id: 3, name: 'Enfant' },
                                        { id: 4, name: 'Mixte' }
                                    ].map(g => (
                                        <TouchableOpacity
                                            key={g.id}
                                            style={[styles.boxOptionSmall, localSelectedGenders.includes(g.id) && styles.boxOptionActive]}
                                            onPress={() => toggleGender(g.id)}
                                        >
                                            <Text style={[styles.boxOptionTextSmall, localSelectedGenders.includes(g.id) && styles.boxOptionTextActive, { fontSize: 13 }]} numberOfLines={1}>
                                                {g.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Prix */}
                        <SectionHeader id="price" title="Prix" />
                        {expandedSections.includes('price') && (
                            <View style={styles.sectionContent}>
                                <View style={styles.priceRow}>
                                    <View style={styles.priceDisplay}>
                                        <Text style={styles.priceLabel}>Min</Text>
                                        <Text style={styles.priceText}>{localMinPrice.toLocaleString()} CFA</Text>
                                    </View>
                                    <Text style={styles.priceSeparator}>-</Text>
                                    <View style={styles.priceDisplay}>
                                        <Text style={styles.priceLabel}>Max</Text>
                                        <Text style={styles.priceText}>{localMaxPrice.toLocaleString()} CFA</Text>
                                    </View>
                                </View>
                                <View style={styles.grid3}>
                                    {[
                                        { label: '0 – 10k', min: 0, max: 10000 },
                                        { label: '10k – 25k', min: 10000, max: 25000 },
                                        { label: '25k – 50k', min: 25000, max: 50000 },
                                        { label: '50k – 100k', min: 50000, max: 100000 },
                                        { label: '100k – 250k', min: 100000, max: 250000 },
                                        { label: '250k – 500k', min: 250000, max: 500000 },
                                        { label: '+ 500k', min: 500000, max: 500000 }
                                    ].map(opt => {
                                        const isActive = localMinPrice === opt.min && localMaxPrice === opt.max;
                                        return (
                                            <TouchableOpacity
                                                key={opt.label}
                                                style={[styles.boxOptionMedium, isActive && styles.boxOptionActive]}
                                                onPress={() => {
                                                    setLocalMinPrice(opt.min);
                                                    setLocalMaxPrice(opt.max);
                                                }}
                                            >
                                                <Text style={[styles.boxOptionTextSmall, isActive && styles.boxOptionTextActive, { fontSize: 12, textAlign: 'center' }]}>
                                                    {opt.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Couleur */}
                        <SectionHeader id="color" title="Couleur" />
                        {expandedSections.includes('color') && (
                            <View style={styles.sectionContent}>
                                <View style={styles.colorGrid}>
                                    {colorAttributes.map((c: any) => {
                                        const isActive = localSelectedColors.includes(c.value);
                                        return (
                                            <TouchableOpacity
                                                key={c.id}
                                                style={[
                                                    styles.colorCircle,
                                                    { backgroundColor: c.hex_color },
                                                    isActive && styles.colorCircleActive
                                                ]}
                                                onPress={() => toggleColor(c.value)}
                                            >
                                                {c.hex_color === '#FFFFFF' && <View style={styles.colorInnerBorder} />}
                                                {isActive && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={18}
                                                        color={c.hex_color === '#FFFFFF' ? '#000' : '#FFF'}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Attributs */}
                        {currentCategoryAttributes.length > 0 && (
                            <>
                                <SectionHeader id="attributes" title="Spécifications" />
                                {expandedSections.includes('attributes') && (
                                    <View style={styles.sectionContent}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll} contentContainerStyle={{ gap: 10 }}>
                                            {currentCategoryAttributes.map((attr: any) => (
                                                <TouchableOpacity
                                                    key={attr.attribute_id}
                                                    style={[styles.chipType, selectedAttributeType === attr.attribute_id.toString() && styles.chipTypeActive]}
                                                    onPress={() => setSelectedAttributeType(attr.attribute_id.toString())}
                                                >
                                                    <Text style={[styles.chipTypeText, selectedAttributeType === attr.attribute_id.toString() && styles.chipTypeTextActive]}>
                                                        {attr.attribute_name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>

                                        {selectedAttributeType !== '' && attributeGroups.length > 0 && (
                                            <View style={{ marginTop: 15 }}>
                                                {attributeGroups.map((group: any) => (
                                                    <View key={group.group_id} style={{ marginBottom: 20 }}>
                                                        {group.group_label && <Text style={styles.subLabel}>{group.group_label}</Text>}
                                                        <View style={styles.valuesGrid}>
                                                            {group.values?.map((val: any) => (
                                                                <TouchableOpacity
                                                                    key={val.id}
                                                                    style={[styles.chipValue, localSelectedAttributes.includes(val.id) && styles.chipValueActive]}
                                                                    onPress={() => toggleAttribute(val.id)}
                                                                >
                                                                    <Text style={[styles.chipValueText, localSelectedAttributes.includes(val.id) && styles.chipValueTextActive]}>
                                                                        {val.value} {val.label || ''}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </>
                        )}

                        {/* Mode de vente (Options avancées) */}
                        <SectionHeader id="seller" title="Options d'achat (Gros)" />
                        {expandedSections.includes('seller') && (
                            <View style={styles.sectionContent}>
                                <View style={styles.grid2}>
                                    {[
                                        { value: false, label: 'Détail (Normal)' },
                                        { value: true, label: 'Prix de gros' }
                                    ].map(opt => (
                                        <TouchableOpacity
                                            key={opt.label}
                                            style={[styles.boxOption, localIsSellerMode === opt.value && styles.boxOptionActive]}
                                            onPress={() => setLocalIsSellerMode(opt.value)}
                                        >
                                            <Text style={[styles.boxOptionText, localIsSellerMode === opt.value && styles.boxOptionTextActive]}>
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Bulk Price Range */}
                        {localIsSellerMode && (
                            <>
                                <SectionHeader id="bulk-price" title="Paliers de prix de gros" />
                                {expandedSections.includes('bulk-price') && (
                                    <View style={styles.sectionContent}>
                                        <View style={styles.grid3}>
                                            {[
                                                { value: '500-1000', label: '500 – 1k' },
                                                { value: '1000-5000', label: '1k – 5k' },
                                                { value: '5000-10000', label: '5k – 10k' },
                                                { value: '10000-25000', label: '10k – 25k' },
                                                { value: '25000-50000', label: '25k – 50k' },
                                                { value: '50000+', label: '+ 50k' }
                                            ].map(opt => (
                                                <TouchableOpacity
                                                    key={opt.value}
                                                    style={[styles.boxOptionMedium, localSelectedBulkPrice === opt.value && styles.boxOptionActive]}
                                                    onPress={() => setLocalSelectedBulkPrice(opt.value)}
                                                >
                                                    <Text style={[styles.boxOptionTextSmall, localSelectedBulkPrice === opt.value && styles.boxOptionTextActive, { fontSize: 12, textAlign: 'center' }]}>
                                                        {opt.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                        <View style={{ height: 120 }} />
                    </ScrollView>

                    {/* Footer buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                            <Text style={styles.clearBtnText}>Effacer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyBtnText}>Voir les résultats</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        height: '92%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    dragIndicatorContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        top: -4,
        padding: 4,
    },
    scrollContent: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionContent: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FAFAFA',
    },
    grid2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    grid3: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    grid4: {
        flexDirection: 'row',
        gap: 8,
    },
    boxOptionMedium: {
        width: '31%',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    boxOptionSmall: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    boxOption: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    boxOptionActive: {
        borderColor: '#F97316',
        backgroundColor: '#FFF7ED',
        shadowOpacity: 0,
        elevation: 0,
    },
    boxOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
    },
    boxOptionTextSmall: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    boxOptionTextActive: {
        color: '#EA580C',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceDisplay: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    priceSeparator: {
        marginHorizontal: 15,
        color: '#D1D5DB',
        fontWeight: 'bold',
        fontSize: 20,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    colorCircleActive: {
        borderWidth: 2,
        borderColor: '#F97316',
        transform: [{ scale: 1.05 }],
    },
    colorInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    subLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    typeScroll: {
        marginBottom: 10,
    },
    chipType: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipTypeActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    chipTypeText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
    },
    chipTypeTextActive: {
        color: '#FFFFFF',
    },
    valuesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chipValue: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipValueActive: {
        backgroundColor: '#FFF7ED',
        borderColor: '#F97316',
    },
    chipValueText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
    },
    chipValueTextActive: {
        color: '#EA580C',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 36,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    clearBtn: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4B5563',
    },
    applyBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    applyBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
