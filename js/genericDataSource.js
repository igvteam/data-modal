import getDataWrapper from './dataWrapper.js'
import {igvxhr, FileUtils } from "../node_modules/igv-utils/src/index.js";

class GenericDataSource {

    constructor(config) {

        this.columns = config.columns;   // Required for now, could default to all columns
        this.columnDefs = config.columnDefs       // optional
        this.rowHandler = config.rowHandler;      // optional

        if (config.data) {
            this.data = config.data;  // Explcitly set table rows as array of json objects
        } else {
            this.url = config.url;     // URL to data source -- required
            this.isJSON = config.isJSON || false;   // optional, defaults to false (tab delimited)
            this.parser = config.parser;                   // optional
            this.filter = config.filter             // optional
            this.sort = config.sort;                // optional
        }
    }

    async tableColumns() {
        return this.columns;
    }

    async tableData() {

        if (undefined === this.data) {

            let response = undefined;
            try {
                const url = this.url
                response = await fetch(url);
            } catch (e) {
                console.error(e)
                return undefined;
            }

            if (response) {

                const str = await response.text();

                let records;
                if (this.parser) {
                    records = this.parser.parse(str);
                } else if (this.isJSON) {
                    records = JSON.parse(str);
                    if (typeof this.filter === 'function') {
                        records = records.filter(this.filter);
                    }
                } else {
                    records = this.parseTabData(str, this.filter);
                }

                if (typeof this.sort === 'function') {
                    records.sort(this.sort);
                }

                this.data = records
            }
        } else if (Array.isArray(this.data)) {
            return this.data
        } else if ('csv' === FileUtils.getExtension(this.data)) {

            let str
            try {
                str = await igvxhr.loadString(this.data)
            } catch (e){
                console.error(e)
                return undefined;
            }

            if (str) {
                // const list = str.split('\n')
                // const keys = list.shift().split(',').map(key => key.trim())
                //
                // const records = list.map(line => {
                //     const keyValues = line.split(',').map((value, index) => [ keys[ index ], value.trim() ])
                //     const entries = new Map(keyValues)
                //     return Object.fromEntries(entries)
                // })
                //
                // this.data = records

                this.data = parseCSV(str)
            }

        }

        return this.data
    }

    parseTabData(str, filter) {

        const dataWrapper = getDataWrapper(str);

        const headerLine = dataWrapper.nextLine();  // Skip header
        const headers = headerLine.split('\t');

        const records = [];
        let line;

        while (line = dataWrapper.nextLine()) {

            const record = {};

            const tokens = line.split(`\t`);
            if (tokens.length !== headers.length) {
                throw Error("Number of values must equal number of headers in file " + this.url);
            }

            for (let i = 0; i < headers.length; i++) {
                record[headers[i]] = tokens[i]
            }

            if (undefined === filter || filter(record)) {
                records.push(record);
            }

        } // while(line)

        return records;
    }

}

function parseCSV(str) {

    const list = str.split('\n')
    const keys = list.shift().split(',').map(key => key.trim())

    return list.map(line => {
        const keyValues = line.split(',').map((value, index) => [ keys[ index ], value.trim() ])
        return Object.fromEntries( new Map(keyValues) )
    })

}

export default GenericDataSource
