Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root "decks#index"
  get "/decks" => "decks#index"
  get "/cards" => "cards#index"

  get "/state", to: "state#index"

  get "/cards/:suit/:card", to: "cards#show"

  put "/games/", to: "games#create"
  get "/games/start", to: "games#start"
  post "/games/join", to: "games#join"
  post "/games/changeBet", "games#change_bet"

  post "/users/login", to: "users#login"
  post "/users/logout", to: "users#logout"
  post "/users/register", to: "users#register"
  get "/users", to: "users#all_registered"
  get "/users/register/:loginId", to: "users#get_registered"

  get "/activeHand/startTurn", to: "active_hand#start_turn"
  get "/activeHand/endTurn", to: "active_hand#end_turn"
  get "/activeHand/hit", to: "active_hand#hit"
  get "/activeHand/stay", to: "active_hand#stay"
  get "/activeHand/split", to: "active_hand#split"
  get "/activeHand/doubleDown", to: "active_hand#double_down"
end
