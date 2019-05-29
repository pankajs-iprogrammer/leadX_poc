import ContactPersonModel from "../app/components/contact/person.model";
import { CONSTANTS } from "../app/config/constants";
const port = process.env.PORT || CONSTANTS.STATICPORT;
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
import ReqBody from "./inputs";
const req = new ReqBody();
chai.use(chaiHttp);
const URL = "http://ec2-18-220-73-73.us-east-2.compute.amazonaws.com:" + port;

describe("Unit Testing - module Contact", () => {
    describe("Test Contact_Person", () => {
        describe("/api/contact/person/get", () => {
            it("it should List all the contact person", done => {
                chai.request(URL)
                    .post("/api/contact/person/get")
                    .send(req.getAllContactPerson())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        done();
                    });
            });
        });
        describe("/api/contact/person/getOne", () => {
            it("it should Get the contact person by the given id", done => {
                chai.request(URL)
                    .post("/api/contact/person/getOne")
                    .send(req.getContactPersonOne())
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
                chai.request(URL)
                    .post("/api/contact/person/add")
                    .send(req.addContactPerson())
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
                chai.request(URL)
                    .delete("/api/contact/person/delete")
                    .send(req.deleteContactPerson())
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
                chai.request(URL)
                    .put("/api/contact/person/update")
                    .send(req.updateContactPerson())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.equal("Data updated successfully");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
    });

    describe("Test Contact_Company", () => {
        describe("/api/contact/company/get", () => {
            it("it should List all the contact company", done => {
                chai.request(URL)
                    .post("/api/contact/company/get")
                    .send(req.getAllContactCompany())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        done();
                    });
            });
        });
        describe("/api/contact/company/getOne", () => {
            it("it should Get the contact company by the given id", done => {
                chai.request(URL)
                    .post("/api/contact/company/getOne")
                    .send(req.getContactCompanyOne())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.data.id.should.not.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/company/add", () => {
            it("it should Create the contact company", done => {
                chai.request(URL)
                    .post("/api/contact/company/add")
                    .send(req.addContactCompany())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/company/delete", () => {
            it("it should Delete the contact company by the given id", done => {
                chai.request(URL)
                    .delete("/api/contact/company/delete")
                    .send(req.deleteContactCompany())
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.should.equal("Data updated successfully");
                        res.body.errorMessage.should.equal("");
                        done();
                    });
            });
        });
        describe("/api/contact/company/update", () => {
            it("it should Update the contact company by the given the id", done => {
                chai.request(URL)
                    .put("/api/contact/company/update")
                    .send(req.updateContactCompany())
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
describe("Unit Testing - module Master", () => {
    describe("/api/master/territory/country", () => {
        it("it should List all the master country", done => {
            chai.request(URL)
                .post("/api/master/territory/country")
                .send(req.getAllMasterCountry())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/territory/country/state", () => {
        it("it should List all the master state of selected country", done => {
            chai.request(URL)
                .post("/api/master/territory/country/state")
                .send(req.getAllMasterState())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/territory/country/state/city", () => {
        it("it should List all the master city of selected state and country", done => {
            chai.request(URL)
                .post("/api/master/territory/country/state/city")
                .send(req.getAllMasterCity())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getMstLeadStatus", () => {
        it("it should List all the master lead status", done => {
            chai.request(URL)
                .post("/api/master/getMstLeadStatus")
                .send(req.getAllMasterLeadStatus())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getMstActivityType", () => {
        it("it should List all the master activity type", done => {
            chai.request(URL)
                .post("/api/master/getMstActivityType")
                .send(req.getAllMasterActivityType())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getMstCurrency", () => {
        it("it should List all the master currency", done => {
            chai.request(URL)
                .post("/api/master/getMstCurrency")
                .send(req.getAllMasterCurrency())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getMstLeadSource", () => {
        it("it should List all the master lead source", done => {
            chai.request(URL)
                .post("/api/master/getMstLeadSource")
                .send(req.getAllMasterLeadSource())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getRoles", () => {
        it("it should List all the master roles", done => {
            chai.request(URL)
                .post("/api/master/getRoles")
                .send(req.getAllMAsterRoles())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/master/getLicenseType", () => {
        it("it should List all the master license type", done => {
            chai.request(URL)
                .post("/api/master/getLicenseType")
                .send(req.getAllMasterlicenseType())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
});
describe("Unit Testing - module Lead", () => {
    describe("/api/lead/add", () => {
        it("it should Create lead", done => {
            chai.request(URL)
                .post("/api/lead/add")
                .send(req.addNewLead())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/lead/update", () => {
        it("it should Update the lead by the given the id", done => {
            chai.request(URL)
                .put("/api/lead/update")
                .send(req.updateLead())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.equal("Data updated successfully");
                    res.body.errorMessage.should.equal("");
                    done();
                });
        });
    });
    describe("/api/lead/getList", () => {
        it("it should List all leads", done => {
            chai.request(URL)
                .post("/api/lead/getList")
                .send(req.getAllLeadList())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/lead/getOne", () => {
        it("it should Get the lead by the given id", done => {
            chai.request(URL)
                .post("/api/lead/getOne")
                .send(req.getLeadOne())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    // res.body.data.id.should.not.equal("");
                    done();
                });
        });
    });
});
describe("Unit Testing - module SalesFeed", () => {
    describe("/api/salesFeed/get", () => {
        it("it should List all sales feed", done => {
            chai.request(URL)
                .post("/api/salesFeed/get")
                .send(req.getAllSalesFeed())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
});
describe("Unit Testing - module SalesNews", () => {
    describe("/api/salesNews/get", () => {
        it("it should List all the sales news", done => {
            chai.request(URL)
                .post("/api/salesNews/get")
                .send(req.getAllSalesNewsList())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe("/api/salesNews/getOne", () => {
        it("it should Get the sales news by the given id", done => {
            chai.request(URL)
                .post("/api/salesNews/getOne")
                .send(req.getSalesNewsOne())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.data.id.should.not.equal("");
                    done();
                });
        });
    });
    describe("/api/salesNews/add", () => {
        it("it should Create the sales news", done => {
            chai.request(URL)
                .post("/api/salesNews/add")
                .send(req.addNewSalesNews())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.errorMessage.should.equal("");
                    done();
                });
        });
    });
    describe("/api/salesNews/update", () => {
        it("it should Update the sales news by the given the id", done => {
            chai.request(URL)
                .put("/api/salesNews/update")
                .send(req.updateSalesNews())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.equal("Data updated successfully");
                    res.body.errorMessage.should.equal("");
                    done();
                });
        });
    });
    describe("/api/salesNews/delete", () => {
        it("it should Delete the sales news by the given id", done => {
            chai.request(URL)
                .delete("/api/salesNews/delete")
                .send(req.deleteSalesNews())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.equal("Data updated successfully");
                    res.body.errorMessage.should.equal("");
                    done();
                });
        });
    });
    describe("/api/salesNews/getById", () => {
        it("it should Get the sales news by the given id (no array filter)", done => {
            chai.request(URL)
                .post("/api/salesNews/getById")
                .send(req.getSalesNewsById())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.data.id.should.not.equal("");
                    done();
                });
        });
    });
});
