import axios from 'axios';
import {app_id, key, url, proxy} from '../config';

export default class Recipe {
    constructor (id){
        this.id = id;
    }

    //methods
    async getRecipe() {
        //catching an error
        try {
            //https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3
            const res = await axios(`${proxy}${url}${this.id}&app_id=${app_id}&app_key=${key}&from=0&to=5`);
            const result = res.data.hits[0].recipe;
            this.title = result.label;
            this.author = result.source;
            this.img = result.image;
            this.url = result.url;
            this.ingredients = result.ingredientLines;
                        
        } catch (err){
            console.log(err);
            alert('Something went wrong. Recipe Not Found!');
        }
    }

    calcTime() {
        //Assuming that we need 15min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        // loop thru each of the ingredients and save them in an array (.map())
        const newIngredients = this.ingredients.map(el => {    

            // 1. Uniform Units
            let ingredient = el.toLowerCase();
                    // pass element(unit) and index(i); availabe in .map() and .forEach()
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
                
            });

            // 2. Remove parenthesis 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //regex
    
            // 3. Parse ingredients

            const arrIng = ingredient.split(' '); 
             //creates a new array element whenever space(' ') is encountered

            const unitIndex = arrIng.findIndex(elem => units.includes(elem));
            // .includes() returns true if the element(elem) is in the array(units); false otherwise                                   
            // .findIndex() returns the index of the element from the array(arrIng) if .includes() condition is true
            
            let objIng;
            if(unitIndex > -1 ) {
                // There is a unit

                const arrCount = arrIng.slice(0, unitIndex);
                    // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                    // Ex. 4 pounds , arrCount is [4]
                    // Ex. 1 3-4 pounds, arrCount is [1, 3-4]

                let count, decimal = 0, stringUnit='';
                if(arrCount.length === 1){
                   arrCount[0].includes('/') ? count = calcDecimal(arrCount[0]) : count = parseInt(arrCount[0], 10);
                } else {
                    if(arrCount[1].includes('-')){
                        count = arrCount[0];
                        stringUnit = `${arrCount[1]}`; 
       
                    } else {
                        decimal = calcDecimal(arrCount[1]);
                        count = parseInt(arrCount[0], 10) + decimal;
                        count.toString();
                    }
                }

                objIng = {
                    count,
                    unit: `${stringUnit} ${arrIng[unitIndex]}`,
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

                
            } else if(parseInt(arrIng[0], 10)){
                // There is No unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
        //console.log(this.ingredients);
    }

    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
};

const calcDecimal = (arrElem) => {
    let fraction, decimal;

    fraction = arrElem.split('/');
    decimal = parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
    return decimal;
};


            

            
    

          



           

