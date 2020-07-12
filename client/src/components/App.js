import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Analytics from './analytics/Analytics';
import Header from './Header';
import Chatbot from './chatbot/Chatbot'
import Footer from './Footer';
import './App.css'


const App = () =>
    (   <div>
            <div className="wrapper">
                <Router>
                    <div id="page-container">
                        <div id="content-wrap">
                            <div className="nav">
                                <Header/>
                            </div>
                            <div className="container main">
                                <Route exact path="/" component={Landing} />
                                <Route exact path="/analytics" component={Analytics} />
                                <Route exact path="/about" component={About} />
                                <Chatbot/>
                            </div>
                        </div>
                        <div id="footer">
                            <Footer/>
                        </div>
                    </div>
                </Router>
            </div>
        </div>
    )

export default App;