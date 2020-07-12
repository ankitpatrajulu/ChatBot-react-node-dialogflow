import React from 'react';
import ItemList from './ItemList'

const Analytics = () =>
    (
        <div>
            <h2>POWER BI</h2>
            <section id="report-container" class="embed-container col-lg-offset-4 col-lg-7 col-md-offset-5 col-md-7 col-sm-offset-5 col-sm-7 mt-5">
            </section>

            <section class="error-container m-5">
            </section>

            <script src="/js/jquery.min.js"></script>
            <script src="/js/bootstrap.min.js"></script>
            <script src="/js/powerbi.min.js"></script>
            <script src="./index.js"></script>

            <ItemList />
        </div>
    )

export default Analytics;