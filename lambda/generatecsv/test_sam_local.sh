sam build
sam local invoke -e events/event.json -n env.json
sam local invoke -e events/event-meta-lending.json -n env-no-meta-lending.json
sam local invoke -e events/event-meta-lending.json -n env-meta-data-lending.json
