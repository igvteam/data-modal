//const {assert} = require('chai')

import EncodeTrackDatasource from "../js/encodeTrackDatasource.js"
import { encodeTrackDatasourceConfigurator } from '../js/encodeTrackDatasourceConfig.js'

suite('Data source', function () {

    test('test encode', async function () {

        this.timeout(600000)

        const genomeId = 'hg19'
        const encodeDatasource = new EncodeTrackDatasource(encodeTrackDatasourceConfigurator(genomeId))

        const data = await encodeDatasource.tableData()

        chai.assert.ok(data)

    })

})
