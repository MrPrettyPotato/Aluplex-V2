// main.js
$(document).ready(function() {
    // Je array met gegevens
    var data = [
       ["Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$3,120"],
       ["Garrett Winters", "Director", "Edinburgh", "8422", "2011/07/25", "$5,300"]
    ];

    // DataTable initialiseren zonder vooraf gedefinieerde thead
    var table = $('#myTable').DataTable({
       data: data,
       columns: [
          { title: "Column 1" },
          { title: "Column 2" },
          { title: "Column 3" },
          { title: "Column 4" },
          { title: "Column 5" },
          { title: "Column 6" }
       ]
    });
 });