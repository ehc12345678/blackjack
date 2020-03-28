import { Player } from '../../client/src/store/Player';
import { State } from '../../client/src/store/State';

export type UserIdPair = {
    id: string,
    name: string
};

export class UserService {
    registeredUsers: Map<String, Player>;

    constructor() {
        this.registeredUsers = new Map();
    }

    getNewLoginId(state: State) : string {
        return "user" + state.activeUsers.length;
    }

    signUp(state: State, name: string) : string {
        const id =  this.getNewLoginId(state);
        const user = {id, name, currentBet: 80, chipBalance: 5000, cashBalance: 100} as Player;
        this.registeredUsers.set(id, user);
        return id;
    }

    login(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = [...state.activeUsers, user];
            state = {...state, activeUsers};
            console.log('Logged in user=' + id + " state=" + JSON.stringify(state));
        }
        return state;
    }

    logout(state: State, id: string) : State {
        const user = this.lookup(state, id);
        if (user) {
            var activeUsers = state.activeUsers.filter(u => u.id !== user.id);
            state = {...state, activeUsers};
        }
        return state;
    }

    lookup(state: State, id: string) : Player | null {
        const user = this.registeredUsers.get(id);
        if (user) {
            return user;
        }
        console.log('Could not find user with id=' + id);
        return null;
    }

    getRegistered() : Array<UserIdPair> {
        var ret = [];
        let i = this.registeredUsers.values();
        var user : Player; 
        while ((user = i.next().value)) {
            ret.push({id: user.id, name: user.name});
        }
        return ret;
    }

    getActivePlayersDisplay(state: State) : Array<String> {
        return state.activeUsers.map(u => u.id);
    }
}
export const theUserService = new UserService();