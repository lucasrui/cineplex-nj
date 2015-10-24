/**
 * User: tuilu
 */
var crypto = require('crypto');

/**
 * md5 hash
 *
 * @param str
 * @returns md5 str
 */
exports.md5 = function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};