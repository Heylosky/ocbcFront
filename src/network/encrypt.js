import {JSEncrypt} from "jsencrypt";
import {requestGet2} from "@/network/request";
import axios from "axios";

// export function RsaEncode(data) {
//     let pwd
//     pwd = 'aaa'
//     requestGet2({
//         url: '/bak/rsa'
//     }, res => {
//         // console.log(res.data);
//         let encryptorIns1 = new JSEncrypt();
//         encryptorIns1.setPublicKey(res.data);
//         console.log(encryptorIns1.encrypt(data));
//         this.pwd = encryptorIns1.encrypt(data);
//         this.pwd = 'hello'
//     }, err => {
//         console.log(err);
//     })
//     return pwd
// }

export function Encode(publicKey, data) {
    let encryptorIns1 = new JSEncrypt();
    encryptorIns1.setPublicKey(publicKey);
    return encryptorIns1.encrypt(data);
}

// export function RsaEncode2(data) {
//     let pwd
//     pwd = 'aaa'
//     new Promise((resolve, reject) => {
//         pwd = 'uuu'
//         axios.get('https://henry.sdesk.vip:8010/bak/rsa').then(res => {console.log(res.data); resolve();})
//     }).then(() => {
//         console.log('asdf');
//     })
//     return pwd
// }
//
// export function RsaEncode3(data) {
//     let pwd
//     pwd = 'iii'
//     new Promise((resolve, reject) => {
//         axios.get('https://henry.sdesk.vip:8010/bak/rsa')
//             .then(res => {
//                 console.log(res.data);
//                 console.log('1');
//                 pwd = 'ccc'
//                 resolve();
//             })
//     }).then(() => {
//         console.log('2');
//         RsaEncode3.return(pwd)
//     })
// }
