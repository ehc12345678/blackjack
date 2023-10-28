from rest_framework import serializers
from rest_framework.utils.model_meta import is_abstract_model

from blackjack.state.card import Card
from blackjack.state.game import Game
from blackjack.state.hand import Hand
from blackjack.state.player import Player
from blackjack.state.state import State

class StateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = State
        fields = ['currentGame', 'playersHands', 'dealersHand', 'activeHand', 'activeUsers', 'turnIsGoing']

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['players']

class HandSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Hand
        fields = ['cards','player','bet','isStaying','result']        

class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Player
        fields = ['chipBalance','cashBalance','name','id','currentBet']        
         
class CardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Card
        fields = ['suit','value']        


