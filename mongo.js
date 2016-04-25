/**
 * Created by mor on 21/04/16.
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');

var dbUrl = 'mongodb://localhost:27017/snake';

var mongo = {

    ten: [],

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
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            db.open(function(err, client) {
                assert.equal(null, err);
                console.log("[mongo] nueva snake: " + id);
                client.collection('snake').insertOne({name: id}, db.close());
            });
        });
    },
    /**
     * Muestra los 10 jugadores con mayor puntuación
     * @returns {Array} Array de los 10 jugadores con la puntuación más alta
     */
    topTenPlayers: function() {
        MongoClient.connect(dbUrl, function (err, db) {
            mongo.top = [];
            console.log("[mongo] comprobando top");
            db.open(function(err, client){
                assert.equal(null, err);
                var ret = client.collection('snake').find({score: {$exists: true}});
                ret.sort({score: -1, deaths: 1});
                ret.limit(10);
                if(mongo.top.length === 0) {
                    ret.each(function (err, doc) {
                        assert.equal(null, err);
                        if (doc != null && mongo.ten.length < 10) mongo.ten.push(doc);
                        else db.close();
                    });
                }
            });
        });
        //mongo.showTop();
    },
    /**
     * Actualiza la puntuación de un jugador en la base de datos
     * @param snake Usuario a actualizar
     */
    updatePlayerScore: function (snake) {
        var id = snake.id;
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            db.open(function(err, client) {
                assert.equal(null, err);
                console.log("[mongo] actualizando snake: " + id);
                client.collection('snake').deleteMany({score: {$exists: false}},
                    client.collection('snake').updateOne({name: id, score: {$exists: true}},
                        {$set: {score: snake.score, deaths: snake.deaths}}, db.close())
                );
            });
        });
        mongo.topTenPlayers();
    }
};

module.exports = mongo;