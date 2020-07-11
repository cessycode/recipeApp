import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, clearLoader} from './views/base';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


/* Global State of App
    - Search Object
    - Current recipe object
    - shopping list object
    - liked recipes
*/

const state = {};


                /************************
                 *  SEARCH CONTROLLER   *
                 ************************/

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if(query){
        // 2. New search object and add to state
            state.search = new Search(query);
                // state.search is created in the global state object(const state = {})
                // it holds the new object from the object constructor Search
        
        // 3. Prepare UI for results
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);
        
        try {
        // 4. Search for recipes
            await state.search.getResults();
                // use async-await because data from getResults() should be retrieved before rendering results on UI
                // getResults is an async function, it returns a promise thus the use of await.

        // 5. Render results on UI
            clearLoader();

                //state.search.result == this is where data is stored. Refer to Search.js getResults()
            searchView.renderResults(state.search.result);
        } catch (err){
            alert(`${err} cannot find recipe...`);
            clearLoader();
        }        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // stops the page from reloading everytime the form is clicked
    controlSearch();
});

// event delegation - to add an event listener even when the intended element is not present during initial page load
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

                /*************************
                 *   RECIPE CONTROLLER   *
                 ************************/

const controlRecipe = async () => {
    
    // get ID from url (considering url is from EDAMAM)
   let id;

   if(window.location.hash.includes('#http://www.edamam.com/ontologies/edamam.owl#recipe_')){
       id = window.location.hash.replace('#http://www.edamam.com/ontologies/edamam.owl#recipe_', '');
   } else {
       id = window.location.hash.replace('#', '');
   }
   
  
   if(id){
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight Selected Item
        try {
            if(state.search) searchView.highlightItem(id);       
        } catch(error){
            searchView.clearResults();
        }
    // Create new recipe object; save to state{};
    state.recipe = new Recipe(id);

        try {
            // Get recipe data; await - finish this code before proceding to the next one
            await state.recipe.getRecipe();

            // Parse Ingredients
            state.recipe.parseIngredients();

            //Caculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch(err){
            clearLoader();
            console.log(err);
        }
   }
};

// add event listeners to the global element (window)
// window.addEventlistener('load', controlRecipe);
// window.addEventlistner('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


                /*************************
                 *    LIST CONTROLLER    *
                 ************************/

const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(e => {
        const item = state.list.addItem(e.count, e.unit, e.ingredient);
        listView.renderItem(item);
    });  

    // Add DeleteAll Button
    const numList = state.list.getNumList();
    listView.addDeleteAllBtn(numList);

     // delete all items in shopping_list
    elements.deleteAllBtn.addEventListener('click', () => {
        state.list.deleteAll();
        listView.deleteAll();
    });                 
};

// M A N U A L   A D D    I T E M S
  elements.manualAddBtn.addEventListener('click', () => {
        let amt, unit, desc;

        amt = elements.amt.value;
        unit = elements.unit.value;
        desc = elements.desc.value;    
        console.log('manual add button clicked');
    });

// Handle delete and update list event items
    //event delegation

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    } // count update
     else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);            
    }
});



                /*************************
                 *    LIKES CONTROLLER    *
                 ************************/
//FOR TESTING
//state.likes = new Likes();
//likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // Current recipe is NOT liked yet
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );

        // Toggle Like button
        likesView.toggleLikeBtn(true);

        // Add Like to UI
        likesView.renderLikes(newLike);
    

    // Current recipe is ALREADY LIKED
    } else {
        // Delete item from the state
        state.likes.deleteLike(currentID);

        // Toggle Like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore Liked recipes on page load

window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readLocalStorage();
    
    // Toggle LikeMenu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render existing likes          
    state.likes.likedItems.forEach(like => likesView.renderLikes(like));
}); 


// Handling recipe button clicks (-, + on servings, add to cart, etc.) 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } 
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to shopping list
        controlList();    
    } 
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like Controller
        controlLike();
    } 
    
});









    
    
    










