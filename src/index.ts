let appName: string = "Shopping List";
let id: number = 5;
let isProcessed: boolean = true;

function autobind(target: any, name: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;

    const newDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            return originalMethod.bind(this);
        },
    };

    return newDescriptor;
}

function validate(validateInput: Validate){
    let isValid = true;

    if(validateInput.required){
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }

    if(validateInput.minLength != null && typeof validateInput.value === 'string'){
        isValid = isValid && validateInput.value.length >= validateInput.minLength;
    }

    if(validateInput.maxLength != null && typeof validateInput.value === 'string'){
        isValid = isValid && validateInput.value.length <= validateInput.maxLength;
    }

    if(validateInput.min != null && typeof validateInput.value === 'number'){
        isValid = isValid && validateInput.value >= validateInput.min;
    }

    if(validateInput.max != null && typeof validateInput.value === 'number'){
        isValid = isValid && validateInput.value <= validateInput.max;
    }

    return isValid;

}

interface Validate {
    value: string | number;
    required?: true;
    minLength?: number;
    maxLength?: number;
    min?:number;
    max?: number;
}

enum ItemType {
    FOOD,
    DRINK,
    BOOK,
}

class Item{
    constructor(
        public id:string, 
        public name: string, 
        public price: string, 
        public description: string){
    }
}

type Listener = (projects: Item[]) =>void;

class ItemState{
    private static instance: ItemState;
    private items: Item[] = [];
    private listeners: Listener[] = [];

    private constructor(){

    }

    public static getInstance(){
        if(this.instance == null){
            this.instance = new ItemState();
        }
        return this.instance;
    }

    addListener(listener: Listener){
        this.listeners.push(listener);
    }

    addItem(title:string, price:string, description:string){
        const item = new Item(Math.random().toString(), title, price, description);
        this.items.push(item);

        for(const listenerFunction of this.listeners){
            listenerFunction(this.items);
        }
    }
}
const itemState = ItemState.getInstance();

class ItemInput{
    formElement: HTMLFormElement;
    titleElement: HTMLInputElement;
    // itemTypeElement: HTMLInputElement;
    priceElement: HTMLInputElement;
    descripitonElement: HTMLInputElement;

    constructor(){
        this.formElement = document.querySelector('form') as HTMLFormElement;
        this.titleElement = document.getElementById('title') as HTMLInputElement;
        // this.itemTypeElement = document.getElementById('item-type') as HTMLInputElement;
        this.priceElement = document.getElementById('price') as HTMLInputElement;
        this.descripitonElement = document.getElementById('description') as HTMLInputElement;

        this.configure();
    }

    private configure(){
        this.formElement.addEventListener('submit', this.submitHandler);
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();

        const userInput = this.gatherUserInput();

        if(Array.isArray(userInput)){
            const [title, price, description] = userInput;
            // console.log(userInput);
            this.clearInput();
            itemState.addItem(title, price, description);
        }
    }

    private clearInput(){
        this.titleElement.value = '';
        this.priceElement.value = '';
        this.descripitonElement.value = '';
    }

    private gatherUserInput(): [string, string, string] | void{
        const title = this.titleElement.value;
        // const itemType = this.itemTypeElement.value;
        const price = this.priceElement.value;
        const description = this.descripitonElement.value;


        const titleValidate: Validate = {
            value: title,
            required: true,
            minLength: 2,
            maxLength: 30,
        };

        const priceValidate: Validate = {
            value: price,
            required: true,
            min: 0,
        };

        const descriptionValidate: Validate = {
            value: description,
            minLength: 2,
            maxLength: 255, 
        };

        if(!validate(titleValidate) || !validate(priceValidate) || !validate(descriptionValidate)){
            alert("The input is not valid!");
            return;
        }

        return [title, price, description];
        // console.log(title, price, description);
    }
}

class ItemList{
    assignedItems: Item[] = [];
    constructor(){
        itemState.addListener((items:Item[]) => {
            this.assignedItems = items;
            this.renderItems();
        });   
    }

    private renderItems(){
        const listElement = document.getElementById('item-list') as HTMLUListElement;

        listElement.innerHTML = '';

    for(const item of this.assignedItems){
        const listItem = document.createElement('li');
        listItem.innerHTML = item.name + ", " + item.price + ", " + item.description;
        listElement.appendChild(listItem);

        listItem.addEventListener("click", function(){
            listItem.style.textDecoration= "line-through";
        })

        const buttonDelete = document.querySelector('delete') as HTMLButtonElement;
        
        
        
    }

    }
}

const itemInput = new ItemInput();
const itemList = new ItemList();


