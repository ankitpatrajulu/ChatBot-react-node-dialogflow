import React from 'react';

const Card = (props) => (
    <div style={{ float: 'left', paddingRight: 30, width: 270 }}>
        <div className="card" style={{width: 220}}>
            <div className="card-image" style={{width: 220, height: 150}}>
                <img alt={props.payload.fields.header.stringValue} src={props.payload.fields.image.stringValue}/>
                <span className="card-title"><b>{props.payload.fields.header.stringValue}</b></span>
                    </div>
                        <div className="card-content">
                        <p>{props.payload.fields.description.stringValue}</p>
                        <p><a href="/">{props.payload.fields.price.stringValue}</a></p>
                        </div>
                    <div className="card-action">
                <a target="_blank" rel="noopener noreferrer" href={props.payload.fields.link.stringValue}>GET NOW</a>
            </div>
      </div>
    </div>
)

export default Card;