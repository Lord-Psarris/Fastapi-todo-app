from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

todo_items = [
    {
        'id': 1,
        'itemText': 'This is the init todo',
        'checked': True
    },
    {
        'id': 2,
        'itemText': 'This is the second init todo',
        'checked': False
    },
    {
        'id': 3,
        'itemText': 'This is the third init todo',
        'checked': False
    },
]

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root() -> list:
    return todo_items


@app.post("/add-todo")
def add_todo(todo_item: dict) -> dict:
    global todo_items

    todo_items.append(todo_item)

    return {
        "success": True,
        "data": todo_items
    }


@app.put("/toggle-todo/{todo_id}")
def toggle_todo(todo_id: int) -> dict:
    global todo_items

    for item in todo_items:
        if item['id'] == todo_id:
            item['checked'] = not item['checked']

    return {
        "data": todo_items
    }


@app.delete("/delete-todo/{todo_id}")
def toggle_todo(todo_id: int) -> dict:
    global todo_items

    for item in todo_items:
        if item['id'] == todo_id:
            todo_items.pop(todo_items.index(item))

    return {
        "data": todo_items
    }


@app.get("/clear-completed")
def clear_completed() -> dict:
    global todo_items

    for item in todo_items:
        print(item)
        if item['checked']:
            todo_items.pop(todo_items.index(item))
        else:
            continue

    print(todo_items)

    return {
        "success": True,
        "data": todo_items
    }