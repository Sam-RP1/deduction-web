import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Container from './components/UI/Container/Container';
import MainMenu from './containers/MainMenu/MainMenu';
import CreateGameMenu from './containers/CreateGameMenu/CreateGameMenu';
import JoinGameMenu from './containers/JoinGameMenu/JoinGameMenu';
import Deduction from './components/Deduction/Deduction'; // eslint-disable-line
import Rules from './components/Menus/Rules/Rules'; // eslint-disable-line
import Settings from './components/Settings/Settings'; // eslint-disable-line
import BackButton from './components/UI/Buttons/BackButton/BackButton';
import Footer from './components/Footer/Footer';

import './styles/root.scss';

const App = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = () => {
        isDarkTheme ? setIsDarkTheme(false) : setIsDarkTheme(true);
        console.log('[THEME] toggled');
    };

    return (
        <div className={'theme ' + (isDarkTheme ? 'theme--dark' : 'theme--default')}>
            <BrowserRouter>
                <Route
                    render={({ location }) => {
                        return location.pathname !== '/' ? <BackButton /> : null;
                    }}
                />
                <div className='base'>
                    <Container opClasses={'container--center container--column'}>
                        <Route path='/game' component={Deduction} />
                        <Route path='/settings' component={Settings} />
                        <Route path='/rules' component={Rules} />
                        <Route path='/joingame' component={JoinGameMenu} />
                        <Route path='/creategame' component={CreateGameMenu} />
                        <Route path='/' exact component={MainMenu} />
                    </Container>
                    <Footer themeToggle={() => toggleTheme()} />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
