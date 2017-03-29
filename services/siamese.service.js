/**
 * Siamese Question Search
 */
const logger = require('./logging.service').getLogger('siamese.service')
const Q = require('q')
const esclient = require('./elasticsearch.service')
const WordPOS = require('wordpos')
const wordpos = new WordPOS()



/**
 * 
 */
function SiameseService() {

}

/**
 * lookupNoun
 */
SiameseService.prototype.lookupNoun = function (word) {
    let deferred = Q.defer();
    wordpos.lookupNoun(word, function (result) {
        deferred.resolve(result);
    })

    return deferred.promise;
}

SiameseService.prototype.getNouns = function (sentence) {
    let deferred = Q.defer()
    let self = this;
    wordpos.getNouns(sentence, async (result) => {
        // deferred.resolve(result);
        let results = []
        for (let noun of result) {
            let lookups = await self.lookupNoun(noun)
            results.push({
                noun: noun,
                lookup: lookups
            })
        }
        deferred.resolve(results)
    })

    return deferred.promise;
}

SiameseService.prototype.searchWithPOSNouns = async function (index, type, sentence, options) {
    let nouns = await this.getNouns(sentence)
    let must = [{ match: { 'questionText': sentence } }]

    for (let noun of nouns) {
        must.push({ match: { 'questionText': noun.noun } })
    }

    // deferred.resolve(nouns)
    let result = await esclient.search({
        index: index,
        type: type,
        body: {
            query: {
                bool: {
                    must: must
                }
            }
        }
    })

    return result
}

/**
 * Returns tokenized array of words in text, less 
 * duplicates and stopwords. This method is called 
 * on all getX() calls internally.
 */
SiameseService.prototype.parseText = function (text) {
    console.log('process', text)
    return wordpos.parse(text)
}

exports = module.exports = new SiameseService()
