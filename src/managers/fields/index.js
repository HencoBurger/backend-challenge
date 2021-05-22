'use strict';

const sqlite = require('../../db/sqlite.js');

const minRequired = ['type', 'name'];

/**
 * Validate minimum require fields
 * @param {Array} requireFields Fields require
 * @param {Object} data Properties to validate
 * @returns Object
 */
const validateFields = (requireFields, data) => {
    
    let errorFields = {};
    for (let key of requireFields) {
        if (data[key] === null) {
            // Capitalize property name
            let keyName = `${key[0].toUpperCase()}${key.slice(1)}`;
            errorFields[key] = `${keyName} is required`;
        }
    }

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
 * Get all fields from DB
 * @returns 
 */
const get = async () => {

    const fields = await sqlite
        .from("fields")
        .select("*");

    return fields;
}

/**
 * Save new fields to DB
 * @param {String} type 
 * @param {String} name 
 * @param {Number} required 
 * @param {String} pattern 
 * @param {Object} fields 
 * @returns 
 */
const create = async (type = null, name = null, required = null, pattern = null, fields = null) => {
    let field = null;

    let dataToSave = {
        type: type,
        name: name,
        required: required,
        pattern: pattern,
        fields: (fields === null) ? fields : JSON.stringify(fields)
    }

    // Validate minimum fields require
    const requiredFields = validateFields(minRequired, {
        type,
        name
    });

    if (!requiredFields.isValid) {
        throw {
            'status': 400,
            'msg': 'Missing fields',
            'errors': requiredFields.errorFields
        }
    }

    try {
        field = await sqlite.insert(dataToSave).into('fields');
    } catch (e) {
        
        let error = {
            'status': 400
        };
        // Throw exception on "UNIQUE constraint"
        if (`${e}`.search("UNIQUE constraint") !== 0) {
            error.msg = `Looks like there is a duplicate field.`;
            error.errors = {
                name: `Duplicate "${name}" field.`
            };
        } else {
            error.msg = `Something went wrong, please contact support.`;
        }

        throw error;
    }
    
    dataToSave.id = field[0];

    return dataToSave;
}

/**
 * Update saved field in DB
 * @param {String} type 
 * @param {String} name 
 * @param {Number} required 
 * @param {String} pattern 
 * @param {Object} fields 
 * @returns 
 */
const update = async (fieldId, type = null, name = null, required = null, pattern = null, fields = null) => {
    let field = null;

    let dataToSave = {
        type: type,
        name: name,
        required: required,
        pattern: pattern,
        fields: (fields === null) ? fields : JSON.stringify(fields)
    }

    // Validate minimum fields require
    const requiredFields = validateFields(minRequired, {
        type,
        name
    });

    if (!requiredFields.isValid) {
        throw {
            'status': 400,
            'msg': 'Missing fields',
            'errors': requiredFields.errorFields
        }
    }

    try {
        field = await sqlite
            .table('fields')
            .where({
                id: fieldId
            })
            .update(dataToSave);
    } catch (e) {
        let error = {
            'status': 400
        };
        // Throw exception on "UNIQUE constraint"
        if (`${e}`.search("UNIQUE constraint") !== 0) {
            error.msg = `Looks like there is a duplicate field.`;
            error.errors = {
                name: `Duplicate "${name}" field.`
            };
        } else {
            error.msg = `Something went wrong, please contact support.`;
        }

        throw error;
    }
    
    dataToSave.id = fieldId;

    return dataToSave;
}

/**
 * Delete field from DB
 * @param {String} type 
 * @param {String} name 
 * @param {Number} required 
 * @param {String} pattern 
 * @param {Object} fields 
 * @returns 
 */
const remove = async (fieldId) => {
    if (!fieldId ?? true) throw {
        'status': 400,
        'msg': 'Field Id required.'
    }

    try {
        await sqlite
            .table('fields')
            .where({
                id: fieldId
            })
            .del();
    } catch (e) {
        throw {
            'status': 400,
            'msg': `Something went wrong, please contact support.`
        };
    }

    return {
        'removed': true
    };
}


module.exports = {
    get,
    create,
    update,
    remove
}