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

describe("/register", function () {
  // it("Check the api without parameters . failure case", function (done) {
  //   chai
  //     .request("http://localhost:8000")
  //     .post("/users/register")
  //     .send({})
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       expect(res).to.have.status(401);
  //       done();
  //     });
  // });

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

describe("/getProductsList", function () {
  it("it should fetch all the products", function (done) {
    chai
      .request("http://localhost:8000")
      .get("/products/getProductsList")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/getAvailableBuyerProductsList", function () {
  it("it should fetch all the available products for the buyer", function (done) {
    chai
      .request("http://localhost:8000")
      .get("/products/getAvailableBuyerProductsList")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/stockList", function () {
  it("it should fetch all the left stock list for the buyer", function (done) {
    chai
      .request("http://localhost:8000")
      .get("/products/stockList")
      .end(function (err, res) {
        expect(res).to.have.status(200);

        done();
      });
  });
});

describe("/filterProducts", function () {
  it("it should fetch all the filter products", function (done) {
    chai
      .request("http://localhost:8000")
      .get("/products/filterProducts?category=electronics")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
// describe("/updateProductStatus/:id", function () {
//   it("It should log in user", function (done) {
//     chai
//       .request("http://localhost:8000")
//       .put("/updateProductStatus/:64d0be05b74727af00d28b5e")
//       .send({

//         availability: "Available"
//       })
//       .end(function (err, res) {
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });
