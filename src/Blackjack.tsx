import React, {Component} from 'react'; 
import { UserService } from './store/UserService';
import { GameService } from './store/GameService';
import { State, defaultState } from './store/State';
import { PlayerComponent } from './views/Components/PlayerComponent';
import { HandComponent } from './views/Components/HandComponent';
import './App.css';
import { Hand } from './store/Hand';

type BlackjackProps = {

};

export class Blackjack extends Component<BlackjackProps, State> {
   userService: UserService;
   gameService: GameService;
   
   constructor(props: BlackjackProps) {
       super(props);
       this.userService = new UserService();
       this.gameService = new GameService();
       this.state = defaultState;
   }

   handleLogin() {
       const index = this.state.activeUsers.size;
       var state = (this.userService.signUp(this.state, 'Login ' + index, 'login' + index));
       state = this.userService.login(state, 'user' + index);
       if (state.currentUser !== null) {
            state = this.gameService.addPlayer(state, this.userService.playerFromUser(state.currentUser));
       }
       this.setState(state);
   }

   handleRegister() {
      const index = this.state.activeUsers.size;
      var state = (this.userService.signUp(this.state, 'Register ' + index, 'register' + index));
      if (state.currentUser !== null) {
        state = this.gameService.addPlayer(state, this.userService.playerFromUser(state.currentUser));
      }
      this.setState(state);
   }

   handleCreateGame() {
      this.setState(this.gameService.createGame(this.state));
   }

   handleStartGame() {
       this.setState(this.gameService.startGame(this.state));
   }

   getActiveHand(state: State) : Hand {
       if (state.activeHand < state.playersHands.length) {
           return state.playersHands[state.activeHand];
       }
       return state.dealersHand;
   }

   onHit() {
       var state = this.gameService.handService.hitActiveHand(this.state);
       this.setState(state);
       if (this.isDealerInControl(state)) {
           this.fireDealerTakesControl(state);
       }
   }

   onStay() {
       var state = this.gameService.handService.stayActiveHand(this.state); 
       this.setState(state);
       if (this.isDealerInControl(state)) {
           this.fireDealerTakesControl(state);
       }
   }

   onDealerInControl(state: State) {
       if (this.state.dealersHand.shouldHit()) {
          state = this.gameService.handService.dealerTakesCard(this.state);
          this.fireDealerTakesControl(state);
       } else {
          state = this.gameService.handService.endTurn(this.state);
       }
       this.setState(state);
   }

   handleNextTurn() {
       var state = this.gameService.handService.startTurn(this.state);
       this.setState(state);
   }

    private fireDealerTakesControl(state: State) {
        window.setTimeout(() => this.onDealerInControl(state), 1000);
    }

   isDealerInControl(state: State) : boolean {
       var activeHand = this.getActiveHand(state);
       var inControl = activeHand === state.dealersHand;
       console.log('hand=' + state.activeHand + " " + inControl);
       return inControl;
   }

   getNextTurnButton() { 
       if (!this.state.turnIsGoing) {
          return <button onClick={() => this.handleNextTurn()}>Next Turn</button>; 
       }
   }

   render() {
       return (
          <div>
            <div>
                <button onClick={() => this.handleLogin()}>Login</button>
                <button onClick={() => this.handleRegister()}>Register</button>              
            </div>
            <div>
                <button onClick={() => this.handleStartGame()}>Start Game</button>              
                {this.getNextTurnButton()}             
            </div>
            <div>
                Current: {this.state.currentUser?.name}
            </div>
            <div>
                <h2>Game</h2>
                <table>
                    <tr>
                        {this.state.currentGame.players.map((value) => {
                            return <td>
                                <PlayerComponent player={value} 
                                    hands={this.gameService.getHandsForPlayer(this.state, value)} 
                                    activeHand={this.getActiveHand(this.state)} 
                                    onHit={() => this.onHit()} 
                                    onStay={() => this.onStay()}/>
                            </td>
                        })}
                    </tr>
                    <tr>
                        <td>Dealer</td>
                        <td>
                            <HandComponent hand={this.state.dealersHand} 
                                isActive={this.getActiveHand(this.state) === this.state.dealersHand}
                                onHit={() => this.onHit()} 
                                onStay={() => this.onStay()}/>
                        </td>
                    </tr>
                </table>
            </div>
          </div>
       )
   }
}