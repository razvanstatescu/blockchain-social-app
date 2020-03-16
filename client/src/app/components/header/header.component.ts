import {Component, OnInit} from '@angular/core';
import {Web3Service} from 'src/app/services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  account: string;

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    this.account = await this.web3Service.account;
  }

}
