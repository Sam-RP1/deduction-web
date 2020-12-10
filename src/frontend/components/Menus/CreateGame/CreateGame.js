import React from 'react';
import PropTypes from 'prop-types';

// Imports
import Title from '../../UI/Title/Title';
import ToggleSwitch from '../../UI/ToggleSwitch/ToggleSwitch';
import Button from '../../UI/Buttons/Button/Button';

// Styles
import './CreateGame.scss';

// Presentational Component
const CreateGame = (props) => {
    return (
        <section className='create-game'>
            <Title title='Deduction' />

            <div className='create-game__option'>
                <div className='create-game__option__row'>
                    <h3>Turn Timer:</h3>
                    <ToggleSwitch toggle={props.turnTimer} function={props.toggleTurnTimer} />
                </div>
                <p>If enabled teams have one minute to complete their turn.</p>
            </div>

            <div className='create-game__option'>
                <div className='create-game__option__row'>
                    <h3>Quick Game:</h3>
                    <ToggleSwitch toggle={props.quickGame} function={props.toggleQuickGame} />
                </div>
                <p>
                    If enabled games will last upto six minutes before ending & teams have 30 seconds to complete each
                    turn.
                </p>
            </div>

            <div className='create-game__option__selection'>
                <h3>Select a Word Group...</h3>
                <div className='create-game__option__selection__container'>
                    {props.wordGroups.map((item) => {
                        return (
                            <div
                                key={item.id}
                                id={item.id}
                                role='checkbox'
                                aria-checked={props.selectedWordGroup === item.id ? 'true' : 'false'}
                                onClick={() => {
                                    props.wordGroupHandler(item.id);
                                }}
                                className='create-game__option__selection__brick'
                            >
                                <p>{item.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='create-game__option__text-input'>
                <h3>OR</h3>
                <h3>Enter Custom Words...</h3>
                <p>Enter 25 words by typing one word at a time in the box below and then pressing your enter key.</p>
                {props.customWordsErrMsg}
                <input
                    id='text-input'
                    onKeyPress={(evt) => {
                        if (evt.key === 'Enter') {
                            props.addCustomWordHandler(evt);
                        }
                    }}
                    minLength={2}
                    maxLength={30}
                />
                <p>{props.customWords.length} / 25</p>
                <div className='create-game__option__text-input__bricks'>
                    {props.customWords.map((word) => {
                        return (
                            <div
                                key={word}
                                onClick={() => {
                                    props.deleteCustomWord(word);
                                }}
                            >
                                <p>{word}</p>
                            </div>
                        );
                    })}
                </div>
                {props.submitErrMsg}
            </div>

            <Button title={'Go!'} function={props.submitHandler} />
        </section>
    );
};

CreateGame.propTypes = {
    // Turn Timer
    turnTimer: PropTypes.bool.isRequired,
    toggleTurnTimer: PropTypes.func.isRequired,
    // Quick Game
    quickGame: PropTypes.bool.isRequired,
    toggleQuickGame: PropTypes.func.isRequired,
    // Word Group
    selectedWordGroup: PropTypes.string.isRequired,
    wordGroups: PropTypes.array.isRequired,
    wordGroupHandler: PropTypes.func.isRequired,
    // Custom Words
    customWords: PropTypes.array.isRequired,
    addCustomWordHandler: PropTypes.func.isRequired,
    deleteCustomWord: PropTypes.func.isRequired,
    // Submit
    submitHandler: PropTypes.func.isRequired,
    // Errors
    customWordsErrMsg: PropTypes.object,
    submitErrMsg: PropTypes.object,
};

CreateGame.defaultProps = {
    // Turn Timer
    turnTimer: false,
    toggleTurnTimer: () => {
        console.log('[TURN TIMER] toggleTurnTimer err');
    },
    // Quick Game
    quickGame: false,
    toggleQuickGame: () => {
        console.log('[QUICK GAME] toggleQuickGame err');
    },
    // Word Groups
    wordGroups: [{ id: 'err', title: 'ERROR :(' }],
    wordGroupHandler: () => {
        console.log('[WORD GROUP] wordGroupHandler err');
    },
    // Custom Words
    customWords: ['err'],
    addCustomWordHandler: () => {
        console.log('[CUSTOM WORDS] addCustomWordHandler err');
    },
    deleteCustomWord: () => {
        console.log('[CUSTOM WORDS] deleteCustomWord err');
    },
    // Submit
    submitHandler: () => {
        console.log('[SUBMIT BTN] submitHandler err');
    },
};

export default CreateGame;
