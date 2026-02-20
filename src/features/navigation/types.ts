export type Gender = 'HOMME' | 'FEMME' | 'ENFANT';

export type Category = {
    id: string;
    name: string;
    imageUrl: string | number;
    gender: Gender;
};

export const CATEGORIES: Category[] = [
    // FEMME
    { id: '1', name: 'Vêtements', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '2', name: 'Bijoux', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '3', name: 'Chaussures', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '4', name: 'Parfums', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '5', name: 'Soins et beauté', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '6', name: 'Sport', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '7', name: 'Accessoires', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '8', name: 'Sacs', gender: 'FEMME', imageUrl: require('@/assets/images/shop1.webp') },

    // HOMME
    { id: '9', name: 'Vêtements', gender: 'HOMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '10', name: 'Montres', gender: 'HOMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '11', name: 'Chaussures', gender: 'HOMME', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '12', name: 'Parfums', gender: 'HOMME', imageUrl: require('@/assets/images/shop1.webp') },

    // ENFANT
    { id: '13', name: 'Vêtements', gender: 'ENFANT', imageUrl: require('@/assets/images/shop1.webp') },
    { id: '14', name: 'Jouets', gender: 'ENFANT', imageUrl: require('@/assets/images/shop1.webp') },
];
