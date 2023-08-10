//During the test the env variable is set to test
NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
should = chai.should();
request = require("supertest");

var expect = chai.expect;
chai.use(chaiHttp);

describe("Test", function () {
  it("Simple test", function (done) {
    chai
      .request("http://localhost:8000")
      .get("/")
      .end(function (err, res) {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/register", function () {
  it("it should register with required fields", function (done) {
    chai
      .request("http://localhost:8000")
      .post("/users/register")
      .send({
        name: "Vaishnavi Ambolkar",
        email: "Vaishnavi123@gmail.com",
        password: "Vaishu@022",
        address: "address",
        zip: "32142",
        isAdmin: 0,
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/login", function () {
  it("It should log in user", function (done) {
    chai
      .request(server)
      .post("/users/login")
      .send({
        email: "Vaishnavi123@gmail.com",
        password: "Vaishu@022",
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/cart", function () {
  it("it should add products to the cart", function (done) {
    chai
      .request("http://localhost:8000")
      .post("/carts/cart")
      .send({
        productId: 2,
        title: "Jeans",
        description: "Fashion",
        price: 700,
        category: "women",
        subCategory: "",
        discount: 300,
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
