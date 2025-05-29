import getDataWrapper from './dataWrapper.js'
import stringLoader from "./stringLoader.js"

const delimiters = new Set(['\t', ','])

class GenericDataSource {

    constructor(config) {

        this.stringLoader = config.igvxhr ? config.igvxhr : stringLoader
        this.columns = config.columns   // Required for now, could default to all columns
        this.columnDefs = config.columnDefs       // optional
        this.rowHandler = config.rowHandler// optional

        this.delimiter = undefined
        if (config.delimiter) {
            this.delimiter = config.delimiter
        }

        if (config.data) {
            this.data = config.data  // Explcitly set table rows as array of json objects
        } else {
            this.url = config.url     // URL to data source -- required
            this.isJSON = config.isJSON || false   // optional, defaults to false (tab delimited)
            this.parser = config.parser                   // optional
            this.filter = config.filter             // optional
            this.sort = config.sort                // optional
        }
    }

    async tableColumns() {
        return this.columns
    }

    async tableData() {

        if (undefined === this.data) {

            let str = undefined
            try {
                str = await this.stringLoader.loadString(this.url)
            } catch (e) {
                console.error(e)
                return undefined
            }

            if (str) {

                let records
                if (this.parser) {
                    records = this.parser.parse(str)
                } else if (this.isJSON) {
                    records = JSON.parse(str)
                    if (typeof this.filter === 'function') {
                        records = records.filter(this.filter)
                    }
                } else {
                    records = this.parseTabData(str, this.filter)
                }

                if (typeof this.sort === 'function') {
                    records.sort(this.sort)
                }

                // this.data = records
                return records
            }
        } else if (Array.isArray(this.data)) {
            return this.data
        } else if ('json' === GenericDataSource.getExtension(this.data) || delimiters.has(getDelimiter(this.data, this.delimiter))) {

            const extension = GenericDataSource.getExtension(this.data)
            const delimiter = getDelimiter(this.data, this.delimiter)

            let result
            try {
                result = 'json' === extension ? await this.stringLoader.loadJson(this.data) : await this.stringLoader.loadString(this.data)
            } catch (e) {
                console.error(e)
                return undefined
            }

            if (result) {

                if ('json' === extension) {
                    return result
                } else if (delimiter) {

                    switch (delimiter) {
                        case '\t'   :
                            return this.parseTabData(result)
                        case ','    :
                            return parseCSV(result)
                    }
                }

            }

        }

        return undefined
    }

    parseTabData(str, filter) {

        const dataWrapper = getDataWrapper(str)

        const headerLine = dataWrapper.nextLine()  // Skip header
        const headers = headerLine.split('\t').map(key => key.trim())

        const records = []
        let line

        while (line = dataWrapper.nextLine()) {

            const record = {}

            const tokens = line.split(`\t`).map(key => key.trim())
            if (tokens.length !== headers.length) {
                throw Error("Number of values must equal number of headers in file " + this.url)
            }

            for (let i = 0; i < headers.length; i++) {
                record[headers[i]] = tokens[i]
            }

            if (undefined === filter || filter(record)) {
                records.push(record)
            }

        } // while(line)

        return records
    }

    static getExtension(url) {

        const path = (url instanceof File) ? url.name : url

        // Strip parameters (handles Dropbox URLs)
        let filename = path.toLowerCase()

        let index

        index = filename.indexOf('?')
        if (index > 0) {
            filename = filename.substr(0, index)
        }

        index = filename.lastIndexOf(".")
        return index < 0 ? filename : filename.substr(1 + index)
    }

}

function getDelimiter(data, delimiter) {
    return delimiter || getDelimiterForExtension(GenericDataSource.getExtension(data))

}

function getDelimiterForExtension(extension) {
    switch (extension) {
        case 'tab' :
            return '\t'
        case 'csv' :
            return ','
        default:
            return undefined
    }
}

function parseCSV(str) {

    const list = str.split('\n')
    const keys = list.shift().split(',').map(key => key.trim())

    return list.map(line => {
        const keyValues = line.split(',').map((value, index) => [keys[index], value.trim()])
        return Object.fromEntries(new Map(keyValues))
    })

}


export default GenericDataSource
