import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SocialService} from 'src/app/services/social.service';
import Web3 from 'web3';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  contract;
  postContent: string;
  postList = [];

  constructor(private socialService: SocialService, private ref: ChangeDetectorRef) {
  }

  async ngOnInit() {
    await this.loadPosts();

    this.contract.events.PostTipped({}, async (error, event) => {
      await this.loadPosts();
      this.ref.detectChanges();
    });
  }

  async addPost() {
    const result = await this.socialService.addPost(this.postContent);
  }

  async loadPosts() {
    if (!this.contract) {
      this.contract = await this.socialService.getContract();
    }

    const postCount = await this.contract.methods.postCount().call();
    this.postList = [];
    for (let i = 1; i <= postCount; i++) {
      const post = await this.contract.methods.postList(i).call();
      post.tipAmount = Web3.utils.fromWei(post.tipAmount, 'ether');
      this.postList.push(post);
    }

    console.log(this.postList);
  }

  async tipPost(id: number) {
    await this.socialService.tipPost(id);
  }
}
