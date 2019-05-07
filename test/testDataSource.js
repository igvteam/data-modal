//const {assert} = require('chai')

import EncodeDataSource from '../js/encode.js'

suite('Data source', function () {

    test('test encode', async function () {

        this.timeout(600000);

        const columnFormat =
            [
                {title: 'Cell Type', width: '7%'},
                {title: 'Target', width: '8%'},
                {title: 'Assay Type', width: '20%'},
                {title: 'Output Type', width: '20%'},
                {title: 'Bio Rep', width: '5%'},
                {title: 'Tech Rep', width: '5%'},
                {title: 'Format', width: '5%'},
                {title: 'Experiment', width: '7%'},
                {title: 'Accession', width: '8%'},
                {title: 'Lab', width: '20%'}
            ];

        const encodeDatasource = new EncodeDataSource(columnFormat, "hg19");

        const data = await encodeDatasource.fetchData()

        chai.assert.ok(data)

    })

})