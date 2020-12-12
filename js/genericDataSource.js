import getDataWrapper from './dataWrapper.js'

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

        if (!this.data) {

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
                    const json = JSON.parse(str)
                    records = Object.entries(json)
                    if (typeof this.filter === 'function') {
                        records = records.map(([ key, value ]) => this.filter(key, value))
                    }
                } else {
                    records = this.parseTabData(str, this.filter);
                }

                if (typeof this.sort === 'function') {
                    records.sort(this.sort);
                }
                this.data = records
            }
        }
        return this.data;
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


export default GenericDataSource
