import axios from "axios";
import createAxiosConfig from "../createAxiosConfig";

/**
 * Adds authorization headers
 * @param url
 */
export default (url) => {
    axios.get(url, createAxiosConfig())
        .then(response => {
            return response.data
        })
        .catch(err => {
            console.error(err);
            return null;
        });
}