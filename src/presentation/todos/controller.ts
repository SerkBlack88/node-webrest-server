import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

const todos = [
    { id: 1, text: 'text 1', completedAt: new Date() },
    { id: 2, text: 'text 2', completedAt: null },
    { id: 3, text: 'text 3', completedAt: new Date() },
]


export class TodosController {

    //* DI
    constructor() {}

    public getTodos = async(req:Request, res:Response) => {
        try {
            const todosList = await prisma.todo.findMany();
            res.json(todosList);
        }
        catch( error:any ) {
            res.status(500).json({ error: error.message });
        }
        
    }

    public getTodoById = async(req:Request, res: Response) => {
        const id = +req.params.id;

        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        // const todo = todos.find( todo => todo.id === id );

        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${ id } not found` });
    }

    public createTodo = async( req: Request, res: Response ) => {
        // const { text } = req.body;
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if ( error ) return res.status(400).json({ error: error });

        // if ( !text ) return res.status(400).json({ error: 'Text is required' });
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });
        // const todo = await prisma.todo.create({
        //     data: {
        //         text: text
        //     }
        
        // })

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: new Date()
        // }

        // todos.push( newTodo );

        // res.json( newTodo );

        res.json( todo );
    }

    public updateTodo = async ( req: Request, res: Response ) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error: error });
        
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        
        // const todo = todos.find( todo => todo.id === id );
        
        if ( !todo ) return res.status(404).json({ error: `TODO with id ${ id } not found` });
        
        // const { text, completedAt } = req.body;
        //prueba

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        })

        res.json( updatedTodo );

        // todo.text = text || todo.text;
        // ( completedAt === 'null')
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date( completedAt || todo.completedAt );
        // // if ( !text ) return res.status( 400 ).json({ error: 'Text is required' });

        // todo.text = text;
        //! OJO, aquí todo está pasando por referencia
        // Haciendo este forEach ya no se pasa por referencia
        // todos.forEach( (todo, index) => {
        //     if ( todo.id === id ) todos[index] = todo;
        // }


        // res.json( todo );
    }

    public deleteTodo = async(req:Request, res:Response) => {
        const id = +req.params.id;

        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });

        // const todoIndex = todos.findIndex( todo => todo.id === id );

        // if ( todoIndex === -1 ) return res.status(404).json({ error: `TODO with id ${ id } not found` });

        if (!todo) return res.status(404).json({ error: `TODO with id ${ id } not found` });

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: id
            }
        });

        ( deletedTodo )
            ? res.json(deletedTodo)
            : res.status(400).json({ error: `TODO with id ${ id } not found` });

        // todos.splice(todoIndex, 1);

        // res.json({ todo, deletedTodo });
    }
}