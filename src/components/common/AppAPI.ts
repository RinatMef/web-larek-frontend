import { Api, ApiListResponse } from '../base/api';
import { IOrder, IOrderResponce, IItem, IProductResponce } from "../../types";

export interface ILarekAPI {
    getProductList: () => Promise<IProductResponce>;
    orderProducts: (order: IOrder) => Promise<IOrderResponce>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;
    
    constructor(cdn: string, baseUrl: string ) {
        super(baseUrl)
        this.cdn = cdn;
    }

    getProductList(): Promise<IProductResponce> {
        return this.get('/product/').then((data: ApiListResponse<IItem>) => {
            const UpdatedImage = data.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }));
            return { total: data.total, items: UpdatedImage };
        });
    }

    orderProducts(order: IOrder): Promise<IOrderResponce> {
        return this.post('/order/', order).then((data: IOrderResponce) => 
            data);
    }

}
