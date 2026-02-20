export type Shop = {
    id: string | number;
    name: string;
    description?: string;
    rating: number;
    reviewsCount: number;
    city: string;
    isPremium: boolean;
    tags: string[];
    imageUrl: string | number;
    bannerUrl: string | number;
    logoUrl?: string | number; // Added for ShopCardFull avatar overlap
};

export type ShopCardProps = {
    shop: Shop;
    onPress?: (shop: Shop) => void;
    isPriority?: boolean;
};
