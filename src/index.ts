

import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/common/AppAPI';
import { Modal } from './components/common/Modal';
import { LarekModel } from './components/Models/AppModel';
import { Basket, BasketItems } from './components/View/Basket';
import {  Item, ItemPreview } from './components/View/Item';
import { Contacts, Order } from './components/View/Order';
import { Page } from './components/View/Page';


import './scss/styles.scss';
import { IOrderForm } from './types';

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


const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events)
const order = new Order(cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactTemplate), events)


events.on('catalog:changed', () => {
    const itemsCatalog = model.getItems().map(item => {
        const card = new Item(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });
    page.catalog = itemsCatalog;
    page.counter = model.getBasketCounter();
});

events.on('basket:changed', () => {
    page.counter = model.getBasketCounter();
    
});

events.on('preview:addItem', (evt) => {
    const { id } = evt as { id: string };
    model.addToBasket(id);
    events.emit('card:selected', evt);
});

events.on('preview:deleteItem', (evt) => {
    const { id } = evt as { id: string };
    model.removeFromBasket(id);
    events.emit('card:selected', evt);
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



events.on('basket:deleteItem', (evt) => {
    const { id } = evt as { id: string };
    model.removeFromBasket(id);
    page.counter = model.getBasketCounter();
    events.emit('basket:open', evt);
});




events.on('basket:open', () => {
    const basketItems = model.getBasketItems().map((item, index) => {
        const basketList = new BasketItems(cloneTemplate(cardTemplateBasket), events)
        basketList.index = index +1;
        return basketList.render(item)
    })
    modal.render({
        content: basket.render({    
            items: basketItems,
            total: model.getTotal(),
            
        })
    });
});



events.on('order:open', () => {
    return modal.render({
        content: order.render({
            payment: model.orderData.payment,
            address: model.orderData.address,
            valid: false,
            errors: [],
        })
         
    });
        
});




events.on('order:changed', (evt: { payment: string }) => {
    model.setOrderField('payment', evt.payment);
    model.orderData.total = model.getTotal();
    order.orderButtonsStyle = model.orderData.payment
    
    
    events.emit('order:open');
});

events.on('contacts:open', () => {
    return modal.render({
        content: contacts.render({
            email: model.orderData.email,
            phone: model.orderData.phone,
            valid: false,
            errors: [],
        })
         
    });
        
});



events.on('modal:open', () => {
        page.locked = true;
    });
    
    // ... и разблокируем
events.on('modal:close', () => {
        page.locked = false;
    });
    
// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    model.setOrderField(data.field, data.value);
    console.log('^order\..*:change/');
    
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    model.setOrderField(data.field, data.value);
    console.log('^contacts\..*:change/');
    
});

events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
        const { payment, address, email, phone } = errors;
        order.valid = !payment && !address;
        contacts.valid = !phone && !email;
        order.errors = Object.values({payment, address,}).filter(i => !!i).join('; ');
        contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
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

    