pragma solidity >=0.4.25 <0.7.0;

contract Social {
    struct Post {
        uint256 id;
        string content;
        address payable owner;
        uint256 tipAmount;
    }

    uint256 public postCount = 0;
    mapping(uint256 => Post) public postList;

    event PostAdded(uint256 id, string content, address payable owner);

    event PostTipped(uint256 id, uint256 tipAmount);

    function addPost(string memory _content) public {
        postCount = postCount + 1;
        postList[postCount] = Post(postCount, _content, msg.sender, 0);

        emit PostAdded(postCount, _content, msg.sender);
    }

    function tipPost(uint256 _id) public payable {
        require(msg.value > 0);

        Post memory post = postList[_id];
        post.owner.transfer(msg.value);
        post.tipAmount = post.tipAmount + msg.value;
        postList[_id] = post;

        emit PostTipped(_id, post.tipAmount);
    }
}
