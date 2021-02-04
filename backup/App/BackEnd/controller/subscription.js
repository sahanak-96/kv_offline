const db = require('../model/queries')

const getSubscription = (request, response) => {
    console.log("check1");
   const user=db.getSubscriptiondb;
   console.log(user);
   response.status(200).send(user);
  }

  module.exports = {
    getSubscription,
  }
  