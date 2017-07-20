'use strict';

const path = require('path');
const util = require('./util');

function getDatasets(dataPath) {
  return new Promise((resolve, reject) => {
    const data = new Map();

    util.rreaddir(dataPath, (err, list) => {
      if (err) {
        return reject(err);
      }

      list
        .filter(file => file.endsWith('.json'))
        .forEach(file => {
          data.set(path.basename(file, '.json'), require(`${dataPath}/${file}`));
        });

      resolve(data);
    }, true);
  });
}

getDatasets(path.join(__dirname, 'data'))
  .catch(e => console.error(e.stack || e))
  .then(data => {
    console.log('hashes: got data. adding events');

    jcmp.events.Add('hashes_all', (category = null) => category ? { data: data.get(category) || [] } : { data });
    jcmp.events.Add('hashes_get', (category, { name = null, modelName = null, hash = null, onlyFirstResult = false, sloppyMatch = false } = {}) => {
      if (!data.has(category)) {
        return { data: (onlyFirstResult ? null : []) };
      }

      let objects = data.get(category);

      if (name !== null) {
        const re = new RegExp(name, 'ig');
        objects = objects.filter(obj => sloppyMatch ? re.test(obj.name) : obj.name === name);
      }
      if (modelName !== null) {
        const re = new RegExp(modelName, 'ig');
        objects = objects.filter(obj => sloppyMatch ? re.test(obj.model_name) : obj.model_name === modelName);
      }
      if (hash !== null) {
        console.log(hash);
        const hashStr = hash.toString();
        const re = new RegExp(hashStr, 'ig');
        objects = objects.filter(obj => sloppyMatch ? re.test(obj.hash) : obj.hash === hash);
      }

      return onlyFirstResult ? { data: (objects[0] || null) } : { data: objects };
    });
  });