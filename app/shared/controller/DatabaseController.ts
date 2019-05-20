import * as fs from "fs";

class DatabaseController {
    public async getAll(currentModel, condition) {
        return new Promise((resolve, reject) => {
            currentModel
                .findAndCountAll(condition)
                .then(data => {
                    let status = Object.keys(data).length > 0;
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
                    let status = Object.keys(data).length > 0;
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
                        status: 200,
                        msg: "Data added scucessfully"
                    });
                    return { status: 200, data: resData };
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
                        status: 200,
                        msg: "Data updated scucessfully"
                    });
                    return { status: 200, data: resData };
                })
                .catch(err => {
                    resolve({ data: err, status: false, msg: err.message });
                });
        }).catch(err => err);
    }
}
export default DatabaseController;
