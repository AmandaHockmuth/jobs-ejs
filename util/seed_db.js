const Item = require("../models/Item");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

//FACTORY BUDGET ITEM
factory.define("item", Item, {
  title: () => faker.company.name().slice(0, 20), // Generate random company name
  value: () => faker.commerce.price(), // Generate random prices
  status: () =>
    ["unpaid", "pending", "paid", "declined"][Math.floor(4 * Math.random())], // Random one of the four statuses
});

// FACTORY USER
factory.define("user", User, {
  name: () => faker.person.fullName().slice(0, 20),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});


// SEED DATABASE
const seed_db = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    await Item.deleteMany({}); // deletes all item records
    await User.deleteMany({}); // and all the users
    testUser = await factory.create("user", { password: testUserPassword });
    await factory.createMany("item", 20, { createdBy: testUser._id }); // put 20 item entries in the database.
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
