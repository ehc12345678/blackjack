import { Player } from '../../client/src/store/Player';
import { State } from '../../client/src/store/State';
import { User } from '../../client/src/store/User';

export class UserService {
    registeredUsers: Map<String, User>;

    constructor() {
        this.registeredUsers = new Map();
    }

    getNewLoginId(state: State) : string {
        return "user" + state.activeUsers.size;
    }

    signUp(state: State, name: string) : string {
        const id =  this.getNewLoginId(state);
        const user = {name, id} as User;
        this.registeredUsers.set(id, user);
        return id;
    }

    login(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = new Map(state.activeUsers);
            activeUsers.set(id, user);
            return {...state, activeUsers};
        }
        return state;
    }

    logout(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = new Map(state.activeUsers);
            activeUsers.delete(id);
            return {...state, activeUsers};
        }
        return state;
    }

    lookup(state: State, id: string) : User | null {
        const user = this.registeredUsers.get(id);
        if (user) {
            return user;
        }
        return null;
    }

    playerFromUser(user: User) : Player {
        return {name: user.name, id: user.id} as Player;
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