export default class Likes {
    constructor() {
        this.likedItems = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};          
        this.likedItems.push(like);

        //store data to local storage
        this.saveToLocalStorage();

        return like;
    }

    deleteLike(id){
       const index = this.likedItems.findIndex(e => e.id === id);
       this.likedItems.splice(index, 1); 

       //store data to local storage
       this.saveToLocalStorage();
       
    }

    isLiked(id){
        //returns true or false
        return this.likedItems.findIndex(e => e.id === id) !== -1;
    }

    getNumLikes(){
        return this.likedItems.length;
    }
    
    saveToLocalStorage() {
        localStorage.setItem('localLikesArray', JSON.stringify(this.likedItems));
    }

    readLocalStorage() {
        const storage = JSON.parse(localStorage.getItem('localLikesArray'));

        // restore of the list of liked items from the storage
        if (storage) this.likedItems = storage;

        // NOTE: localStorage.setItem and localStorage.getItem are objects available from node.js
    } 
}