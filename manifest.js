'use strict';
const Confidence = require('confidence');
const criteria = {
    env: process.env.NODE_ENV
};


const manifest = {
    $meta: 'This file defines the server.',
    server: {
        debug: {
            request: ['---REQUEST---']
        }
    },
    connections: [{
        port: 8550,
        labels: ['server']
    }],
    registrations: [
        {
            plugin: {
                register: './routes'
            }
        }
    ]
};


const store = new Confidence.Store(manifest);


exports.get = (key) => {
    return store.get(key, criteria);
};


exports.meta = (key) => {
    return store.meta(key, criteria);
};
