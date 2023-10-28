from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from blackjack.services import ALL_SERVICES

import json

class StateView(APIView):
    def get(self, request: Request) -> Response:
        state = ALL_SERVICES.blackjackServer.getState()
        # serializer = StateSerializer(state)
        # return Response(serializer.data)
        return Response(json.dumps(state.toDict()))
