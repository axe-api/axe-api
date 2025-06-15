echo "Waiting for server to be ready..."
until curl -s http://localhost:3000/docs > /dev/null; do
  sleep 1
done
