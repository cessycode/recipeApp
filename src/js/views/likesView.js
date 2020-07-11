import {elements} from './base';
import {limitRecipeTitle} from './searchView'

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    // change icon from html
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLikes = newLike => {
    const markup = `
        <li>
            <a class="likes__link" href="#${newLike.id}">
                <figure class="likes__fig">
                    <img src="${newLike.img}" alt="${newLike.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(newLike.title)} ...</h4>
                    <p class="likes__author">${newLike.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);

};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}

