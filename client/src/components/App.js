import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Analytics from './analytics/Analytics';
import Header from './Header';
import Chatbot from './chatbot/Chatbot'



const App = () =>
    (
        <div>
            <Router>
            <Header/>
                <div className="container">

                    <Route exact path="/" component={Landing} />
                    <Route exact path="/analytics" component={Analytics} />
                    <Route exact path="/about" component={About} />
                    <Chatbot/>
                </div>
            </Router>
        </div>
    )

export default App;