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

import ModalTable from '../src/modalTable.js'
import GenericDataSource from "../src/genericDataSource.js";

// Read table data from a tab-delimite file  (ENCODE tracks for genome dm3)

const dataSourceConfig = {
    isJSON: false,
    url: 'data/tabDelimited.txt',
    columns:
        [
            // 'ID',           // hidden
            //  'Assembly',     // hidden
            'Biosample',
            'AssayType',
            'Target',
            'BioRep',
            'TechRep',
            'OutputType',
            'Format',
            'Lab',
            //   'HREF',         // hidden
            'Accession',
            'Experiment'
        ],
    columnDefs:
        {
            AssayType: {title: 'Assay Type'},
            OutputType: {title: 'Output Type'},
            BioRep: {title: 'Bio Rep'},
            TechRep: {title: 'Tech Rep'}
        },
    sort: (a, b) => {
        const aTarget = a.Target || "";
        const bTarget = b.Target || ""
        return aTarget.localeCompare(bTarget);
    },
    rowHandler: row => {
        const name = `${row['Biosample']} - ${row['Target']}`;
        const url = `https://www.encodeproject.org/${row['HREF']}`;
        return {name, url}
    }
}

const dataSource = new GenericDataSource(dataSourceConfig);


// Create another modal using the test datasource

const simpleModalConfig =
    {
        id: "tabDelimited",
        datasource: dataSource,
        title: "Tab delimited file",
        okHandler: selected => {
            console.log(selected)
        }
    }

new ModalTable(simpleModalConfig)



