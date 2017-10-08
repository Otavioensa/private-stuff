'use strict';

const amqp = require('amqplib');
const promise = require('bluebird');
const config = require('../config');

const uri = config.rabbit.uri;
const workQueue = config.rabbit.workQueue;
const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };

return amqp.connect(uri)
  .then((connection) => connection.createChannel())
  .then((channel) => assertAndConsumeQueue(channel));

const assertAndConsumeQueue = (channel) => {

  const ackMessage = (msg) => {

    return doYourHeavyTask(msg)
      .then(() => channel.ack(msg));
  };

  return channel.assertQueue(workQueue, assertQueueOptions)
    .then(() => channel.consume(workQueue, ackMessage, consumeQueueOptions);
};


// it does all your heavy tasks
const doYourHeavyTask = (msg) => {

  console.log(msg.content.toString());
  return promise.resolve('done');
};
