/*
 *  The MIT License (MIT)
 *
 * Copyright (c) 2019 The Regents of the University of California
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 * @author Jim Robinson
 *
 */

import ModalTable from '../js/modalTable.js'
import GenericMapDatasource from '../js/genericDataSource.js'
import EncodeTrackDatasource from "../js/encodeTrackDatasource.js"
import { encodeTrackDatasourceConfigurator } from '../js/encodeTrackDatasourceConfig.js'
import { encodeTrackDatasourceSignalConfigurator } from '../js/encodeTrackDatasourceSignalConfig.js'
import { encodeTrackDatasourceOtherConfigurator } from '../js/encodeTrackDatasourceOtherConfig.js'
import {exampleCustomConfigurator} from '../js/exampleCustomConfig.js';


// Custom Data Source Example
const customModalConfig =
    {
        id: 'customModal',
        title: 'Custom Modal',
        pageLength: 100,
        selectionStyle: 'multi',
        selectHandler: selectionList => {
            console.log(selectionList)
        }
    }

const customModal = new ModalTable(customModalConfig)
const customDatasource = new GenericMapDatasource(exampleCustomConfigurator())
customModal.setDatasource(customDatasource)

// ENCODE Example
const encodeModalConfig =
    {
        id: "encodeModal",
        title: "ENCODE Modal",
        pageLength: 100,
        selectionStyle: 'multi',
        selectHandler: selectionList => {
            console.log(selectionList)
        }
    }

const encodeModal = new ModalTable(encodeModalConfig)


// Update the modal with a new datasource on genome change.  Setting the datasource will clear the modal,
// causing the data table to be rebuilt opon opening
$("#genome-select").change(function (e) {

    $("#genome-select option:selected").each(function () {

        const genomeId = this.value

        // const datasource = new EncodeTrackDatasource(encodeTrackDatasourceConfigurator(genomeId))
        const datasource = new EncodeTrackDatasource(encodeTrackDatasourceSignalConfigurator(genomeId))
        // const datasource = new EncodeTrackDatasource(encodeTrackDatasourceOtherConfigurator(genomeId))

        // const filter = (record) => record["Format"].toLowerCase() === "bigwig"
        // encodeModal.setDatasource(datasource, filter)

        encodeModal.setDatasource(datasource)

    })

})
