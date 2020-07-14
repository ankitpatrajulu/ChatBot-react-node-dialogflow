import React from 'react'

const Card2 = (props) => (
    <div style={{ float: 'left', paddingRight: 30, width: 300 }}>
        <div className="row">
            <div className="col s12 m7">
                <div className="card" style={{width: 300}}>
                    <div style={{paddingLeft: 10, paddingTop: 10}}className="card-image">
                    <a target="_blank" rel="noopener noreferrer" href="/">{props.payload.fields.type.stringValue}</a>
                        <span className="card-title">{props.payload.fields.subtitle.stringValue}</span>
                    </div>
                    <div className="card-content">
                        <p>{props.payload.fields.title.stringValue}</p>
                    </div>
                    <div className="card-action">
                        <a target="_blank" rel="noopener noreferrer" href="/">{props.payload.fields.text.stringValue}</a>
                    </div>
                </div>
            </div>
    </div>
  </div>
)

export default Card2