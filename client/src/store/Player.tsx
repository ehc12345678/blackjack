const CHIPS_PER_DOLLAR = 100;

type Data = {
    readonly chipBalance: number;
    readonly cashBalance: number;
    readonly name: string;
    readonly id: string;
    readonly currentBet: number;    
}

export class Player {
    readonly data: Data;

    constructor(data: Data) {
        this.data = data;
    }    

    static create(name: string, id: string) : Player {
        return new Player({name, id, chipBalance: 5000, cashBalance: 100, currentBet: 40});
    }

    public setCurrentBet(currentBet: number) : Player {
        return new Player({...this.data, currentBet});
    }

    public cashBalance() : number {
        return this.data.cashBalance;
    }

    public chipBalance() : number {
        return this.data.chipBalance;
    }

    public currentBet() : number {
        return this.data.currentBet;
    }

    public id(): string {
        return this.data.id;
    }

    public name(): string {
        return this.data.name;
    }

    public buyChips(cash: number) : Player {
        if (cash < this.cashBalance()) {
            var cashBalance = this.cashBalance() - cash;
            var chipBalance = this.chipBalance() + (cash * CHIPS_PER_DOLLAR);
            return new Player({...this.data, chipBalance, cashBalance});
        }
        return this;
    }

    public cashOut(chips: number) : Player {
        if (chips < this.chipBalance()) {
            var cashBalance = this.cashBalance() + (chips / CHIPS_PER_DOLLAR);
            var chipBalance = this.chipBalance() - chips;
            return new Player({...this.data, chipBalance, cashBalance});
        }
        return this;
    }

    public addChips(chips: number) : Player {
        var chipBalance = this.chipBalance() + chips;
        return new Player({...this.data, chipBalance});
    }

    public removeChips(chips: number) : Player {
        if (this.chipBalance() >= chips) {
            return this.addChips(-chips);
        }
        return this; 
    }
};

