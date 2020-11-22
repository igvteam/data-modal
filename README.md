# data-modal
A data resource browser and selector based on DataTables.  Used by igv applications for selecting files from ENCODE and other data resources.

#### Use

Use of data-modal requires Bootstrp 4 and Datatables

```
    <!-- Bootstrap 4 CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <!-- DataTables CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.20/sl-1.3.1/datatables.min.css"/>

    <!-- Bootstrap 4 and Dependancies -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

    <!-- Datatables JS -->
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.20/sl-1.3.1/datatables.min.js"></script>
```

A data-modal is typically launched from a button

```
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#simpleModal">
    Open Data Modal
</button>
```

The data-modal table is backed by in instance of ModalTable,  with an id attribute == the data-target id in the corresponding html.   The html above presumes the existence of a ModalTable object with ```id = simpleModal```

```
new ModalTable({
        id: "simpleModal",
        title: "Simple Modal",
        datasource: new TestDataSource(),
        okHandler: selected => {
            console.log(selected)
        }
    })
```

### ModalTable constructor

* ```id``` Identifier.  

* ```datasource``` A datasource object, see below.

* ```okHandler``` Called with selected rows on dismissal of the dialog with "OK".  

* ```pageLength``` Number of rows to display per page

* ```selectionStyle```  either `single` or `multi`

* ```title```  Dialog title

* ```parent```  Parent element of the modal.  If not supplied the parent is ```body```.

#### datasource

A ModalTable fetches data to build the table from a datasource.  Datasource object properties include 

* ``` async tableColumns() ```  Required.  Return the column headings as an array of strings

* ``` async tableData()  ```  Required. Return the table data as an array of objects.  Each object has properties corresponding to the table columns

* ``` columnDefs```   Optional.  See [datatable reference](https://datatables.net/reference/option/columns) for details.

#### GenericDataSource

A datasource can be instantiated from class GenericDataSource by supplying a configuration object with the following properties

* ```columns```  Required. Array of strings representing a key for each column.  Data for cells are fetched from row json with these keys. In the absence of columnDefs (below) the keys will be used for column labels.

* ```columnDefs``` Optional.  Key-value object store for column definitions.  Key is the column identifier, value is a json `columnDef` object as documented [here](https://datatables.net/reference/option/columns).

* ```rowHandler``` Function which takes a row json object and returns a transformed json object prior to passing selections to ```okHandler```.

Data for the table can be supplied explicitly, as an array of JSON (or JSON-like) objects, or read from a url.   One of either ```data``` or ```url``` must be supplied.

* ```data```  An array of simple objects or JSON containing data for the table, one object for each row.  Property names should match the ```columns``` keys above.

* ```url```  URL to file containing table data.  File can be either tab delimited, or JSON, with an array of objects as descibed above.  If the ```data``` property is used the ```URL``` property, and all properties below, are ignored.

* ```isJSON``` Flag indicating the format of the contents of ```url```, either JSON (if true) or tab delimited (if false or not set).

* ```parser```  Optional function to parse the contents of ```URL```.   Input is url content, output is array of JSON objects

* ```sort```  Optional function to sort rows before table initialization.  Function is actually a comparator for sort, taking a pair of row JSON objects.






