const {assert} = require('chai')
import "./util/mockObjects.js";
import GenericDataSource from "../js/encodeTrackDatasource.js"
import { encodeTrackDatasourceConfigurator } from '../js/encodeTrackDatasourceConfig.js'
import { colorForTarget} from "../js/encodeColors.js"

suite('Data source', function () {

    test('test encode color', async function () {

        this.timeout(600000)

        const genomeId = 'hg19'
        const encodeDatasource = new GenericDataSource(encodeTrackDatasourceConfigurator(genomeId))
        const data = await encodeDatasource.tableData()

        // Was data loaded?
        assert.ok(data.length > 0)

        // Simulate selection and test color assignment
        const h3k4Target = data.find(d => d.Target.startsWith("H3K4"))
        const selectionList = [h3k4Target];
        const result = encodeDatasource.tableSelectionHandler(selectionList)
        const expectedColor = colorForTarget(h3k4Target.Target)
        assert.equal(result[0].color, expectedColor)

    })

})
