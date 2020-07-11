import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightItem = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    //render results of current page
        const start = (page - 1) * resultPerPage;
        const end = page * resultPerPage;

        // recipes.forEach(renderRecipe) ==> shorcut for code: recipes.forEach(e => renderRecipe(e));
        recipes.slice(start, end).forEach(renderRecipe);
            //slice creates a new array of elements and will extract upto but not including the end. Thus end == end-1;
    
    //render pagination buttons
        renderButtons(page, recipes.length, resultPerPage);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {

    /*       --- TEST VALUES for .reduce() ---- 

        title: 'Pasta with tomato and spinach'
        acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
        acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
        acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
        acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
        acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
    */

        //the following code is a loop
        title.split(' ').reduce((acc, cur) => {
                // split the title with every space encounter
                // acc - accumulator
                // cur - current value (title)

            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length; // this will run until the end of title string

        }, 0); // refers to the initial value of 'acc' ; end of reduce loop


        
        return `${newTitle.join(' ')} ...`;
                            // opposite of split. joins the array newTitle into a string separated by space in between
    }
    return title;
}


const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe.uri}">
                <figure class="results__fig">
                    <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
                    <p class="results__author">${recipe.recipe.source}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>       
    </button>
`;

const renderButtons = (page, numResults, resultPerPage) => {
    const pages = Math.ceil(numResults / resultPerPage);

    let button;
    if (page === 1 && pages > 1){
        // show button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages){
        // show both buttons for prev and next page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1){
        //show button to go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

