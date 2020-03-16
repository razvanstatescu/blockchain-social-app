import {Injectable} from '@angular/core';
import {Web3Service} from 'src/app/services/web3.service';
import * as Social from '../abis/Social.json';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private _contract;

  constructor(private web3Service: Web3Service) {
  }

  async getNetworkData() {
    const networkId = await this.web3Service.networkId;
    return networkId ? Social.networks[networkId] : null;
  }

  get abi() {
    return Social.abi;
  }

  async getContract() {
    if (this._contract) {
      return this._contract;
    } else {
      const web3 = await this.web3Service.web3;
      if (!web3) {
        return null;
      }
      const networkData = await this.getNetworkData();
      if (!networkData) {
        return null;
      }

      this._contract = new web3.eth.Contract(this.abi, networkData.address);
      return this._contract;
    }
  }

  async addPost(content: string) {
    const contract = await this.getContract();
    const account = await this.web3Service.account;

    return contract.methods.addPost(content).send({from: account});
  }

  async tipPost(id: number) {
    const contract = await this.getContract();
    const account = await this.web3Service.account;
    const value = Web3.utils.toWei('1', 'ether');

    return contract.methods.tipPost(id).send({from: account, value});
  }
}
