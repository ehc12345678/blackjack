import { Player } from './Player';

export class Game {
    readonly players: Array<Player>;

    constructor(players: Array<Player> = []) {
        this.players = players;
    }

    addPlayer(player: Player) : Game {
        return new Game([...this.players, player]);
    }

    removePlayer(player: Player) {
        return new Game(this.players.filter(p => p.id() !== player.id()));
    }

    modifyPlayer(player: Player) : Game {
        var players = this.players.map((item) => {
            if (item.id() !== player.id()) {
              // This isn't the item we care about - keep it as-is
              return item;
            }
        
            return player;
          });
        return new Game(players);
    }
}