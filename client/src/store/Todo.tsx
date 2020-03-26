export type TodoItem = {
    readonly id: string;
    readonly content: string;
};

export type TodoList = {
    readonly id: string;
    readonly items: ReadonlyArray<TodoItem>;
};

export type State = {
    readonly todoLists: ReadonlyArray<TodoList>; 
}

export const initialState: State = {
    todoLists: [],
};