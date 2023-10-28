from django.test import TestCase

from blackjack.state.state import State
from blackjack.store.user_service import UserService

class UserServiceTest(TestCase):
    def setUp(self):
        self.userService = UserService()

    def test_initial_state(self):
        self.assertEqual(len(self.userService.registeredUsers), 0)

    def test_signUp(self):
        state = State()
        self.userService.signUp(state, "Hey", "Dude")
        player = self.userService.lookup("Dude")
        self.assertEqual(player.name, "Hey")

        cmp = self.userService.lookup("Dude")
        self.assertEqual(player.toDict(), cmp.toDict())
        self.assertEqual(self.userService.lookup("No One"), None)

    def test_login_logout(self):
        state = State()
        self.userService.signUp(state, "Hey", "Dude")
        state = self.userService.login(state, "Dude")
        self.assertEqual(len(list(filter(lambda p: p.id == "Dude", state.activeUsers))), 1) 

        self.assertTrue(self.userService.isLoggedIn(state, "Dude"))

        state = self.userService.logout(state, "Dude")
        self.assertEqual(len(list(filter(lambda p: p.id == "Dude", state.activeUsers))), 0)         

        self.assertFalse(self.userService.isLoggedIn(state, "Dude"))

    def test_modify_player(self):
        state = State()
        self.userService.signUp(state, "Hey", "Dude")
        state = self.userService.login(state, "Dude")
        player = self.userService.lookup("Dude")

        newPlayer = player.clone()
        newPlayer.chipBalance = newPlayer.chipBalance - 100
        newState = self.userService.modifyPlayer(state, newPlayer)

        cmpPlayer = self.userService.lookup("Dude")
        self.assertEqual(cmpPlayer.chipBalance, newPlayer.chipBalance)

        self.assertEqual(1, len(newState.activeUsers))
        cmp2Player = list(filter(lambda p: p.id == "Dude", newState.activeUsers))[0]
        self.assertEqual(cmp2Player.chipBalance, newPlayer.chipBalance)
                        

