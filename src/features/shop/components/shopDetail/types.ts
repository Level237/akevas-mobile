export type Product = {
    id: string | number;
    name: string;
    price: number;
    imageUrl: string | number;
    category?: string;
};

export type Review = {
    id: string | number;
    user: string;
    rating: number;
    comment: string;
    date: string;
};

export type ShopDetailData = {
    id: string | number;
    name: string;
    city: string;
    rating: number;
    reviewsCount: number;
    logoUrl: string | number;
    bannerUrl: string | number;
    description: string;
    products: Product[];
    reviews: Review[];
};
