import { ShoppingCart, ShoppingCartItem } from './shopping-cart';

export interface ServerOrder {
    datePlaced: number;
    items: {productKey: string, quantity: number}[];
    shipping: {addressLine1: string, addressLine2: string, city: string, name: string};
    userId: string;
}

// TODO: Make fields private (same with other implemented models)
export class Order {
    datePlaced: number;
    items: any[];
    orderId = '';

    constructor(public userId: string, public shipping: any, shoppingCart: ShoppingCart) {
        if (userId === '' && shipping === null && shoppingCart === null) return;

        this.datePlaced = new Date().getTime();

        this.items = Object.entries(shoppingCart.items).map(
            (entry: [string, ShoppingCartItem]) => {
                return {
                    productKey: entry[0],
                    quantity: entry[1].quantity
                };
            });
    }

    public static emptyOrder(): Order {
        return new Order('', null, null);
    }

    public static fromServer(orderId: string, serverOrder: ServerOrder): Order {
        const order: Order = this.emptyOrder();
        order.datePlaced = serverOrder.datePlaced;
        order.shipping = serverOrder.shipping;
        order.items = serverOrder.items;
        order.userId = serverOrder.userId;
        order.orderId = orderId;
        return order;
    }
}
