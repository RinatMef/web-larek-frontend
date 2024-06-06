

import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/common/AppAPI';
import { Modal } from './components/common/Modal';
import { LarekModel } from './components/Models/AppModel';
import { Basket } from './components/View/Basket';
import { Item, ItemPreview } from './components/View/Item';
import { Page } from './components/View/Page';


import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardTemplateBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');







const larekApi = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const model = new LarekModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)

// const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events)

events.on('catalog:changed', () => {
    const itemsCatalog = model.getItems().map(item => {
        const card = new Item(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });

    // Обновление каталога
    page.catalog = itemsCatalog;

    // Обновление счетчика корзины
    page.counter = model.getBasketCounter();
});

events.on('basket:changed', () => {
    page.counter = model.getBasketCounter();
});


events.on('card:selected', (evt) => {
    const { id } = evt as { id: string };
    const item = model.getItem(id);
    
   
        const cardPreview = new ItemPreview(cloneTemplate(cardPreviewTemplate), events);
        cardPreview.render(item);
        
        modal.render({
             content: cardPreview.render({
                title: item.title,
                image: item.image,
                description: item.description,
                price: item.price,
                category: item.category
             })
        });
  
});


events.on('basket:addItem', (evt) => {
    const { id } = evt as { id: string };
    const item = model.addToBasket(id);
    if (item) {
        events.emit('basket:statusChanged', { id: item.id, status: item.inBasket });
    }
});

events.on('basket:deleteItem', (evt) => {
    const { id } = evt as { id: string };
    const item = model.removeFromBasket(id);
    if (item) {
        events.emit('basket:statusChanged', { id: item.id, status: item.inBasket });
    }
});



events.on('basket:openModal', () => {
    const basketItems = model.getBasketItems().map(item => {
        const card = new Item(cloneTemplate(cardTemplateBasket), events)
        return card.render(item)

    })
    
    modal.render({
        content: basket.render({    
            items: basketItems,
            total: model.getTotal(),
        })
    });
});

console.log(`Это все что в корзине ${model.getBasketItems()}`);







const cont = model.getBasketCounter()
    console.log(`В корзине ${cont}`)
    setTimeout(() => {
        
        model.addToBasket('f3867296-45c7-4603-bd34-29cea3a061d5');  // Закрывающая скобка была добавлена
        const newCont = model.getBasketCounter();  // Переименована переменная для избежания конфликта имен
        console.log(`В корзине ${newCont}`);
        console.log(`Это все что в корзине ${model.getBasketItems()}`);  // Вызов метода исправлен на model.getBasketItems()
    }, 3000);

    






    events.on('modal:open', () => {
        page.locked = true;
    });
    
    // ... и разблокируем
    events.on('modal:close', () => {
        page.locked = false;
    });
    







  
    
    // Получаем товары с сервера
    larekApi.getProductList()
    .then((response) => {
        const { items } = response;
        console.log(items);
        
        model.setItems(items);
    })
    .catch((err) => {
        console.error(err);
    });

    