import axios from 'axios';
import {app_id, key, url, proxy} from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }
    //method
    
    async getResults(){
    
        //catching an error

        //https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3
        try {
            const res = await axios(`${proxy}${url}${this.query}&app_id=${app_id}&app_key=${key}&from=0&to=15`);
                        //async returns a promise thus the use of await
            this.result = res.data.hits;
                //this.result will be created

        } catch(error){
            alert(error);
        }
    }
}

    