/**
 * WordPoS Test
 */

const siameseService = require('../services/siamese.service')
const test = require('ava')

test('WordPoS Test#Lookup nouns', async (t) => {
    let result = await siameseService.getNouns('what is your nickname')
    console.log('WordPoS #1', result)
    t.pass()
})


test('Siamese Search#parseText what is your nickname', async (t) => {
    let result = await siameseService.parseText('What is your nickname');
    console.log('Siamese Search#parseText what is your nickname', result);
    t.pass()
})

test.only('Siamese Search#parseText would I know your nickname', async (t) => {
    let result = await siameseService.parseText('would I know your nickname');
    console.log('Siamese Search#parseText would I know your nickname', result);
    t.pass()
})