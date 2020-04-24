import React, {useState, useEffect, Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';

import Header from './components/Header';
import Name from './components/Name';
import Home from './components/Home';

function App() {
    return (
        <div className="App">
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/:group" component={Name}/>
                    </Switch>
                </Suspense>
            </Router>
        </div>
    );
}


export default App;
