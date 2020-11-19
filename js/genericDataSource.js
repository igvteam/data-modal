import getDataWrapper from './dataWrapper.js'

class GenericDataSource {

    constructor(config) {

        if (config.rowHandler) {
            this.rowHandler = config.rowHandler;
        }

        if (config.data) {
            this.data = config.data;  // Explcitly set table rows as array of json objects
        } else {
            this.url = config.url;     // URL to data source
            this.isJSON = config.isJSON || false;
            if (config.parser) {
                this.parser = parser;
            }
            if (config.filter) {
                this.filter = config.filter
            }
            if (config.sort) {
                this.sort = config.sort;
            }
        }

        this.configureColumns(config)

    }

    configureColumns(config) {

        this.columnDictionary = {};

        for (let column of config.columns) {
            this.columnDictionary[column] = column;
        }

        if (config.hiddenColumns || config.titles) {

            this.columnDefs = [];
            const keys = Object.keys(this.columnDictionary);

            if (config.hiddenColumns) {
                for (let column of config.hiddenColumns) {
                    this.columnDefs.push({visible: false, searchable: false, targets: keys.indexOf(column)})
                }
            }

            if (config.titles) {
                for (let [column, title] of Object.entries(config.titles)) {
                    this.columnDefs.push({title, targets: keys.indexOf(column)})
                }
            }

        } else {
            this.columnDefs = undefined
        }
    }

    async tableColumns() {
        return Object.keys(this.columnDictionary);
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
