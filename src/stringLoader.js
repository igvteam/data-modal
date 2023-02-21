
// Default string loader implementation

export default {
    loadString: async (path, options) => {
            options = options || {}
            if (path instanceof File) {
                const blob = options.range ? path.slice(options.range.start, options.range.start + options.range.size) : path
                return blob.text()
            } else {
                const response = await fetch(path)
                return response.text()
            }
    },

    loadJson: async function (url, options) {
        const result = await this.loadString(url, options)
        if (result) {
            return JSON.parse(result)
        } else {
            return result
        }
    }
}


