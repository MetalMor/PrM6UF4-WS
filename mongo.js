/**
 * Created by mor on 21/04/16.
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');

var dbUrl = 'mongodb://127.0.0.1:27017/snake';

var mongo = {

    ten: [],
    initConnection: function(callback) {
        MongoClient.connect(dbUrl, function(err, db) {
            mongo.connection = db;
            assert.equal(null, err);
            if (callback && typeof callback === 'function')
                callback(db);
        });
    },

    /**
     * Muestra por consola el top. Función para debugar.
     */
    showTop: function() {
        var top = mongo.ten;
        var len = top.length;
        console.log("top: ");
        for (var counter = 0; counter < len; counter++)
            console.log(top[counter]);
    },
    /**
     * Inserta un jugador en la BD.
     * @param id Nombre del jugador.
     */
    insertPlayer: function (id) {
        assert.notEqual(null, mongo.connection);
        console.log("[mongo] nueva snake: " + id);
        mongo.connection.collection('snake').insertOne({name: id});
    },
    /**
     * Muestra los 10 jugadores con mayor puntuación
     * @returns {Array} Array de los 10 jugadores con la puntuación más alta
     */
    topTenPlayers: function() {
        mongo.top = [];
        assert.notEqual(null, mongo.connection);
        console.log("[mongo] comprobando top");
        var ret = mongo.connection.collection('snake').find({score: {$exists: true}});
        ret.sort({score: -1, deaths: 1});
        ret.limit(10);
        if(mongo.top.length === 0) {
            ret.each(function (err, doc) {
                assert.equal(null, err);
                if (doc != null && mongo.ten.length < 10) mongo.ten.push(doc);
            });
        }
        //mongo.showTop();
    },
    /**
     * Actualiza la puntuación de un jugador en la base de datos
     * @param snake Usuario a actualizar
     */
    updatePlayerScore: function (snake) {
        var id = snake.id;
        assert.notEqual(null, mongo.connection);
        console.log("[mongo] actualizando snake: " + snake.id);
        mongo.connection.collection('snake').deleteMany({score: {$exists: false}},
            mongo.connection.collection('snake').updateOne({name: id, score: {$exists: true}},
                {$set: {score: snake.score, deaths: snake.deaths}}, {upsert: true})
        );
        mongo.topTenPlayers();
    }
};

module.exports = mongo;