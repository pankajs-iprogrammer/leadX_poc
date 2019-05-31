import * as fs from "fs";
import { CONSTANTS } from "../../config/constants";

class DatabaseController {
    public async getAll(currentModel, condition) {
        console.log("+++++ condition +++++", condition);
        return new Promise((resolve, reject) => {
            currentModel
                .findAndCountAll(condition)
                .then(data => {
                    console.log("+++++ data +++++", data);
                    const status = Object.keys(data).length > CONSTANTS.ZERO;
                    resolve({
                        data: data,
                        status: status,
                        msg: status ? "Data found." : "Data not found"
                    });
                })
                .catch(err => {
                    resolve({ data: err, status: false, msg: err.message });
                });
        }).catch(err => err);
    }

    public async getOne(currentModel, condition = {}) {
        return new Promise((resolve, reject) => {
            currentModel
                .findOne(condition)
                .then(data => {
                    const status = Object.keys(data).length > CONSTANTS.ZERO;
                    resolve({
                        data: data,
                        status: status,
                        msg: status ? "Data found." : "Data not found"
                    });
                })
                .catch(err => {
                    resolve({ data: err, status: false, msg: err.message });
                });
        }).catch(err => err);
    }

    public async getById(currentModel, id) {
        return new Promise((resolve, reject) => {
            currentModel
                .findById(id)
                .then(data => {
                    const status = Object.keys(data).length > CONSTANTS.ZERO;
                    resolve({
                        data: data,
                        status: status,
                        msg: status ? "Data found." : "Data not found"
                    });
                })
                .catch(err => {
                    resolve({ data: err, status: false, msg: err.message });
                });
        }).catch(err => err);
    }

    public async createData(currentModel, reqBody) {
        return new Promise((resolve, reject) => {
            currentModel
                .create(reqBody)
                .then(resData => {
                    resolve({
                        data: resData,
                        status: CONSTANTS.SUCCESSCODE,
                        msg: "Data added successfully"
                    });
                    return { status: CONSTANTS.SUCCESSCODE, data: resData };
                })
                .catch(err => {
                    resolve({
                        data: err,
                        status: false,
                        msg: err.message
                    });
                });
        }).catch(err => err);
    }

    public async updateData(currentModel, reqBody, condition = {}) {
        return new Promise((resolve, reject) => {
            currentModel
                .update(reqBody, condition)
                .then(resData => {
                    resolve({
                        data: resData,
                        status: CONSTANTS.SUCCESSCODE,
                        msg: "Data updated successfully"
                    });
                    return { status: CONSTANTS.SUCCESSCODE, data: resData };
                })
                .catch(err => {
                    resolve({ data: err, status: false, msg: err.message });
                });
        }).catch(err => err);
    }
}
export default DatabaseController;
