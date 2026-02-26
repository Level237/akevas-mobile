import { Shop } from '@/types/seller';

export { Shop };

export type ShopCardProps = {
    shop: Shop;
    onPress?: (shop: Shop) => void;
    isPriority?: boolean;
};
