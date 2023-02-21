import Product from "./Product"

export interface Order {
    orderID: number
    orderItems: Product[]
    user: string
}
export default interface MyOrders {
    orders: Order[]
}
