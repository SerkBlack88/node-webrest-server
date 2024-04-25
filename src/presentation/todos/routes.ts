import { Router } from "express";
import { TodosController } from "./controller";
import { get } from "http";

export class TodoRoutes {

    static get routes(): Router {

        const router = Router();
        const todoController = new TodosController();

        router.get('/', (req, res) => todoController.getTodos(req, res) );
        router.get('/:id', todoController.getTodoById );

        router.post('/', todoController.createTodo );
        router.put('/:id', todoController.updateTodo );
        router.delete('/:id', todoController.deleteTodo );

        return router;
    }
}