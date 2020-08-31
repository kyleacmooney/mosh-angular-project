import { Product } from './product';

export interface ShoppingCartItem {
    quantity: number;
}

export interface ShoppingCartItems {
    [productKey: string]: ShoppingCartItem;
}

export class ShoppingCart {
    items: ShoppingCartItems; // TODO: Refactor so that items is just an array and
                              // all uses of this class use items array rather than this key to item map

    constructor(cart: {dateCreated: number, items?: ShoppingCartItems}) {
        this.items = cart.items || {};
    }

    get productKeys(): string[] {
        return Object.keys(this.items);
    }

    get totalItemsCount(): number {
        let count = 0;
        for (const productKey in this.items)
            count += this.items[productKey].quantity;
        return count;
    }

    getQuantity(product: Product): number {
        const item = this.items[product.key];
        return item ? item.quantity : 0;
    }
}
