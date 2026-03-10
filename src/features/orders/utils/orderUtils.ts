import { COLORS } from '@/constants/colors';

export const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];

    // Vérifier si order existe
    if (!order) {
        return allOrderItems;
    }

    // Ajouter les produits avec variation (orderVariations)
    if (order.orderVariations && Array.isArray(order.orderVariations) && order.orderVariations.length > 0) {
        order.orderVariations.forEach((item: any) => {
            // Cas 1: variation_attribute existe avec product_variation
            if (item && item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                const attributeValue = item.variation_attribute.value;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    size: attributeValue || '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
            // Cas 2: variation_attribute est null mais product_variation existe directement
            else if (item && item.product_variation) {
                const variation = item.product_variation;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    size: '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
        });
    }

    // Ajouter les produits sans variation (order_details)
    if (order.order_details && Array.isArray(order.order_details) && order.order_details.length > 0) {
        order.order_details.forEach((item: any) => {
            if (item && item.product) {
                allOrderItems.push({
                    id: item.id,
                    name: item.product?.product_name || 'Produit inconnu',
                    color: '',
                    size: '',
                    quantity: parseInt(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    image: item.product?.product_profile || '',
                    total: (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0),
                    type: 'simple'
                });
            }
        });
    }

    return allOrderItems;
};

export const getProductImage = (orderItems: any[]) => {
    if (orderItems.length > 0) {
        // Essayer d'abord de trouver une image valide
        const itemWithImage = orderItems.find(item => item.image && item.image !== '');
        if (itemWithImage) {
            return itemWithImage.image;
        }
        // Si aucune image trouvée, retourner la première image disponible
        return orderItems[0].image || '';
    }
    return '';
};

export const getTotalItems = (orderItems: any[]) => {
    return orderItems.reduce((total: number, item: any) => {
        return total + (item.quantity || 0);
    }, 0);
};

export const getStatusText = (status: string | number) => {
    const statusText = {
        '0': 'En attente',
        '1': 'En cours de livraison',
        '2': 'Livré',
        '3': 'Annulé',
    };
    return statusText[status?.toString() as keyof typeof statusText] || 'Inconnu';
};

export const getStatusStyles = (status: string | number) => {
    const styles = {
        '0': { bg: '#FEF3C7', text: '#92400E' }, // Yellow (En attente) - Equivalent to bg-yellow-100 text-yellow-800
        '1': { bg: COLORS.primaryLight || '#fff4e6', text: COLORS.primary || '#ed7e0f' }, // Primary App color (En cours de livraison / Confirmé)
        '2': { bg: '#D1FAE5', text: '#065F46' }, // Green (Livré) - Equivalent to bg-green-100 text-green-800
        '3': { bg: '#FEE2E2', text: '#991B1B' }, // Red (Annulé) - Equivalent to bg-red-100 text-red-800
    };
    return styles[status?.toString() as keyof typeof styles] || { bg: '#F3F4F6', text: '#1F2937' }; // Default Grey
};
