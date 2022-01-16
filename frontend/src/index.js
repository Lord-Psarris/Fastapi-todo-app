/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Header() {

    function toggleTheme(theme) {
        localStorage.setItem("theme", theme);
        document.body.classList.toggle("dark");
        document.getElementsByClassName('toggle-day')[0].classList.toggle('active')
        document.getElementsByClassName('toggle-night')[0].classList.toggle('active')
    }

    return (
        <div class="header">
            <h1>Todo</h1>
            <div class="toggle-icons">
                <a href="#" onClick={() => toggleTheme('light')} class="toggle-day">
                    <img src={require("./images/icon-sun.svg").default} alt="light toggle" />
                </a>

                <a href="#" onClick={() => toggleTheme('dark')} class="toggle-night">
                    <img src={require("./images/icon-moon.svg").default} alt="dark toggle" />
                </a>
            </div>
        </div>
    )
}

function AddTodo(props) {
    return (
        <div class="add-todo">
            <div class="box">
                <div class="check">
                    <input type="checkbox" name="" id="main-checkbox" />
                    <label for="main-checkbox" class="check-label" >
                        <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                    </label>
                </div>
                <input onKeyDown={props.addNewTodoItem} type="text" placeholder="Create a new todo" />
            </div>
        </div >
    )
}

class TodoWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: this.props.todoItems
        }
    }

    handleSelectAll(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')
        var todoItemsList = this.props.todoItems

        this.setState({ todoItems: todoItemsList })
    }

    handleSelectActive(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')

        var todoItemsList = this.props.todoItems
        var newTodoItemsList = []

        for (let i = 0; i < todoItemsList.length; i++) {
            let currentItem = todoItemsList[i]
            if (currentItem.checked === false) {
                newTodoItemsList.push(currentItem)
            }
        }

        this.setState({ todoItems: newTodoItemsList })
    }

    handleSelectCompleted(event) {
        document.querySelector('.switch-tab > a.active').classList.remove('active')
        event.target.classList.add('active')

        var todoItemsList = this.props.todoItems
        var newTodoItemsList = []

        for (let i = 0; i < todoItemsList.length; i++) {
            let currentItem = todoItemsList[i]
            if (currentItem.checked === true) {
                newTodoItemsList.push(currentItem)
            }
        }

        this.setState({ todoItems: newTodoItemsList })
    }


    render() {
        const todoItemsList = this.props.todoItems
        const checkedItems = this.props.checkedItems
        const todoItems = todoItemsList.map((todoItem, step) => {
            return (<TodoItem key={todoItem.id} itemId={todoItem.id} itemText={todoItem.itemText}
                deleteItem={this.props.deleteItem} checkItem={this.props.checkItem} itemChecked={todoItem.checked} />);
        })
        return (
            <div class="todos">
                <div id="todo-items">
                    {todoItems}
                    <TodoOptions
                        clearCompleted={this.props.clearCompleted}
                        selectOptionsAll={(Event) => this.handleSelectAll(Event)}
                        selectOptionsActive={(Event) => this.handleSelectActive(Event)}
                        selectOptionsCompleted={(Event) => this.handleSelectCompleted(Event)} checkedItems={checkedItems} />
                </div>
            </div>
        )
    }
}


// curent issue. fix the checkbox
class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: 0
        }
    }


    render() {
        const itemId = this.props.itemId
        const itemText = this.props.itemText
        const isChecked = this.props.itemChecked

        if (isChecked) {
            return (
                <div id={itemId}>
                    <div class="box">
                        <div class="check">
                            <input checked={true} data-id={itemId} onChange={this.props.checkItem} type="checkbox" name="" id={"checkbox-" + itemId} class="checkbox" />
                            <label for={"checkbox-" + itemId} class="check-label">
                                <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                            </label>
                        </div>

                        <p class={"checked checkbox-" + itemId}>{itemText}</p>
                        <div data-id={itemId} class="close" onClick={this.props.deleteItem}>
                            <img src={require("./images/icon-cross.svg").default} alt="cross" />
                        </div>
                    </div>
                    <span class="hr"></span>
                </div>
            )
        } else {
            return (
                <div id={itemId}>
                    <div class="box">
                        <div class="check">
                            <input checked={false} data-id={itemId} onChange={this.props.checkItem} type="checkbox" name="" id={"checkbox-" + itemId} class="checkbox" />
                            <label for={"checkbox-" + itemId} class="check-label">
                                <img src={require("./images/icon-check.svg").default} alt="check-mark" class="check-mark" />
                            </label>
                        </div>

                        <p class={"checkbox-" + itemId}>{itemText}</p>
                        <div data-id={itemId} class="close" onClick={this.props.deleteItem}>
                            <img src={require("./images/icon-cross.svg").default} alt="cross" />
                        </div>
                    </div>
                    <span class="hr"></span>
                </div>
            )
        }

    }
}

function TodoOptions(props) {
    return (
        <div class="others">
            <span>
                <i id="count">{props.checkedItems}</i>
                &nbsp;items left
            </span>
            <p class="switch-tab">
                <a href="#" class="active" onClick={props.selectOptionsAll}>All</a>
                <a href="#" onClick={props.selectOptionsActive}>Active</a>
                <a href="#" onClick={props.selectOptionsCompleted}>Completed</a>
            </p>
            <a href="#" class="clear" onClick={props.clearCompleted}>Clear Completed</a>
        </div>
    )
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: [],
            todoItemCount: 0,
            checkedTodoItemsCount: 0,
        }
    }

    async componentDidMount() {
        var checkedItemsCount = this.state.checkedTodoItemsCount
        var todoItemCount = this.state.todoItemCount
        const response = await fetch("http://localhost:8000/")
        const todos = await response.json()
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].checked) {
                checkedItemsCount++
            }
            todoItemCount++
        }
        this.setState({ todoItems: todos, checkedTodoItemsCount: checkedItemsCount, todoItemCount: todoItemCount })
    }

    handleClearCompleted() {
        var checkedItemsCount = 0
        var todoItemCount = this.state.todoItemCount
        fetch("http://localhost:8000/clear-completed")
            .then((response) => response.json()).then((data) => {
                var todos = data.data
                for (let i = 0; i < todos.length; i++) {
                    if (todos[i].checked) {
                        checkedItemsCount++
                    }
                    todoItemCount++
                }
                this.setState({ todoItems: todos, checkedTodoItemsCount: checkedItemsCount, todoItemCount: todoItemCount })
            })
    }

    handleCheckTodoItem(event) {
        var checkedItemsCount = this.state.checkedTodoItemsCount
        var itemId = event.target.getAttribute('data-id')

        fetch("http://localhost:8000/toggle-todo/" + itemId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: itemId
        })
            .then((response) => response.json()).then((data) => {
                var todos = data.data
                console.log(todos)

                for (let i = 0; i < todos.length; i++) {
                    if (todos[i].id == itemId && todos[i].checked) {
                        checkedItemsCount++
                    } else if (todos[i].id == itemId) {
                        checkedItemsCount--
                    }
                }

                this.setState({ todoItems: todos, checkedTodoItemsCount: checkedItemsCount })
            })
    }

    handleDeleteTodoItem(event) {
        var checkedItemsCount = 0
        // var todoItems = this.state.todoItems
        var currentId = this.state.todoItemCount
        var todoItemId = event.target.getAttribute('data-id')

        fetch("http://localhost:8000/delete-todo/" + todoItemId, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: todoItemId
        })
            .then((response) => response.json()).then((data) => {
                var todos = data.data
                currentId = todos.length - 1
                for (let i = 0; i < todos.length; i++) {
                    if (todos[i].checked) {
                        checkedItemsCount++
                    }
                }
                this.setState({ todoItems: todos, todoItemCount: currentId, checkedTodoItemsCount: checkedItemsCount })
            })
    }

    handleAddNewTodoItem(event) {
        if (event.key === 'Enter') {
            if (event.target.value === '') {
                return false;
            }
            var todoItems = this.state.todoItems
            var currentId = this.state.todoItemCount
            currentId++
            var item = {
                id: currentId,
                itemText: event.target.value,
                checked: false,
            }

            todoItems.push(item)

            fetch("http://localhost:8000/add-todo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item)
            })
                .then((response) => response.json()).then((data) => {
                    this.setState({ todoItems: data.data, todoItemCount: currentId })
                    event.target.value = ''
                })
        }
    }

    render() {
        const itemsCount = this.state.todoItems.length - this.state.checkedTodoItemsCount
        return (
            <main>
                <Header />
                <AddTodo addNewTodoItem={(Event) => this.handleAddNewTodoItem(Event)} />
                <TodoWrapper
                    clearCompleted={() => this.handleClearCompleted()}
                    deleteItem={(Event) => this.handleDeleteTodoItem(Event)}
                    checkItem={(Event) => this.handleCheckTodoItem(Event)}
                    checkedItems={itemsCount}
                    todoItems={this.state.todoItems} />
            </main>
        )
    }
}


ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
);

// other functions
function detectColorScheme() {
    var theme = "light";    //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") === "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
    }

    //dark theme preferred, set document with a `dark` class
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.getElementsByClassName('toggle-day')[0].classList.add('active')
    } else {
        document.getElementsByClassName('toggle-night')[0].classList.add('active')

    }
}

detectColorScheme();
