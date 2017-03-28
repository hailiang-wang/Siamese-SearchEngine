/**
 * Import Data into ElasticSearch
 */
const test = require('ava')
const logger = require('../services/logging.service').getLogger('import.data')

test('Import Data into ElasticSearch', async t => {
    logger.debug('test')
    t.pass()
})
