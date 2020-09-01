export interface Product {
    key: string;
    imageUrl: string;
    title: string;
    price: number;
    category: string;
}

export const emptyProduct = (): Product => ({
    key: '',
    imageUrl: '',
    title: '',
    price: null,
    category: '',
});
