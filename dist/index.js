"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let appName = "Shopping List";
let id = 5;
let isProcessed = true;
function autobind(target, name, descriptor) {
    const originalMethod = descriptor.value;
    const newDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return newDescriptor;
}
function validate(validateInput) {
    let isValid = true;
    if (validateInput.required) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
    if (validateInput.minLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length >= validateInput.minLength;
    }
    if (validateInput.maxLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length <= validateInput.maxLength;
    }
    if (validateInput.min != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value >= validateInput.min;
    }
    if (validateInput.max != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value <= validateInput.max;
    }
    return isValid;
}
var ItemType;
(function (ItemType) {
    ItemType[ItemType["FOOD"] = 0] = "FOOD";
    ItemType[ItemType["DRINK"] = 1] = "DRINK";
    ItemType[ItemType["BOOK"] = 2] = "BOOK";
})(ItemType || (ItemType = {}));
class Item {
    constructor(id, name, price, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}
class ItemState {
    constructor() {
        this.items = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new ItemState();
        }
        return this.instance;
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    addItem(title, price, description) {
        const item = new Item(Math.random().toString(), title, price, description);
        this.items.push(item);
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.items);
        }
    }
}
const itemState = ItemState.getInstance();
class ItemInput {
    constructor() {
        this.formElement = document.querySelector('form');
        this.titleElement = document.getElementById('title');
        // this.itemTypeElement = document.getElementById('item-type') as HTMLInputElement;
        this.priceElement = document.getElementById('price');
        this.descripitonElement = document.getElementById('description');
        this.configure();
    }
    configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, price, description] = userInput;
            // console.log(userInput);
            this.clearInput();
            itemState.addItem(title, price, description);
        }
    }
    clearInput() {
        this.titleElement.value = '';
        this.priceElement.value = '';
        this.descripitonElement.value = '';
    }
    gatherUserInput() {
        const title = this.titleElement.value;
        // const itemType = this.itemTypeElement.value;
        const price = this.priceElement.value;
        const description = this.descripitonElement.value;
        const titleValidate = {
            value: title,
            required: true,
            minLength: 2,
            maxLength: 30,
        };
        const priceValidate = {
            value: price,
            required: true,
            min: 0,
        };
        const descriptionValidate = {
            value: description,
            minLength: 2,
            maxLength: 255,
        };
        if (!validate(titleValidate) || !validate(priceValidate) || !validate(descriptionValidate)) {
            alert("The input is not valid!");
            return;
        }
        return [title, price, description];
        // console.log(title, price, description);
    }
}
__decorate([
    autobind
], ItemInput.prototype, "submitHandler", null);
class ItemList {
    constructor() {
        this.assignedItems = [];
        itemState.addListener((items) => {
            this.assignedItems = items;
            this.renderItems();
        });
    }
    renderItems() {
        const listElement = document.getElementById('item-list');
        listElement.innerHTML = '';
        for (const item of this.assignedItems) {
            const listItem = document.createElement('li');
            listItem.innerHTML = item.name + ", " + item.price + ", " + item.description;
            listElement.appendChild(listItem);
            listItem.addEventListener("click", function () {
                listItem.style.textDecoration = "line-through";
            });
            const buttonDelete = document.querySelector('delete');
        }
    }
}
const itemInput = new ItemInput();
const itemList = new ItemList();
