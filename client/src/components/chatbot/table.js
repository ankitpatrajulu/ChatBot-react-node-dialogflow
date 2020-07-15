import React from 'react';

const Table = (props) => (
    <div>
        <Table>
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
    </div>
)

export default Table;