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

/*
 * Test the /POST route
 */
describe("/POST register", function() {
  it("it should not register without required fields", function(done) {
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

describe("Login API", () => {
  describe("/users/login", function () {
    it("responds with status 200", function (done) {
      chai
        .request(server)
        .post("/users/login")
        .send( {
            email: "Vaishnavi123@gmail.com",
            password: "Vaishu@022",
          })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
