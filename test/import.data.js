/**
 * Import Data into ElasticSearch
 */
const test = require('ava')
const config = require('../config/environment')
const logger = require('../services/logging.service').getLogger('import.data')
const _ = require('lodash')
const topicData = require(config.root + '/data/data.topics.json')
const esclient = require(config.root + '/services/elasticsearch.service')

test.skip('Import Data into ElasticSearch', async t => {
    logger.debug('test')
    let topicKeys = _.keys(topicData)
    for (let topicEleKey of topicKeys) {
        logger.debug('key:', topicEleKey)
        let topicEleData = topicData[topicEleKey]
        let topicEleName = topicEleData.name
        let topicEleQuestions = topicEleData.questions
        let topicEleQuestionsKeys = _.keys(topicEleQuestions)
        for (let topicEleQuestionsId of topicEleQuestionsKeys) {
            // let topicEleQuestionsIdKeys = _.keys(topicEleQuestions[topicEleQuestionsId])
            logger.debug('topicEleQuestionsId', topicEleQuestionsId)
            for (let topicEleQuestionsVar of topicEleQuestions[topicEleQuestionsId]) {
                logger.debug('topicEleQuestionsVar.questionId inque', topicEleQuestionsVar.questionId)
                let createAt = new Date()
                let body = _.assign({
                    createAt: createAt
                }, topicEleQuestionsVar)
                logger.debug('topicEleQuestionsVar body', body)
                await esclient.index({
                    index: 'topic',
                    type: 'question',
                    timeout: '30m',
                    id: topicEleQuestionsVar.questionId,
                    body: body
                })
                logger.debug('done.')
            }
        }
    }
    logger.debug('passed.')
    t.pass()
})

/**
 * Succ
 */
test.skip('Import Data into ElasticSearch#Query what is', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'what is' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query', JSON.stringify(result))
    t.pass()
})


/**
 * Failed
 */
test.skip('Import Data into ElasticSearch#Query what is your name', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'What is your name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    t.pass()
})

/**
 * Succ
 */
test.skip('Import Data into ElasticSearch#Query what is your name [PoS]', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'What is your name' } },
                        { match: { 'questionText': 'What' } },
                        { match: { 'questionText': 'is' } },
                        { match: { 'questionText': 'your' } },
                        { match: { 'questionText': 'name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    t.pass()
})

/**
 * failed
 */
test.skip('Import Data into ElasticSearch#Query Would I know your name [PoS]', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'Would I know your name' } },
                        { match: { 'questionText': 'Would' } },
                        { match: { 'questionText': 'I' } },
                        { match: { 'questionText': 'know' } },
                        { match: { 'questionText': 'your' } },
                        { match: { 'questionText': 'name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    // {"took":10,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":0,"max_score":null,"hits":[]}}
    t.pass()
})


/**
 * Succ
 */
test.skip('Import Data into ElasticSearch#Query Would I know your name', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'Would I know your name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    // {
    //   "took": 18,
    //   "timed_out": false,
    //   "_shards": {
    //     "total": 5,
    //     "successful": 5,
    //     "failed": 0
    //   },
    //   "hits": {
    //     "total": 25,
    //     "max_score": 6.3761535,
    //     "hits": [
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q1-v3",
    //         "_score": 6.3761535,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:36.650Z",
    //           "questionId": "t1-q1-v3",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q1-v3.wav.mp3",
    //           "questionText": "May I know your name?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q1-v2",
    //         "_score": 2.9050593,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:36.574Z",
    //           "questionId": "t1-q1-v2",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q1-v2.wav.mp3",
    //           "questionText": "What's your name?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q1-v1",
    //         "_score": 2.3837996,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:35.622Z",
    //           "questionId": "t1-q1-v1",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q1-v1.wav.mp3",
    //           "questionText": "What is your name?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t2-q10-v2",
    //         "_score": 2.0935185,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:38.114Z",
    //           "questionId": "t2-q10-v2",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t2-q10-v2.wav.mp3",
    //           "questionText": "Can I have a picture of your pet?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q10-v3",
    //         "_score": 2.0770206,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.442Z",
    //           "questionId": "t1-q10-v3",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q9-v3.wav.mp3",
    //           "questionText": "May I have a picture of you?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t2-q4-v1",
    //         "_score": 1.5725496,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.611Z",
    //           "questionId": "t2-q4-v1",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t2-q4-v1.wav.mp3",
    //           "questionText": "Can you name some animals that live on the land?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t2-q5-v1",
    //         "_score": 1.5692015,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.660Z",
    //           "questionId": "t2-q5-v1",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t2-q5-v1.wav.mp3",
    //           "questionText": "Can you name some animals that live in the water?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q7-v3",
    //         "_score": 1.3589534,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.168Z",
    //           "questionId": "t1-q7-v3",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q6-v3.wav.mp3",
    //           "questionText": "What is your favorite subject in school?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t2-q3-v2",
    //         "_score": 1.1466724,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.544Z",
    //           "questionId": "t2-q3-v2",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t2-q3-v2.wav.mp3",
    //           "questionText": "What's your favorite animal? Why do you like it?"
    //         }
    //       },
    //       {
    //         "_index": "topic",
    //         "_type": "question",
    //         "_id": "t1-q8-v1",
    //         "_score": 1.1188718,
    //         "_source": {
    //           "createAt": "2017-03-29T02:33:37.220Z",
    //           "questionId": "t1-q8-v1",
    //           "questionVoiceUrl": "http://bot-server.oss-cn-hangzhou.aliyuncs.com/sphinx/voices/t1-q7-v1.wav.mp3",
    //           "questionText": "What is your hobby?"
    //         }
    //       }
    //     ]
    //   }
    // }
    t.pass()
})

/**
 * failed.
 */
test.skip('Import Data into ElasticSearch#Query Would I know your name [word by word]', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'Would' } },
                        { match: { 'questionText': 'I' } },
                        { match: { 'questionText': 'know' } },
                        { match: { 'questionText': 'your' } },
                        { match: { 'questionText': 'name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    // {"took":10,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":0,"max_score":null,"hits":[]}}
    t.pass()
})

/**
 * succ.
 */
test.only('Import Data into ElasticSearch#Query Would I know your name [word by word]', async (t) => {
    let result = await esclient.search({
        index: 'topic',
        type: 'question',
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'questionText': 'Would I know your name' } },
                        { match: { 'questionText': 'name' } }
                    ]
                }
            }
        }
    })
    logger.debug('Import Data into ElasticSearch#Query what is your name', JSON.stringify(result))
    // {"took":10,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":0,"max_score":null,"hits":[]}}
    t.pass()
})