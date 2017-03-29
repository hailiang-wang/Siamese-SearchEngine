/**
 * Siamese Test
 */

const siameseService = require('../services/siamese.service')
const test = require('ava')


/**
 * Should resolve
 */
test.only('Siamese Search#Nouns what is your name', async t => {
    let result = await siameseService.searchWithPOSNouns('topic', 'question', 'what is your name');
    console.log('result(what is your name):', JSON.stringify(result))
    t.pass()
})
    
/**
 * Should resolve 
 */
test.only('Siamese Search#Nouns would I know your name', async t => {
    let result = await siameseService.searchWithPOSNouns('topic', 'question', 'would I know your name');
    console.log('result(would I know your name):', JSON.stringify(result))
    t.pass()
})

/**
 * Should not resolve
 */
test.skip('Siamese Search#Nouns would I know your nickname', async t => {
    let result = await siameseService.searchWithPOSNouns('topic', 'question', 'would I know your nickname');
    console.log('result(would I know your nickname):', JSON.stringify(result))
    t.pass()
})


