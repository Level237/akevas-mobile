export type CartItemType = {
    id: string;
    title: string;
    price: number;
    image: any;
    location: string;
    quantity: number;
};

export type CartState = {
    items: CartItemType[];
    subtotal: number;
    deliveryFee: number;
    total: number;
};
