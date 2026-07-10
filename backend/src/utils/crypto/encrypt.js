import CryptoJS from "crypto-js";
export const encrypt =({data, secretkey = process.env.CRYPTO_KEY})=>{
    return CryptoJS.AES.encrypt(data, secretkey).toString();
};