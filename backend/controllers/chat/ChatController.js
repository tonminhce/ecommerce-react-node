const sellerModel = require("../../models/sellerModel");
const customerModel = require("../../models/customerModel");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const sellerCustomerMessage = require("../../models/chat/sellerCustomerMessage");
const adminSellerMessage = require("../../models/chat/adminSellerMessage");
const { responseReturn } = require("../../utiles/response");

class ChatController {
  async get_seller(req, res) {
    const { sellerId } = req.params;
    try {
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        return responseReturn(res, 404, { message: "Seller not found" });
      }
      return responseReturn(res, 200, { seller });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async add_customer_friend(req, res) {
    const { sellerId, userId } = req.body;

    try {
      const seller = await sellerModel.findById(sellerId);
      const user = await customerModel.findById(userId);

      if (!seller || !user) {
        return responseReturn(res, 404, {
          message: "User or Seller not found",
        });
      }

      await this.updateFriendsList(sellerId, userId, seller.name, seller.image);
      await this.updateFriendsList(userId, sellerId, user.name, "");

      const messages = await sellerCustomerMessage.find({
        $or: [
          { receverId: sellerId, senderId: userId },
          { receverId: userId, senderId: sellerId },
        ],
      });

      const MyFriends = await sellerCustomerModel.findOne({ myId: userId });
      const currentFd = MyFriends.myFriends.find(
        (friend) => friend.fdId === sellerId
      );

      return responseReturn(res, 200, {
        MyFriends: MyFriends.myFriends,
        currentFd,
        messages,
      });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async updateFriendsList(myId, friendId, friendName, friendImage) {
    const existingFriend = await sellerCustomerModel.findOne({
      myId,
      myFriends: { $elemMatch: { fdId: friendId } },
    });

    if (!existingFriend) {
      await sellerCustomerModel.updateOne(
        { myId },
        {
          $push: {
            myFriends: { fdId: friendId, name: friendName, image: friendImage },
          },
        },
        { upsert: true }
      );
    }
  }

  async customer_message_add(req, res) {
    const { userId, text, sellerId, name } = req.body;
    try {
      const message = await sellerCustomerMessage.create({
        senderId: userId,
        senderName: name,
        receverId: sellerId,
        message: text,
      });

      await this.updateFriendPosition(userId, sellerId);
      await this.updateFriendPosition(sellerId, userId);

      return responseReturn(res, 201, { message });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async updateFriendPosition(myId, friendId) {
    const data = await sellerCustomerModel.findOne({ myId });
    const friends = data.myFriends;

    const index = friends.findIndex((f) => f.fdId === friendId);
    if (index > 0) {
      const [movedFriend] = friends.splice(index, 1);
      friends.unshift(movedFriend);

      await sellerCustomerModel.updateOne({ myId }, { myFriends: friends });
    }
  }

  async get_customers(req, res) {
    const { sellerId } = req.params;
    try {
      const data = await sellerCustomerModel.findOne({ myId: sellerId });
      return responseReturn(res, 200, { customers: data.myFriends });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async get_sellers(req, res) {
    try {
      const sellers = await sellerModel.find({});
      return responseReturn(res, 200, { sellers });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async get_customers_seller_message(req, res) {
    const { customerId } = req.params;
    const { id } = req;

    try {
      const messages = await sellerCustomerMessage.find({
        $or: [
          { receverId: customerId, senderId: id },
          { receverId: id, senderId: customerId },
        ],
      });

      const currentCustomer = await customerModel.findById(customerId);
      return responseReturn(res, 200, { messages, currentCustomer });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async seller_message_add(req, res) {
    const { senderId, receverId, text, name } = req.body;
    try {
      const message = await sellerCustomerMessage.create({
        senderId,
        senderName: name,
        receverId,
        message: text,
      });

      await this.updateFriendPosition(senderId, receverId);
      await this.updateFriendPosition(receverId, senderId);

      return responseReturn(res, 201, { message });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async seller_admin_message_insert(req, res) {
    const { senderId, receverId, message, senderName } = req.body;
    try {
      const messageData = await adminSellerMessage.create({
        senderId,
        receverId,
        message,
        senderName,
      });

      return responseReturn(res, 200, { message: messageData });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async get_admin_messages(req, res) {
    const { receverId } = req.params;
    const { id } = req;

    try {
      const messages = await adminSellerMessage.find({
        $or: [
          { receverId, senderId: id },
          { receverId: id, senderId: receverId },
        ],
      });

      const currentSeller = receverId
        ? await sellerModel.findById(receverId)
        : {};
      return responseReturn(res, 200, { messages, currentSeller });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }

  async get_seller_messages(req, res) {
    const { id } = req;
    const receverId = "";

    try {
      const messages = await adminSellerMessage.find({
        $or: [
          { receverId, senderId: id },
          { receverId: id, senderId: receverId },
        ],
      });

      return responseReturn(res, 200, { messages });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, { message: "Internal Server Error" });
    }
  }
}

module.exports = new ChatController();
