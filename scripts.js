"use strict";
let todoList = []; //declares a new array for Your todo list

let initList = function () {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else
//code creating a default list with 2 items
        todoList.push(
            {
                title: "Learn JS",
                description: "Create a demo application for my TODO's",
                place: "445",
                dueDate: new Date(2019, 10, 16)
            },
            {
                title: "Lecture test",
                description: "Quick test from the first three lectures",
                place: "F6",
                dueDate: new Date(2019, 10, 17)
            }
            // of course the lecture test mentioned above will not take place
        );
};

//initList();
$.ajax({
    // copy Your bin identifier here. It can be obtained in the dashboard
    url: 'https://api.jsonbin.io/b/5dac4f77294fa05a9f437286/latest',
    type: 'GET',
    headers: { //Required only if you are trying to access a private bin
        'secret-key': '$2b$10$yOafVhVFNAOcOLirdEJjZO5FxrpI94jggFgKn6dQeq5jlzumVUGja'
    },
    success: (data) => {
        //console.log(data);
        todoList = data;
    },
    error: (err) => {
        console.log(err.responseJSON);
    }
});

let updateJSONbin = function () {
    $.ajax({
        url: 'https://api.jsonbin.io/b/5dac4f77294fa05a9f437286',
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': '$2b$10$yOafVhVFNAOcOLirdEJjZO5FxrpI94jggFgKn6dQeq5jlzumVUGja'
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
};

let updateTodoList = function () {
    let todoListDiv =
        document.getElementById("todoListView");


    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

//add all elements
    let filterInput = document.getElementById("inputSearch");
    let newTable = document.createElement("table");

    let newHeaderRow = document.createElement("tr");

    let newTitleHeader = document.createElement("th");
    let newTitleContent = document.createTextNode("Title");
    newTitleHeader.appendChild(newTitleContent);

    let newDescriptionHeader = document.createElement("th");
    let newDescriptionContent = document.createTextNode("Description");
    newDescriptionHeader.appendChild(newDescriptionContent);

    newHeaderRow.appendChild(newTitleHeader);
    newHeaderRow.appendChild(newDescriptionHeader);
    newTable.appendChild(newHeaderRow);



    for (let todo in todoList) {

        let newRow = document.createElement("tr");

        if (
            (filterInput.value === "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            let newTitleCell = document.createElement("td");
            let newTitleContent = document.createTextNode(todoList[todo].title);
            newTitleCell.appendChild(newTitleContent);

            let newDescriptionCell = document.createElement("td");
            let newDescriptionContent = document.createTextNode(todoList[todo].description);
            newDescriptionCell.appendChild(newDescriptionContent);

            let newDeleteCell = document.createElement("td");
            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click",
                function () {
                    deleteTodo(todo);
                });
            newDeleteCell.appendChild(newDeleteButton);

            newRow.appendChild(newTitleCell);
            newRow.appendChild(newDescriptionCell);
            newRow.appendChild(newDeleteCell);
        }

        newTable.appendChild(newRow);
    }
    todoListDiv.appendChild(newTable);

};

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
    updateJSONbin();
    todoList.splice(index, 1);
};

let addTodo = function () {
    updateJSONbin();
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");
    //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate
    };
    //add item to the list
    todoList.push(newTodo);
    window.localStorage.setItem("todos", JSON.stringify(todoList));
};