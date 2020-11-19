class GenericMapDatasource {

    constructor(config) {

        this.isJSON = config.isJSON || false;

        this.addIndexColumn = config.addIndexColumn || false;

        this.columnDictionary = {};

        for (let column of config.columns) {
            this.columnDictionary[ column ] = column;
        }

        if (config.hiddenColumns || config.titles) {

            this.columnDefs = [];
            const keys = Object.keys(this.columnDictionary);

            if (config.hiddenColumns) {
                for (let column of config.hiddenColumns) {
                    this.columnDefs.push({ visible: false, searchable: false, targets: keys.indexOf(column) })
                }
            }

            if (config.titles) {
                for (let [ column, title ] of Object.entries(config.titles)) {
                    this.columnDefs.push({ title, targets: keys.indexOf(column) })
                }
            }

        } else {
            this.columnDefs = undefined
        }

        if (config.parser) {
            this.parser = config.parser;
        }

        if (config.selectionHandler) {
            this.selectionHandler = config.selectionHandler;
        }

    }

    async tableColumns() {
        return Object.keys(this.columnDictionary);
    }

    async tableData() {

        let response = undefined;

        try {
            response = await fetch(this.path);
        } catch (e) {
            console.error(e)
            return undefined;
        }

        if (response) {

            if (true === this.isJSON) {
                const obj = await response.json();
                return this.parser(obj, this.columnDictionary, this.addIndexColumn);
            } else {
                const str = await response.text();
                return this.parser(str, this.columnDictionary, this.addIndexColumn);
            }
        }
    }

    tableSelectionHandler(selectionList) {
        if (this.selectionHandler) {
            return this.selectionHandler(selectionList)
        } else {
            return selectionList
        }
    };

}

export default GenericMapDatasource
