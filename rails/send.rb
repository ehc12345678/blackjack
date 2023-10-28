require 'bunny'

connection = Bunny.new(automatically_recover: false)
connection.start

channel = connection.create_channel
queue = channel.queue('hello')

ARGV.each do |arg|
  channel.default_exchange.publish(arg, routing_key: queue.name)
  puts " [x] Sent '#{arg}'"
end

connection.close