import getDataWrapper from './dataWrapper.js'
import { igvxhr } from "../node_modules/igv-utils/src/index.js";

const extensions = new Set([ 'csv', 'tab', 'json' ])
class GenericDataSource {

    constructor(config) {

        this.columns = config.columns;   // Required for now, could default to all columns
        this.columnDefs = config.columnDefs       // optional
        this.rowHandler = config.rowHandler;      // optional
        this.delimiter = config.delimiter         // optional

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
        } else if (extensions.has( (this.delimiter || GenericDataSource.getExtension(this.data)) )) {

            const extension = this.delimiter || GenericDataSource.getExtension(this.data)

            let result
            try {
                result = 'json' === extension ? await igvxhr.loadJson(this.data) : await igvxhr.loadString(this.data)
            } catch (e){
                console.error(e)
                return undefined
            }

            if (result) {

                switch (extension) {
                    case 'csv': return parseCSV(result)
                    case 'tab': return this.parseTabData(result)
                    default: /* json */ return result
                }

            }

        }

        return undefined
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

    static getExtension(url) {

        const path = (url instanceof File) ? url.name : url
        const filename = path.toLowerCase()

        const index = filename.lastIndexOf(".")

        return index < 0 ? filename : filename.substr(1 + index)
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
