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

The data-modal table is backed by in instance of ModalTable,  with an id attribute == the data-target id in the corresponding html.   The html above presumes the existence of a ModalTable object with ```id = customModal```

```
new ModalTable({
        id: "simpleModal",
        title: "Simple Modal",
        datasource: new TestDataSource(),
        selectHandler: selected => {
            console.log(selected)
        }
    })
```

### ModalTable constructor

* ```datasource```

* ```selectHandler```

* ```pageLength```

* ```selectionStyle```

* ```id```

* ```title```

* ```parent``` 

#### datasource

A ModalTable fetches data to build the table from a datasource.  

* ``` async tableColumns() ```  Return the column headings as an array of strings

* ``` async tableData()  ```  Return the table data as an array of objects.  Each object has properties corresponding to the table columns

* ``` tableSelectionHandler(result) ```  Optional, receives an array of objects for selected rows and returns an array of transformed objects for passing the the selectHandler. 

* ``` columnDefs```   Optional

