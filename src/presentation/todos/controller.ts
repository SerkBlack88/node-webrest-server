import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'text 1', completedAt: new Date() },
    { id: 2, text: 'text 2', completedAt: null },
    { id: 3, text: 'text 3', completedAt: new Date() },
]


export class TodosController {

    //* DI
    constructor() {}

    public getTodos = (req:Request, res:Response) => {
        res.json(todos)
    }

    public getTodoById = (req:Request, res: Response) => {
        const id = +req.params.id;

        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = todos.find( todo => todo.id === id );

        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${ id } not found` });
    }

    public createTodo = ( req: Request, res: Response ) => {
        const { text } = req.body;
        if ( !text ) return res.status(400).json({ error: 'Text is required' });
        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: new Date()
        }

        todos.push( newTodo );

        res.json( newTodo );
    }

    public updateTodo = ( req: Request, res: Response ) => {
        const id = +req.params.id;
        
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });
        
        const todo = todos.find( todo => todo.id === id );
        
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${ id } not found` });
        
        const { text, completedAt } = req.body;

        todo.text = text || todo.text;
        ( completedAt === 'null')
            ? todo.completedAt = null
            : todo.completedAt = new Date( completedAt || todo.completedAt );
        // if ( !text ) return res.status( 400 ).json({ error: 'Text is required' });

        todo.text = text;
        //! OJO, aquí todo está pasando por referencia
        // Haciendo este forEach ya no se pasa por referencia
        // todos.forEach( (todo, index) => {
        //     if ( todo.id === id ) todos[index] = todo;
        // }


        res.json( todo );
    }

    public deleteTodo = (req:Request, res:Response) => {
        const id = +req.params.id;

        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todoIndex = todos.findIndex( todo => todo.id === id );

        if ( todoIndex === -1 ) return res.status(404).json({ error: `TODO with id ${ id } not found` });

        todos.splice(todoIndex, 1);

        res.json({ message: `TODO with id ${ id } deleted` });
    }
}