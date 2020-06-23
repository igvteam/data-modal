
const encodeTrackDatasourceConfigurator = genomeId => {

    return {
        isJSON: false,
        genomeId,
        dataSetPathPrefix: 'https://www.encodeproject.org',
        urlPrefix: 'https://s3.amazonaws.com/igv.org.app/encode/',
        dataSetPath: undefined,
        addIndexColumn: false,
        columns:
            [
                'ID',           // hide
                'Assembly',     // hide
                'Biosample',
                'Target',
                'AssayType',
                'OutputType',
                'BioRep',
                'TechRep',
                'Format',
                'Experiment',
                'Accession',
                'Lab',
                'HREF'         // hide
            ],
        titles:
            {
                AssayType: 'Assay Type',
                OutputType: 'Output Type',
                BioRep: 'Bio Rep',
                TechRep: 'Tech Rep'
            },
        hiddenColumns:
            [
                'ID',
                'Assembly',
                'HREF'
            ],
        parser: undefined,
        selectionHandler: selectionList => {
            return selectionList.map(({ name, HREF }) => {
                return { name, url: HREF }
            })
        }

    }

}

export { encodeTrackDatasourceConfigurator }
