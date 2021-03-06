'use strict';
const { SUCCESS, ERROR } = require('../../statusTypes');
const { sqlPromise, logError } = require('../../config');
const _ = require('underscore');

// add if else for fail conditions + could use filter
module.exports.updateTeams = async (gameId, playerId, team) => {
    try {
        const sql = await sqlPromise;
        const [players] = await sql.query(sql.format('select players from game_instances where game_id = ?', [gameId]));
        const playerArr = JSON.parse(players[0].players);

        for (let i = 0; i < playerArr.length; i++) {
            if (playerArr[i].playerId === playerId) {
                playerArr[i].team = team;
                break;
            }
        }

        const updatedPlayerStr = JSON.stringify(playerArr);
        const lastQuery = Date.now();

        await sql.query(
            sql.format('update game_instances set players = ?, last_query = ? where game_id = ?', [
                updatedPlayerStr,
                lastQuery,
                gameId,
            ])
        );

        return { status: SUCCESS, players: playerArr };
    } catch (e) {
        logError(e);
        return { status: ERROR, error: 'Could not change your team.' };
    }
};

module.exports.randomiseTeams = async (gameId) => {
    try {
        const sql = await sqlPromise;
        const [players] = await sql.query(sql.format('select players from game_instances where game_id = ?', [gameId]));

        const playerArr = JSON.parse(players[0].players);
        const numPlayers = playerArr.length;
        const isEvenPlayers = numPlayers % 2 === 0 ? true : false;
        const shuffledPlayers = _.shuffle(playerArr);

        const firstHalf = Math.floor(numPlayers / 2);
        for (let i = 0; i < firstHalf; i++) {
            shuffledPlayers[i].team = 'red';
        }

        const lastHalf = firstHalf * 2;
        for (let i = firstHalf; i < lastHalf; i++) {
            shuffledPlayers[i].team = 'blue';
        }

        if (isEvenPlayers === false) {
            const ans = Math.random() > 0.5 ? 'blue' : 'red';
            shuffledPlayers[numPlayers - 1].team = ans;
        }

        const updatedPlayerStr = JSON.stringify(shuffledPlayers);
        const lastQuery = Date.now();

        await sql.query(
            sql.format('update game_instances set players = ?, last_query = ? where game_id = ?', [
                updatedPlayerStr,
                lastQuery,
                gameId,
            ])
        );

        return { status: SUCCESS, players: shuffledPlayers };
    } catch (e) {
        logError(e);
        return { status: ERROR, error: 'Could not randomise teams.' };
    }
};
