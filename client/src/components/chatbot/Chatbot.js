import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';
import Card2 from './Card2';
import QuickReplies from './QuickReplies';


const cookies = new Cookies();

class Chatbot extends Component {

    messeagesEnd;
    takeInput;
    constructor(props) {
        super(props);

        // This binding is necessary to make this work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this)
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)

        this.state = {
            messages: [],
            showBot: true
        }
        if(cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/'})
        }
        console.log(cookies.get('userID'))
    }

    async df_text_query(text) {
        let says = {
            speaks: 'me',
            msg: {
                text: {
                    text: text
                }
            }
        }

        this.setState({messages: [...this.state.messages, says]})

        try {
            const res = await axios.post('/api/df_text_query', {text : text, userID: cookies.get('userID')})

            for (let msg of res.data.fulfillmentMessages) {
                says = {
                    speaks: 'bot',
                    msg
                }
                this.setState({messages: [...this.state.messages, says]})
            }
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having trouble. I need to terminate. I will be back later!"
                    }
                }
            }
            this.setState({messages: [...this.state.messages, says]})
        }
        

    }

    async df_event_query(event) {
        try {
            const res = await axios.post('/api/df_event_query', {event : event, userID: cookies.get('userID')})

            for(let msg of res.data.fulfillmentMessages) {
                let says = {
                    speaks: 'me',
                    msg
                }
                this.setState({messages: [...this.state.messages, says]})
            }
        }catch (e) {
            let says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having trouble. I need to terminate. I will be back later!"
                    }
                }
            }
            this.setState({messages: [...this.state.messages, says]})

            let that = this;
            setTimeout(function(){
                that.setState({showBot : false})
            }, 2000)
        }
        
    }

    async powerbi_fetch() {
        const res = await axios.get('/powerbi/fetch')
        let says = {
            speaks: 'bot',
            msg: 'Power BI has been loaded. Follow the link to see it.'
        }
        this.setState({messages: [...this.state.messages, says]})
    }

    async node_query_fetch(){
        const res = await axios.post('/api/node_query_fetch', {userID: cookies.get('userID')})
                let says = {
                    speaks: 'bot',
                    msg: res
                }
                this.setState({messages: [...this.state.messages, says]})
    }

    componentDidMount() {
        this.df_event_query('Welcome')
        //this.df_event_query('LoadData')
    }

    // componentWillUnmount() {
    //     console.log('This is where the call to save messages to database will be added.')
    //     axios.post('/api/messages_save_willunmount', {cookieID: cookies.get('userID'), messages: this.state.messages}).then((res) => {
    //         console.log('This is where the call to save messages to database will be added.')
    //     })
    // }

    // async sendMessage() {
    //     axios.post('/api/messages_save_willunmount', {cookieID: cookies.get('userID'), messages: this.state.messages}).then((res) => {
    //         console.log('This is where the call to save messages to database will be added.')
    //     }).catch((e) => {
    //         console.log('Error for saving messages')
    //     })
    // }

    componentDidUpdate() {
        this.messeagesEnd.scrollIntoView({ behavior: "smooth"})
        if(this.talkInput) {
            this.takeInput.focus()
        }
        // this.sendMessage()
    }

    show(event) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({showBot: true})
    }

    hide(event) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({showBot: false})
    }

    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault()
        event.stopPropagation()

        this.df_text_query(text)
    }

    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>)
    }

    renderCards2(cards) {
        return cards.map((card, i) => <Card2 key={i} payload={card.structValue}/>)
    }


    renderOneMessage(message, i) {
        
        if(message.msg && message.msg.text && message.msg.text.text) {
            //console.log(message.msg.text.text)
            // if(message.msg.text.text  === 'PO') {
            //     //console.log(message)
            //     let that = this;
            //     setTimeout(function(){
            //         console.log('Reached the fetch call')
            //         that.node_query_fetch()
            //     }, 2000)
                
            // }
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>
        } else if (message.msg && message.msg.payload.fields.cards) { //message.msg.payload.fields.cards.listValue.values

            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: 'hidden'}}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                            <div style={{ height: 300, width:message.msg.payload.fields.cards.listValue.values.length * 270}}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }  else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies
        ) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}/>;
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields.richContent &&
            message.msg.payload.fields.richContent.listValue.values[0]
        ) {
            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: 'hidden'}}>
                        <div className="col s12">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{ overflow: 'auto'}}>
                            <div style={{ height: 100, width:message.msg.payload.fields.richContent.listValue.values.length * 270}}>
                                {this.renderCards2(message.msg.payload.fields.richContent.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    }

    renderMessages(stateMessages) {
        if (stateMessages) {
            return stateMessages.map((message, i) => {
                return this.renderOneMessage(message, i)
            })
        } 
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value)
            e.target.value = ''
        }
    }

    render() {
        if(this.state.showBot) {
            return (
                <div style={chatbotHead}>
                    <nav>
                        <div style={{paddingLeft: 10}} className="nav-wrapper teal lighten-2">
                            <a className="brand-logo" href="/">ChatBot</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.hide}>Close</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div id="chatbot" style={chatbotMain}>
                        {this.renderMessages(this.state.messages)}
                        <div ref={(el) => { this.messeagesEnd = el }}
                            style={{float: 'left', clear: "both"}}>
                        </div>
                    </div>
                    <div className="col s12">
                        <input style={{margib: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} placeholder="type your message" type="text" onKeyPress={this._handleInputKeyPress} 
                            ref={(c) => {this.takeInput = c}}
                            autoFocus={true}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{
                    height: 40,
                    width: 400,
                    position: 'absolute',
                    bottom: 75,
                    right: 0,
                    border: '1px solid lightgrey',
                    paddingRight: 3,
                    paddingBottom: 30
                }}>
                    <nav>
                        <div style={{paddingLeft: 10}} className="nav-wrapper teal lighten-2">
                            <a className="brand-logo" href="/">ChatBot</a>
                            <ul id="nav-mobile" class="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.show}>Open</a></li>
                            </ul>
                        </div>
                        <div ref={(el) => { this.messeagesEnd = el }}
                            style={{float: 'left', clear: "both"}}>
                        </div>
                    </nav>  
                </div>
            )
        }
    }
}

const chatbotHead = {
    height: 550,
    width: 400,
    position: 'absolute',
    bottom: 75,
    right: 0,
    border: '1px solid lightgrey',
    paddingRight: 3,
    paddingBottom: 100
}

const chatbotMain = {
    height: 478,
    width: '100%',
    overflow: 'auto'
}

export default Chatbot;
