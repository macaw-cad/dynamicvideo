const Questionnaire = require('../models/questionnaire');
const Tag = require('../models/tag');
const Answer = require('../models/answer');
const Question = require('../models/question');
const StreamHelper = require('../helpers/streamHelper');
const FileHelper = require('../helpers/fileHelper');

const request = require('supertest');
const app = require('../app');
const fs = require('fs');

// First create the video folder, otherwise the server will return 500 errors
const videoDir = global.rootDirectory + '/video/';
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir);
}

describe('Questionnaire', function () {
    let q = new Questionnaire();

    test('Should parse json', function () {
        expect(() => {
            q.parseFileToJson('data/data.json');
        }).not.toThrow();
    });

    test('Should not parse json when source file is corrupt', function () {
        expect(() => {
            q.parseFileToJson('data/data-error-parse.json')
        }).toThrow(Error('Couldn\'t parse the JSON'));
    });

    test('Should throw error when file does not exist', function () {
        let filepath = 'path-which-doesnt-exist';

        expect(() => {
            q.parseFileToJson(filepath);
        }).toThrow(Error('Couldn\'t read the file ' + filepath));
    });


    test('Should get an error on a question without description', function () {
        expect(() => {
            let p = new Questionnaire();
            p.parseFileToJson('data/data-error-q1-nodescription.json')
            p.parseJsonToQuestionList();
        }).toThrow(Error('_description is not set on question 1'));
    });
});

describe('AnswerList', function () {
    let q = new Questionnaire();

    test('Should only contain answers', function () {
        expect(() => {
            q.parseFileToJson('data/data.json');
            q.parseJsonToAnswerList()
        }).not.toThrow(Error('Couldn\'t parse JSON in the main data.json file.'));


        for (const aIndex in q.answerList.answers) {
            const answer = q.answerList.answers[aIndex]

            expect(answer.constructor.name).toBe('Answer');
        }
    });

    test('Should find the correct Answer in the AnswerList', function () {
        const newAnswer = new Answer({id: 999, desc: 'totally-sample-answer', tags: ['sample-tag']});
        expect(() => {
            q.parseFileToJson('data/data.json');
            q.parseJsonToQuestionList();
            q.parseJsonToTagList();
            q.answerList.addAnswer(newAnswer);
        }).not.toThrow(Error('Couldn\'t parse JSON in the main data.json file.'));

        expect(q.answerList.find('string')).toBeUndefined();
        expect(q.answerList.find(999)).toBe(newAnswer);
    });

});

describe('Answer', function () {
    test('Should create Answer object without errors', function () {
        const json = {
            id: 5,
            desc: 'adventure',
            tags: ['tag-1', 'tag-2']
        };
        const answer = new Answer(json);

        expect(answer._isValid()).toBe(true);
        expect(answer.description).toBe('adventure');
        expect(answer.id).toBe(5);
    });

    test('Should throw an error if information is missing', function () {
        const json = {
            id: 5
        };

        expect(() => {
            const answer = new Answer(json);
        }).toThrow();
    });
});

describe('Question', function () {
    test('Should create Question object without errors', function () {
        const json = {
            id: 5,
            desc: 'adventure',
            based_on: 'test',
            answers: [0, 1]
        };
        const question = new Question(json);

        expect(question._isValid()).toBe(true);
        expect(question.description).toBe('adventure');
        expect(question.basedOn).toBe('test');
        expect(question.asked).toBeUndefined();
        expect(question.id).toBe(5);
    });

    test('Should throw an error if information is missing', function () {
        const json = {
            id: 5,
            description: 'adventure'
        };

        expect(() => {
            const question = new Question(json);
        }).toThrow();
    });
});

describe('Tag', function () {
    let q = new Questionnaire();

    test('Should get the best tag available', function () {
        q.parseFileToJson('data/data.json');
        q.parseJsonToQuestionList();
        q.parseJsonToAnswerList();
        q.parseJsonToTagList();

        q.tagList.tags[0].count = 2;
        q.tagList.tags[1].playCount = 10;
        q.tagList.tags[3].count = 1;

        expect(q.tagList.getBestTag()).toBe(q.tagList.tags[0]);
    });

    test('Should find the correct tag in the TagList', function () {
        const newTag = new Tag({id: 999, title: 'totally-sample-tag'});
        expect(() => {
            q.tagList.addTag(newTag);
        }).not.toThrow(Error('Couldn\'t parse JSON in the main data.json file.'));

        expect(q.tagList.find('asdfsdfasdfasdf')).toBeUndefined();
        expect(q.tagList.find('totally-sample-tag')).toBe(newTag);
    });

    test('Should create Tag object without errors', function () {
        const json = {
            id: 5,
            title: 'adventure'
        };
        const tag = new Tag(json);

        expect(tag._isValid()).toBe(true);
        expect(tag.title).toBe('adventure');
        expect(tag.id).toBe(5);
    });

    test('Should throw an error if information is missing', function () {
        const json = {
            id: 5
        };

        expect(() => {
            const tag = new Tag(json);
        }).toThrow();
    });
});

describe('FileHelper and StreamHelper', () => {
    if (!global.rootDirectory) {
        throw new Error('Global variable rootDirectory is not set.');
    }

    test('Should not change a video playlist when scene is not available', function () {
        const sessId = 'sample-session-id';
        const sh = new StreamHelper();

        expect(sh.changeScene('abcdef', sessId)).toBe(false);
    });

    test('Should create a the root playlist with expected contents', function () {
        const sessId = 'sample-session-id';
        const fh = new FileHelper();
        const expectedOutput = 'ffconcat version 1.0\n' +
            'file ' + sessId + '_playlist.txt\n' +
            'file ' + sessId + '.txt';

        expect(() => {
            fh.buildRootPlaylist(sessId)
        }).not.toThrow();

        const output = fs.readFileSync(global.rootDirectory + '/video/' + sessId + '.txt', 'utf-8');

        expect(output).toBe(expectedOutput);
    });

    test('Should not throw an error when getting all files from the video folder', function () {
        const fh = new FileHelper();

        expect(() => {
            fh.getAllFilesFromFolder(global.rootDirectory + '/video/');
        }).not.toThrow();
    });

    test('Should throw an error when getting all files from a non-existent folder', function () {
        const fh = new FileHelper();
        const dir = global.rootDirectory + '/totally-a-non-existing-folder/';

        expect(() => {
            fh.getAllFilesFromFolder(dir);
        }).toThrow(Error(dir + ' - folder not found'));
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

    test('Should give an error when not sending information', (done) => {
        request(app).post('/api/v1/send-answer').then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('No answer ID given');
            done();
        });
    });

    test('Should give 404 error when requesting a non-existing page', (done) => {
        request(app).post('/please-give-me-a-404-error').then((response) => {
            expect(response.statusCode).toBe(404);
            done();
        });
    });
});