import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Redux Action Types
import {
    newGameAC,
    setTeamsAC,
    setRolesAC,
    setTurnAC,
    setWordBundleAC,
    setWordsAC,
    setCustomWordsAC,
    setScoreAC,
    resetGameAC,
} from '../store/actions/game';
import { setTeamAC, setRoleAC, resetPlayerAC } from '../store/actions/player';

const useGame = (socketRef, gameId) => {
    // Redux Actions
    const dispatch = useDispatch();
    const setNewGame = useCallback((data) => dispatch(newGameAC(data)), [dispatch]);
    // Teams
    const setTeams = useCallback((players) => dispatch(setTeamsAC(players)), [dispatch]);
    const setTeam = useCallback((team) => dispatch(setTeamAC(team)), [dispatch]);
    // Roles
    const setRoles = useCallback((role) => dispatch(setRolesAC(role)), [dispatch]);
    const setRole = useCallback((role) => dispatch(setRoleAC(role)), [dispatch]);
    // Turn
    const setTurn = useCallback((turn) => dispatch(setTurnAC(turn)), [dispatch]);
    // Words
    const setWordBundle = useCallback((bundleId) => dispatch(setWordBundleAC(bundleId)), [dispatch]);
    const setWords = useCallback((words) => dispatch(setWordsAC(words)), [dispatch]);
    const setCustomWords = useCallback((words) => dispatch(setCustomWordsAC(words)), [dispatch]);
    // Score
    const setScore = useCallback((score) => dispatch(setScoreAC(score)), [dispatch]);
    // Leave
    const resetPlayer = useCallback(() => dispatch(resetPlayerAC()), [dispatch]);
    const resetGame = useCallback(() => dispatch(resetGameAC()), [dispatch]);

    useEffect(() => {
        // New game has been requested
        socketRef.current.on('update_game', (res) => {
            console.log(res.msg);
            setNewGame(res.data);
        });
        // Player(s) have changed team
        socketRef.current.on('update_teams', (res) => {
            console.log(res.msg);
            setTeams(res.players);
        });
        // Player has changed its own team
        socketRef.current.on('update_client_team', (res) => {
            console.log(res.msg);
            setTeam(res.team);
            setTeams(res.players);
        });
        // Teams have been randomised
        socketRef.current.on('random_teams', (res) => {
            console.log(res.msg);
            const playerArr = res.players;
            const playerId = socketRef.current.id;
            let team;
            for (const player in playerArr) {
                if (playerArr[player].playerId === playerId) {
                    team = playerArr[player].team;
                }
            }
            setTeam(team);
            setTeams(res.players);
        });
        // Player(s) have changed role
        socketRef.current.on('update_roles', (res) => {
            console.log(res.msg);
            setRoles(res.players);
        });
        // Player has changed its own role
        socketRef.current.on('update_client_role', (res) => {
            console.log(res.msg);
            setRole(res.role);
            setRoles(res.players);
        });
        // Game turn has changed
        socketRef.current.on('update_turn', (res) => {
            console.log(res.msg);
            setTurn(res.turn);
        });
        // Player(s) have changed word bundle
        socketRef.current.on('update_word_bundle', (res) => {
            console.log(res.msg);
            setWordBundle(res.bundle);
        });
        // Game words have changed
        socketRef.current.on('update_words', (res) => {
            console.log(res.msg);
            setWords(res.words);
        });
        // Game custom words have changed
        socketRef.current.on('update_custom_words', (res) => {
            console.log(res.msg);
            setCustomWords(res.customWords);
        });
        // Guess has been made
        socketRef.current.on('guess_made', (res) => {
            console.log(res);
            if (res.data.nextTurn !== null) {
                setTurn(res.data.nextTurn);
            }
            setScore(res.data.score);
            setWords(res.data.words);
        });

        // Clean up and remove all socket listeners
        return () => {
            socketRef.current.removeListener('update_game');
            socketRef.current.removeListener('update_teams');
            socketRef.current.removeListener('update_client_team');
            socketRef.current.removeListener('random_teams');
            socketRef.current.removeListener('update_roles');
            socketRef.current.removeListener('update_client_role');
            socketRef.current.removeListener('update_turn');
            socketRef.current.removeListener('update_word_bundle');
            socketRef.current.removeListener('update_words');
            socketRef.current.removeListener('update_custom_words');
            socketRef.current.removeListener('guess_made');
            socketRef.current.emit('leave_game', {
                gameId: gameId,
            });
            resetPlayer();
            resetGame();
        };
    }, []);

    const joinGame = (gameId, playerName) => {
        console.log('[JOIN GAME] joining game');
        socketRef.current.emit('join_game', {
            gameId: gameId,
            playerName: playerName,
        });
    };

    const newGame = (wordBundle, customWords) => {
        console.log('[GAME] request new game');
        if (wordBundle !== '' || customWords.length === 25) {
            console.log('[GAME] new game conditions met');
            socketRef.current.emit('new_game', {
                gameId: gameId,
            });
        }
    };

    const selectTeam = (team, currentTeam) => {
        console.log('[TEAMS] selecting team');
        if (team !== currentTeam) {
            console.log('[TEAMS] team selected');
            socketRef.current.emit('select_team', {
                gameId: gameId,
                team: team,
            });
        }
    };

    const randomiseTeams = () => {
        console.log('[TEAMS] randomising teams');
        socketRef.current.emit('randomise_teams', {
            gameId: gameId,
        });
    };

    const selectRole = (role, currentRole) => {
        console.log('[ROLE] selecting role');
        if (role !== currentRole) {
            console.log('[ROLE] role selected');
            socketRef.current.emit('select_role', {
                gameId: gameId,
                role: role,
            });
        }
    };

    const selectWordBundle = (bundle, currentBundle) => {
        console.log('[WORD BUNDLES] selecting word bundle');
        if (bundle !== currentBundle) {
            console.log('[WORD BUNDLES] selection conditions met');
            socketRef.current.emit('select_word_bundle', {
                gameId: gameId,
                bundle: bundle,
            });
        }
    };

    const addCustomWord = (word) => {
        console.log('[CUSTOM WORDS] adding word');
        socketRef.current.emit('add_custom_word', {
            gameId: gameId,
            word: word,
        });
    };

    const removeCustomWord = (word) => {
        console.log('[CUSTOM WORDS] removing word');
        socketRef.current.emit('remove_custom_word', {
            gameId: gameId,
            word: word,
        });
    };

    const useCustomWords = (customWords) => {
        console.log('[CUSTOM WORDS] attempting to use custom words');
        if (customWords.length === 25) {
            console.log('[CUSTOM WORDS] using custom words');
            socketRef.current.emit('use_custom_words', {
                gameId: gameId,
            });
        }
    };

    const guess = (word, gameTurn, playerTeam, playerRole) => {
        console.log('[GUESS] made a guess');
        if (playerRole === 'agent' && gameTurn === playerTeam && word.guessData.isGuessed === false) {
            console.log('[GUESS] guess conditions met');
            socketRef.current.emit('guess', {
                gameId: gameId,
                word: word,
                playerTeam: playerTeam,
                playerRole: playerRole,
            });
        }
    };

    const endTurn = (team, currentTurn) => {
        console.log('[TURN] tried ending turn');
        if (team === currentTurn) {
            console.log('[TURN] ending turn conditions met');
            socketRef.current.emit('end_turn', {
                gameId: gameId,
            });
        }
    };

    return {
        joinGame,
        newGame,
        selectTeam,
        randomiseTeams,
        selectRole,
        selectWordBundle,
        addCustomWord,
        removeCustomWord,
        useCustomWords,
        guess,
        endTurn,
    };
};

export default useGame;
