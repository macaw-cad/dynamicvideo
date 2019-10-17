var assert = require('assert');
var Questionnaire = require('../models/questionnaire');

describe('Questionnaire', function () {
    let q = new Questionnaire();

    it('should parse json', function() {
        try {
            q.parseFileToJson('data/data-error-q1-nodescription.json');
            assert.ok('Works as expected.');
        } catch(e) {
            assert.fail('Couldn\'t parse JSON file');
        }
    });

    it('should not parse json when source file is corrupt', function() {
        try {
            q.parseFileToJson('data/data-error-parse.json');
            assert.fail('Shouldn\'t pass this function');
        } catch(e) {
            assert.deepStrictEqual(e, Error('Couldn\'t parse the JSON'));
        }
    });

    it('should throw error when file does not exist', function() {
        let filepath = 'path-doesnt-exist';
        try {
            q.parseFileToJson(filepath);
            assert.fail('Shouldn\'t pass this function');
        } catch(e) {
            assert.deepStrictEqual(e, Error('Couldn\'t read the file ' + filepath));
        }
    });


    it('should get an error on a question without description', function () {
        try {
            q.parseJsonToQuestions();
        } catch (e) {
            assert.deepStrictEqual(e, Error('_description is not set on question 1'));
        }

    });
});

describe('Answer', function () {
    it('should parse JSON to a valid answer', function () {


    });
});

describe('AnswerList', function () {
    it('should only contain answers', function () {


    });
});