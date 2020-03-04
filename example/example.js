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
import EncodeDataSource from '../js/encodeDataSource.js'


// Create a modal for ENCODE with "dm3" as the initial data source
const encodeModal = new ModalTable({
    id: "encodeModal",
    title: "ENCODE",
    pageLength: 100,
    //datasource: new EncodeDataSource("dm3"),
    selectHandler: selected => console.log(selected)
})


// Update the modal with a new datasource on genome change.  Setting the datasource will clear the modal,
// causing the data table to be rebuilt opon opening
$("#genome-select").change(function (e) {
    $("#genome-select option:selected").each(function () {
        const genomeId = this.value
        const datasource = new EncodeDataSource(genomeId)
        const filter = (record) => record["Format"].toLowerCase() === "bigwig"
        encodeModal.setDatasource(datasource, filter)
    })
})



// Trivial example datasource

class TestDataSource {

    constructor() {

        this.columnDefs =
            [
                {
                    targets: [ 1 ],
                    visible: false,
                    // searchable: false
                },
                {
                    targets: [ 2 ],
                    visible: false,
                    // searchable: false
                }
            ];

    }

    async tableColumns() {
        return ["A", "B", "C"]
    }

    async tableData() {
        return [
            {"A": "A 1", "B": "B 1", "C": "C 1"},
            {"A": "A 2", "B": "B 2", "C": "C 3"},
            {"A": "A 7", "B": "B 5", "C": "C 9"},
            {"A": "A 11", "B": "B 3", "C": "C 15"},
        ]
    }

}



// Create another modal using the test datasource

const testSourceModal = new ModalTable({
    id: "simpleModal",
    title: "TEST",
    datasource: new TestDataSource(),
    selectHandler: selected => console.log(selected)
})

