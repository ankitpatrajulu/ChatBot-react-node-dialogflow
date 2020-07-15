import React from 'react'
import './Card2.css'
import Table from 'react-bootstrap/Table'

const Card2 = (props) => (
    <div style={{ float: 'left', paddingRight: 30, width: 300 }}>
        <div className="row">
            <div className="col s12 m7">
                <div className="card" style={{width: 280}}>
                    <div style={{paddingLeft: 20, paddingTop: 10}}className="card-image">
                    <a target="_blank" rel="noopener noreferrer" href="/">{props.payload.fields.type.stringValue}</a>
                        <span className="card-title">{props.payload.fields.subtitle.stringValue}</span>
                    </div>
                    <div className="card-content" >
                    {props.payload.fields.title.stringValue === 'default' &&
                    <Table style={{height: 280}}>
                        <tr>
                            <th>Vendor ID</th>
                            <th>Amount($)</th>
                        </tr>
                        <tr>
                            <td>{props.payload.fields.vendor1.stringValue}</td>
                            <td>{props.payload.fields.data1.stringValue}</td>
                        </tr>
                        <tr>
                            <td>{props.payload.fields.vendor2.stringValue}</td>
                            <td>{props.payload.fields.data2.stringValue}</td>
                        </tr>
                        <tr>
                            <td>{props.payload.fields.vendor3.stringValue}</td>
                            <td>{props.payload.fields.data3.stringValue}</td>
                        </tr>
                        <tr>
                            <td>{props.payload.fields.vendor4.stringValue}</td>
                            <td>{props.payload.fields.data4.stringValue}</td>
                        </tr>
                        <tr>
                            <td>{props.payload.fields.vendor5.stringValue}</td>
                            <td>{props.payload.fields.data5.stringValue}</td>
                        </tr>
                    </Table>
                    }
                    {props.payload.fields.title.stringValue !== 'default' &&
                        <p>{props.payload.fields.title.stringValue}</p>
                    }
                    </div>
                    <div className="card-action">
                        <a target="_blank" rel="noopener noreferrer" href={props.payload.fields.subtitle.stringValue}>{props.payload.fields.text.stringValue}</a>
                    </div>
                </div>
            </div>
    </div>
  </div>
)

export default Card2