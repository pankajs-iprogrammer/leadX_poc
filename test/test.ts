import ContactPersonModel from "../app/components/contact/person.model";
// import * as chai from "chai";
// import chaiHttp from "chai-http";
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const URL = "http://localhost:8888";
describe("Unit Testing - module Contact", () => {
    describe("Test Contact_Person", () => {
        describe("/api/contact/person/get", () => {
            it("it should List all the contact person", done => {
                const req = {
                    arrayFilters: [{ is_deleted: 0 }],
                    selectFilters: [],
                    sort: {
                        field: "name",
                        sortOrder: "ASC"
                    },
                    paginate: {
                        page: 0,
                        limit: 100
                    }
                };
                chai.request(URL)
                    .post("/api/contact/person/get")
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        done();
                    });
            });
        });
        describe("/api/contact/person/getOne", () => {
            it("it should Get the contact person by the given id", done => {
                const req = {
                    arrayFilters: [{ is_deleted: 0, id: 5 }],
                    selectFilters: [],
                    sort: {
                        field: "name",
                        sortOrder: "ASC"
                    }
                };
                chai.request(URL)
                    .post("/api/contact/person/getOne")
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.data.id.should.not.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/person/add", () => {
            it("it should Create the contact person", done => {
                let AddPerson = {
                    name: "AshwiniB",
                    company_id: "2",
                    phone_number: "122225555",
                    email: "xyz@gmail.com",
                    address_line_1: "BH Road1",
                    address_line_2: "Near FG chaouk",
                    country_id: "36",
                    state_id: "311",
                    city_id: "55",
                    notes: "noted"
                };
                chai.request(URL)
                    .post("/api/contact/person/add")
                    .send(AddPerson)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/person/delete", () => {
            it("it should Delete the contact person by the given id", done => {
                const DeletePerson = {
                    id: "10",
                    is_deleted: "1"
                };
                chai.request(URL)
                    .delete("/api/contact/person/delete")
                    .send(DeletePerson)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.equal("Data updated successfully");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/person/update", () => {
            it("it should Update the contact person by the given the id", done => {
                const UpdatePerson = {
                    id: "27",
                    name: "Monika M",
                    company_id: "15",
                    phone_number: "122225555",
                    email: "xyz@gmail.com",
                    address: "ddd qqq eee",
                    country_id: "3",
                    state_id: "311",
                    notes: "frr dvnh f"
                };
                chai.request(URL)
                    .put("/api/contact/person/update")
                    .send(UpdatePerson)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.equal("Data updated successfully");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
    });
});
