import { Player } from '../../client/src/store/Player';
import { State } from '../../client/src/store/State';

type UserIdPair = {
  id: string;
  name: string;
};

export class UserService {
  registeredUsers: Map<String, Player>;

  constructor() {
    this.registeredUsers = new Map();
  }

  signUp(state: State, name: string, loginId: string): string {
    const id = loginId;
    const user = {
      id,
      name,
      currentBet: 80,
      chipBalance: 5000,
      cashBalance: 100,
    } as Player;
    this.registeredUsers.set(id, user);
    return id;
  }

  login(state: State, id: string): State {
    const user = this.lookup(id);
    if (user && !this.isLoggedIn(state, id)) {
      var activeUsers = [...state.activeUsers, user];
      state = { ...state, activeUsers };
    }
    return state;
  }

  logout(state: State, id: string): State {
    const user = this.lookup(id);
    if (user) {
      var activeUsers = state.activeUsers.filter((u) => u.id !== user.id);
      state = { ...state, activeUsers };
    }
    return state;
  }

  lookup(id: string): Player | null {
    const user = this.registeredUsers.get(id);
    if (user) {
      return user;
    }
    console.log('Could not find user with id=' + id);
    return null;
  }

  getRegistered(): Array<Player> {
    var ret = [];
    let i = this.registeredUsers.values();
    var user: Player;
    while ((user = i.next().value)) {
      ret.push({ ...user });
    }
    return ret;
  }

  isLoggedIn(state: State, loginId: string): boolean {
    return state.activeUsers.find((u) => u.id === loginId) !== undefined;
  }

  modifyPlayer(state: State, player: Player) {
    var activeUsers = state.activeUsers.map((p) => {
      if (p.id === player.id) {
        return player;
      }
      return p;
    });
    return { ...state, activeUsers };
  }
}
export const theUserService = new UserService();
