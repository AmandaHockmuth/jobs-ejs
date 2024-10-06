const puppeteer = require("puppeteer");
require("../app");
const get_chai = require("../util/get_chai");
const { seed_db, testUserPassword } = require("../util/seed_db");
const Item = require("../models/Item");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    //await sleeper(5000)
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector(
        "a ::-p-text(Click this link to logon)"
      );
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(20000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
      await page.waitForSelector("a ::-p-text(change the Secret)");
      await page.waitForSelector('a[href="/secretWord"]');
      // const copyr = await page.waitForSelector("p ::-p-text(copyright)");
      // const copyrText = await copyr.evaluate((el) => el.textContent);
      // console.log("copyright text: ", copyrText);
    });
  });
  describe("puppeteer crud operations", function () {
    this.timeout(10000);
    it("clicks the link for the budget list", async () => {
      const { expect } = await get_chai();
      this.itemsLink = await page.waitForSelector(
        "a ::-p-text(Click this link to view/change Budget Items)"
      );
      await this.itemsLink.click();
      await page.waitForNavigation();
      const content = await page.content();
      const pageParts = content.split("<tr>");
      expect(pageParts.length).to.equal(21);
    });
    it("accesses the add item form", async () => {
      const { expect } = await get_chai();
      this.addItemsButton = await page.waitForSelector(
        'a[href="/api/v1/items/new"]'
      );

      await this.addItemsButton.click();
      await page.waitForNavigation();
      const content = await page.content();
      expect(content).to.include("Item Title:");

      this.itemTitle = await page.waitForSelector('input[name="title"]');
      this.value = await page.waitForSelector('input[name="value"]');
      this.status = await page.waitForSelector('select[name="status"]');
      this.submitItem = await page.waitForSelector("button ::-p-text(Submit)");
    });
    it("adds a new item", async () => {
      const { expect } = await get_chai();
      await this.itemTitle.type("NEW BUDGET ITEM");
      await this.value.type("100");
      await this.submitItem.click();
      await page.waitForNavigation();
      const content = await page.content();
      expect(content).to.include("Budget Items List");
    });
  });
});
