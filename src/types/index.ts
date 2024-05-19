export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export type TOrder = Pick<ICard, 'id' | 'price'>;
export type TBusket = Pick<ICard, 'id' | 'title' | 'price'>;

export interface ICardData {
	cards: ICard[];
	preview: string | null;
	getCard(cardId: string): ICard;
}

export interface IUser {
	payMethod: string;
	adress: string;
	email: string;
	phone: string;
}

export interface IUserData {
	userData: IUser[];
	checkValidationUserData(data: Record<keyof IUser, string>): boolean;
}

export interface IBusket {
	items: TBusket;
	totalPrice: number;
}

export interface IBusketData {
	busket: IBusket[];
	addToBusket(item: TBusket): void;
	removeFromBusket(itemId: string): void;
	clearBusket(): void;
}
