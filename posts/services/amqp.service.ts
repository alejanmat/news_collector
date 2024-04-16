const amqp = require("amqplib/callback_api");
const { createPost } = require("../utils/posts.utils");

/**
 * This function parse the message from a RabbitMQ and create a new post
 *
 * @param
 * @returns the result of posts creation
 */
const _parseData = async (data: any) => {
  try {
    const msg = JSON.parse(data.content.toString());
    if (msg.type === "NEW_DATA") {
      const news = msg.message;
      const postsPromises: any = news.forEach(
        async (newPost: any) => await createPost(newPost)
      );
      await Promise.all(postsPromises);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * This function connect to RabbitMQ channel
 *
 * @param
 * @returns
 */
const connectToChannel = async () => {
  amqp.connect("amqp://localhost", function (err: any, connection: any) {
    if (err) {
      console.log("err", err);
      throw err;
    }
    connection.createChannel(function (err: any, channel: any) {
      if (err) {
        throw err;
      }
      var queue = "news_queue";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(queue, _parseData, { noAck: true });
    });
  });
};

export { connectToChannel };
