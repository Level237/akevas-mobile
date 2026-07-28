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

    const [expandedSections, setExpandedSections] = useState<string[]>(['seller', 'bulk-price', 'price', 'color', 'gender', 'attributes']);
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
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ width: 40 }} />
                        <Text style={styles.headerTitle}>Filtres</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={props.onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Mode de vente */}
                        <SectionHeader id="seller" title="Mode de vente" />
                        {expandedSections.includes('seller') && (
                            <View style={styles.sectionContent}>
                                <View style={styles.grid2}>
                                    {[
                                        { value: false, label: 'Prix normal' },
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
                                        <View style={styles.grid2}>
                                            {[
                                                { value: '500-1000', label: '500 - 1 000 CFA' },
                                                { value: '1000-5000', label: '1 000 - 5 000 CFA' },
                                                { value: '5000-10000', label: '5 000 - 10 000 CFA' },
                                                { value: '10000-25000', label: '10 000 - 25 000 CFA' },
                                                { value: '25000-50000', label: '25 000 - 50 000 CFA' },
                                                { value: '50000+', label: '50 000+ CFA' }
                                            ].map(opt => (
                                                <TouchableOpacity
                                                    key={opt.value}
                                                    style={[styles.boxOption, localSelectedBulkPrice === opt.value && styles.boxOptionActive]}
                                                    onPress={() => setLocalSelectedBulkPrice(opt.value)}
                                                >
                                                    <Text style={[styles.boxOptionTextSmall, localSelectedBulkPrice === opt.value && styles.boxOptionTextActive]}>
                                                        {opt.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

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
                                            style={[styles.boxOption, localSelectedGenders.includes(g.id) && styles.boxOptionActive]}
                                            onPress={() => toggleGender(g.id)}
                                        >
                                            <Text style={[styles.boxOptionTextSmall, localSelectedGenders.includes(g.id) && styles.boxOptionTextActive]}>
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
                                        <Text style={styles.priceText}>{localMinPrice.toLocaleString()} CFA</Text>
                                    </View>
                                    <Text style={styles.priceSeparator}>à</Text>
                                    <View style={styles.priceDisplay}>
                                        <Text style={styles.priceText}>{localMaxPrice.toLocaleString()} CFA</Text>
                                    </View>
                                </View>
                                <View style={styles.grid2}>
                                    {[
                                        { label: '0 – 10k CFA', min: 0, max: 10000 },
                                        { label: '10k – 25k CFA', min: 10000, max: 25000 },
                                        { label: '25k – 50k CFA', min: 25000, max: 50000 },
                                        { label: '50k – 100k CFA', min: 50000, max: 100000 },
                                        { label: '100k – 250k CFA', min: 100000, max: 250000 },
                                        { label: '250k – 500k CFA', min: 250000, max: 500000 },
                                        { label: '+ 500k CFA', min: 500000, max: 500000 }
                                    ].map(opt => {
                                        const isActive = localMinPrice === opt.min && localMaxPrice === opt.max;
                                        return (
                                            <TouchableOpacity
                                                key={opt.label}
                                                style={[styles.boxOption, isActive && styles.boxOptionActive]}
                                                onPress={() => {
                                                    setLocalMinPrice(opt.min);
                                                    setLocalMaxPrice(opt.max);
                                                }}
                                            >
                                                <Text style={[styles.boxOptionTextSmall, isActive && styles.boxOptionTextActive]}>
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
                                    {colorAttributes.map((c: any) => (
                                        <TouchableOpacity
                                            key={c.id}
                                            style={[styles.colorCircle, { backgroundColor: c.hex_color }, localSelectedColors.includes(c.value) && styles.colorCircleActive]}
                                            onPress={() => toggleColor(c.value)}
                                        >
                                            {c.hex_color === '#FFFFFF' && <View style={styles.colorInnerBorder} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Attributs */}
                        {currentCategoryAttributes.length > 0 && (
                            <>
                                <SectionHeader id="attributes" title="Attributs" />
                                {expandedSections.includes('attributes') && (
                                    <View style={styles.sectionContent}>
                                        <Text style={styles.subLabel}>Type d'attribut</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                                            {currentCategoryAttributes.map((attr: any) => (
                                                <TouchableOpacity
                                                    key={attr.attribute_id}
                                                    style={[styles.chip, selectedAttributeType === attr.attribute_id.toString() && styles.chipActive]}
                                                    onPress={() => setSelectedAttributeType(attr.attribute_id.toString())}
                                                >
                                                    <Text style={[styles.chipText, selectedAttributeType === attr.attribute_id.toString() && styles.chipTextActive]}>
                                                        {attr.attribute_name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>

                                        {selectedAttributeType !== '' && attributeGroups.length > 0 && (
                                            <View style={{ marginTop: 10 }}>
                                                {attributeGroups.map((group: any) => (
                                                    <View key={group.group_id} style={{ marginBottom: 15 }}>
                                                        {group.group_label && <Text style={styles.subLabel}>{group.group_label}</Text>}
                                                        <View style={styles.valuesGrid}>
                                                            {group.values?.map((val: any) => (
                                                                <TouchableOpacity
                                                                    key={val.id}
                                                                    style={[styles.chip, localSelectedAttributes.includes(val.id) && styles.chipActive]}
                                                                    onPress={() => toggleAttribute(val.id)}
                                                                >
                                                                    <Text style={[styles.chipText, localSelectedAttributes.includes(val.id) && styles.chipTextActive]}>
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
                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Footer buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                            <Text style={styles.clearBtnText}>Réinitialiser</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyBtnText}>Appliquer</Text>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        height: '90%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    sectionContent: {
        padding: 20,
        backgroundColor: '#FFF',
    },
    grid2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    grid4: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    boxOption: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        marginBottom: 8,
    },
    boxOptionActive: {
        borderColor: '#F97316',
        backgroundColor: '#FFF7ED',
    },
    boxOptionText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },
    boxOptionTextSmall: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    boxOptionTextActive: {
        color: '#C2410C',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priceDisplay: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F97316',
    },
    priceSeparator: {
        marginHorizontal: 15,
        color: '#9CA3AF',
        fontWeight: 'bold',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    colorCircleActive: {
        borderWidth: 2,
        borderColor: '#F97316',
        transform: [{ scale: 1.1 }],
    },
    colorInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    subLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 10,
    },
    typeScroll: {
        marginBottom: 20,
    },
    valuesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    chipActive: {
        backgroundColor: '#FFF7ED',
        borderColor: '#F97316',
    },
    chipText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#C2410C',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 30,
    },
    clearBtn: {
        flex: 1,
        paddingVertical: 14,
        marginRight: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    clearBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    applyBtn: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F97316',
        alignItems: 'center',
    },
    applyBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
