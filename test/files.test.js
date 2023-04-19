const app = require('../index');

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Router /files', () => {
    describe('GET /files/data', () => {
        it('Should return a list of parsed elements', (done) => {
            chai.request(app)
                .get('/files/data')
                .end((_err, res) => {
                    expect(res).to.have.status(200);

                    const data = res.body;

                    expect(data).to.be.a('array');

                    data.forEach((element) => {
                        expect(element).to.have.own.property('file');
                        expect(element).to.have.own.property('lines');
                        expect(element.lines).to.be.a('array');
                        element.lines.forEach((line) => {
                            ['text', 'number', 'hex'].forEach((expectedProperty) => {
                                expect(line).to.have.own.property(expectedProperty);
                                expect(line[expectedProperty]).to.exist;
                            });
                        });
                    });

                    done();
                });
        });

        const expectedElementToBeFound = 'test1.csv';

        it(`Should return a list with only one element when querying for "${expectedElementToBeFound}"`, (done) => {
            chai.request(app)
                .get(`/files/data?fileName=${expectedElementToBeFound}`)
                .end((_err, res) => {
                    expect(res).to.have.status(200);

                    const data = res.body;

                    expect(data).to.be.a('array');

                    expect(data.length).to.be.equal(1);

                    data.forEach((element) => {
                        expect(element.file).to.be.equal(expectedElementToBeFound);
                    });

                    done();
                });
        });

        const expectedElementToNotBeFoundBecauseRetrievalError = 'test4.csv';
        const expectedElementToNotBeFoundBecauseItIsUnexistent = 'whatever.csv';

        it(`Should return an empty list when querying for "${expectedElementToNotBeFoundBecauseRetrievalError}" or "${expectedElementToNotBeFoundBecauseItIsUnexistent}"`, async () => {
            const requester = chai.request(app).keepOpen();

            const responses = await Promise.all([
                requester.get(`/files/data?fileName=${expectedElementToNotBeFoundBecauseRetrievalError}`),
                requester.get(`/files/data?fileName=${expectedElementToNotBeFoundBecauseItIsUnexistent}`),
            ]);

            responses.forEach((resp) => {
                expect(resp).to.have.status(200);

                const data = resp.body;

                expect(data).to.be.a('array');

                expect(data.length).to.be.equal(0);
            });

            requester.close();
        });
    });

    describe('GET /files/list', () => {
        it('Should return a list with all available files for downloading', (done) => {
            chai.request(app)
                .get('/files/list')
                .end((_err, res) => {
                    expect(res).to.have.status(200);

                    const data = res.body;

                    expect(data.files).to.be.a('array');

                    data.files.forEach((filePath) => {
                        expect(filePath).to.be.a('string');
                    });

                    done();
                });
        });
    });
});
