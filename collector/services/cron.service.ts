const cron = require("node-cron");
const { parse } = require("rss-to-json");
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

import { MARKET_DATA_URL, TECHNOLOGY_DATA_URL } from "../utils/constants";
let counter = 0;

const NUMBER_OF_ITEMS = 5;
const news: any = {};
const QUEUE = "news_queue";

/**
 * This function retrieves the rss feeds and parses them within a json object
 *
 * @param
 * @returns jsonObject
 */
const _retrieveData = async () => {
  let { items: markets } = await parse(MARKET_DATA_URL);
  let { items: technology } = await parse(TECHNOLOGY_DATA_URL);
  return {
    markets: markets.slice(-NUMBER_OF_ITEMS),
    technology: technology.slice(-NUMBER_OF_ITEMS),
  };
};

/**
 * This function deletes news already sent
 *
 * @param new data to check
 * @returns Data to send
 */
const _checkData = (data: any) => {
  const toSend: any[] = [];
  console.log("_checkData", data);
  (Object.keys(data) || []).forEach((topic) => {
    data[topic].forEach((el: any) => {
      const uuid = uuidv4();
      const link = el.link;
      if (link && !news[link]) {
        news[link] = {
          uuid: uuid,
          title: el.title,
          description: el.description,
          created: el.created,
          link: link,
          topic,
        };
        toSend.push(news[link]);
      }
    });
  });
  return toSend;
};

/**
 * This function retrieve new data, check and prepare new message
 *
 * @param
 * @returns  Message to send
 */
const _getMessage = async () => {
  const data = await _retrieveData();
  const message = _checkData(data);
  return {
    type: "NEW_DATA",
    message,
  };
};

/**
 * This function retrieve new data, check and prepare new message
 *
 * @param RabbitMQ channel
 * @returns
 */
const _notifyNewData = async (channel: any) => {
  await channel.assertQueue(QUEUE, { durable: false });
  const message = await _getMessage();
  console.log("message", message);
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
  console.log(`[x] Inviato '${message}'`);
};

const connect = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error("Errore:", error);
  }
};
const start = async () => {
  const channel = await connect();
  cron.schedule("1 * * * *", () => _notifyNewData(channel));
};

export { start };
