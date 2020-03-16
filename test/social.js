// @ts-nocheck
const Social = artifacts.require("Social");

contract('Social', ([deployer, postOwner, regularUser]) => {
    let SocialInstance;

    before(async () => {
        SocialInstance = await Social.deployed();
    });

    describe('deployment', async () => {
        it('should deploy succesfully', async () => {
            const address = await SocialInstance.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('post', async () => {

        it('should add a post', async () => {
            const result = await SocialInstance.addPost('my awesome first post', {from: postOwner});

            assert.equal(true, result.receipt.status);
        });

        it('should have one post', async () => {
            const postCount = await SocialInstance.postCount();

            assert.equal(1, postCount);
        });

        it('should have a valid post', async () => {
            const post = await SocialInstance.postList(1);

            assert.equal(1, post.id);
            assert.equal('my awesome first post', post.content);
            assert.equal(postOwner, post.owner);
            assert.equal(0, post.tipAmount);
        });

        it('should tip a post', async () => {
            const result = await SocialInstance.tipPost(1, {
                from: regularUser,
                value: web3.utils.toWei('0.5', 'Ether')
            });
            const post = await SocialInstance.postList(1);

            assert.equal(true, result.receipt.status);
            assert.equal(1, post.id);
            assert.equal(web3.utils.toWei('0.5', 'Ether'), post.tipAmount);
        });
    });
});
