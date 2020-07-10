import React from 'react';
import ItemList from './ItemList'

const Analytics = () =>
    (
        <div>
            <h2>Shop</h2>
            <iframe width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=2daf114c-6f1b-41de-a6ce-a47a9ee821e8&groupId=4cb8da42-de39-40f7-b066-3aa2ac8fd730&autoAuth=true&ctid=7ba60b49-a6cf-4459-8011-9bdf62b87507&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWluZGlhLWNlbnRyYWwtYS1wcmltYXJ5LXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9" frameborder="0" allowFullScreen="true"></iframe>
            <ItemList />
        </div>
    )

export default Analytics;