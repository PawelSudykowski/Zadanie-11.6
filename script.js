// metoda czekająca, aż zostanie załadowana cała zawartość strony HTML
document.addEventListener("DOMContentLoaded", function() 
{
    function randomString() 
    {
        var chars = "0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ";
        var str = "";

        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }

        return str;
    }

    // funkcja generująca szablon biblioteki Mustache
    function generateTemplate(name, data, basicElement) 
    {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || "div");

        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);

        return element;
    }    
    
    // class column
    function Column(name) 
    {
        // zapamiętanie wskaźnika this
        var self = this;

        // wypełnienie zmiennych klasy
        this.id = randomString();
        this.name = name;
        this.element = generateTemplate("column-template", { name: this.name, id: this.id });

        // obsługa zdarzenia kliknięcia 
        this.element.querySelector(".column").addEventListener("click", function (event) 
        {
            // remove column
            if (event.target.classList.contains("btn-delete")) 
            {
              self.removeColumn();
            }

            // add card
            if (event.target.classList.contains("add-card")) 
            {
              self.addCard(new Card(prompt("Enter the name of the card")));
            }
        });
    }
    
    // definicja metod 'addCard' oraz 'removeColumn'
    Column.prototype = 
    {
        // add card
        addCard: function(card) 
        {
          this.element.querySelector("ul").appendChild(card.element);
        },
        // remove columns
        removeColumn: function() 
        {
          this.element.parentNode.removeChild(this.element);
        }
    };
    
    // class cart
    function Card(description) 
    {
        // zapamiętuje wskaźnik this
        var self = this;

        // wypełnia zmienne wewnetrzne klasy
        this.id = randomString();
        this.description = description;
        this.element = generateTemplate("card-template", { description: this.description }, "li");

        // obsługa zdarzenia kliknięcia karty
        this.element.querySelector(".card").addEventListener("click", function (event) 
        {
            event.stopPropagation();

            // delate card
            if (event.target.classList.contains("btn-delete")) 
            {
                self.removeCard();
            }
        });
    }
    // dodanie metody 'removeCard'
    Card.prototype = 
    {
        // usuń kartę
        removeCard: function() 
        {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    // obiekt board
    var board = 
    {
        // wypełnienie nazwy
        name: "Kanban Board",
        addColumn: function(column) 
        {
          // add column
          this.element.appendChild(column.element);
          // add drag&drop 
          initSortable(column.id); 
        },
        element: document.querySelector("#board .column-container")
    };
    
    function initSortable(id) 
    {
        // pobranie element
        var el = document.getElementById(id);
        // konfiguracja drag&drop
        var sortable = Sortable.create(el, 
        {
            group: "kanban",
            sort: true
        });
    }
    
    // obsługa cliku przyciksu dodającego kolumnę
    document.querySelector('#board .create-column').addEventListener("click", function() 
    {
        // pobranie nazwy kolumnu za pomocą 'prompt'
        var name = prompt("Enter a column name");
        var column = new Column(name);
        // add column
        board.addColumn(column);
    });    
});