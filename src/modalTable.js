class ModalTable {

    constructor(args) {

        this.datasource = args.datasource
        this.okHandler = args.okHandler

        this.pageLength = args.pageLength || 10

        if (args.selectionStyle) {
            this.select = {style: args.selectionStyle}
        } else {
            this.select = true;
        }

        const id = args.id
        const title = args.title || ''
        const parent = args.parent ? $(args.parent) : $('body')
        const html = `
        <div id="${id}" class="modal fade">
        
            <div class="modal-dialog modal-xl">
        
                <div class="modal-content">
        
                    <div class="modal-header">
                        <div class="modal-title">${title}</div>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
        
                    <div class="modal-body">
        
                        <div id="${id}-spinner" class="spinner-border" style="display: none;">
                            <!-- spinner -->
                        </div>
        
                        <div id="${id}-datatable-container">
        
                        </div>
                        
                        <!-- description -->
                        <div>
                        </div>
                    </div>
        
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">OK</button>
                    </div>
        
                </div>
        
            </div>
        
        </div>
    `
        const $m = $(html)
        parent.append($m)

        this.$modal = $m
        this.$datatableContainer = $m.find(`#${id}-datatable-container`)
        this.$spinner = $m.find(`#${id}-spinner`)
        const $okButton = $m.find('.modal-footer button:nth-child(2)')

        $m.on('shown.bs.modal', (e) => {
            this.buildTable()
        })

        $m.on('hidden.bs.modal', (e) => {
            $(e.relatedTarget).find('tr.selected').removeClass('selected')
        })

        $okButton.on('click', (e) => {
            const selected = this.getSelectedTableRowsData.call(this, this.$dataTable.$('tr.selected'))
            if (selected && this.okHandler) {
                this.okHandler(selected)
            }
        })
    }

    setTitle(title) {
        this.$modal.find('.modal-title').text(`${ title }`)
    }

    setDescription(description) {
        this.$modal.find('.modal-body').children().last().html(`${ description }`)
    }

    remove() {
        this.$modal.remove()
    }

    setDatasource(datasource) {
        this.datasource = datasource
        this.$datatableContainer.empty()
        this.$table = undefined
    }

    async buildTable() {

        if (!this.$table && this.datasource) {

            this.$table = $('<table class="display"></table>')
            this.$datatableContainer.append(this.$table)

            try {
                this.startSpinner()

                const tableData = await this.datasource.tableData()
                const tableColumns = await this.datasource.tableColumns()
                const columnDefs = this.datasource.columnDefs;
                const config =
                    {
                        data: tableData,
                        columns: tableColumns.map(c => {
                            if (columnDefs && columnDefs[c]) {
                                return Object.assign({}, columnDefs[c], {data: c});
                            } else {
                                return {title: c, data: c}
                            }
                        }),
                        pageLength: this.pageLength,
                        select: this.select,
                        autoWidth: false,
                        paging: true,
                        scrollX: true,
                        scrollY: '400px',
                    };


                // API object
                this.api = this.$table.DataTable(config);

                // Preserve sort order. For some reason it gets garbled by default
                // this.api.column( 0 ).data().sort().draw();

                // Adjust column widths
                this.api.columns.adjust().draw()

                // jQuery object
                this.$dataTable = this.$table.dataTable()

                this.tableData = tableData


            } catch (e) {

            } finally {
                this.stopSpinner()
            }
        }
    }

    getSelectedTableRowsData($rows) {
        const tableData = this.tableData
        const result = []
        if ($rows.length > 0) {
            $rows.removeClass('selected')
            const api = this.$table.api()
            $rows.each(function () {
                const index = api.row(this).index()
                result.push(tableData[index])
            })
            if (typeof this.datasource.rowHandler === 'function') {

                const config = result.map(row => {
                    const thang = this.datasource.rowHandler(row)
                    const filteredKeys = Object.keys(row).filter(key => this.datasource.columns.includes(key))
                    thang.metadata = {}
                    for (let key of filteredKeys) {
                        thang.metadata[ key ] = row[ key ]
                    }
                    return thang
                })

                return config
            } else {
                return result;
            }
        } else {
            return undefined;
        }
    }

    startSpinner() {
        if (this.$spinner)
            this.$spinner.show()
    }

    stopSpinner() {
        if (this.$spinner)
            this.$spinner.hide()
    }

}

export default ModalTable
