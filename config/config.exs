# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :iYearn,
  ecto_repos: [IYearn.Repo]

# Configures the endpoint
config :iYearn, IYearn.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "WS7IRLYw9hB5m2O+CDqN89xIBCUIr0GPgPLdI0ryTD9Zw1JKJThr0iSbgYND3aWA",
  render_errors: [view: IYearn.ErrorView, accepts: ~w(html json)],
  pubsub: [name: IYearn.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
