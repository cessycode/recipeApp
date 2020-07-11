import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        //find the index of the item that has the same id as uniqid
        const index = this.items.findIndex(el => el.id === id);

        // [2,4,8] splice(1, 2) -> returns [4, 8], original array becomes [2]
        this.items.splice(index, 1);
    }

    deleteAll(){
        this.items = [];
        
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }

    getNumList() {
        return this.items.length;
    }
}