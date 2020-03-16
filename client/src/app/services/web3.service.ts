import {Injectable} from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private _web3: Web3;

  constructor() {
  }

  async initWeb3() {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      await window.ethereum.enable();
      // @ts-ignore
      return new Web3(window.ethereum);
      // @ts-ignore
    } else if (window.web3) {
      // @ts-ignore
      return new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return null;
    }
  }

  get web3(): Promise<any> {
    if (this._web3) {
      return new Promise<any>(resolve => {
        resolve(this._web3);
      });
    }
    return this.initWeb3().then(web3 => {
      this._web3 = web3;
      return web3;
    });
  }

  get account(): Promise<any> {
    return this.web3.then(web3 => {
      return web3 ?
        web3.eth.getAccounts().then(accounts => {
          return accounts[0];
        }) :
        null;
    });
  }

  get networkId(): Promise<any> {
    return this.web3.then(web3 => {
      return web3 ? web3.eth.net.getId() : null;
    });
  }
}
