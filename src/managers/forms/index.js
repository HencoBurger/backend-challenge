'use strict';

const sqlite = require('../../db/sqlite.js');

const minRequired = ['type', 'name'];

/**
 * Validate fields using the required field validations, return fields errors
 * @param {Array} fields 
 * @param {Object} data 
 * @returns Object of errors
 */
const validFields = (fields, data) => {
    let errorFields = {};

    for (let key in data) {
        let dataItem = data[key];
        let field = fields.find((f) => f.name === key);
        if (typeof field !== 'undefined') {
            // Is required field check
            if (
                field.required === 1 &&
                dataItem === ''
            ) {
                let keyName = `${key[0].toUpperCase()}${key.slice(1)}`;
                errorFields[key] = `${keyName} is required.`;
            } else {
                // Type check
                switch (field.type) {
                    case 'date':
                        let isDate = Date.parse(dataItem);
                        if (isNaN(isDate)) {
                            let keyName = `${key[0].toUpperCase()}${key.slice(1)}`;
                            errorFields[key] = `${keyName} is not a valid Date format.`;
                        }
                        break;
                    case 'email':
                        const testEmail = new RegExp(field.pattern);
                        if (!testEmail.test(dataItem)) {
                            let keyName = `${key[0].toUpperCase()}${key.slice(1)}`;
                            errorFields[key] = `${keyName} is not a valid email.`;
                        }
                        break;
                }
            }
        } else {
            // Check nested data
            let nested = validFields(fields, dataItem);
            for (let nKey in nested) {
                errorFields[`${key}.${nKey}`] = nested[nKey];
            }
        }
    }
    return errorFields;
}

/**
 * Initiate form validation
 * @param {Array} fields 
 * @param {Object} data 
 * @returns 
 */
const validateForm = (fields, data) => {
    let errorFields = validFields(fields, data);

    return {
        get isValid() {
            return (Object.keys(errorFields).length > 0) ? false : true;
        },
        get errorFields() {
            return errorFields;
        }
    }
}

/**
 * Parse data ready for the DB save
 * @param {Object} data 
 * @returns 
 */
const parseDataForDb = (data) => {
    let parsedData = [];
    let timestamp = Date.now();
    for (let key in data) {
        let item = data[key];
        let parseItem = {
            'form_id': timestamp,
            'key': '',
            'value': ''
        }
        if (item instanceof Object) {
            data[key] = JSON.stringify(item);
            parseItem.key = key;
            parseItem.value = JSON.stringify(item);
        } else {
           parseItem.key = key;
           parseItem.value = item;
        }
        parsedData.push(parseItem);
    }

    return parsedData;
}

/**
 * Get the fields to validate from the submitted data
 * @param {Object} data 
 * @returns 
 */
const getFields = (data) => {
    let fieldKeys = [];

    for (let key in data) {
        if (data[key] instanceof Object) {
            let nested = getFields(data[key]);
            fieldKeys = [...fieldKeys, ...nested];
        } else {
            fieldKeys.push(key);
        }
    }

    return fieldKeys;
}

/**
 * Query database using array of fields submited
 * @param {Array} fieldNames 
 * @returns 
 */
const getFieldsDb = async (fieldNames) => {
    const fields = await sqlite
        .table('fields')
        .whereIn('name', fieldNames);

    return fields;
}

/**
 * Save submitted form to DB
 * @param {Object} data 
 * @returns 
 */
const submit = async (data) => {
    let savedForm = null

    const foundFields = getFields(data);
    const fields = await getFieldsDb(foundFields);
    let valid = validateForm(fields, data);

    if (!valid.isValid) {
        throw {
            'status': 400,
            'msg': 'Following fields have errors.',
            'collection': valid.errorFields
        }
    }

    let dataToSave = parseDataForDb(data);

    try {
        savedForm = await sqlite.insert(dataToSave).into('forms');
    } catch (e) {
        console.log(e);
        throw {
            'status': 400,
            'msg': `Something went wrong, please contact support.`
        };
    }

    data.id = savedForm[0];

    return data;
}

module.exports = {
    submit
}