import { Player } from '../../client/src/store/Player';
import { State } from '../../client/src/store/State';
import { User } from '../../client/src/store/User';

export class UserService {
    getNewLoginId(state: State) : string {
        return "user" + state.activeUsers.size;
    }

    signUp(state: State, name: string, id: string) : State {
        const user = {name, id} as User;
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

    logout(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = new Map(state.activeUsers);
            activeUsers.delete(id);
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