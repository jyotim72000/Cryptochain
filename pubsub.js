const redis = require('redis');

const CHANNEL = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }){
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannesls();

        this.subscriber.on(
            'message', (channel, message) => this.handleMessage(channel, message)
            );
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);

        if(channel === CHANNEL.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage); 
        }
    }

    subscribeToChannesls(){
        Object.values(CHANNEL).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        this.publisher.publish(channel,message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNEL.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;
//const testPubSub = new PubSub();

//setTimeout(() => testPubSub.publisher.publish(CHANNEL.TEST, 'foo'), 1000);