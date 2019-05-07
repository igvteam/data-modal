//const {assert} = require('chai')

import EncodeDataSource from '../js/encode.js'

suite('Data source', function () {

    test('test encode', async function () {

        this.timeout(600000);


        const encodeDatasource = new EncodeDataSource("hg19");

        const data = await encodeDatasource.tableData()

        chai.assert.ok(data)

    })

})