import { Player } from "./Player";
import { State } from "./State";

export class User {
    readonly name: string;
    readonly id: string;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}

export class UserService {
    signUp(state: State, name: string, id: string) : State {
        const user = new User(name, id);
        var activeUsers = new Map(state.activeUsers);
        activeUsers.set(id, user);
        return {...state, activeUsers, currentUser: user};
    }

    login(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = new Map(state.activeUsers);
            activeUsers.set(id, user);
            return {...state, activeUsers, currentUser: user};
        }
        return state;
    }

    lookup(state: State, id: string) : User | null {
        const user = state.activeUsers.get(id);
        if (user) {
            return user;
        }
        // TODO: call API
        return null;
    }

    playerFromUser(user: User) : Player {
        return Player.create(user.name, user.id);
    }

    getActivePlayersDisplay(state: State) : Array<String> {
        var ret = new Array<String>();
        if (state) {
            let i = state.activeUsers.values();
            var user : User; 
            while ((user = i.next().value)) {
                ret.push(user.name);
            }
        }
        return ret;
    }
}