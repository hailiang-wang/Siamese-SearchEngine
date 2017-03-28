/**
 * Import Data into ElasticSearch
 */
const test = require('ava')
const config = require('../config/environment')
const logger = require('../services/logging.service').getLogger('import.data')
const _ = require('lodash')
const topicData = require(config.root + '/data/data.topics.json')

test('Import Data into ElasticSearch', async t => {
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
                logger.debug('topicEleQuestionsVar.questionId', topicEleQuestionsVar.questionId)
            }
        }
    }
    logger.debug('passed.')
    t.pass()
})
