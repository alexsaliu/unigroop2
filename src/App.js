import React, {useState, useEffect, Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Grid from './components/Grid';
import Home from './components/Home';

function App() {
    return (
        <div className="App">
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/:group" component={Grid}/>
                    </Switch>
                </Suspense>
            </Router>
        </div>
    );
}


export default App;
