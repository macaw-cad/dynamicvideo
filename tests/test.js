const Questionnaire = require('../models/questionnaire');
const request = require('supertest');
const app = require('../app');
const Logger = require('../helpers/logger');

describe('Questionnaire', function () {
    let q = new Questionnaire();

    test('should parse json', function () {
        expect(() => {
            q.parseFileToJson('data/data.json');
        }).not.toThrow();
    });

    test('should not parse json when source file is corrupt', function () {
        expect(() => {
            q.parseFileToJson('data/data-error-parse.json')
        }).toThrow(Error('Couldn\'t parse the JSON'));
    });

    test('should throw error when file does not exist', function () {
        let filepath = 'path-which-doesnt-exist';

        expect(() => {
            q.parseFileToJson(filepath);
        }).toThrow(Error('Couldn\'t read the file ' + filepath));
    });


    test('should get an error on a question without description', function () {
        expect(() => {
            let p = new Questionnaire();
            p.parseFileToJson('data/data-error-q1-nodescription.json')
            p.parseJsonToQuestionList();
        }).toThrow(Error('_description is not set on question 1'));
    });
});

describe('Answer', function () {
    test('should parse JSON to a valid answer', function () {


    });
});

describe('AnswerList', function () {
    let q = new Questionnaire();

    test('should only contain answers', function () {
        expect(() => {
            q.parseFileToJson('data/data.json');
            q.parseJsonToAnswerList()
        }).not.toThrow(Error('Couldn\'t parse JSON in the main data.json file.'));


        for (const aIndex in q.answerList.answers) {
            const answer = q.answerList.answers[aIndex]

            expect(answer.constructor.name).toBe('Answer');
        }
    });
});

describe('Tag', function () {
    let q = new Questionnaire();

    test('', function () {
        q.parseFileToJson('data/data.json');
        q.parseJsonToQuestionList();
        q.parseJsonToAnswerList();
        q.parseJsonToTagList();

        q.tagList.tags[0].count = 2;
        q.tagList.tags[1].playCount = 10;
        q.tagList.tags[3].count = 1;

        expect(q.tagList.getBestTag()).toBe(q.tagList.tags[0]);
    });
});

describe('Test the server', () => {
    test('Should response to the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('Should give JSON as response in API', (done) => {
        request(app).post('/api/v1/send-answer').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
            done();
        });
    });

    test('Should give an error while not sending information', (done) => {
        request(app).post('/api/v1/send-answer').then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No answer ID given');
            done();
        });
    });
});