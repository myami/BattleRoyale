'use strict';

const fs = require('fs');
const path = require('path');

module.exports = class Utility {
  /**
   * Recursively reads a directory.
   *
   * @param {string} dir - dir
   * @param {function(err: Error, list: Array.<string>)} done - callback
   * @param {boolean} [filesOnly=false] - whether to include only files in the result
   */
  static rreaddir(dir, done, filesOnly = false) {
    let pending = 0;
    let files = [];
    fs.readdir(dir, (err, list) => {
      if (err) {
        return done(err, files);
      }
      pending = list.length;

      list.forEach(f => {
        fs.stat(path.join(dir, f), (err, stat) => {
          if (err) {
            console.warn('skipping file because we couldnt stat it in rreaddir: ' + err);
            if (!pending--) {
              return done(undefined, files);
            }
            return;
          }


          if (stat.isDirectory()) {
            if (!filesOnly) {
              files.push(f);
            }
            Utility.rreaddir(f, (err, rlist) => {
              rlist.forEach(rf => files.push(rf));

              pending--;
              if (!pending) {
                return done(undefined, files);
              }
            }, filesOnly);
          } else {
            files.push(f);
            pending--;
            if (!pending) {
              return done(undefined, files);
            }
          }
        });
      });
    })
  }
}