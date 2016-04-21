/**
 * Created by mor on 21/04/16.
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/snake';

var mongo = {
    /**
     * Printa un error de MongoDB
     * @param err Objeto error
     */
    showError: function (err) {
        if (!assert.equal(null, err))
            console.log(err.statusCode + ": " + err.message);
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
                client.collection('snake').insertOne({"name": id}/*, db.close*/);
            });
        });
    },
    /**
     * Muestra los 10 jugadores con mayor puntuación
     * @returns {Array} Array de los 10 jugadores con la puntuación más alta
     */
    topTenPlayers: function () {
        var ret = [];
        var top;
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            db.open(function(err, client){
                assert.equal(null, err);
                top = client.collection('snake').find({
                    "score": {$exists: true}, // tiene atributo score
                }).sort({
                    "score": -1,
                    "deaths": 1
                });
                if (top !== undefined) {
                    // ERROR el parametro doc está saliendo null
                    top.forEach(function(doc) {
                        console.log(doc);
                        if (doc != null) ret.push(doc);
                    });
                }
            });
        });
        return ret;
    },
    /**
     * Actualiza la puntuación de un jugador en la base de datos
     * @param snake Usuario a actualizar
     */
    updatePlayerScore: function (snake) {
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            db.open(function(err, client) {
                assert.equal(null, err);
                client.collection('snake').updateOne({
                    "name": snake.id
                }, {
                    $set: {
                        "score": snake.score,
                        "deaths": snake.deaths
                    }
                }/*, db.close()*/);
            });
        });
    }
};

module.exports = mongo;