export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    inBasket: boolean;
}



export interface ILarekModel {
    items: IItem[];
    orderData: IOrder | null;
    getItems(): IItem[];
    setItems(items: IItem[]): void;
    getItem(id: string): IItem;
    addToBasket(id: string): IItem;
    removeFromBasket(id: string): IItem;
    getBasketCounter(): number;
    getBasketItems(): IItem[];
    
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IProductResponce {
    total: number;
    items: IItem[];
}



export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;

}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderData{
	order: IOrder;
	checkOrderValidation(data: Record<keyof IOrder, string>): boolean;
}

export interface IOrderResponce {
	id: string;
    total: number
}






